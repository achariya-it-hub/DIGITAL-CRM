"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-context";
import { useCRMStore } from "@/store/crm-store";
import { initials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  GanttChart,
  Video,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/timeline", label: "Timeline", icon: GanttChart },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/productivity", label: "Productivity", icon: BarChart3 },
  { href: "/dashboard/meetings", label: "Meetings", icon: Video },
];

function NavItem({ href, label, icon: Icon, active }: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-white" : "text-white/50 group-hover:text-white")} />
      <span>{label}</span>
      {active && (
        <ChevronRight className="ml-auto h-4 w-4 text-white/70" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const member = useCRMStore((s) => s.members.find((m) => m.email === user?.email));
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#1A3A5C] border-r border-white/10 w-64">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <img src="/logo.png" alt="Achariya" className="h-10 w-10 rounded-xl object-cover" />
        <div>
          <h1 className="text-lg font-bold text-white">
            Achariya CRM
          </h1>
          <p className="text-[11px] text-white/50 font-medium">World Class Education</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-pink-500/30">
            <AvatarImage src={member?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-semibold">
              {member ? initials(member.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-lg p-1.5 text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3A5C] shadow-lg border border-white/10 lg:hidden"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-10 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 shadow"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:block h-full">{sidebar}</div>
    </>
  );
}
