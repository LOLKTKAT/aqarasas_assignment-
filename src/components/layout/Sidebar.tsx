"use client";
import { sideBarData } from "@/constans/sidebarData";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

function NavList({
  items,
  active,
  onActivate,
}: {
  items: typeof sideBarData;
  active: number;
  onActivate: (id: number) => void;
}) {
  return (
    <ul className={`flex flex-col gap-2 antialiased`}>
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <li
            className={`cursor-pointer flex gap-3 items-center p-3 rounded-xl transition-all duration-200 ease-in-out transform hover:translate-x-1 hover:scale-[1.01] ${
              active == item.id ? "bg-white/10" : "hover:bg-white/5"
            }`}
            key={item.id}
            onClick={() => onActivate(item.id)}
          >
            <IconComponent size={24} />
            <p className="text-[16px]">{item.title}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const [activeNavItem, setActiveNavItem] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainItems = sideBarData.filter((item) => item.section === "main");
  const footerItems = sideBarData.filter((item) => item.section === "footer");

  return (
    <div dir="rtl">
      {/* Hamburger Menu Button - Visible only on small/medium screens */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden cursor-pointer fixed top-4 start-4 z-50 p-2 bg-primary rounded-lg text-text-primary-dark"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Backdrop - Visible only on small/medium screens */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden cursor-pointer fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <ScrollArea
        className={`text-text-primary-dark font-medium bg-primary lg:w-fit w-0 h-svh  fixed lg:relative z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0 w-fit"
            : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close Button inside Sidebar */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden cursor-pointer absolute top-4 left-4 p-2 text-text-primary-dark"
        >
          <X size={24} />
        </button>
        <div className="h-10 w-full" />
        <div className="flex flex-col gap-24 p-5 ">
          <NavList
            items={mainItems}
            active={activeNavItem}
            onActivate={setActiveNavItem}
          />
          <NavList
            items={footerItems}
            active={activeNavItem}
            onActivate={setActiveNavItem}
          />
        </div>
        <div className="h-px w-full bg-white/10 my-2" />
        <div className="flex items-center p-5 justify-between cursor-pointer">
          <div className="text-[16px]">
            <p>أحمد</p>
            <p>Ahmad@gmail.com</p>
          </div>
          <div>
            <ChevronDown size={16} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
