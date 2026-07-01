"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { addDays, differenceInDays, format, parseISO, startOfDay, isWithinInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function TimelinePage() {
  const projects = useCRMStore((s) => s.projects);
  const milestones = useCRMStore((s) => s.milestones);
  const tasks = useCRMStore((s) => s.tasks);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  const [view, setView] = useState<"projects" | "milestones" | "tasks">("projects");
  const [projectFilter, setProjectFilter] = useState("all");
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 15); return d;
  });

  const rangeDays = 60;
  const days = useMemo(() => Array.from({ length: rangeDays }, (_, i) => addDays(rangeStart, i)), [rangeStart]);
  const today = startOfDay(new Date());

  const filteredProjects = projects.filter((p) => projectFilter === "all" || p.id === projectFilter);
  const filteredMilestones = milestones.filter((m) => projectFilter === "all" || m.projectId === projectFilter);
  const filteredTasks = tasks.filter((t) => projectFilter === "all" || t.projectId === projectFilter);

  function getBarStyle(start: string, end: string) {
    const s = parseISO(start);
    const e = parseISO(end);
    const totalRange = rangeDays;
    const startDay = differenceInDays(s, rangeStart);
    const endDay = differenceInDays(e, rangeStart);
    const left = Math.max(0, (startDay / totalRange) * 100);
    const width = Math.min(100 - left, ((endDay - startDay) / totalRange) * 100);
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  }

  function isOverdue(end: string) {
    return parseISO(end) < today;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timeline</h1>
          <p className="text-slate-500 mt-1">Visualize your project schedules</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={projectFilter} onValueChange={(v) => v && setProjectFilter(v)}>
            <SelectTrigger className="w-44 bg-white"><SelectValue placeholder="All Projects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={view} onValueChange={(v) => v && setView(v as typeof view)}>
            <SelectTrigger className="w-36 bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="milestones">Milestones</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setRangeStart(addDays(rangeStart, -14))}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="text-sm font-medium text-slate-600 min-w-[200px] text-center">
          {format(rangeStart, "MMM d")} — {format(addDays(rangeStart, rangeDays), "MMM d, yyyy")}
        </span>
        <Button variant="outline" size="icon" onClick={() => setRangeStart(addDays(rangeStart, 14))}><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => { const d = new Date(); d.setDate(d.getDate() - 15); setRangeStart(d); }}><Calendar className="h-3.5 w-3.5 mr-1" />Today</Button>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10">
                <div className="w-52 shrink-0 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {view === "projects" ? "Projects" : view === "milestones" ? "Milestones" : "Tasks"}
                </div>
                <div className="flex-1 flex relative">
                  {days.filter((_, i) => i % 7 === 0).map((day) => {
                    const left = (differenceInDays(day, rangeStart) / rangeDays) * 100;
                    return (
                      <div key={day.toISOString()} className="absolute text-[10px] text-slate-400 font-medium" style={{ left: `${left}%` }}>
                        {format(day, "MMM d")}
                      </div>
                    );
                  })}
                </div>
              </div>

              {view === "projects" && filteredProjects.map((project) => {
                const bar = getBarStyle(project.startDate, project.endDate);
                return (
                  <div key={project.id} className="flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="w-52 shrink-0 px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800 truncate">{project.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(project.startDate)} — {formatDate(project.endDate)}</p>
                    </div>
                    <div className="flex-1 relative py-4">
                      <div className="absolute inset-y-0 left-0 right-0">
                        {days.filter((_, i) => i % 7 === 0).map((day) => (
                          <div key={day.toISOString()} className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${(differenceInDays(day, rangeStart) / rangeDays) * 100}%` }} />
                        ))}
                        <div className="absolute top-0 bottom-0 w-px bg-indigo-300 border-dashed" style={{ left: `${(differenceInDays(today, rangeStart) / rangeDays) * 100}%` }} />
                      </div>
                      <div className="relative">
                        <div
                          className="h-8 rounded-lg flex items-center px-3 text-xs font-medium text-white shadow-sm cursor-pointer transition-all hover:shadow-md"
                          style={{ ...bar, backgroundColor: project.color, opacity: isOverdue(project.endDate) && project.status !== "completed" ? 0.6 : 1 }}
                        >
                          <span className="truncate">{project.name} — {project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {view === "milestones" && filteredMilestones.map((ms) => {
                const project = projects.find((p) => p.id === ms.projectId);
                const msDate = ms.dueDate;
                const bar = getBarStyle(msDate, msDate);
                const statusColors: Record<string, string> = { upcoming: "#6366f1", "in-progress": "#f59e0b", completed: "#10b981", overdue: "#ef4444" };
                return (
                  <div key={ms.id} className="flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="w-52 shrink-0 px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 truncate">{ms.title}</p>
                      <p className="text-[10px] text-slate-400">{project?.name}</p>
                    </div>
                    <div className="flex-1 relative py-3">
                      <div className="relative">
                        <div className="absolute rounded-full" style={{ left: bar.left, width: "12px", height: "12px", top: "8px", backgroundColor: statusColors[ms.status] || "#6366f1" }} />
                        <div className="absolute text-[10px] text-slate-600 font-medium" style={{ left: `calc(${bar.left} + 20px)`, top: "4px" }}>
                          {formatDate(ms.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {view === "tasks" && filteredTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((task) => {
                if (!task.dueDate) return null;
                const bar = getBarStyle(task.createdAt, task.dueDate);
                const statusColors: Record<string, string> = { backlog: "#94a3b8", todo: "#3b82f6", "in-progress": "#f59e0b", review: "#a855f7", done: "#10b981" };
                return (
                  <div key={task.id} className="flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="w-52 shrink-0 px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                      <Badge variant="secondary" className="text-[9px] mt-1">{task.status}</Badge>
                    </div>
                    <div className="flex-1 relative py-3">
                      <div className="relative">
                        <div
                          className="h-5 rounded flex items-center px-2 text-[10px] font-medium text-white"
                          style={{ ...bar, backgroundColor: statusColors[task.status] || "#6366f1", minWidth: "20px" }}
                        >
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
