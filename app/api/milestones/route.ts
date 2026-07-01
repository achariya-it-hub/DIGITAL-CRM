import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  const where: Record<string, unknown> = {};
  if (projectId) where.projectId = projectId;

  const milestones = await prisma.milestone.findMany({
    where,
    include: { project: true },
  });
  return NextResponse.json(milestones);
}

export async function POST(request: Request) {
  const body = await request.json();
  const milestone = await prisma.milestone.create({
    data: body,
    include: { project: true },
  });
  return NextResponse.json(milestone, { status: 201 });
}
