import { db } from "@/db";
import { accounts, profiles, users, userRoleEnum } from "@/db/schema";
import crypto from "crypto";

const ITERATIONS = 10000;
const SALT_LENGTH = 16;

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function createTestUsers() {
  const testUsers = [
    {
      email: "recruiter@example.com",
      password: "Test@123",
      userName: "recruiter",
      role: "recruiter" as const,
      displayName: "Test Recruiter",
      bio: "This is a test recruiter account",
    },
    {
      email: "candidate@example.com",
      password: "Test@123",
      userName: "candidate",
      role: "candidate" as const,
      displayName: "Test Candidate",
      bio: "This is a test candidate account",
    },
  ];

  for (const userData of testUsers) {
    // Generate salt
    const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
    // Hash password
    const hashedPassword = await hashPassword(userData.password, salt);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        emailVerified: new Date(),
        userName: userData.userName,
        role: userData.role,
        isOnboarded: true,
      })
      .returning();

    // Create account with password
    await db.insert(accounts).values({
      userId: user.id,
      accountType: "email",
      password: hashedPassword,
      salt: salt,
    });

    // Create profile
    await db.insert(profiles).values({
      userId: user.id,
      displayName: userData.displayName,
      bio: userData.bio,
    });

    console.log(`Test ${userData.role} created successfully!`);
    console.log("Email:", userData.email);
    console.log("Password:", userData.password);
    console.log("Username:", userData.userName);
    console.log("You can now use these credentials to login");
    console.log("----------------------------------------");
  }
}

// createTestUsers().catch(console.error);
