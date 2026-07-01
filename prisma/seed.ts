import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.meetingAttendee.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "u1",
        name: "Athiyaman",
        email: "athiyaman@digital-crm.com",
        password: "demo123",
        role: "manager",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Athiyaman",
        department: "Content & Media",
        title: "Content Manager",
        phone: "+91 98765 43210",
        joinDate: "2024-01-10",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        id: "u2",
        name: "Bala",
        email: "bala@digital-crm.com",
        password: "demo123",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bala",
        department: "Engineering",
        title: "Technical Lead",
        phone: "+91 98765 43211",
        joinDate: "2024-01-10",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        id: "u3",
        name: "Ramkumar",
        email: "ramkumar@digital-crm.com",
        password: "demo123",
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramkumar",
        department: "Media Production",
        title: "Video Producer",
        phone: "+91 98765 43212",
        joinDate: "2024-03-15",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        id: "u4",
        name: "Sarah Miller",
        email: "sarah@digital-crm.com",
        password: "demo123",
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        department: "Design",
        title: "UI/UX Designer",
        phone: "+1 (555) 102-2002",
        joinDate: "2024-06-01",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        id: "u5",
        name: "Michael Brown",
        email: "michael@digital-crm.com",
        password: "demo123",
        role: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        department: "Engineering",
        title: "Backend Developer",
        phone: "+1 (555) 105-2005",
        joinDate: "2024-06-15",
        status: "active",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: "p1",
        name: "Book Preparation Work",
        description: "Complete book preparation including content creation, editing, formatting and review.",
        status: "active",
        priority: "high",
        startDate: "2025-06-01",
        endDate: "2025-08-30",
        progress: 35,
        color: "#6366f1",
        ownerId: "u1",
        members: { create: [{ userId: "u1" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p2",
        name: "Video",
        description: "Video production and editing projects. Interns to be recruited for support.",
        status: "active",
        priority: "high",
        startDate: "2025-06-15",
        endDate: "2025-09-30",
        progress: 20,
        color: "#ec4899",
        ownerId: "u1",
        members: { create: [{ userId: "u1" }, { userId: "u3" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p3",
        name: "App Development",
        description: "Mobile and web application development projects across multiple clients.",
        status: "active",
        priority: "urgent",
        startDate: "2025-05-01",
        endDate: "2025-10-31",
        progress: 40,
        color: "#10b981",
        ownerId: "u2",
        members: { create: [{ userId: "u2" }, { userId: "u5" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p4",
        name: "Audio Podcast",
        description: "Podcast production including recording, editing, and publishing episodes.",
        status: "active",
        priority: "medium",
        startDate: "2025-07-01",
        endDate: "2025-12-31",
        progress: 10,
        color: "#f59e0b",
        ownerId: "u1",
        members: { create: [{ userId: "u1" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p5",
        name: "AI Film Studio Agents",
        description: "Development of AI-powered agents for film studio automation and workflows.",
        status: "active",
        priority: "high",
        startDate: "2025-06-10",
        endDate: "2025-11-30",
        progress: 25,
        color: "#8b5cf6",
        ownerId: "u2",
        members: { create: [{ userId: "u2" }, { userId: "u5" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p6",
        name: "Shambhala Music App",
        description: "Music streaming and discovery application development.",
        status: "active",
        priority: "high",
        startDate: "2025-05-15",
        endDate: "2025-09-15",
        progress: 50,
        color: "#06b6d4",
        ownerId: "u2",
        members: { create: [{ userId: "u2" }, { userId: "u4" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p7",
        name: "RBIQ Video Work",
        description: "Video content production for RBIQ client deliverables.",
        status: "active",
        priority: "medium",
        startDate: "2025-07-01",
        endDate: "2025-08-31",
        progress: 15,
        color: "#ef4444",
        ownerId: "u3",
        members: { create: [{ userId: "u3" }] },
      },
    }),
    prisma.project.create({
      data: {
        id: "p8",
        name: "DMR DER App",
        description: "Multi-platform app development for Qschool, Bushido, Heguru, WOW, and RBIQ clients.",
        status: "active",
        priority: "urgent",
        startDate: "2025-04-01",
        endDate: "2025-12-31",
        progress: 30,
        color: "#3b82f6",
        ownerId: "u2",
        members: { create: [{ userId: "u2" }, { userId: "u5" }, { userId: "u4" }] },
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  // Create milestones
  const milestones = await Promise.all([
    prisma.milestone.create({ data: { id: "m1", projectId: "p1", title: "Content Outline", description: "Finalize book chapter structure and outline", dueDate: "2025-06-20", status: "completed" } }),
    prisma.milestone.create({ data: { id: "m2", projectId: "p1", title: "First Draft", description: "Complete first draft of all chapters", dueDate: "2025-07-30", status: "in-progress" } }),
    prisma.milestone.create({ data: { id: "m3", projectId: "p2", title: "Intern Recruitment", description: "Recruit interns for video production support", dueDate: "2025-07-15", status: "in-progress" } }),
    prisma.milestone.create({ data: { id: "m4", projectId: "p2", title: "Video Portfolio", description: "Complete first set of production videos", dueDate: "2025-08-31", status: "upcoming" } }),
    prisma.milestone.create({ data: { id: "m5", projectId: "p3", title: "Core Features", description: "Build core app features and API", dueDate: "2025-07-31", status: "in-progress" } }),
    prisma.milestone.create({ data: { id: "m6", projectId: "p5", title: "Agent Prototype", description: "Working AI agent prototype", dueDate: "2025-08-15", status: "in-progress" } }),
    prisma.milestone.create({ data: { id: "m7", projectId: "p6", title: "MVP Release", description: "Minimum viable product launch", dueDate: "2025-07-31", status: "in-progress" } }),
    prisma.milestone.create({ data: { id: "m8", projectId: "p8", title: "Platform Delivery", description: "Deliver app builds for all 5 clients", dueDate: "2025-09-30", status: "upcoming" } }),
  ]);

  console.log(`Created ${milestones.length} milestones`);

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({ data: { id: "t1", projectId: "p1", milestoneId: "m1", title: "Research target audience", description: "Identify and profile target readers", status: "done", priority: "high", assigneeId: "u1", dueDate: "2025-06-10", order: 0 } }),
    prisma.task.create({ data: { id: "t2", projectId: "p1", milestoneId: "m2", title: "Write chapter 1-3", description: "Draft first three chapters", status: "in-progress", priority: "high", assigneeId: "u1", dueDate: "2025-07-10", order: 0 } }),
    prisma.task.create({ data: { id: "t3", projectId: "p1", milestoneId: "m2", title: "Write chapter 4-6", description: "Draft chapters four through six", status: "todo", priority: "medium", assigneeId: "u1", dueDate: "2025-07-25", order: 1 } }),
    prisma.task.create({ data: { id: "t4", projectId: "p2", milestoneId: "m3", title: "Post intern job listings", description: "Create and publish internship postings on job portals", status: "in-progress", priority: "urgent", assigneeId: "u1", dueDate: "2025-07-05", order: 0 } }),
    prisma.task.create({ data: { id: "t5", projectId: "p2", milestoneId: "m3", title: "Interview candidates", description: "Screen and interview shortlisted interns", status: "todo", priority: "high", assigneeId: "u1", dueDate: "2025-07-12", order: 1 } }),
    prisma.task.create({ data: { id: "t6", projectId: "p2", milestoneId: "m4", title: "Script video episodes", description: "Write scripts for first 5 video episodes", status: "todo", priority: "medium", assigneeId: "u3", dueDate: "2025-08-15", order: 2 } }),
    prisma.task.create({ data: { id: "t7", projectId: "p3", milestoneId: "m5", title: "API architecture design", description: "Design REST API endpoints and database schema", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-15", order: 0 } }),
    prisma.task.create({ data: { id: "t8", projectId: "p3", milestoneId: "m5", title: "Build authentication module", description: "User registration, login, and session management", status: "in-progress", priority: "urgent", assigneeId: "u2", dueDate: "2025-07-05", order: 1 } }),
    prisma.task.create({ data: { id: "t9", projectId: "p3", milestoneId: "m5", title: "Dashboard UI development", description: "Build main dashboard screens", status: "todo", priority: "high", assigneeId: "u2", dueDate: "2025-07-20", order: 2 } }),
    prisma.task.create({ data: { id: "t10", projectId: "p4", title: "Record first episode", description: "Record intro episode of the podcast", status: "backlog", priority: "medium", assigneeId: "u1", dueDate: "2025-07-15", order: 0 } }),
    prisma.task.create({ data: { id: "t11", projectId: "p5", milestoneId: "m6", title: "Research AI frameworks", description: "Evaluate LangChain, CrewAI, AutoGen for agent workflows", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-25", order: 0 } }),
    prisma.task.create({ data: { id: "t12", projectId: "p5", milestoneId: "m6", title: "Build agent pipeline", description: "Develop the core AI agent processing pipeline", status: "in-progress", priority: "urgent", assigneeId: "u2", dueDate: "2025-07-30", order: 1 } }),
    prisma.task.create({ data: { id: "t13", projectId: "p5", milestoneId: "m6", title: "Integrate with studio tools", description: "Connect agents to video editing and production tools", status: "todo", priority: "high", assigneeId: "u2", dueDate: "2025-08-10", order: 2 } }),
    prisma.task.create({ data: { id: "t14", projectId: "p6", milestoneId: "m7", title: "Music library integration", description: "Integrate with music streaming APIs and content delivery", status: "done", priority: "high", assigneeId: "u2", dueDate: "2025-06-20", order: 0 } }),
    prisma.task.create({ data: { id: "t15", projectId: "p6", milestoneId: "m7", title: "Build player UI", description: "Design and develop the music player interface", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-07-15", order: 1 } }),
    prisma.task.create({ data: { id: "t16", projectId: "p6", milestoneId: "m7", title: "Recommendation engine", description: "Implement AI-based music recommendations", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-07-25", order: 2 } }),
    prisma.task.create({ data: { id: "t17", projectId: "p7", title: "Plan video shoot schedule", description: "Create shooting schedule and location scouting", status: "in-progress", priority: "high", assigneeId: "u3", dueDate: "2025-07-10", order: 0 } }),
    prisma.task.create({ data: { id: "t18", projectId: "p7", title: "Edit first batch", description: "Edit and post-produce first set of RBIQ videos", status: "todo", priority: "medium", assigneeId: "u3", dueDate: "2025-08-05", order: 1 } }),
    prisma.task.create({ data: { id: "t19", projectId: "p8", milestoneId: "m8", title: "Qschool app build", description: "Develop and test Qschool platform version", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-08-01", order: 0 } }),
    prisma.task.create({ data: { id: "t20", projectId: "p8", milestoneId: "m8", title: "Bushido app build", description: "Develop and test Bushido platform version", status: "in-progress", priority: "high", assigneeId: "u2", dueDate: "2025-08-15", order: 1 } }),
    prisma.task.create({ data: { id: "t21", projectId: "p8", milestoneId: "m8", title: "Heguru app build", description: "Develop and test Heguru platform version", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-09-01", order: 2 } }),
    prisma.task.create({ data: { id: "t22", projectId: "p8", milestoneId: "m8", title: "WOW app build", description: "Develop and test WOW platform version", status: "todo", priority: "medium", assigneeId: "u2", dueDate: "2025-09-15", order: 3 } }),
    prisma.task.create({ data: { id: "t23", projectId: "p8", milestoneId: "m8", title: "RBIQ app build", description: "Develop and test RBIQ platform version", status: "backlog", priority: "high", assigneeId: "u2", dueDate: "2025-09-30", order: 4 } }),
  ]);

  console.log(`Created ${tasks.length} tasks`);

  // Create meetings
  const meetings = await Promise.all([
    prisma.meeting.create({
      data: {
        id: "mt1",
        title: "Weekly Team Standup",
        description: "Sync on all project progress and blockers",
        startTime: new Date("2025-07-01T09:00:00.000Z"),
        endTime: new Date("2025-07-01T09:30:00.000Z"),
        roomName: "weekly-standup",
        hostId: "u2",
        status: "scheduled",
        attendees: { create: [{ userId: "u1" }, { userId: "u2" }, { userId: "u3" }, { userId: "u4" }, { userId: "u5" }] },
      },
    }),
    prisma.meeting.create({
      data: {
        id: "mt2",
        title: "DMR DER App Sprint Review",
        description: "Review progress across all 5 client apps",
        startTime: new Date("2025-07-02T14:00:00.000Z"),
        endTime: new Date("2025-07-02T15:00:00.000Z"),
        roomName: "dmr-der-sprint",
        hostId: "u2",
        status: "scheduled",
        attendees: { create: [{ userId: "u2" }, { userId: "u5" }, { userId: "u4" }] },
      },
    }),
    prisma.meeting.create({
      data: {
        id: "mt3",
        title: "Content Planning Session",
        description: "Plan book content and podcast episodes",
        startTime: new Date("2025-07-03T10:00:00.000Z"),
        endTime: new Date("2025-07-03T11:30:00.000Z"),
        roomName: "content-planning",
        hostId: "u1",
        status: "scheduled",
        attendees: { create: [{ userId: "u1" }, { userId: "u3" }] },
      },
    }),
  ]);

  console.log(`Created ${meetings.length} meetings`);

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({ data: { id: "a1", userId: "u2", action: "created", target: "project", targetId: "p3", createdAt: new Date("2025-05-01T00:00:00.000Z") } }),
    prisma.activity.create({ data: { id: "a2", userId: "u1", action: "created", target: "project", targetId: "p2", createdAt: new Date("2025-06-15T00:00:00.000Z") } }),
    prisma.activity.create({ data: { id: "a3", userId: "u2", action: "completed", target: "task", targetId: "t7", createdAt: new Date("2025-06-16T00:00:00.000Z") } }),
    prisma.activity.create({ data: { id: "a4", userId: "u1", action: "completed", target: "task", targetId: "t1", createdAt: new Date("2025-06-11T00:00:00.000Z") } }),
  ]);

  console.log(`Created ${activities.length} activities`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
