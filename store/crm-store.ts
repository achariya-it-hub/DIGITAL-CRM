"use client";

import { create } from "zustand";
import { Project, Milestone, Task, Meeting, Activity, TeamMember } from "@/types";

interface CRMStore {
  members: TeamMember[];
  projects: Project[];
  milestones: Milestone[];
  tasks: Task[];
  meetings: Meeting[];
  activities: Activity[];
  load: () => Promise<void>;
  addMember: (member: Omit<TeamMember, "id">) => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addMilestone: (milestone: Omit<Milestone, "id">) => Promise<void>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, "id" | "roomName">) => Promise<void>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => Promise<void>;
}

export const useCRMStore = create<CRMStore>()((set, get) => ({
  members: [],
  projects: [],
  milestones: [],
  tasks: [],
  meetings: [],
  activities: [],

  load: async () => {
    const [members, projects, milestones, tasks, meetings, activities] = await Promise.all([
      fetch("/api/members").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/milestones").then((r) => r.json()),
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/meetings").then((r) => r.json()),
      fetch("/api/activities").then((r) => r.json()),
    ]);
    set({ members, projects, milestones, tasks, meetings, activities });
  },

  addMember: async (member) => {
    await fetch("/api/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(member) });
    await get().load();
  },

  updateMember: async (id, updates) => {
    await fetch(`/api/members/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    await get().load();
  },

  deleteMember: async (id) => {
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    await get().load();
  },

  addProject: async (project) => {
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    await get().load();
  },

  updateProject: async (id, updates) => {
    await fetch(`/api/projects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    await get().load();
  },

  deleteProject: async (id) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await get().load();
  },

  addMilestone: async (milestone) => {
    await fetch("/api/milestones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(milestone) });
    await get().load();
  },

  updateMilestone: async (id, updates) => {
    await fetch(`/api/milestones/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    await get().load();
  },

  deleteMilestone: async (id) => {
    await fetch(`/api/milestones/${id}`, { method: "DELETE" });
    await get().load();
  },

  addTask: async (task) => {
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) });
    await get().load();
  },

  updateTask: async (id, updates) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    await get().load();
  },

  deleteTask: async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await get().load();
  },

  addMeeting: async (meeting) => {
    await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(meeting) });
    await get().load();
  },

  updateMeeting: async (id, updates) => {
    await fetch(`/api/meetings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    await get().load();
  },

  deleteMeeting: async (id) => {
    await fetch(`/api/meetings/${id}`, { method: "DELETE" });
    await get().load();
  },

  addActivity: async (activity) => {
    await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(activity) });
    await get().load();
  },
}));

export const useMember = (id?: string) => {
  return useCRMStore((state) => state.members.find((m) => m.id === id));
};
