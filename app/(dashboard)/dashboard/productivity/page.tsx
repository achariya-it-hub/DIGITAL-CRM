"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Icon3D } from "@/components/icon-3d";
import { initials, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, CheckCircle2, Clock, AlertTriangle, Target, Users } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function ProductivityPage() {
  const members = useCRMStore((s) => s.members);
  const projects = useCRMStore((s) => s.projects);
  const tasks = useCRMStore((s) => s.tasks);
  const milestones = useCRMStore((s) => s.milestones);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);

  const memberStats = useMemo(() => {
    return members.map((m) => {
      const myTasks = tasks.filter((t) => t.assigneeId === m.id);
      const done = myTasks.filter((t) => t.status === "done").length;
      const inProgress = myTasks.filter((t) => t.status === "in-progress").length;
      const todo = myTasks.filter((t) => t.status === "todo").length;
      const review = myTasks.filter((t) => t.status === "review").length;
      const overdue = myTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;
      const myProjects = projects.filter((p) => p.memberIds.includes(m.id));
      const activeProjects = myProjects.filter((p) => p.status === "active").length;
      const completionRate = myTasks.length > 0 ? Math.round((done / myTasks.length) * 100) : 0;

      return { ...m, totalTasks: myTasks.length, done, inProgress, todo, review, overdue, activeProjects, completionRate };
    });
  }, [members, tasks, projects]);

  const topPerformers = [...memberStats].sort((a, b) => b.completionRate - a.completionRate);
  const mostActive = [...memberStats].sort((a, b) => b.totalTasks - a.totalTasks);

  const barData = memberStats.map((m) => ({ name: m.name.split(" ")[0], completed: m.done, inProgress: m.inProgress, todo: m.todo, review: m.review }));

  const departmentData = useMemo(() => {
    const depts: Record<string, { total: number; done: number }> = {};
    memberStats.forEach((m) => {
      if (!depts[m.department]) depts[m.department] = { total: 0, done: 0 };
      depts[m.department].total += m.totalTasks;
      depts[m.department].done += m.done;
    });
    return Object.entries(depts).map(([name, data]) => ({ name, ...data, rate: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0 }));
  }, [memberStats]);

  const pieData = memberStats.map((m) => ({ name: m.name, value: m.totalTasks }));

  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done");
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-900">Productivity Dashboard</h1>
        <p className="text-slate-500 mt-1">Employee-wise performance overview across all projects</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length, icon: Target, gradient: "indigo" as const, color: "text-indigo-600" },
          { label: "Completed", value: tasks.filter((t) => t.status === "done").length, icon: CheckCircle2, gradient: "green" as const, color: "text-emerald-600" },
          { label: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, icon: Clock, gradient: "amber" as const, color: "text-amber-600" },
          { label: "Overdue", value: overdueTasks.length, icon: AlertTriangle, gradient: "red" as const, color: "text-red-600" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <Icon3D gradient={stat.gradient} size="sm"><stat.icon className="h-5 w-5" /></Icon3D>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-800">Tasks by Employee</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="review" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="todo" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Done</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />In Progress</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" />Review</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />To Do</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-800">Task Distribution</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600 truncate">{d.name}</span>
                    <span className="text-slate-400 ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md bg-white">
          <CardHeader><CardTitle className="text-lg font-semibold text-slate-800">Department Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="rounded-xl border border-slate-100 p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-800">{dept.name}</h4>
                    <Badge variant="secondary" className="text-xs">{dept.rate}%</Badge>
                  </div>
                  <Progress value={dept.rate} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{dept.done}/{dept.total} tasks completed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-500" /> Top Performers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.slice(0, 5).map((m, i) => (
                <div key={m.id} className="flex items-center gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors">
                  <span className="text-lg font-bold text-slate-300 w-6 text-center">#{i + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.title} &middot; {m.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">{m.completionRate}%</p>
                    <p className="text-[10px] text-slate-400">{m.done}/{m.totalTasks} tasks</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Users className="h-5 w-5 text-purple-500" /> All Employees</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-[420px] overflow-y-auto">
              {memberStats.sort((a, b) => b.totalTasks - a.totalTasks).map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback className="text-xs bg-slate-100">{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.department} &middot; {m.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.overdue > 0 && <Badge className="text-[9px] bg-red-50 text-red-600 border-red-200">{m.overdue} overdue</Badge>}
                    <div className="text-right min-w-[50px]">
                      <p className="text-sm font-bold text-slate-700">{m.completionRate}%</p>
                    </div>
                    <div className="w-16">
                      <Progress value={m.completionRate} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
