import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const meetings = await prisma.meeting.findMany({
    include: {
      host: { select: { id: true, name: true, email: true, avatar: true } },
      attendees: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
    },
  });
  return NextResponse.json(meetings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { attendeeIds, ...meetingData } = body;

  const meeting = await prisma.meeting.create({
    data: {
      ...meetingData,
      attendees: attendeeIds?.length
        ? { create: attendeeIds.map((userId: string) => ({ userId })) }
        : undefined,
    },
    include: {
      host: { select: { id: true, name: true, email: true, avatar: true } },
      attendees: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
    },
  });
  return NextResponse.json(meeting, { status: 201 });
}
