"use client";
import React, { useState } from "react";
import {
  Settings,
  Search,
  FileText,
  Download,
  LogIn,
  Globe,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  LucideIcon,
  Plus,
  Minus,
  Box,
  Folder,
  Map,
  TrendingUp,
  Lock,
  ShoppingBag,
} from "lucide-react";

// --- Interfaces ---

interface SubItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  subItems?: SubItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  collapsed: boolean;
  activeId: string;
  setActiveId: (id: string) => void;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
}

// --- Components ---

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed,
  activeId,
  setActiveId,
  expandedMenus,
  toggleMenu,
}) => {
  const { id, icon: Icon, label, subItems } = item;
  const isExpanded = expandedMenus[id];
  const hasSubItems = subItems && subItems.length > 0;

  // Check if any child of this item is currently active
  const isChildActive = subItems?.some((sub) => sub.id === activeId);

  // The Parent is "Active" (Highlighted) if:
  // 1. It is the exact active ID (for items with no children)
  // 2. OR It has children AND (It is expanded OR a child is active)
  const isParentActive =
    activeId === id || (hasSubItems && (isExpanded || isChildActive));

  return (
    <div className="w-full mb-1">
      {/* Main Item */}
      <div
        onClick={() => {
          if (hasSubItems && !collapsed) {
            toggleMenu(id);
          } else {
            setActiveId(id);
          }
        }}
        className={`
          group flex items-center p-3 cursor-pointer 
          ${
            isParentActive
              ? "bg-white/10 text-white shadow-lg"
              : "text-slate-400 hover:bg-white/10 hover:text-white"
          }
          ${collapsed ? "justify-center" : "px-4"}
        `}
      >
        <div
          className={`${
            isParentActive
              ? "text-white"
              : "text-slate-400 group-hover:text-white"
          } `}
        >
          <Icon size={16} strokeWidth={2} />
        </div>

        {!collapsed && (
          <>
            <span
              className={`ms-3 font-medium whitespace-nowrap ${
                isParentActive ? "text-white" : ""
              } ${hasSubItems ? "text-[16px]" : "text-[14px]"}`}
            >
              {label}
            </span>

            <div
              className={`mr-auto  ${
                isParentActive
                  ? "text-white"
                  : "text-slate-500 group-hover:text-slate-300"
              }`}
            >
              {hasSubItems ? (
                isExpanded ? (
                  <Minus size={16} strokeWidth={1.5} />
                ) : (
                  <Plus size={16} strokeWidth={1.5} />
                )
              ) : (
                <ChevronLeft size={18} strokeWidth={1.5} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Accordion Sub-items Container */}
      {!collapsed && hasSubItems && isExpanded && (
        <div className="mt-1 bg-transparent overflow-hidden ">
          {subItems.map((sub) => {
            const isSubActive = activeId === sub.id;
            const SubIcon = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => setActiveId(sub.id)}
                className={`
                  group/sub flex items-center pr-4 pl-4 py-2.5 my-0.5 text-[14px] cursor-pointer  relative 
                  ${
                    isSubActive
                      ? "text-white font-medium bg-white/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
                  }
                `}
              >
                <SubIcon size={16} strokeWidth={2} />
                <span className="ms-3 whitespace-nowrap">{sub.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>("map");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    services: true,
  });

  const toggleMenu = (id: string): void => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const menuItems: MenuItem[] = [
    { id: "overview", icon: Box, label: "نظرة عامة" },
    {
      id: "services",
      icon: Folder,
      label: "الخدمات",
      subItems: [
        { id: "search", label: "البحث بالقطع و الصفقات", icon: Search },
        { id: "map", label: "البحث بالخريطة", icon: Map },
        { id: "content", label: "المحتوى", icon: FileText },
        { id: "indicators", label: "المؤشرات العقارية", icon: TrendingUp },
        { id: "export", label: "تصدير البيانات", icon: Download },
      ],
    },
    { id: "favorites", icon: Lock, label: "المفضلة" },
    { id: "notifications", icon: Lock, label: "الإشعارات" },
    { id: "packages", icon: ShoppingBag, label: "باقات الإشتراك" },
    { id: "settings", icon: Settings, label: "الإعدادات" },
  ];

  return (
    <div
      className="flex h-screen bg-slate-50 font-sans selection:bg-blue-500/30"
      dir="rtl"
    >
      {/* Sidebar Container */}
      <aside
        className={`
          relative flex flex-col  bg-primary text-white ease-in-out border-l border-white/5 shadow-2xl
          ${isCollapsed ? "w-30" : "w-65"}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute cursor-pointer top-8 z-50 flex items-center justify-center 
            size-10  shadow-lg 
            ${
              isCollapsed
                ? "left-0 text-black bg-[#1e145033] -translate-x-full rounded-e-2xl"
                : "left-0 text-white bg-white/20 rounded-s-2xl "
            }
          `}
        >
          {isCollapsed ? (
            <ChevronsLeft size={24} strokeWidth={2} />
          ) : (
            <ChevronsRight size={24} strokeWidth={2} />
          )}
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6">
          <div className="flex w-full items-center gap-3 mb-8">
            <img
              src="/aqarsas-white-logo.png"
              className="w-[64px] cursor-pointer h-auto"
              alt="aqarsas-logo"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
          <div
            className={`w-full flex items-center justify-between ${
              isCollapsed ? "flex-col" : "flex-row"
            }`}
          >
            <div className="flex items-center gap-2 bg-white rounded-sm  px-2 py-1 mb-4">
              <span className="text-xs font-normal text-black">غير مسجل</span>
            </div>

            <button className="flex items-center gap-2 cursor-pointer text-sky-400 text-[16px] mb-6">
              <Globe size={14} />
              <span>English</span>
            </button>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col w-full  text-start">
              <span className="text-sky-400 font-bold">أهلا بك،</span>
              <span className="text-white font-bold mb-3">
                سجل الآن في العضوية
              </span>
            </div>
          )}
          <div className="w-full h-px bg-white/10 my-3"></div>
          {/* Navigation Items */}
          <div className="">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                collapsed={isCollapsed}
                activeId={activeId}
                setActiveId={setActiveId}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
              />
            ))}
          </div>
          {/* Footer / Login */}
          <div className="my-8">
            <div
              className={`
              flex items-center gap-3 p-3.5 bg-sky-400/10 text-sky-400 cursor-pointer
              ${isCollapsed ? "justify-center" : "px-5"}
            `}
            >
              <LogIn size={20} strokeWidth={2.5} />
              {!isCollapsed && (
                <span className="font-bold text-sm tracking-wide">
                  تسجيل الدخول
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-primary h-8 w-full" />
      </aside>
    </div>
  );
};

export default App;
