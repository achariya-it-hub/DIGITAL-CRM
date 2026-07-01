"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { useAuth } from "@/components/providers/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatDate } from "@/lib/utils";
import { Task, TaskStatus, Priority } from "@/types";
import { Plus, CheckCircle2, Circle, GripVertical, Filter } from "lucide-react";

const columns: { status: TaskStatus; label: string; color: string; headerColor: string }[] = [
  { status: "backlog", label: "Backlog", color: "bg-slate-100 border-slate-200", headerColor: "bg-slate-500" },
  { status: "todo", label: "To Do", color: "bg-blue-50/50 border-blue-200", headerColor: "bg-blue-500" },
  { status: "in-progress", label: "In Progress", color: "bg-amber-50/50 border-amber-200", headerColor: "bg-amber-500" },
  { status: "review", label: "Review", color: "bg-purple-50/50 border-purple-200", headerColor: "bg-purple-500" },
  { status: "done", label: "Done", color: "bg-emerald-50/50 border-emerald-200", headerColor: "bg-emerald-500" },
];

const priorityBadge: Record<Priority, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-slate-100 text-slate-600",
};

export default function TasksPage() {
  const { user } = useAuth();
  const tasks = useCRMStore((s) => s.tasks);
  const projects = useCRMStore((s) => s.projects);
  const members = useCRMStore((s) => s.members);
  const updateTask = useCRMStore((s) => s.updateTask);
  const addTask = useCRMStore((s) => s.addTask);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  const [open, setOpen] = useState(false);
  const [filterProject, setFilterProject] = useState("all");
  const [form, setForm] = useState({ title: "", description: "", projectId: "", priority: "medium" as Priority, assigneeId: "", dueDate: "" });

  const filtered = tasks.filter((t) => {
    if (filterProject !== "all" && t.projectId !== filterProject) return false;
    return true;
  });

  function handleMove(task: Task, newStatus: TaskStatus) {
    if (task.status === newStatus) return;
    updateTask(task.id, { status: newStatus });
  }

  function handleCreate() {
    if (!form.title || !form.projectId || !user?.id) return;
    addTask({
      projectId: form.projectId,
      title: form.title,
      description: form.description,
      status: "todo",
      priority: form.priority,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate || undefined,
    });
    setOpen(false);
    setForm({ title: "", description: "", projectId: "", priority: "medium", assigneeId: "", dueDate: "" });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">Drag tasks between columns or click to advance</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterProject} onValueChange={(v) => v && setFilterProject(v)}>
            <SelectTrigger className="w-48 bg-white"><Filter className="h-4 w-4 mr-2 text-slate-400" /><SelectValue placeholder="All Projects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" />}>
              <Plus className="h-4 w-4 mr-2" /> New Task
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Task Name</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Design homepage hero" /></div>
                <div><Label>Description</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project</Label>
                    <Select value={form.projectId} onValueChange={(v) => v && setForm({ ...form, projectId: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select project" /></SelectTrigger>
                      <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => v && setForm({ ...form, priority: v as Priority })}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assignee</Label>
                    <Select value={form.assigneeId} onValueChange={(v) => v && setForm({ ...form, assigneeId: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                      <SelectContent>{members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Due Date</Label><Input type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.status).sort((a, b) => a.order - b.order);
          return (
            <div key={col.status} className="flex-shrink-0 w-72 lg:flex-1 lg:w-auto">
              <div className={`rounded-t-xl ${col.headerColor} px-4 py-3 flex items-center justify-between`}>
                <h3 className="text-sm font-semibold text-white">{col.label}</h3>
                <span className="text-xs font-medium text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className={`${col.color} border border-t-0 rounded-b-xl p-3 min-h-[400px] space-y-2`}>
                {colTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const project = projects.find((p) => p.id === task.projectId);
                  return (
                    <motion.div key={task.id} layout className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => handleMove(task, col.status === "done" ? "todo" : col.status === "backlog" ? "todo" : col.status === "todo" ? "in-progress" : col.status === "in-progress" ? "review" : "done")}>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`text-[10px] ${priorityBadge[task.priority]}`}>{task.priority}</Badge>
                        <GripVertical className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm font-medium text-slate-800 mb-1">{task.title}</p>
                      {project && <p className="text-[10px] text-slate-400 mb-2">{project.name}</p>}
                      <div className="flex items-center justify-between">
                        {task.dueDate && <span className="text-[10px] text-slate-400">{formatDate(task.dueDate, { month: "short", day: "numeric" })}</span>}
                        {assignee && <Avatar className="h-5 w-5"><AvatarImage src={assignee.avatar} /><AvatarFallback className="text-[8px]">{initials(assignee.name)}</AvatarFallback></Avatar>}
                      </div>
                    </motion.div>
                  );
                })}
                {colTasks.length === 0 && <div className="flex items-center justify-center h-24 text-sm text-slate-400">No tasks</div>}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
