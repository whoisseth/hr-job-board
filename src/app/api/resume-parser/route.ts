import { NextRequest, NextResponse } from "next/server"; // To handle the request and response
import { promises as fs } from "fs"; // To save the file temporarily
import { v4 as uuidv4 } from "uuid"; // To generate a unique filename
import PDFParser from "pdf2json"; // To parse the pdf
import path from "path";
import os from "os";
import { uploadResume } from "@/lib/resume";
import { addResumeData } from "./action";

// LLM
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { getCurrentUser } from "@/lib/session";

interface ParsedResume {
  skills: string[];
  experience: {
    [companyName: string]: string[];
  };
  projects: {
    [projectName: string]: {
      description: string;
      links: string[];
    };
  };
  education: string[];
}

// Helper function to clean LLM response
function cleanLLMResponse(text: string): string {
  // Remove markdown code blocks if present
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  // Remove any leading/trailing whitespace
  text = text.trim();
  return text;
}

// Helper function to parse PDF
function parsePDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const rawText = (pdfParser as any).getRawTextContent();
      resolve(rawText);
    });

    pdfParser.loadPDF(filePath);
  });
}

// Helper function to validate and transform LLM response
function transformToValidJSON(text: string): ParsedResume {
  try {
    // First try direct JSON parse
    return JSON.parse(text);
  } catch (e) {
    // If not valid JSON, attempt to extract structured data
    const defaultResponse: ParsedResume = {
      skills: [],
      experience: {},
      projects: {},
      education: [],
    };

    // If the text is empty or clearly an error message, return default
    if (
      !text ||
      text.toLowerCase().includes("please provide") ||
      text.toLowerCase().includes("error")
    ) {
      return defaultResponse;
    }

    // Attempt to parse sections if they exist
    const sections = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    sections.forEach((section) => {
      if (section.toLowerCase().includes("skill")) {
        const skillMatch = section.match(/\[(.*?)\]/);
        if (skillMatch) {
          defaultResponse.skills = skillMatch[1]
            .split(",")
            .map((s) => s.trim());
        }
      } else if (section.toLowerCase().includes("experience")) {
        const expMatch = section.match(/\[(.*?)\]/);
        if (expMatch) {
          // Convert array of experiences into object format
          const experiences = expMatch[1].split(",").map((s) => s.trim());
          experiences.forEach((exp) => {
            const [company, ...details] = exp.split(":");
            if (company && details.length > 0) {
              defaultResponse.experience[company.trim()] = details.map((d) =>
                d.trim()
              );
            }
          });
        }
      } else if (section.toLowerCase().includes("project")) {
        const projMatch = section.match(/\[(.*?)\]/);
        if (projMatch) {
          // Convert array of projects into object format
          const projects = projMatch[1].split(",").map((s) => s.trim());
          projects.forEach((proj) => {
            const [title, ...details] = proj.split(":");
            if (title && details.length > 0) {
              defaultResponse.projects[title.trim()] = {
                description: details.join(":").trim(),
                links: [], // Default empty links array
              };
            }
          });
        }
      } else if (section.toLowerCase().includes("education")) {
        const eduMatch = section.match(/\[(.*?)\]/);
        if (eduMatch) {
          defaultResponse.education = eduMatch[1]
            .split(",")
            .map((s) => s.trim());
        }
      }
    });

    return defaultResponse;
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("filepond");

  if (!uploadedFiles || uploadedFiles.length === 0) {
    console.log("No files found in request.");
    return new NextResponse(JSON.stringify({ error: "No files found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const uploadedFile = uploadedFiles[1];
  console.log("Uploaded file:", uploadedFile);

  if (!(uploadedFile instanceof File)) {
    console.log("Uploaded file is not in the expected format.");
    return new NextResponse(JSON.stringify({ error: "Invalid file format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Generate a unique filename
    const fileName = uuidv4();
    const tempFilePath = path.join(os.tmpdir(), `${fileName}.pdf`);

    // Save the file temporarily
    const fileBuffer = new Uint8Array(await uploadedFile.arrayBuffer());
    await fs.mkdir(os.tmpdir(), { recursive: true });
    await fs.writeFile(tempFilePath, fileBuffer);

    // Upload to S3 first
    // const s3UploadResult = await uploadResume({
    //   file: uploadedFile,
    //   candidateId: user.id, // Use the actual user ID instead of generating from UUID
    //   fileType: uploadedFile.type,
    // });

    // Parse PDF
    console.log("Starting PDF parsing...");
    const parsedText = await parsePDF(tempFilePath);
    console.log("PDF Text extracted:", parsedText.substring(0, 200) + "...");

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    // Process with LLM
    const prompt = `
    You are a resume parsing assistant. Your task is to extract structured information from the resume text below.
    YOU MUST RESPOND WITH VALID JSON ONLY, using this exact format:
    {
      "skills": ["skill1", "skill2", ...],
      "experience": {
        "Company Name 1": ["job details", "more details if available"],
        "Company Name 2": ["job details", "more details if available"],
        ...
      },
      "projects": {
        "Project Title 1": {
          "description": "short project details",
          "links": ["link1", "link2", ...] // Include only if available
        },
        "Project Title 2": {
          "description": "short project details",
          "links": ["link1", "link2", ...]
        },
        ...
      },
      "education": ["Degree Title", ...]
    }
    
    Rules:
    1. ONLY return valid JSON, no other text.
    2. For skills: Include both technical and soft skills.
    3. For experience:
       - Structure it as an object where the company name is the key.
       - The value should be an array of job-related details.
    4. For projects:
       - Structure it as an object where the project title is the key.
       - Include a short description.
       - Include relevant links in an array (if available).
    5. For education:
       - Only include the degree title (e.g., "Master of Computer Applications", "Bachelor of Computer Applications").
    6. Use empty arrays or objects if no information is found.
    
    Resume text to analyze:
    ${parsedText}`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key") {
      console.error("GROQ_API_KEY is not configured in .env");
      return new NextResponse(
        JSON.stringify({
          error:
            "Groq API key is not configured. Please add your GROQ_API_KEY to your .env file.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const groqClient = createGroq({ apiKey: apiKey.trim() });
    const primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    const candidateModels = [
      primaryModel,
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    let text = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Sending to LLM (${modelName}) for processing...`);
        const result = await generateText({
          model: groqClient(modelName),
          prompt,
          temperature: 0.1,
          maxTokens: 2048,
        });
        text = result.text;
        break;
      } catch (err) {
        console.warn(
          `Model ${modelName} failed, trying next candidate if available:`,
          err
        );
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error("Failed to generate response from LLM");
    }

    console.log("Raw LLM Response:", text);

    try {
      const cleanedText = cleanLLMResponse(text);
      console.log("Cleaned LLM Response:", cleanedText);

      const parsedResponse = transformToValidJSON(cleanedText);

      console.log("Successfully parsed resume data:", {
        skills: parsedResponse.skills.length + " skills found",
        experience:
          Object.keys(parsedResponse.experience).length +
          " experience entries found",
        education: parsedResponse.education.length + " education entries found",
      });

      // Add resume data to database
      const dbResult = await addResumeData({
        candidateId: user.id,
        extractedText: parsedText,
        structuredData: parsedResponse,
        file: uploadedFile,
        fileType: uploadedFile.type,
      });

      if (!dbResult.success) {
        console.error(
          "Failed to save resume data to database:",
          dbResult.error
        );
        return new NextResponse(
          JSON.stringify({
            error: "Failed to save resume data",
            details: dbResult.error,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const response = {
        fileName,
        url: dbResult.data?.url,
        parsed: parsedResponse,
        rawText: parsedText,
        dbResult: dbResult.data,
      };

      console.log("Final Response:", JSON.stringify(response, null, 2));

      return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      console.error("Problematic text:", text);
      return new NextResponse(
        JSON.stringify({
          error: "Failed to parse resume information",
          rawText: parsedText,
          llmResponse: text,
          fileType: uploadedFile.type,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    return new NextResponse(JSON.stringify({ error: "Error processing PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
