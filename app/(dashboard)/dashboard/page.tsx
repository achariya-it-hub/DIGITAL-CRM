"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { useAuth } from "@/components/providers/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Icon3D } from "@/components/icon-3d";
import { formatDate, initials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const projects = useCRMStore((s) => s.projects);
  const tasks = useCRMStore((s) => s.tasks);
  const milestones = useCRMStore((s) => s.milestones);
  const meetings = useCRMStore((s) => s.meetings);
  const members = useCRMStore((s) => s.members);
  const activities = useCRMStore((s) => s.activities);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);

  const myTasks = tasks.filter((t) => t.assigneeId === user?.id);
  const activeProjects = projects.filter((p) => p.status === "active");
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done");
  const upcomingMeetings = meetings.filter((m) => m.status === "scheduled");

  const stats = [
    { label: "Active Projects", value: activeProjects.length, icon: FolderKanban, gradient: "indigo" as const, color: "text-indigo-600" },
    { label: "My Tasks", value: myTasks.length, icon: CheckSquare, gradient: "blue" as const, color: "text-blue-600" },
    { label: "Overdue Tasks", value: overdueTasks.length, icon: AlertCircle, gradient: "red" as const, color: "text-red-600" },
    { label: "Upcoming Meetings", value: upcomingMeetings.length, icon: Calendar, gradient: "green" as const, color: "text-emerald-600" },
  ];

  const taskStats = {
    done: tasks.filter((t) => t.status === "done").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    backlog: tasks.filter((t) => t.status === "backlog").length,
    review: tasks.filter((t) => t.status === "review").length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.name?.split(" ")?.[0] || ""}</span>
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening across your projects today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <Icon3D gradient={stat.gradient} size="sm">
                    <stat.icon className="h-5 w-5" />
                  </Icon3D>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Active Projects</CardTitle>
              <Link href="/dashboard/projects" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group"
                >
                  <div className="h-10 w-1 rounded-full" style={{ backgroundColor: project.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{project.name}</p>
                      <Badge variant="secondary" className="text-[10px] shrink-0">{project.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={project.progress} className="h-1.5 flex-1 max-w-[200px]" />
                      <span className="text-xs text-slate-500 shrink-0">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {members.filter((m) => project.memberIds?.includes(m.id)).slice(0, 3).map((m) => (
                      <Avatar key={m.id} className="h-7 w-7 ring-2 ring-white">
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback className="text-[10px] bg-slate-100">{initials(m.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Team</CardTitle>
              <Badge variant="secondary">{members.length} members</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => {
                const memberTasks = tasks.filter((t) => t.assigneeId === member.id && t.status !== "done").length;
                return (
                  <div key={member.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">{initials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{memberTasks} tasks</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Task Overview</CardTitle>
              <Link href="/dashboard/tasks" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {(["backlog", "todo", "in-progress", "review", "done"] as const).map((status) => {
                  const count = taskStats[status];
                  const colors = { backlog: "bg-slate-100 text-slate-600", todo: "bg-blue-50 text-blue-600", "in-progress": "bg-amber-50 text-amber-600", review: "bg-purple-50 text-purple-600", done: "bg-emerald-50 text-emerald-600" };
                  const labels = { backlog: "Backlog", todo: "To Do", "in-progress": "In Progress", review: "Review", done: "Done" };
                  return (
                    <div key={status} className={`rounded-xl p-3 text-center ${colors[status]}`}>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-[10px] font-medium mt-0.5">{labels[status]}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Overall Progress</span>
                  <span>{tasks.length > 0 ? Math.round((taskStats.done / tasks.length) * 100) : 0}%</span>
                </div>
                <Progress value={tasks.length > 0 ? (taskStats.done / tasks.length) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[280px] overflow-y-auto">
              {activities.slice(0, 10).map((activity) => {
                const user = members.find((m) => m.id === activity.userId);
                const actionColor = { created: "bg-emerald-500", completed: "bg-blue-500", updated: "bg-amber-500", scheduled: "bg-purple-500" };
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: (actionColor as Record<string, string>)[activity.action] || "#94a3b8" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-800">{user?.name}</span>{" "}
                        {activity.action} a {activity.target}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(activity.createdAt, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
