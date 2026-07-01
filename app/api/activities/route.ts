import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activities = await prisma.activity.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();
  const activity = await prisma.activity.create({
    data: body,
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  });
  return NextResponse.json(activity, { status: 201 });
}
