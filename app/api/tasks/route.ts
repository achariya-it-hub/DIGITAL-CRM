import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: true,
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      milestone: true,
    },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: body,
    include: {
      project: true,
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      milestone: true,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
