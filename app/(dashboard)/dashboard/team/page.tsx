"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icon3D } from "@/components/icon-3d";
import { formatDate, initials } from "@/lib/utils";
import { TeamMember, UserRole, EmployeeStatus } from "@/types";
import { Plus, Search, Users, Mail, Phone, Calendar, Briefcase, Edit, Trash2, Camera } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusColors: Record<EmployeeStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  "on-leave": "bg-amber-50 text-amber-700 border-amber-200",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  manager: "bg-purple-50 text-purple-700 border-purple-200",
  member: "bg-blue-50 text-blue-700 border-blue-200",
};

const defaultDepartments = ["Engineering", "Design", "Marketing", "Sales", "Support", "Operations"];

interface MemberForm {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  title: string;
  phone: string;
  joinDate: string;
  status: EmployeeStatus;
  password: string;
  avatar: string;
}

const emptyForm: MemberForm = { name: "", email: "", role: "member", department: "Engineering", title: "", phone: "", joinDate: new Date().toISOString().split("T")[0], status: "active", password: "demo123", avatar: "" };

export default function TeamPage() {
  const members = useCRMStore((s) => s.members);
  const projects = useCRMStore((s) => s.projects);
  const tasks = useCRMStore((s) => s.tasks);
  const addMember = useCRMStore((s) => s.addMember);
  const updateMember = useCRMStore((s) => s.updateMember);
  const deleteMember = useCRMStore((s) => s.deleteMember);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [showCustomDept, setShowCustomDept] = useState(false);
  const [customDept, setCustomDept] = useState("");

  const filtered = members.filter((m) => {
    if (filterDept !== "all" && m.department !== filterDept) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allDepartments = [...new Set([...defaultDepartments, ...members.map((m) => m.department)])].sort();

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowCustomDept(false);
    setCustomDept("");
    setOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    setForm({ name: member.name, email: member.email, role: member.role, department: member.department, title: member.title, phone: member.phone, joinDate: member.joinDate, status: member.status, password: member.password || "", avatar: member.avatar || "" });
    const isCustom = !defaultDepartments.includes(member.department);
    setShowCustomDept(isCustom);
    setCustomDept(isCustom ? member.department : "");
    setOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.email) return;
    const avatarUrl = form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name.split(" ")[0]}`;
    const dept = showCustomDept && customDept.trim() ? customDept.trim() : form.department;
    if (editing) {
      updateMember(editing.id, { name: form.name, email: form.email, role: form.role, department: dept, title: form.title, phone: form.phone, joinDate: form.joinDate, status: form.status, avatar: avatarUrl });
    } else {
      addMember({ name: form.name, email: form.email, role: form.role, department: dept, title: form.title, phone: form.phone, joinDate: form.joinDate, status: form.status, password: form.password || "demo123", avatar: avatarUrl });
    }
    setOpen(false);
    setForm(emptyForm);
    setEditing(null);
    setShowCustomDept(false);
    setCustomDept("");
  }

  function handleDelete(id: string) {
    if (confirm("Remove this employee? They will be unassigned from all projects and tasks.")) {
      deleteMember(id);
    }
  }

  const deptCounts = allDepartments.reduce((acc, d) => { acc[d] = members.filter((m) => m.department === d).length; return acc; }, {} as Record<string, number>);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500 mt-1">{members.length} employees across {Object.keys(deptCounts).filter((d) => deptCounts[d] > 0).length} departments</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25">
          <Plus className="h-4 w-4 mr-2" /> Add Employee
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-3">
        {allDepartments.filter((d) => deptCounts[d] > 0).map((dept) => (
          <button key={dept} onClick={() => setFilterDept(filterDept === dept ? "all" : dept)} className={`rounded-xl border px-4 py-2.5 text-center transition-all duration-200 ${filterDept === dept ? "border-indigo-300 bg-indigo-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
            <p className="text-lg font-bold text-slate-800">{deptCounts[dept]}</p>
            <p className="text-[11px] text-slate-500 font-medium">{dept}</p>
          </button>
        ))}
      </motion.div>

      <motion.div variants={item} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white border-slate-200" />
        </div>
        <Select value={filterDept} onValueChange={(v) => v && setFilterDept(v)}>
          <SelectTrigger className="w-44 bg-white"><SelectValue placeholder="All Departments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {allDepartments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const memberProjects = projects.filter((p) => p.memberIds.includes(member.id));
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const doneTasks = memberTasks.filter((t) => t.status === "done").length;

          return (
            <motion.div key={member.id} variants={item}>
              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-indigo-100">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-800">{member.name}</h3>
                        <p className="text-xs text-slate-500">{member.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(member)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(member.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={statusColors[member.status]}>{member.status}</Badge>
                    <Badge variant="outline" className={roleColors[member.role]}>{member.role}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{member.department}</Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-slate-400" />{member.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-slate-400" />{member.phone}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-slate-400" />Joined {formatDate(member.joinDate)}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-indigo-600">{memberProjects.length}</p>
                      <p className="text-[10px] text-slate-400">Projects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600">{memberTasks.length - doneTasks}</p>
                      <p className="text-[10px] text-slate-400">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600">{doneTasks}</p>
                      <p className="text-[10px] text-slate-400">Done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle className="text-xl font-semibold">{editing ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <Avatar className="h-20 w-20 ring-4 ring-slate-100">
                  <AvatarImage src={form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name.split(" ")[0] || "U"}`} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-semibold">{initials(form.name || "U")}</AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setForm({ ...form, avatar: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400">Click to upload a photo</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
              <div><Label>Email</Label><Input type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Job Title</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer" /></div>
              <div><Label>Phone</Label><Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                {showCustomDept ? (
                  <div className="flex gap-1.5 mt-1.5">
                    <Input value={customDept} onChange={(e) => setCustomDept(e.target.value)} placeholder="e.g. Finance" autoFocus />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => { setShowCustomDept(false); setCustomDept(""); setForm({ ...form, department: allDepartments[0] }); }}>
                      <span className="text-lg leading-none">&times;</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-1.5 mt-1.5">
                    <Select value={form.department} onValueChange={(v) => {
                      if (!v) return;
                      if (v === "_custom") { setShowCustomDept(true); setCustomDept(""); }
                      else { setForm({ ...form, department: v }); }
                    }}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {allDepartments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        <SelectItem value="_custom">+ Add new department...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as EmployeeStatus })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Join Date</Label><Input type="date" className="mt-1.5" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} /></div>
            {!editing && <div><Label>Password</Label><Input className="mt-1.5" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="demo123" /></div>}
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">{editing ? "Save Changes" : "Add Employee"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
