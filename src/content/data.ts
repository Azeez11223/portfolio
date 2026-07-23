// Single source of truth for all resume-derived content.
// Edit this file to update copy across the entire site.

export const profile = {
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
  resumeUrl: "/resume.pdf", // [TODO: upload resume PDF to /public/resume.pdf]
  gradYear: 2026,
  cgpa: "7.28",
};

export const careerObjective = {
  short:
    "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
  long:
    "I'm a final-year B.Tech Information Technology student building hands-on experience with Spring Boot, REST APIs, and PostgreSQL through internships rather than a classroom-only curriculum. My focus is scalable backend systems and cloud-native architecture, and I work with GitHub Copilot and ChatGPT as part of a modern, AI-assisted development workflow, not as a shortcut around understanding the code. I'm looking to join an enterprise backend team in an Agile environment where I can keep shipping production-shaped work.",
};

export const heroRoles = [
  "Spring Boot Developer",
  "React Developer",
  "REST API Builder",
  "AI-Native Engineer",
];

export const stats = [
  { value: 3, suffix: "", label: "Internships" },
  { value: 3, suffix: "+", label: "Projects Built" },
  { value: 3, suffix: "", label: "Certifications" },
];

export type SkillTier = "Core" | "Working Knowledge" | "Familiar";

export interface SkillGroup {
  category: string;
  skills: { name: string; tier: SkillTier }[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming",
    skills: [
      { name: "Java", tier: "Core" },
      { name: "SQL", tier: "Core" },
      { name: "Python (Basic)", tier: "Familiar" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Spring Boot", tier: "Core" },
      { name: "REST APIs", tier: "Core" },
      { name: "Microservices", tier: "Working Knowledge" },
      { name: "JPA", tier: "Working Knowledge" },
      { name: "Hibernate", tier: "Working Knowledge" },
      { name: "JWT Authentication", tier: "Working Knowledge" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", tier: "Working Knowledge" },
      { name: "HTML5", tier: "Working Knowledge" },
      { name: "CSS3", tier: "Working Knowledge" },
      { name: "JavaScript", tier: "Working Knowledge" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", tier: "Working Knowledge" },
      { name: "Firebase (NoSQL)", tier: "Familiar" },
    ],
  },
  {
    category: "CS Fundamentals",
    skills: [
      { name: "Data Structures", tier: "Core" },
      { name: "Algorithms", tier: "Core" },
      { name: "OOP", tier: "Core" },
      { name: "Design Patterns", tier: "Working Knowledge" },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "EC2", tier: "Familiar" },
      { name: "S3", tier: "Familiar" },
      { name: "IAM", tier: "Familiar" },
      { name: "Cloud Deployment Basics", tier: "Familiar" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", tier: "Working Knowledge" },
      { name: "GitHub", tier: "Working Knowledge" },
      { name: "IntelliJ IDEA", tier: "Working Knowledge" },
      { name: "VS Code", tier: "Working Knowledge" },
      { name: "Postman", tier: "Working Knowledge" },
      { name: "Maven", tier: "Working Knowledge" },
    ],
  },
  {
    category: "Practices",
    skills: [
      { name: "Agile (Scrum)", tier: "Working Knowledge" },
      { name: "CI/CD (Basic)", tier: "Familiar" },
      { name: "RESTful API Design", tier: "Core" },
    ],
  },
  {
    category: "AI Tools",
    skills: [
      { name: "GitHub Copilot", tier: "Working Knowledge" },
      { name: "ChatGPT (code gen & debugging)", tier: "Working Knowledge" },
    ],
  },
];

export interface ExperienceEntry {
  role: string;
  company: string;
  duration: string;
  current?: boolean;
  bullets: string[];
  tech: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "Backend Developer Intern",
    company: "Ethical Intelligent Technologies",
    duration: "Jan 2026 – Present",
    current: true,
    bullets: [
      "Developed backend modules and RESTful API endpoints using Java and Spring Boot, enabling data exchange between frontend and database layers",
      "Designed and tested 10+ REST APIs using Postman, ensuring reliability and correct response handling across endpoints",
      "Worked with PostgreSQL to write optimized queries and manage data models for backend business logic",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Postman"],
  },
  {
    role: "Full Stack Developer Trainee Intern",
    company: "Eagle-HiTech Softclou Pvt. Ltd.",
    duration: "May 2025 – June 2025",
    bullets: [
      "Collaborated with senior developers to implement Firebase real-time data integration, reducing UI latency in data-driven components",
      "Participated in design and development of responsive UI components, ensuring cross-browser compatibility and seamless UX",
      "Followed Agile sprint workflows, participating in daily standups and code reviews",
    ],
    tech: ["Firebase", "JavaScript", "Agile"],
  },
  {
    role: "Frontend Developer Intern",
    company: "IBM SkillsBuild",
    duration: "June 2024 – July 2024",
    bullets: [
      "Developed responsive UI components and implemented form validation for offline-compatible login features",
      "Gained hands-on experience in front-end development practices including UI testing and accessibility",
    ],
    tech: ["HTML5", "CSS3", "JavaScript"],
  },
];

export const education = {
  degree: "B.Tech Information Technology",
  institution:
    "B.S. Abdur Rahman Crescent Institute of Science and Technology",
  location: "Vandalur, Chennai",
  duration: "2022 – 2026",
  cgpa: "7.28",
};

export interface Certification {
  name: string;
  issuer: string;
  credentialUrl?: string; // [TODO: add credential link]
}

export const certifications: Certification[] = [
  { name: "Java", issuer: "HackerRank" },
  { name: "SQL (Intermediate)", issuer: "HackerRank" },
  { name: "English for Competitive Exam", issuer: "NPTEL" },
];

export interface Project {
  slug: string;
  title: string;
  category: string;
  oneLiner: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  impact: string[];
  duration: string; // [TODO: add duration]
  repoUrl?: string; // [TODO: add repo link]
  liveUrl?: string; // [TODO: add live demo link]
  challenges?: string; // [TODO: add specific challenge notes]
}

export const projects: Project[] = [
  {
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
      "Built a Spring Boot and React application backed by PostgreSQL, with RESTful APIs secured by JWT authentication protecting user sessions and endpoints. Product listing APIs were paginated and filterable, which cut down response payload size and improved query performance.",
    features: [
      "Transactional order processing with inventory management",
      "RESTful APIs secured with JWT authentication",
      "Paginated, filterable product listing endpoints",
    ],
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "JWT", "REST API"],
    impact: [
      "JWT authentication secured user sessions and protected endpoints",
      "Pagination and filtering on product listing APIs improved query performance and response times",
    ],
    duration: "[TODO: add duration]",
    repoUrl: undefined,
    liveUrl: undefined,
    challenges: "[TODO: add specific challenge notes]",
  },
  {
    slug: "smart-car-parking",
    title: "Smart Car Parking Booking System",
    category: "Frontend / Product UX",
    oneLiner:
      "A responsive booking flow that shows real parking availability as it changes.",
    description:
      "A responsive booking system built in React with real-time slot availability and dynamic vehicle registration.",
    problem:
      "Drivers need to know which parking slots are actually free before they arrive, not a static, out-of-date list.",
    solution:
      "Built a responsive React interface that displays real-time slot availability, with a dynamic UI for vehicle registration and slot selection so a booking always reflects current state.",
    features: [
      "Real-time slot availability display",
      "Dynamic vehicle registration flow",
      "Interactive slot selection UI",
    ],
    tech: ["React", "JavaScript", "CSS3"],
    impact: [],
    duration: "[TODO: add duration]",
    repoUrl: undefined,
    liveUrl: undefined,
    challenges: "[TODO: add specific challenge notes]",
  },
  {
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
    features: [
      "Interactive calorie tracking charts",
      "Personalized meal plan generation",
      "Integrated nutritional data",
    ],
    tech: ["React", "JavaScript", "Data Visualization"],
    impact: [],
    duration: "[TODO: add duration]",
    repoUrl: undefined,
    liveUrl: undefined,
    challenges: "[TODO: add specific challenge notes]",
  },
];

export const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
