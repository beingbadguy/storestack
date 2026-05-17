"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useUiStore } from "@/store/useUiStore";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden relative">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
