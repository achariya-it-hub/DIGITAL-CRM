"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { useAuth } from "@/components/providers/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icon3D } from "@/components/icon-3d";
import { formatDate, initials } from "@/lib/utils";
import { Project, ProjectStatus, Priority } from "@/types";
import { Plus, Search, FolderKanban, ArrowUpRight, Users, Check } from "lucide-react";
import Link from "next/link";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusColors: Record<ProjectStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  "on-hold": "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const priorityColors: Record<Priority, string> = {
  urgent: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const projectColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function ProjectsPage() {
  const { user } = useAuth();
  const projects = useCRMStore((s) => s.projects);
  const members = useCRMStore((s) => s.members);
  const tasks = useCRMStore((s) => s.tasks);
  const milestones = useCRMStore((s) => s.milestones);
  const addProject = useCRMStore((s) => s.addProject);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", priority: "medium" as Priority, startDate: "", endDate: "",
    memberIds: [] as string[], color: "#6366f1",
  });

  const filtered = projects.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleMember(id: string) {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter((m) => m !== id)
        : [...prev.memberIds, id],
    }));
  }

  function handleCreate() {
    if (!form.name || !user?.id) return;
    const finalMembers = form.memberIds.includes(user.id) ? form.memberIds : [user.id, ...form.memberIds];
    addProject({
      name: form.name,
      description: form.description,
      status: "active",
      priority: form.priority,
      startDate: form.startDate || new Date().toISOString().split("T")[0],
      endDate: form.endDate || new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
      progress: 0,
      ownerId: user.id,
      memberIds: finalMembers,
      color: form.color,
    });
    setOpen(false);
    setForm({ name: "", description: "", priority: "medium", startDate: "", endDate: "", memberIds: [], color: "#6366f1" });
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">{projects.length} total projects</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25" />}>
            <Plus className="h-4 w-4 mr-2" /> New Project
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Project Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Website Redesign" className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..." className="mt-1.5" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => v && setForm({ ...form, priority: v as Priority })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label>Project Color</Label>
                <div className="flex gap-2 mt-2">
                  {projectColors.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">Assign Team Members <span className="text-xs text-slate-400 font-normal">({form.memberIds.length} selected)</span></Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto rounded-xl border border-slate-200 p-2">
                  {members.filter((m) => m.status === "active").map((m) => {
                    const isSelected = form.memberIds.includes(m.id);
                    return (
                      <button key={m.id} type="button" onClick={() => toggleMember(m.id)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${isSelected ? "bg-indigo-50 border border-indigo-300" : "border border-slate-100 hover:bg-slate-50 hover:border-slate-200"}`}>
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback className="text-[9px] bg-slate-100">{initials(m.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.title}</p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white border-slate-200" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "completed", "on-hold"] as const).map((s) => (
            <Button key={s} variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className={filter === s ? "bg-indigo-600 text-white" : ""}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const doneTasks = projectTasks.filter((t) => t.status === "done").length;
          const projectMilestones = milestones.filter((m) => m.projectId === project.id);
          const teamMembers = members.filter((m) => project.memberIds.includes(m.id));

          return (
            <motion.div key={project.id} variants={item}>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: project.color }}>
                          <FolderKanban className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{project.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Ends {formatDate(project.endDate)}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={statusColors[project.status]}>{project.status}</Badge>
                      <Badge variant="outline" className={priorityColors[project.priority]}>{project.priority}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{doneTasks}/{projectTasks.length} tasks done</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <div className="flex -space-x-2">
                        {teamMembers.slice(0, 4).map((m) => (
                          <Avatar key={m.id} className="h-7 w-7 ring-2 ring-white">
                            <AvatarImage src={m.avatar} />
                            <AvatarFallback className="text-[9px] bg-slate-100">{initials(m.name)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {teamMembers.length > 4 && (
                          <div className="h-7 w-7 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[9px] font-medium text-slate-500">
                            +{teamMembers.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{projectMilestones.length} milestones</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{teamMembers.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
