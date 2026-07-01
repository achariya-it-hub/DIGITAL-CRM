"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCRMStore } from "@/store/crm-store";
import { useAuth } from "@/components/providers/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatDateTime, initials } from "@/lib/utils";
import { Meeting } from "@/types";
import { Plus, Video, Users, Calendar, Clock, Phone, PhoneOff, X, Maximize2, Minimize2 } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function JitsiMeeting({ roomName, displayName, onClose }: { roomName: string; displayName: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let api: any = null;

    async function loadJitsi() {
      if (!containerRef.current) return;

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI;
        if (!JitsiMeetExternalAPI || !containerRef.current) return;

        api = new JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: containerRef.current,
          userInfo: { displayName },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            toolbarButtons: [
              "microphone", "camera", "desktop", "chat",
              "raisehand", "participants-pane", "tileview",
              "fullscreen", "hangup",
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            DEFAULT_BACKGROUND: "#1e1b4b",
            TOOLBAR_ALWAYS_VISIBLE: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          },
        });

        api.addEventListener("readyToClose", onClose);
        setIsLoaded(true);
      };
      document.head.appendChild(script);

      return () => {
        api?.dispose();
        script.remove();
      };
    }

    loadJitsi();
  }, [roomName, displayName, onClose]);

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900 ${isFullscreen ? "" : "p-4 lg:p-8"}`}>
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button onClick={onClose} className="rounded-lg bg-red-500/80 p-2 text-white hover:bg-red-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <div ref={containerRef} className={`w-full h-full ${isFullscreen ? "" : "rounded-2xl overflow-hidden shadow-2xl"}`} />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/70 text-sm">Joining meeting room...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MeetingsPage() {
  const { user } = useAuth();
  const meetings = useCRMStore((s) => s.meetings);
  const members = useCRMStore((s) => s.members);
  const addMeeting = useCRMStore((s) => s.addMeeting);
  const updateMeeting = useCRMStore((s) => s.updateMeeting);
  const deleteMeeting = useCRMStore((s) => s.deleteMeeting);
  const load = useCRMStore((s) => s.load);
  useEffect(() => { load(); }, [load]);
  const [open, setOpen] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", startTime: "", endTime: "", attendees: [] as string[] });

  const scheduled = meetings.filter((m) => m.status === "scheduled");
  const past = meetings.filter((m) => m.status === "ended");

  function handleCreate() {
    if (!form.title || !form.date || !form.startTime || !user?.id) return;
    const start = new Date(`${form.date}T${form.startTime}:00`);
    const end = form.endTime ? new Date(`${form.date}T${form.endTime}:00`) : new Date(start.getTime() + 3600000);
    addMeeting({
      title: form.title,
      description: form.description,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      hostId: user.id,
      attendeeIds: [user.id, ...form.attendees],
      status: "scheduled",
    });
    setOpen(false);
    setForm({ title: "", description: "", date: "", startTime: "", endTime: "", attendees: [] });
  }

  function joinMeeting(meeting: Meeting) {
    updateMeeting(meeting.id, { status: "live" });
    setActiveMeeting(meeting);
  }

  function endMeeting(meeting: Meeting) {
    updateMeeting(meeting.id, { status: "ended" });
    setActiveMeeting(null);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <AnimatePresence>
        {activeMeeting && (
          <JitsiMeeting
            roomName={activeMeeting.roomName}
            displayName={user?.name || "Guest"}
            onClose={() => endMeeting(activeMeeting)}
          />
        )}
      </AnimatePresence>

      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-500 mt-1">Schedule and join team meetings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" />}>
            <Plus className="h-4 w-4 mr-2" /> Schedule Meeting
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle className="text-xl font-semibold">Schedule Meeting</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Meeting Title</Label><Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekly Standup" /></div>
              <div><Label>Description</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Date</Label><Input type="date" className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div><Label>Start Time</Label><Input type="time" className="mt-1.5" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
                <div><Label>End Time</Label><Input type="time" className="mt-1.5" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>
              <div>
                <Label>Attendees</Label>
                <div className="mt-2 space-y-2">
                  {members.filter((m) => m.id !== user?.id).map((m) => (
                    <label key={m.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={form.attendees.includes(m.id)}
                        onChange={(e) => setForm({ ...form, attendees: e.target.checked ? [...form.attendees, m.id] : form.attendees.filter((id) => id !== m.id) })}
                        className="rounded border-slate-300"
                      />
                      <Avatar className="h-7 w-7"><AvatarImage src={m.avatar} /><AvatarFallback className="text-[9px]">{initials(m.name)}</AvatarFallback></Avatar>
                      <span className="text-sm font-medium text-slate-700">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Schedule Meeting</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md bg-white">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Video className="h-5 w-5 text-indigo-500" /> Upcoming Meetings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {scheduled.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No upcoming meetings. Schedule one!</p>}
            {scheduled.map((meeting) => {
              const host = members.find((m) => m.id === meeting.hostId);
              const attendees = members.filter((m) => meeting.attendeeIds.includes(m.id));
              const isHost = meeting.hostId === user?.id;
              return (
                <motion.div key={meeting.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-800">{meeting.title}</h3>
                      {meeting.description && <p className="text-sm text-slate-500 truncate">{meeting.description}</p>}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar className="h-3 w-3" />{formatDate(meeting.startTime, { month: "short", day: "numeric" })}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3" />{formatDate(meeting.startTime, { hour: "numeric", minute: "2-digit" })} — {formatDate(meeting.endTime, { hour: "numeric", minute: "2-digit" })}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Users className="h-3 w-3" />{attendees.length} attendees</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {attendees.slice(0, 4).map((m) => (
                        <Avatar key={m.id} className="h-7 w-7 ring-2 ring-white">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback className="text-[9px] bg-slate-100">{initials(m.name)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {isHost && (
                        <Button variant="outline" size="sm" onClick={() => deleteMeeting(meeting.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">Cancel</Button>
                      )}
                      <Button size="sm" onClick={() => joinMeeting(meeting)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30">
                        <Phone className="h-4 w-4 mr-1" /> Join
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {past.length > 0 && (
        <motion.div variants={item}>
          <Card className="border-0 shadow-md bg-white">
            <CardHeader><CardTitle className="text-lg text-slate-500 flex items-center gap-2"><PhoneOff className="h-5 w-5" /> Past Meetings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {past.map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 opacity-60">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <PhoneOff className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600">{meeting.title}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(meeting.startTime)}</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500">Ended</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
