import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, email: true, avatar: true } },
      attendees: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
    },
  });
  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(meeting);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const meeting = await prisma.meeting.update({
    where: { id },
    data: body,
    include: {
      host: { select: { id: true, name: true, email: true, avatar: true } },
      attendees: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
    },
  });
  return NextResponse.json(meeting);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.meeting.delete({ where: { id } });
  return NextResponse.json({ message: "Meeting deleted" });
}
