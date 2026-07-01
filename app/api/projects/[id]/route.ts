import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      milestones: true,
      tasks: { select: { id: true, status: true, assigneeId: true } },
    },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { memberIds, ...projectData } = body;

  if (memberIds) {
    await prisma.projectMember.deleteMany({ where: { projectId: id } });
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      members: memberIds?.length
        ? { create: memberIds.map((userId: string) => ({ userId })) }
        : undefined,
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      milestones: true,
      tasks: { select: { id: true, status: true, assigneeId: true } },
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ message: "Project deleted" });
}
