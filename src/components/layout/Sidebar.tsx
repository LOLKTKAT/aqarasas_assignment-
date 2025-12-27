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
  Plus,
  Minus,
  Box,
  Folder,
  Map,
  TrendingUp,
  Lock,
  ShoppingBag,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SubItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface MenuItem {
  id: string;
  icon: React.ElementType;
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
  const isChildActive = subItems?.some((sub) => sub.id === activeId);
  const isParentActive =
    activeId === id || (hasSubItems && (isExpanded || isChildActive));

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full mb-1">
        <Tooltip shadow-sm>
          {/* Only trigger tooltip if sidebar is collapsed */}
          <TooltipTrigger asChild>
            <div
              onClick={() => {
                if (hasSubItems) {
                  toggleMenu(id);
                } else {
                  setActiveId(id);
                }
              }}
              className={`
                group flex items-center p-3 cursor-pointer 
                ${
                  isParentActive
                    ? "bg-white/10 text-white"
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
                }`}
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
                    className={`mr-auto ${
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
          </TooltipTrigger>

          {collapsed && (
            <TooltipContent side="left" className="bg-primary text-white">
              <p>{label}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Sub Items Logic */}
        {hasSubItems && isExpanded && (
          <div className="mt-1 bg-transparent overflow-hidden ">
            {subItems.map((sub) => {
              const isSubActive = activeId === sub.id;
              const SubIcon = sub.icon;
              return (
                <Tooltip key={sub.id}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setActiveId(sub.id)}
                      className={`
                        group/sub flex items-center py-2.5 my-0.5 text-[14px] cursor-pointer relative 
                        ${collapsed ? "justify-center px-0" : "pr-4 pl-4"}
                        ${
                          isSubActive
                            ? "text-white font-medium bg-white/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
                        }
                      `}
                    >
                      <SubIcon size={16} strokeWidth={2} />
                      {!collapsed && (
                        <span className="ms-3 whitespace-nowrap">
                          {sub.label}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent
                      side="left"
                      className="bg-primary text-white border-slate-700"
                    >
                      <p>{sub.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>("map");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    services: true,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
      className="flex h-screen bg-slate-50  selection:bg-blue-500/30"
      dir="rtl"
    >
      {/* Mobile Top Nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-white border-b border-white/5 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative cursor-pointer w-10 h-10 flex items-center justify-center"
          >
            <span
              className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />

            <span
              className={`absolute h-0.5 w-6 bg-white transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>

          <img
            src="/aqarsas-white-logo.png"
            className="w-[48px] h-auto"
            alt="aqarsas-logo"
          />
        </div>

        {isMobileMenuOpen && (
          <div className="bg-primary no-scrollbar z-100 border-t border-white/5 h-svh overflow-y-auto pb-10">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-white rounded-sm px-2 py-1">
                  <span className="text-xs font-normal text-black">
                    غير مسجل
                  </span>
                </div>
                <button className="flex items-center gap-2 cursor-pointer text-sky-400 text-[14px]">
                  <Globe size={14} />
                  <span>English</span>
                </button>
              </div>

              <div className="flex flex-col w-full text-start mb-3">
                <span className="text-sky-400 font-bold">أهلا بك،</span>
                <span className="text-white font-bold">
                  سجل الآن في العضوية
                </span>
              </div>

              <div className="w-full h-px bg-white/10 my-3"></div>

              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  collapsed={false}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  expandedMenus={expandedMenus}
                  toggleMenu={toggleMenu}
                />
              ))}

              <div className="my-4">
                <div className="flex items-center gap-3 p-3.5 bg-sky-400/10 text-sky-400 cursor-pointer px-5">
                  <LogIn size={20} strokeWidth={2.5} />
                  <span className="font-bold text-sm tracking-wide">
                    تسجيل الدخول
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar Container */}
      <aside
        className={`
          hidden md:flex relative flex-col no-scrollbar bg-primary text-white ease-in-out border-l border-white/5 shadow-2xl
          ${isCollapsed ? "w-30" : "w-65"}
        `}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute cursor-pointer top-8 z-50 flex items-center justify-center 
            size-10  
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

export default Sidebar;
