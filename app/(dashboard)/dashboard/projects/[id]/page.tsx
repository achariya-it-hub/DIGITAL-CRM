"use client";

import { use, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, initials } from "@/lib/utils";
import { Milestone, Priority, TaskStatus } from "@/types";
import { Plus, ArrowLeft, Calendar, CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusIcons = {
  upcoming: <Circle className="h-4 w-4 text-slate-400" />,
  "in-progress": <Clock className="h-4 w-4 text-amber-500" />,
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  overdue: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

const taskStatusColors: Record<TaskStatus, string> = {
  backlog: "bg-slate-100 text-slate-600",
  todo: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  review: "bg-purple-100 text-purple-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const projects = useCRMStore((s) => s.projects);
  const milestones = useCRMStore((s) => s.milestones);
  const tasks = useCRMStore((s) => s.tasks);
  const members = useCRMStore((s) => s.members);
  const addMilestone = useCRMStore((s) => s.addMilestone);
  const addTask = useCRMStore((s) => s.addTask);
  const updateTask = useCRMStore((s) => s.updateTask);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);

  const project = projects.find((p) => p.id === id);
  const projectMilestones = milestones.filter((m) => m.projectId === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [mForm, setMForm] = useState({ title: "", description: "", dueDate: "" });
  const [tForm, setTForm] = useState({ title: "", description: "", milestoneId: "", priority: "medium" as Priority, assigneeId: "", dueDate: "" });

  if (!project) return <div className="text-center py-20 text-slate-500">Project not found.</div>;

  const teamMembers = members.filter((m) => project.memberIds.includes(m.id));

  function handleAddMilestone() {
    if (!mForm.title) return;
    addMilestone({ projectId: id, title: mForm.title, description: mForm.description, dueDate: mForm.dueDate || new Date().toISOString().split("T")[0], status: "upcoming" });
    setMilestoneOpen(false);
    setMForm({ title: "", description: "", dueDate: "" });
  }

  function handleAddTask() {
    if (!tForm.title) return;
    addTask({ projectId: id, milestoneId: tForm.milestoneId || undefined, title: tForm.title, description: tForm.description, status: "todo", priority: tForm.priority, assigneeId: tForm.assigneeId || undefined, dueDate: tForm.dueDate || undefined });
    setTaskOpen(false);
    setTForm({ title: "", description: "", milestoneId: "", priority: "medium", assigneeId: "", dueDate: "" });
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-1 rounded-full" style={{ backgroundColor: project.color }} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <p className="text-slate-500 mt-1 max-w-2xl">{project.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={milestoneOpen} onOpenChange={setMilestoneOpen}>
              <DialogTrigger render={<Button variant="outline" size="sm" />}>
                <Plus className="h-4 w-4 mr-1" />Milestone
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div><Label>Title</Label><Input className="mt-1.5" value={mForm.title} onChange={(e) => setMForm({ ...mForm, title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea className="mt-1.5" value={mForm.description} onChange={(e) => setMForm({ ...mForm, description: e.target.value })} /></div>
                  <div><Label>Due Date</Label><Input type="date" className="mt-1.5" value={mForm.dueDate} onChange={(e) => setMForm({ ...mForm, dueDate: e.target.value })} /></div>
                  <Button onClick={handleAddMilestone} className="w-full">Add Milestone</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
              <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white" />}>
                <Plus className="h-4 w-4 mr-1" />Task
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div><Label>Title</Label><Input className="mt-1.5" value={tForm.title} onChange={(e) => setTForm({ ...tForm, title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea className="mt-1.5" value={tForm.description} onChange={(e) => setTForm({ ...tForm, description: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Milestone</Label>
                      <Select value={tForm.milestoneId} onValueChange={(v) => v && setTForm({ ...tForm, milestoneId: v })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Optional" /></SelectTrigger>
                        <SelectContent>
                          {projectMilestones.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Assignee</Label>
                      <Select value={tForm.assigneeId} onValueChange={(v) => v && setTForm({ ...tForm, assigneeId: v })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={tForm.priority} onValueChange={(v) => v && setTForm({ ...tForm, priority: v as Priority })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Due Date</Label><Input type="date" className="mt-1.5" value={tForm.dueDate} onChange={(e) => setTForm({ ...tForm, dueDate: e.target.value })} /></div>
                  </div>
                  <Button onClick={handleAddTask} className="w-full">Add Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white"><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{project.progress}%</p><p className="text-xs text-slate-500 mt-1">Progress</p>
          <Progress value={project.progress} className="h-1.5 mt-2" />
        </CardContent></Card>
        <Card className="border-0 shadow-md bg-white"><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{projectTasks.length}</p><p className="text-xs text-slate-500 mt-1">Tasks</p>
        </CardContent></Card>
        <Card className="border-0 shadow-md bg-white"><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{projectMilestones.length}</p><p className="text-xs text-slate-500 mt-1">Milestones</p>
        </CardContent></Card>
        <Card className="border-0 shadow-md bg-white"><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p><p className="text-xs text-slate-500 mt-1">Members</p>
        </CardContent></Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg">Milestones</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {projectMilestones.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No milestones yet.</p>}
              {projectMilestones.map((ms) => (
                <div key={ms.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  {statusIcons[ms.status]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{ms.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{ms.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-400">Due {formatDate(ms.dueDate)}</span>
                      <Badge variant="secondary" className="text-[10px]">{ms.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg">Tasks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {projectTasks.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No tasks yet.</p>}
              {projectTasks.sort((a, b) => a.order - b.order).map((task) => {
                const assignee = members.find((m) => m.id === task.assigneeId);
                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-indigo-200 transition-colors">
                    <button onClick={() => updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })} className="shrink-0">
                      {task.status === "done" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === "done" ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p>
                      {task.dueDate && <p className="text-xs text-slate-400 mt-0.5">Due {formatDate(task.dueDate)}</p>}
                    </div>
                    <Badge variant="secondary" className={`text-[10px] ${taskStatusColors[task.status]}`}>{task.status}</Badge>
                    {assignee && <Avatar className="h-6 w-6"><AvatarImage src={assignee.avatar} /><AvatarFallback className="text-[9px]">{initials(assignee.name)}</AvatarFallback></Avatar>}
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
