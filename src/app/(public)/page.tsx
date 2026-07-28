import { db } from "@/lib/db";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Certifications } from "@/components/sections/certifications";
import { GithubActivityLazy } from "@/components/sections/github-activity-lazy";
import { Contact } from "@/components/sections/contact";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "prisma", "site_settings.json");

const DEFAULT_SECTIONS_VISIBILITY = {
  hero: true,
  about: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  github: true,
  certifications: true,
  resume: true,
  contact: true,
  socialLinks: true,
};

const DEFAULT_PROFILE = {
  id: "singleton",
  name: "Mohammed Abdul Azeez S",
  firstName: "Mohammed Abdul Azeez",
  title: "Java Full Stack Developer",
  tagline: "Spring Boot · React · PostgreSQL",
  location: "Tenkasi / Chennai, Tamil Nadu, India",
  email: "mdazeezsoftdev@gmail.com",
  phone: "8667005712",
  linkedin: "https://linkedin.com/in/mohammed-abdul-azeez-b876b5301",
  github: "https://github.com/Azeez11223",
  githubUsername: "Azeez11223",
  availability: "Available for opportunities",
  resumeUrl: "/resume.pdf",
  avatarUrl: null,
  gradYear: 2026,
  cgpa: "7.28",
};

const DEFAULT_OBJECTIVE = {
  id: "singleton",
  short:
    "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
  long: "I'm a final-year B.Tech Information Technology student building hands-on experience with Spring Boot, REST APIs, and PostgreSQL through internships rather than a classroom-only curriculum. My focus is scalable backend systems and cloud-native architecture, and I work with GitHub Copilot and ChatGPT as part of a modern, AI-assisted development workflow, not as a shortcut around understanding the code. I'm looking to join an enterprise backend team in an Agile environment where I can keep shipping production-shaped work.",
};

const DEFAULT_HERO_ROLES = [
  { id: "hr-1", text: "Spring Boot Developer" },
  { id: "hr-2", text: "React Developer" },
  { id: "hr-3", text: "REST API Builder" },
  { id: "hr-4", text: "AI-Native Engineer" },
];

const DEFAULT_STATS = [
  { id: "st-1", value: 3, suffix: "", label: "Internships" },
  { id: "st-2", value: 5, suffix: "+", label: "Projects Built" },
  { id: "st-3", value: 3, suffix: "", label: "Certifications" },
];

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-1",
    role: "Backend Developer Intern",
    company: "Ethical Intelligent Technologies",
    duration: "Jan 2026 – Present",
    current: true,
    bullets: JSON.stringify([
      "Developed backend modules and RESTful API endpoints using Java and Spring Boot, enabling data exchange between frontend and database layers",
      "Designed and tested 10+ REST APIs using Postman, ensuring reliability and correct response handling across endpoints",
      "Worked with PostgreSQL to write optimized queries and manage data models for backend business logic",
    ]),
    tech: JSON.stringify(["Java", "Spring Boot", "PostgreSQL", "Postman"]),
  },
  {
    id: "exp-2",
    role: "Full Stack Developer Trainee Intern",
    company: "Eagle-HiTech Softclou Pvt. Ltd.",
    duration: "May 2025 – June 2025",
    current: false,
    bullets: JSON.stringify([
      "Collaborated with senior developers to implement Firebase real-time data integration, reducing UI latency in data-driven components",
      "Participated in design and development of responsive UI components, ensuring cross-browser compatibility and seamless UX",
      "Followed Agile sprint workflows, participating in daily standups and code reviews",
    ]),
    tech: JSON.stringify(["Firebase", "JavaScript", "Agile"]),
  },
  {
    id: "exp-3",
    role: "Frontend Developer Intern",
    company: "IBM SkillsBuild",
    duration: "June 2024 – July 2024",
    current: false,
    bullets: JSON.stringify([
      "Developed responsive UI components and implemented form validation for offline-compatible login features",
      "Gained hands-on experience in front-end development practices including UI testing and accessibility",
    ]),
    tech: JSON.stringify(["HTML5", "CSS3", "JavaScript"]),
  },
];

const DEFAULT_EDUCATION = {
  id: "singleton",
  degree: "B.Tech Information Technology",
  institution:
    "B.S. Abdur Rahman Crescent Institute of Science and Technology",
  location: "Vandalur, Chennai",
  duration: "2022 – 2026",
  cgpa: "7.28",
};

const DEFAULT_SKILL_GROUPS = [
  {
    id: "sg-1",
    category: "Programming",
    skills: JSON.stringify([
      { name: "Java", tier: "Core" },
      { name: "SQL", tier: "Core" },
      { name: "Python (Basic)", tier: "Familiar" },
    ]),
  },
  {
    id: "sg-2",
    category: "Backend",
    skills: JSON.stringify([
      { name: "Spring Boot", tier: "Core" },
      { name: "REST APIs", tier: "Core" },
      { name: "Microservices", tier: "Working Knowledge" },
      { name: "JPA", tier: "Working Knowledge" },
      { name: "Hibernate", tier: "Working Knowledge" },
      { name: "JWT Authentication", tier: "Working Knowledge" },
    ]),
  },
  {
    id: "sg-3",
    category: "Frontend",
    skills: JSON.stringify([
      { name: "React", tier: "Working Knowledge" },
      { name: "HTML5", tier: "Working Knowledge" },
      { name: "CSS3", tier: "Working Knowledge" },
      { name: "JavaScript", tier: "Working Knowledge" },
    ]),
  },
  {
    id: "sg-4",
    category: "Databases",
    skills: JSON.stringify([
      { name: "PostgreSQL", tier: "Working Knowledge" },
      { name: "Firebase (NoSQL)", tier: "Familiar" },
    ]),
  },
  {
    id: "sg-5",
    category: "CS Fundamentals",
    skills: JSON.stringify([
      { name: "Data Structures", tier: "Core" },
      { name: "Algorithms", tier: "Core" },
      { name: "OOP", tier: "Core" },
      { name: "Design Patterns", tier: "Working Knowledge" },
    ]),
  },
  {
    id: "sg-6",
    category: "Cloud",
    skills: JSON.stringify([
      { name: "EC2", tier: "Familiar" },
      { name: "S3", tier: "Familiar" },
      { name: "IAM", tier: "Familiar" },
      { name: "Cloud Deployment Basics", tier: "Familiar" },
    ]),
  },
  {
    id: "sg-7",
    category: "Tools",
    skills: JSON.stringify([
      { name: "Git", tier: "Working Knowledge" },
      { name: "GitHub", tier: "Working Knowledge" },
      { name: "IntelliJ IDEA", tier: "Working Knowledge" },
      { name: "VS Code", tier: "Working Knowledge" },
      { name: "Postman", tier: "Working Knowledge" },
      { name: "Maven", tier: "Working Knowledge" },
    ]),
  },
  {
    id: "sg-8",
    category: "Practices",
    skills: JSON.stringify([
      { name: "Agile (Scrum)", tier: "Working Knowledge" },
      { name: "CI/CD (Basic)", tier: "Familiar" },
      { name: "RESTful API Design", tier: "Core" },
    ]),
  },
  {
    id: "sg-9",
    category: "AI Tools",
    skills: JSON.stringify([
      { name: "GitHub Copilot", tier: "Working Knowledge" },
      { name: "ChatGPT (code gen & debugging)", tier: "Working Knowledge" },
    ]),
  },
];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    slug: "ecommerce-order-inventory",
    title: "Real-Time E-Commerce Order & Inventory System",
    category: "Full Stack / Backend-heavy",
    oneLiner:
      "A full-stack order and inventory platform built to keep stock counts honest under concurrent load.",
    description:
      "A full-stack application handling transactional order processing and inventory management, built with Spring Boot, React, and PostgreSQL.",
    problem:
      "Needed a reliable way to handle concurrent orders and inventory without overselling stock or losing track of transactional state.",
    solution:
      "Built a Spring Boot and React application backed by PostgreSQL, with RESTful APIs secured by JWT authentication protecting user sessions and endpoints.",
    features: JSON.stringify([
      "Transactional order processing with inventory management",
      "RESTful APIs secured with JWT authentication",
      "Paginated, filterable product listing endpoints",
    ]),
    tech: JSON.stringify(["Java", "Spring Boot", "React", "PostgreSQL", "JWT", "REST API"]),
    impact: JSON.stringify([
      "JWT authentication secured user sessions and protected endpoints",
      "Pagination and filtering on product listing APIs improved query performance and response times",
    ]),
    duration: null,
    repoUrl: "https://github.com/Azeez11223/e-commerce-national",
    liveUrl: null,
    challenges: null,
    imageUrl: null,
    bannerUrl: null,
    featured: true,
  },
  {
    id: "proj-2",
    slug: "smart-car-parking",
    title: "Smart Car Parking Booking System",
    category: "Frontend / Product UX",
    oneLiner: "A responsive booking flow that shows real parking availability as it changes.",
    description:
      "A responsive booking system built in React with real-time slot availability and dynamic vehicle registration.",
    problem:
      "Drivers need to know which parking slots are actually free before they arrive, not a static, out-of-date list.",
    solution:
      "Built a responsive React interface that displays real-time slot availability, with a dynamic UI for vehicle registration and slot selection so a booking always reflects current state.",
    features: JSON.stringify([
      "Real-time slot availability display",
      "Dynamic vehicle registration flow",
      "Interactive slot selection UI",
    ]),
    tech: JSON.stringify(["React", "JavaScript", "CSS3"]),
    impact: JSON.stringify([]),
    duration: null,
    repoUrl: "https://github.com/Azeez11223/car-booking-project",
    liveUrl: null,
    challenges: null,
    imageUrl: null,
    bannerUrl: null,
    featured: false,
  },
  {
    id: "proj-3",
    slug: "calorie-calculator-ai-diet",
    title: "Calorie Calculator & AI Diet Plan Generator",
    category: "Frontend / Data-driven",
    oneLiner:
      "A calorie tracker that turns nutrition data into a plan a person can actually follow.",
    description:
      "A React application with integrated nutritional data, interactive calorie tracking charts, and personalized meal plan generation.",
    problem:
      "Generic calorie counters show numbers without turning them into an actionable daily plan.",
    solution:
      "Built a React app integrating nutritional data sources, with interactive charts for calorie tracking and a generator that produces personalized meal plans from a user's targets.",
    features: JSON.stringify([
      "Interactive calorie tracking charts",
      "Personalized meal plan generation",
      "Integrated nutritional data",
    ]),
    tech: JSON.stringify(["React", "JavaScript", "Data Visualization"]),
    impact: JSON.stringify([]),
    duration: null,
    repoUrl: "https://github.com/Azeez11223/rusi-calorie-calculator",
    liveUrl: null,
    challenges: null,
    imageUrl: null,
    bannerUrl: null,
    featured: false,
  },
  {
    id: "proj-4",
    slug: "click-fraud-detection",
    title: "Click Fraud Detection System",
    category: "Python / Data Science",
    oneLiner:
      "Machine learning model to detect fraudulent click patterns in advertising traffic.",
    description:
      "A Python-based machine learning solution for detecting fraudulent clicks in real-time ad traffic using behavioral feature analysis.",
    problem: "Automated click bots waste ad budgets and distort marketing analytics.",
    solution:
      "Built a machine learning classification model analyzing IP activity, timestamp patterns, and device fingerprints to flag suspicious clicks.",
    features: JSON.stringify([
      "Behavioral pattern analysis on click streams",
      "Machine learning classification model",
      "Automated fraud risk scoring",
    ]),
    tech: JSON.stringify(["Python", "Machine Learning", "Data Analysis"]),
    impact: JSON.stringify([]),
    duration: null,
    repoUrl: "https://github.com/Azeez11223/Click-fraud-detection",
    liveUrl: null,
    challenges: null,
    imageUrl: null,
    bannerUrl: null,
    featured: false,
  },
  {
    id: "proj-5",
    slug: "headphone-shop",
    title: "HeadPhone Shop Front-End",
    category: "Frontend Web Development",
    oneLiner:
      "Modern storefront interface for premium audio hardware with interactive product viewing.",
    description:
      "An e-commerce front-end application built with HTML, CSS, and JavaScript for browsing audio hardware with cart interaction.",
    problem:
      "E-commerce audio stores need engaging product showcases with clean checkout navigation.",
    solution:
      "Developed a responsive user interface featuring dynamic product filtering, visual audio asset showcase, and cart management.",
    features: JSON.stringify([
      "Dynamic product filtering and category view",
      "Interactive cart interface",
      "Responsive web design",
    ]),
    tech: JSON.stringify(["HTML5", "CSS3", "JavaScript"]),
    impact: JSON.stringify([]),
    duration: null,
    repoUrl: "https://github.com/Azeez11223/HeadPhone_Shop",
    liveUrl: null,
    challenges: null,
    imageUrl: null,
    bannerUrl: null,
    featured: false,
  },
];

const DEFAULT_CERTIFICATIONS = [
  { id: "cert-1", name: "Java", issuer: "HackerRank", credentialUrl: null, imageUrl: null },
  { id: "cert-2", name: "SQL (Intermediate)", issuer: "HackerRank", credentialUrl: null, imageUrl: null },
  { id: "cert-3", name: "English for Competitive Exam", issuer: "NPTEL", credentialUrl: null, imageUrl: null },
];

async function getSectionsVisibility() {
  if (existsSync(SETTINGS_FILE)) {
    try {
      const data = await readFile(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed?.sectionsVisibility) {
        return { ...DEFAULT_SECTIONS_VISIBILITY, ...parsed.sectionsVisibility };
      }
    } catch {
      // fallback
    }
  }

  try {
    const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (settings?.sectionsVisibility) {
      const parsed =
        typeof settings.sectionsVisibility === "string"
          ? JSON.parse(settings.sectionsVisibility)
          : settings.sectionsVisibility;
      return { ...DEFAULT_SECTIONS_VISIBILITY, ...parsed };
    }
  } catch {
    // fallback
  }

  return DEFAULT_SECTIONS_VISIBILITY;
}

export const dynamic = "force-dynamic";

export default async function Home() {
  let profile: any = null;
  let objective: any = null;
  let heroRoles: any[] = [];
  let stats: any[] = [];
  let experiences: any[] = [];
  let education: any = null;
  let skillGroups: any[] = [];
  let projects: any[] = [];
  let certifications: any[] = [];
  let sectionsVisibility: any = DEFAULT_SECTIONS_VISIBILITY;

  try {
    const res = await Promise.all([
      db.profile.findUnique({ where: { id: "singleton" } }),
      db.careerObjective.findUnique({ where: { id: "singleton" } }),
      db.heroRole.findMany({ orderBy: { sortOrder: "asc" } }),
      db.stat.findMany({ orderBy: { sortOrder: "asc" } }),
      db.experience.findMany({ orderBy: { sortOrder: "asc" } }),
      db.education.findUnique({ where: { id: "singleton" } }),
      db.skillGroup.findMany({ orderBy: { sortOrder: "asc" } }),
      db.project.findMany({ orderBy: { sortOrder: "asc" } }),
      db.certification.findMany({ orderBy: { sortOrder: "asc" } }),
      getSectionsVisibility(),
    ]);
    profile = res[0];
    objective = res[1];
    heroRoles = res[2] || [];
    stats = res[3] || [];
    experiences = res[4] || [];
    education = res[5];
    skillGroups = res[6] || [];
    projects = res[7] || [];
    certifications = res[8] || [];
    sectionsVisibility = res[9] || DEFAULT_SECTIONS_VISIBILITY;
  } catch (err) {
    console.warn("Failed to load portfolio page data from database, using fallbacks:", err);
  }

  // Fallback defaults if DB is unseeded or temporarily offline
  profile = profile || DEFAULT_PROFILE;
  objective = objective || DEFAULT_OBJECTIVE;
  if (!heroRoles || heroRoles.length === 0) heroRoles = DEFAULT_HERO_ROLES;
  if (!stats || stats.length === 0) stats = DEFAULT_STATS;
  if (!experiences || experiences.length === 0) experiences = DEFAULT_EXPERIENCES;
  education = education || DEFAULT_EDUCATION;
  if (!skillGroups || skillGroups.length === 0) skillGroups = DEFAULT_SKILL_GROUPS;
  if (!projects || projects.length === 0) projects = DEFAULT_PROJECTS;
  if (!certifications || certifications.length === 0) certifications = DEFAULT_CERTIFICATIONS;

  const heroData = {
    profile: {
      ...profile,
      resumeUrl: sectionsVisibility.resume !== false ? profile.resumeUrl : null,
      github: sectionsVisibility.socialLinks !== false ? profile.github : "",
      linkedin: sectionsVisibility.socialLinks !== false ? profile.linkedin : "",
      email: sectionsVisibility.socialLinks !== false ? profile.email : "",
    },
    roles: heroRoles.map((r: any) => r.text),
    stats: stats.map((s: any) => ({ value: s.value, suffix: s.suffix, label: s.label })),
    objective: { short: objective.short, long: objective.long },
  };

  const experienceData = experiences.map((e: any) => ({
    ...e,
    bullets: typeof e.bullets === "string" ? (JSON.parse(e.bullets) as string[]) : e.bullets,
    tech: typeof e.tech === "string" ? (JSON.parse(e.tech) as string[]) : e.tech,
  }));

  const skillData = skillGroups.map((g: any) => ({
    ...g,
    skills: typeof g.skills === "string" ? (JSON.parse(g.skills) as { name: string; tier: string }[]) : g.skills,
  }));

  const projectData = projects.map((p: any) => ({
    ...p,
    features: typeof p.features === "string" ? (JSON.parse(p.features) as string[]) : p.features,
    tech: typeof p.tech === "string" ? (JSON.parse(p.tech) as string[]) : p.tech,
    impact: typeof p.impact === "string" ? (JSON.parse(p.impact) as string[]) : p.impact,
  }));

  const aboutProfile = {
    ...profile,
    resumeUrl: sectionsVisibility.resume !== false ? profile.resumeUrl : null,
  };

  return (
    <>
      {sectionsVisibility.hero !== false && <Hero data={heroData} />}
      {sectionsVisibility.about !== false && (
        <About profile={aboutProfile} objective={objective} education={education} />
      )}
      {sectionsVisibility.experience !== false && <Experience entries={experienceData} />}
      {sectionsVisibility.education !== false && <Education data={education} />}
      {sectionsVisibility.skills !== false && <Skills groups={skillData} />}
      {sectionsVisibility.projects !== false && <Projects items={projectData} />}
      {sectionsVisibility.certifications !== false && <Certifications items={certifications} />}
      {sectionsVisibility.github !== false && (
        <GithubActivityLazy username={profile.githubUsername} name={profile.name} github={profile.github} />
      )}
      {sectionsVisibility.contact !== false && <Contact profile={profile} />}
    </>
  );
}
