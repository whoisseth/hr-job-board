import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  Users,
  ShieldCheck,
  Zap,
  Building2,
  GraduationCap,
  LayoutDashboard,
  Search,
  KeyRound,
  FileUp,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  // Query live active jobs directly from database
  const activeJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "open"))
    .orderBy(desc(jobs.createdAt))
    .limit(6);

  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "candidate";

  return (
    <div className="space-y-24 pb-16">
      {/* Logged-In User Banner */}
      {user && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Welcome back, {user.userName || user.email}!
              </p>
              <p className="text-muted-foreground text-xs">
                You are signed in as a{" "}
                <span className="capitalize font-medium text-foreground">
                  {user.role || "member"}
                </span>
                .
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5">
            <Link
              href={
                isRecruiter
                  ? "/recruiter/dashboard"
                  : isCandidate
                  ? "/candidate/dashboard"
                  : "/user-info"
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Open Your Dashboard
            </Link>
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground backdrop-blur-sm shadow-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Next-Gen Hiring • Powered by AI Resume Intelligence</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Connect Talent with Opportunity{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Faster with AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed">
            An intelligent recruitment platform where candidates showcase verified
            skills extracted directly from resumes, and hiring teams discover
            qualified candidates with zero friction.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {user ? (
            <>
              <Button asChild size="lg" className="h-12 px-6 gap-2 text-base font-medium shadow-md">
                <Link
                  href={
                    isRecruiter
                      ? "/recruiter/dashboard"
                      : isCandidate
                      ? "/candidate/dashboard"
                      : "/user-info"
                  }
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Go to {isRecruiter ? "Recruiter" : isCandidate ? "Candidate" : "User"} Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 gap-2 text-base font-medium">
                <Link href="#featured-jobs">
                  <Search className="h-4 w-4" />
                  Explore Open Roles
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="h-12 px-6 gap-2 text-base font-medium shadow-md">
                <Link href="#featured-jobs">
                  <Search className="h-5 w-5" />
                  Explore Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 gap-2 text-base font-medium">
                <Link href="/sign-up">
                  <Building2 className="h-4 w-4" />
                  Post Jobs as Recruiter
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12 px-6 gap-2 text-base font-medium text-muted-foreground hover:text-foreground">
                <Link href="/resume-parser">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Try AI Resume Parser
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Feature Badges Bar */}
        <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Zap className="h-4 w-4" />
              <span>&lt; 2 Sec</span>
            </div>
            <p className="text-xs text-muted-foreground">AI Resume Parsing Speed</p>
          </div>
          <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Sparkles className="h-4 w-4" />
              <span>Structured</span>
            </div>
            <p className="text-xs text-muted-foreground">Automatic Skills &amp; History</p>
          </div>
          <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <ShieldCheck className="h-4 w-4" />
              <span>OAuth &amp; Magic</span>
            </div>
            <p className="text-xs text-muted-foreground">Secure Multi-Provider Auth</p>
          </div>
          <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>1-Click</span>
            </div>
            <p className="text-xs text-muted-foreground">Instant Job Application</p>
          </div>
        </div>
      </section>

      {/* Dual Perspective Section */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Two Tailored Experiences
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Both Sides of the Hiring Table
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Whether you are advancing your tech career or building an exceptional
            team, our platform gives you the specialized tools to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Candidates */}
          <Card className="flex flex-col justify-between relative overflow-hidden border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
            <CardHeader className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">For Job Seekers</CardTitle>
              <CardDescription className="text-sm">
                Get discovered by top employers without filling out repetitive forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant AI Resume Parsing:</strong> Upload your PDF resume once. Our LLM extracts your technical skills, work history, and degree credentials automatically.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>1-Click Job Applications:</strong> Apply to curated roles instantly using your verified candidate profile.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Real-Time Pipeline Tracking:</strong> Monitor your application statuses (new, shortlisted, rejected) directly in your candidate dashboard.
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button asChild className="w-full gap-2">
                <Link
                  href={
                    isCandidate
                      ? "/candidate/dashboard"
                      : user
                      ? "/user-info"
                      : "/sign-up"
                  }
                >
                  {isCandidate ? "Go to Candidate Workspace" : "Join as Candidate"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* For Recruiters */}
          <Card className="flex flex-col justify-between relative overflow-hidden border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
            <CardHeader className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">For Hiring Teams</CardTitle>
              <CardDescription className="text-sm">
                Find, evaluate, and manage candidate pipelines with structured AI insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Simple Job Management:</strong> Publish and update listings with custom requirements, and toggle statuses (open/closed) in real time.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>AI-Structured Applicant Cards:</strong> Review candidates with pre-parsed skills, company timelines, and portfolio links at a glance.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Complete Applicant Pipeline:</strong> Shortlist or reject applicants with immediate feedback and streamlined candidate management.
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button asChild variant="outline" className="w-full gap-2">
                <Link
                  href={
                    isRecruiter
                      ? "/recruiter/dashboard"
                      : user
                      ? "/user-info"
                      : "/sign-up"
                  }
                >
                  {isRecruiter ? "Go to Recruiter Workspace" : "Start Hiring as Recruiter"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* AI Resume Feature Spotlight */}
      <section className="rounded-2xl border bg-card/40 p-6 sm:p-10 space-y-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>The Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How AI Transforms Raw PDF Resumes into Structured Data
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Instead of manually keying in your skills, work experiences, and degrees, our backend parses
            your PDF and queries high-speed LLMs to extract clean, verified attributes instantly.
          </p>
        </div>

        {/* Visual Transformation Mockup */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-xl border bg-muted/30 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b text-muted-foreground">
              <span className="flex items-center gap-1.5 font-sans font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Input: Raw PDF Document
              </span>
              <span>sample_resume.pdf</span>
            </div>
            <div className="space-y-2 text-muted-foreground leading-relaxed pt-2">
              <p className="text-foreground font-semibold">UTKARSH SETH • Full Stack Engineer</p>
              <p>Experienced in React.js, Next.js, Node.js, TypeScript, Drizzle ORM, and PostgreSQL...</p>
              <p className="border-l-2 border-primary/40 pl-2 italic">
                Senior Frontend Engineer at TechCorp (2022 - Present): Led design system migration and real-time dashboard development.
              </p>
              <p>Education: Master of Computer Applications, University of Technology.</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                Output: AI-Structured Profile
              </span>
              <Badge variant="secondary" className="text-xs font-mono">
                Extracted in ~1.2s
              </Badge>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground mb-1.5 font-medium">Extracted Skill Tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["React.js", "Next.js", "Node.js", "TypeScript", "Drizzle ORM", "PostgreSQL", "REST APIs"].map((s) => (
                    <Badge key={s} variant="outline" className="text-[11px] py-0.5">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 font-medium">Work History:</p>
                <div className="p-2 rounded bg-muted/40 border">
                  <p className="font-semibold text-foreground">TechCorp</p>
                  <p className="text-muted-foreground">Led design system migration and real-time dashboard development.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                <span>Master of Computer Applications</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Want to test the parser on your own resume?
          </p>
          <Button asChild variant="secondary" size="sm" className="gap-2">
            <Link href="/resume-parser">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Try Live AI Resume Parser
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="featured-jobs" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              Live Openings
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Explore active roles currently open for applications.
            </p>
          </div>
          {isRecruiter && (
            <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
              <Link href="/recruiter/dashboard">
                <Briefcase className="h-4 w-4" />
                Post a New Role
              </Link>
            </Button>
          )}
        </div>

        {activeJobs.length === 0 ? (
          <Card className="text-center py-12 px-6">
            <CardHeader className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">No active jobs posted yet</CardTitle>
              <CardDescription>
                Check back soon or create the first job opening as a recruiter.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild>
                <Link href="/recruiter/dashboard">Post the First Job</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => (
              <Card
                key={job.id}
                className="flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {job.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  {isCandidate ? (
                    <Button asChild className="w-full gap-2" size="sm">
                      <Link href={`/candidate/application/${job.id}`}>
                        Apply Now
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : isRecruiter ? (
                    <Button asChild variant="outline" className="w-full gap-2" size="sm">
                      <Link href={`/recruiter/dashboard/${job.id}`}>
                        View in Dashboard
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full gap-2" size="sm">
                      <Link href={`/sign-in?callbackUrl=/candidate/application/${job.id}`}>
                        Apply with Resume
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Simple 3-Step Flow
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From registration to verified matching in three clear steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <CardTitle className="text-lg">Create Your Account</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Sign up in 10 seconds via Google OAuth, GitHub, or Magic Link. Choose whether you are hiring or job hunting.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <CardTitle className="text-lg">Upload Resume or Post Role</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Candidates drop a PDF resume which our AI structures instantly. Recruiters publish job roles with full requirements.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <CardTitle className="text-lg">1-Click Match &amp; Track</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Candidates apply with 1 click; recruiters review structured candidate insights and update pipeline status in real time.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* Test Demo Credentials Hint Banner */}
      <section className="rounded-xl border border-dashed bg-muted/20 p-5 sm:p-6 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Looking for Demo Accounts to Test the Platform?</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Use the pre-configured test credentials from the project documentation:
            <span className="font-mono ml-1 text-foreground">recruiter@example.com</span> or{" "}
            <span className="font-mono text-foreground">candidate@example.com</span> (Password:{" "}
            <span className="font-mono text-foreground">Test@123</span>).
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
          <Link href="/sign-in">
            Go to Sign In
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </section>

      {/* Final Call to Action Banner */}
      <section className="rounded-2xl border bg-gradient-to-b from-primary/10 to-primary/5 p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Transform Your Hiring Experience?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Join candidates and recruiters building modern, AI-powered hiring workflows today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="h-11 px-6 gap-2">
            <Link href="/sign-up">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-6">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-10 text-xs text-muted-foreground">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <p className="font-bold text-foreground text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              HR Job Board
            </p>
            <p className="leading-relaxed">
              Modern full-stack job board with Groq AI resume parsing, Drizzle ORM, and Lucia authentication.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground text-sm">For Candidates</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="#featured-jobs" className="hover:text-foreground transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/resume-parser" className="hover:text-foreground transition-colors">
                  AI Resume Parser
                </Link>
              </li>
              <li>
                <Link href="/candidate/dashboard" className="hover:text-foreground transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground text-sm">For Recruiters</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-foreground transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-foreground transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Create Employer Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground text-sm">Account &amp; Auth</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/sign-in" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/reset-password" className="hover:text-foreground transition-colors">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Mini HR Job Board. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <span>•</span>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
            <span>•</span>
            <Link href="#featured-jobs" className="hover:text-foreground transition-colors">
              Open Jobs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
