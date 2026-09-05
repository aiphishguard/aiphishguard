import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg" />
      <Navbar />
      <CommandPalette />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
