import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.activity.deleteMany();
    await prisma.meetingAttendee.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.task.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: [
        { id: "u1", name: "Athiyaman", email: "athiyaman@digital-crm.com", password: "demo123", role: "manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Athiyaman", department: "Content & Media", title: "Content Manager", phone: "+91 98765 43210", joinDate: "2024-01-10", status: "active" },
        { id: "u2", name: "Bala", email: "bala@digital-crm.com", password: "demo123", role: "admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bala", department: "Engineering", title: "Technical Lead", phone: "+91 98765 43211", joinDate: "2024-01-10", status: "active" },
        { id: "u3", name: "Ramkumar", email: "ramkumar@digital-crm.com", password: "demo123", role: "member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramkumar", department: "Media Production", title: "Video Producer", phone: "+91 98765 43212", joinDate: "2024-03-15", status: "active" },
        { id: "u4", name: "Sarah Miller", email: "sarah@digital-crm.com", password: "demo123", role: "member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", department: "Design", title: "UI/UX Designer", phone: "+1 (555) 102-2002", joinDate: "2024-06-01", status: "active" },
        { id: "u5", name: "Michael Brown", email: "michael@digital-crm.com", password: "demo123", role: "member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael", department: "Engineering", title: "Backend Developer", phone: "+1 (555) 105-2005", joinDate: "2024-06-15", status: "active" },
      ],
    });

    await prisma.project.createMany({
      data: [
        { id: "p1", name: "Book Preparation Work", description: "Complete book preparation including content creation, editing, formatting and review.", status: "active", priority: "high", startDate: "2025-06-01", endDate: "2025-08-30", progress: 35, color: "#6366f1", ownerId: "u1" },
        { id: "p2", name: "Video", description: "Video production and editing projects.", status: "active", priority: "high", startDate: "2025-06-15", endDate: "2025-09-30", progress: 20, color: "#ec4899", ownerId: "u1" },
        { id: "p3", name: "App Development", description: "Mobile and web application development.", status: "active", priority: "urgent", startDate: "2025-05-01", endDate: "2025-10-31", progress: 40, color: "#10b981", ownerId: "u2" },
        { id: "p4", name: "Audio Podcast", description: "Podcast production including recording and editing.", status: "active", priority: "medium", startDate: "2025-07-01", endDate: "2025-12-31", progress: 10, color: "#f59e0b", ownerId: "u1" },
        { id: "p5", name: "AI Film Studio Agents", description: "AI-powered agents for film studio automation.", status: "active", priority: "high", startDate: "2025-06-10", endDate: "2025-11-30", progress: 25, color: "#8b5cf6", ownerId: "u2" },
        { id: "p6", name: "Shambhala Music App", description: "Music streaming and discovery app.", status: "active", priority: "high", startDate: "2025-05-15", endDate: "2025-09-15", progress: 50, color: "#06b6d4", ownerId: "u2" },
        { id: "p7", name: "RBIQ Video Work", description: "Video content for RBIQ client.", status: "active", priority: "medium", startDate: "2025-07-01", endDate: "2025-08-31", progress: 15, color: "#ef4444", ownerId: "u3" },
        { id: "p8", name: "DMR DER App", description: "Multi-platform app for 5 clients.", status: "active", priority: "urgent", startDate: "2025-04-01", endDate: "2025-12-31", progress: 30, color: "#3b82f6", ownerId: "u2" },
      ],
    });

    await prisma.projectMember.createMany({
      data: [
        { projectId: "p1", userId: "u1" },
        { projectId: "p2", userId: "u1" }, { projectId: "p2", userId: "u3" },
        { projectId: "p3", userId: "u2" }, { projectId: "p3", userId: "u5" },
        { projectId: "p4", userId: "u1" },
        { projectId: "p5", userId: "u2" }, { projectId: "p5", userId: "u5" },
        { projectId: "p6", userId: "u2" }, { projectId: "p6", userId: "u4" },
        { projectId: "p7", userId: "u3" },
        { projectId: "p8", userId: "u2" }, { projectId: "p8", userId: "u5" }, { projectId: "p8", userId: "u4" },
      ],
    });

    await prisma.milestone.createMany({
      data: [
        { id: "m1", projectId: "p1", title: "Content Outline", description: "Finalize book chapter structure", dueDate: "2025-06-20", status: "completed" },
        { id: "m2", projectId: "p1", title: "First Draft", description: "Complete first draft of all chapters", dueDate: "2025-07-30", status: "in-progress" },
        { id: "m3", projectId: "p2", title: "Intern Recruitment", description: "Recruit interns for video support", dueDate: "2025-07-15", status: "in-progress" },
        { id: "m4", projectId: "p2", title: "Video Portfolio", description: "Complete first set of videos", dueDate: "2025-08-31", status: "upcoming" },
        { id: "m5", projectId: "p3", title: "Core Features", description: "Build core app features", dueDate: "2025-07-31", status: "in-progress" },
        { id: "m6", projectId: "p5", title: "Agent Prototype", description: "Working AI agent prototype", dueDate: "2025-08-15", status: "in-progress" },
        { id: "m7", projectId: "p6", title: "MVP Release", description: "Minimum viable product launch", dueDate: "2025-07-31", status: "in-progress" },
        { id: "m8", projectId: "p8", title: "Platform Delivery", description: "Deliver all 5 client apps", dueDate: "2025-09-30", status: "upcoming" },
      ],
    });

    await prisma.task.createMany({
      data: [
        { id: "t1", projectId: "p1", milestoneId: "m1", title: "Research target audience", description: "Identify target readers", status: "done", priority: "high", assigneeId: "u1", dueDate: "2025-06-10", order: 0 },
        { id: "t2", projectId: "p1", milestoneId: "m2", title: "Write chapter 1-3", description: "Draft first three chapters", status: "in-progress", priority: "high", assigneeId: "u1", dueDate: "2025-07-10", order: 0 },
        { id: "t3", projectId: "p1", milestoneId: "m2", title: "Write chapter 4-6", description: "Draft chapters four through six", status: "todo", priority: "medium", assigneeId: "u1", dueDate: "2025-07-25", order: 1 },
        { id: "t4", projectId: "p2", milestoneId: "m3", title: "Post intern job listings", description: "Publish internship postings", status: "in-progress", priority: "urgent", assigneeId: "u1", dueDate: "2025-07-05", order: 0 },
        { id: "t5", projectId: "p2", milestoneId: "m3", title: "Interview candidates", description: "Screen shortlisted interns", status: "todo", priority: "high", assigneeId: "u1", dueDate: "2025-07-12", order: 1 },
        { id: "t6", projectId: "p2", milestoneId: "m4", title: "Script video episodes", description: "Write scripts for 5 episodes", status: "todo", priority: "medium", assigneeId: "u3", dueDate: "2025-08-15", order: 2 },
        { id: "t7", projectId: "p3", milestoneId: "m5", title: "API architecture design", description: "Design REST API endpoints", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-15", order: 0 },
        { id: "t8", projectId: "p3", milestoneId: "m5", title: "Build authentication module", description: "User auth and sessions", status: "in-progress", priority: "urgent", assigneeId: "u2", dueDate: "2025-07-05", order: 1 },
        { id: "t9", projectId: "p3", milestoneId: "m5", title: "Dashboard UI development", description: "Build main dashboard screens", status: "todo", priority: "high", assigneeId: "u2", dueDate: "2025-07-20", order: 2 },
        { id: "t10", projectId: "p4", title: "Record first episode", description: "Record intro episode", status: "backlog", priority: "medium", assigneeId: "u1", dueDate: "2025-07-15", order: 0 },
        { id: "t11", projectId: "p5", milestoneId: "m6", title: "Research AI frameworks", description: "Evaluate LangChain, CrewAI", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-25", order: 0 },
        { id: "t12", projectId: "p5", milestoneId: "m6", title: "Build agent pipeline", description: "Core AI agent pipeline", status: "in-progress", priority: "urgent", assigneeId: "u2", dueDate: "2025-07-30", order: 1 },
        { id: "t13", projectId: "p5", milestoneId: "m6", title: "Integrate with studio tools", description: "Connect to video tools", status: "todo", priority: "high", assigneeId: "u2", dueDate: "2025-08-10", order: 2 },
        { id: "t14", projectId: "p6", milestoneId: "m7", title: "Music library integration", description: "Integrate streaming APIs", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-20", order: 0 },
        { id: "t15", projectId: "p6", milestoneId: "m7", title: "Build player UI", description: "Design music player interface", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-07-15", order: 1 },
        { id: "t16", projectId: "p6", milestoneId: "m7", title: "Recommendation engine", description: "AI music recommendations", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-07-25", order: 2 },
        { id: "t17", projectId: "p7", title: "Plan video shoot schedule", description: "Create shooting schedule", status: "in-progress", priority: "high", assigneeId: "u3", dueDate: "2025-07-10", order: 0 },
        { id: "t18", projectId: "p7", title: "Edit first batch", description: "Edit RBIQ videos", status: "todo", priority: "medium", assigneeId: "u3", dueDate: "2025-08-05", order: 1 },
        { id: "t19", projectId: "p8", milestoneId: "m8", title: "Qschool app build", description: "Develop Qschool version", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-08-01", order: 0 },
        { id: "t20", projectId: "p8", milestoneId: "m8", title: "Bushido app build", description: "Develop Bushido version", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-08-15", order: 1 },
        { id: "t21", projectId: "p8", milestoneId: "m8", title: "Heguru app build", description: "Develop Heguru version", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-09-01", order: 2 },
        { id: "t22", projectId: "p8", milestoneId: "m8", title: "WOW app build", description: "Develop WOW version", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-09-15", order: 3 },
        { id: "t23", projectId: "p8", milestoneId: "m8", title: "RBIQ app build", description: "Develop RBIQ version", status: "backlog", priority: "high", assigneeId: "u2", dueDate: "2025-09-30", order: 4 },
      ],
    });

    await prisma.meeting.create({
      data: {
        id: "mt1", title: "Weekly Team Standup", description: "Sync on all project progress", startTime: new Date("2025-07-01T09:00:00Z"), endTime: new Date("2025-07-01T09:30:00Z"), roomName: "weekly-standup", hostId: "u2", status: "scheduled",
        attendees: { create: [{ userId: "u1" }, { userId: "u2" }, { userId: "u3" }, { userId: "u4" }, { userId: "u5" }] },
      },
    });

    await prisma.activity.createMany({
      data: [
        { id: "a1", userId: "u2", action: "created", target: "project", targetId: "p3", createdAt: new Date("2025-05-01T00:00:00Z") },
        { id: "a2", userId: "u1", action: "created", target: "project", targetId: "p2", createdAt: new Date("2025-06-15T00:00:00Z") },
        { id: "a3", userId: "u2", action: "completed", target: "task", targetId: "t7", createdAt: new Date("2025-06-16T00:00:00Z") },
        { id: "a4", userId: "u1", action: "completed", target: "task", targetId: "t1", createdAt: new Date("2025-06-11T00:00:00Z") },
      ],
    });

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
