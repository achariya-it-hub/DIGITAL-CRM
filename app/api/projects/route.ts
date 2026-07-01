import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      milestones: true,
      tasks: { select: { id: true, status: true, assigneeId: true } },
    },
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { memberIds, ...projectData } = body;

  const project = await prisma.project.create({
    data: {
      ...projectData,
      members: memberIds?.length
        ? { create: memberIds.map((userId: string) => ({ userId })) }
        : undefined,
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
    },
  });
  return NextResponse.json(project, { status: 201 });
}
