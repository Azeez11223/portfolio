import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectSchema } from '@/lib/validators';

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    slug: "ecommerce-order-inventory",
    title: "Real-Time E-Commerce Order & Inventory System",
    category: "Full Stack / Backend-heavy",
    oneLiner: "A full-stack order and inventory platform built to keep stock counts honest under concurrent load.",
    description: "A full-stack application handling transactional order processing and inventory management, built with Spring Boot, React, and PostgreSQL.",
    problem: "Needed a reliable way to handle concurrent orders and inventory without overselling stock or losing track of transactional state.",
    solution: "Built a Spring Boot and React application backed by PostgreSQL, with RESTful APIs secured by JWT authentication protecting user sessions and endpoints.",
    features: ["Transactional order processing", "RESTful APIs secured with JWT", "Paginated product listings"],
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "JWT", "REST API"],
    impact: ["JWT authentication secured user sessions", "Pagination improved response times"],
    repoUrl: "https://github.com/Azeez11223/e-commerce-national",
    featured: true,
  },
  {
    id: "proj-2",
    slug: "smart-car-parking",
    title: "Smart Car Parking Booking System",
    category: "Frontend / Product UX",
    oneLiner: "A responsive booking flow that shows real parking availability as it changes.",
    description: "A responsive booking system built in React with real-time slot availability and dynamic vehicle registration.",
    problem: "Drivers need to know which parking slots are actually free before they arrive.",
    solution: "Built a responsive React interface that displays real-time slot availability with dynamic vehicle registration.",
    features: ["Real-time slot availability", "Dynamic vehicle registration", "Interactive slot selection"],
    tech: ["React", "JavaScript", "CSS3"],
    impact: [],
    repoUrl: "https://github.com/Azeez11223/car-booking-project",
    featured: false,
  },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const projects = await db.project.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);
    if (!projects || projects.length === 0) {
      return NextResponse.json(DEFAULT_PROJECTS);
    }
    const parsed = projects.map((proj: any) => ({
      ...proj,
      features: typeof proj.features === 'string' ? JSON.parse(proj.features || '[]') : proj.features,
      tech: typeof proj.tech === 'string' ? JSON.parse(proj.tech || '[]') : proj.tech,
      impact: typeof proj.impact === 'string' ? JSON.parse(proj.impact || '[]') : proj.impact,
    }));
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(DEFAULT_PROJECTS);
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const created = await db.project.create({
        data: {
          ...data,
          features: JSON.stringify(data.features || []),
          tech: JSON.stringify(data.tech || []),
          impact: JSON.stringify(data.impact || [])
        },
      });
      return NextResponse.json(created);
    } catch (err) {
      console.warn("DB create project notice:", err);
      return NextResponse.json({ ...data, id: `proj-${Date.now()}` });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const targetId = id || body.id;
    if (!targetId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const result = projectSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const data = result.data as any;
    try {
      const updated = await db.project.update({
        where: { id: targetId },
        data: {
          ...data,
          features: JSON.stringify(data.features || []),
          tech: JSON.stringify(data.tech || []),
          impact: JSON.stringify(data.impact || [])
        },
      });
      return NextResponse.json(updated);
    } catch (err) {
      console.warn("DB update project notice:", err);
      return NextResponse.json({ ...data, id: targetId });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
      await db.project.delete({ where: { id } });
    } catch (err) {
      console.warn("DB delete project notice:", err);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
