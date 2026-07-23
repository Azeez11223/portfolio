import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // ─── Profile ──────────────────────────────────
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
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
      gradYear: 2026,
      cgpa: "7.28",
    },
  });
  console.log("  ✓ Profile");

  // ─── Career Objective ─────────────────────────
  await prisma.careerObjective.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      short:
        "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
      long: "I'm a final-year B.Tech Information Technology student building hands-on experience with Spring Boot, REST APIs, and PostgreSQL through internships rather than a classroom-only curriculum. My focus is scalable backend systems and cloud-native architecture, and I work with GitHub Copilot and ChatGPT as part of a modern, AI-assisted development workflow, not as a shortcut around understanding the code. I'm looking to join an enterprise backend team in an Agile environment where I can keep shipping production-shaped work.",
    },
  });
  console.log("  ✓ Career Objective");

  // ─── Hero Roles ───────────────────────────────
  await prisma.heroRole.deleteMany();
  const roles = [
    "Spring Boot Developer",
    "React Developer",
    "REST API Builder",
    "AI-Native Engineer",
  ];
  for (let i = 0; i < roles.length; i++) {
    await prisma.heroRole.create({
      data: { text: roles[i], sortOrder: i },
    });
  }
  console.log("  ✓ Hero Roles");

  // ─── Stats ────────────────────────────────────
  await prisma.stat.deleteMany();
  const stats = [
    { value: 3, suffix: "", label: "Internships" },
    { value: 5, suffix: "+", label: "Projects Built" },
    { value: 3, suffix: "", label: "Certifications" },
  ];
  for (let i = 0; i < stats.length; i++) {
    await prisma.stat.create({
      data: { ...stats[i], sortOrder: i },
    });
  }
  console.log("  ✓ Stats");

  // ─── Experience ───────────────────────────────
  await prisma.experience.deleteMany();
  const experiences = [
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
      current: false,
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
      current: false,
      bullets: [
        "Developed responsive UI components and implemented form validation for offline-compatible login features",
        "Gained hands-on experience in front-end development practices including UI testing and accessibility",
      ],
      tech: ["HTML5", "CSS3", "JavaScript"],
    },
  ];
  for (let i = 0; i < experiences.length; i++) {
    await prisma.experience.create({
      data: {
        role: experiences[i].role,
        company: experiences[i].company,
        duration: experiences[i].duration,
        current: experiences[i].current,
        bullets: JSON.stringify(experiences[i].bullets),
        tech: JSON.stringify(experiences[i].tech),
        sortOrder: i,
      },
    });
  }
  console.log("  ✓ Experience");

  // ─── Projects ─────────────────────────────────
  const projects = [
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
      repoUrl: "https://github.com/Azeez11223/e-commerce-national",
      featured: true,
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
      repoUrl: "https://github.com/Azeez11223/car-booking-project",
      featured: false,
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
      repoUrl: "https://github.com/Azeez11223/rusi-calorie-calculator",
      featured: false,
    },
    {
      slug: "click-fraud-detection",
      title: "Click Fraud Detection System",
      category: "Python / Data Science",
      oneLiner:
        "Machine learning model to detect fraudulent click patterns in advertising traffic.",
      description:
        "A Python-based machine learning solution for detecting fraudulent clicks in real-time ad traffic using behavioral feature analysis.",
      problem:
        "Automated click bots waste ad budgets and distort marketing analytics.",
      solution:
        "Built a machine learning classification model analyzing IP activity, timestamp patterns, and device fingerprints to flag suspicious clicks.",
      features: [
        "Behavioral pattern analysis on click streams",
        "Machine learning classification model",
        "Automated fraud risk scoring",
      ],
      tech: ["Python", "Machine Learning", "Data Analysis"],
      impact: [],
      repoUrl: "https://github.com/Azeez11223/Click-fraud-detection",
      featured: false,
    },
    {
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
      features: [
        "Dynamic product filtering and category view",
        "Interactive cart interface",
        "Responsive web design",
      ],
      tech: ["HTML5", "CSS3", "JavaScript"],
      impact: [],
      repoUrl: "https://github.com/Azeez11223/HeadPhone_Shop",
      featured: false,
    },
  ];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const projectData = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      oneLiner: p.oneLiner,
      description: p.description,
      problem: p.problem,
      solution: p.solution,
      features: JSON.stringify(p.features),
      tech: JSON.stringify(p.tech),
      impact: JSON.stringify(p.impact),
      repoUrl: p.repoUrl,
      featured: p.featured,
      sortOrder: i,
    };
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: projectData,
      create: projectData,
    });
  }
  console.log("  ✓ Projects");

  // ─── Skill Groups ─────────────────────────────
  const skillGroups = [
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
  for (let i = 0; i < skillGroups.length; i++) {
    await prisma.skillGroup.create({
      data: {
        category: skillGroups[i].category,
        skills: JSON.stringify(skillGroups[i].skills),
        sortOrder: i,
      },
    });
  }
  console.log("  ✓ Skill Groups");

  // ─── Education ────────────────────────────────
  await prisma.education.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      degree: "B.Tech Information Technology",
      institution:
        "B.S. Abdur Rahman Crescent Institute of Science and Technology",
      location: "Vandalur, Chennai",
      duration: "2022 – 2026",
      cgpa: "7.28",
    },
  });
  console.log("  ✓ Education");

  // ─── Certifications ───────────────────────────
  const certifications = [
    { name: "Java", issuer: "HackerRank" },
    { name: "SQL (Intermediate)", issuer: "HackerRank" },
    { name: "English for Competitive Exam", issuer: "NPTEL" },
  ];
  for (let i = 0; i < certifications.length; i++) {
    await prisma.certification.create({
      data: { ...certifications[i], sortOrder: i },
    });
  }
  console.log("  ✓ Certifications");

  // ─── Nav Links ────────────────────────────────
  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];
  for (let i = 0; i < navLinks.length; i++) {
    await prisma.navLink.create({
      data: { ...navLinks[i], sortOrder: i },
    });
  }
  console.log("  ✓ Nav Links");

  // ─── SEO Settings ────────────────────────────
  await prisma.seoSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitle: "Mohammed Abdul Azeez S — Java Full Stack Developer",
      siteDescription:
        "Final-year IT student who builds backend systems the way production teams do: Spring Boot services, versioned REST APIs, and schemas that hold up under real queries.",
      keywords: JSON.stringify([
        "Java Full Stack Developer",
        "Spring Boot Developer",
        "React Developer",
        "PostgreSQL",
        "Backend Developer Intern",
        "Mohammed Abdul Azeez S",
      ]),
      siteUrl: "https://mdazeezsoftdev.vercel.app",
    },
  });
  console.log("  ✓ SEO Settings");

  // ─── Site Settings ────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultTheme: "dark",
      logoText: "MA",
    },
  });
  console.log("  ✓ Site Settings");

  console.log("\n✅ Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
