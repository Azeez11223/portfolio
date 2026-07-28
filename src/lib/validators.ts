import { z } from "zod";

const optionalUrlTransform = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || !val.trim()) return null;
      let v = val.trim();
      if (!/^https?:\/\//i.test(v)) {
        v = `https://${v}`;
      }
      return v;
    });

// ─── Auth ─────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Profile ──────────────────────────────────
export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  firstName: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  tagline: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  linkedin: optionalUrlTransform(),
  github: optionalUrlTransform(),
  githubUsername: z.string().min(1).max(50),
  availability: z.string().min(1).max(100),
  resumeUrl: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  gradYear: z.number().int().min(1900).max(2100),
  cgpa: z.string().min(1).max(10),
});

// ─── Career Objective ─────────────────────────
export const careerObjectiveSchema = z.object({
  short: z.string().min(1).max(500),
  long: z.string().min(1).max(2000),
});

// ─── Hero Role ────────────────────────────────
export const heroRoleSchema = z.object({
  text: z.string().min(1).max(100),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Stat ─────────────────────────────────────
export const statSchema = z.object({
  value: z.number().int().min(0),
  suffix: z.string().max(10).optional(),
  label: z.string().min(1).max(50),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Experience ───────────────────────────────
export const experienceSchema = z.object({
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  duration: z.string().min(1).max(100),
  current: z.boolean().optional(),
  bullets: z.array(z.string()),
  tech: z.array(z.string()),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Project ──────────────────────────────────
export const projectSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  oneLiner: z.string().min(1).max(500),
  description: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  features: z.array(z.string()),
  tech: z.array(z.string()),
  impact: z.array(z.string()),
  duration: z.string().optional().nullable(),
  repoUrl: optionalUrlTransform(),
  liveUrl: optionalUrlTransform(),
  challenges: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Skill Group ──────────────────────────────
export const skillGroupSchema = z.object({
  category: z.string().min(1).max(100),
  skills: z.array(
    z.object({
      name: z.string().min(1).max(100),
      tier: z.string().min(1),
    })
  ),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Education ────────────────────────────────
export const educationSchema = z.object({
  degree: z.string().min(1).max(200),
  institution: z.string().min(1).max(300),
  location: z.string().min(1).max(200),
  duration: z.string().min(1).max(50),
  cgpa: z.string().min(1).max(10),
});

// ─── Certification ────────────────────────────
export const certificationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  issuer: z.string().min(1, "Issuer is required").max(200),
  credentialUrl: optionalUrlTransform(),
  imageUrl: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Contact Message ──────────────────────────
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

// ─── SEO Settings ─────────────────────────────
export const seoSchema = z.object({
  siteTitle: z.string().min(1).max(200),
  siteDescription: z.string().min(1).max(500),
  keywords: z.array(z.string()),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterCard: z.string().optional(),
  twitterTitle: z.string().optional().nullable(),
  twitterDescription: z.string().optional().nullable(),
  siteUrl: optionalUrlTransform(),
});

// ─── Site Settings ────────────────────────────
export const siteSettingsSchema = z.object({
  defaultTheme: z.enum(["dark", "light"]),
  faviconUrl: z.string().optional().nullable(),
  logoText: z.string().min(1).max(10),
  sectionsVisibility: z.any().optional().nullable(),
});

// ─── Reorder ──────────────────────────────────
export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int().min(0),
    })
  ),
});

// ─── Message Status ───────────────────────────
export const messageStatusSchema = z.object({
  status: z.enum(["unread", "read", "archived"]),
});

// ─── Nav Link ─────────────────────────────────
export const navLinkSchema = z.object({
  label: z.string().min(1).max(50),
  href: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0).optional(),
});
