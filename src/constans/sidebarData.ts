import { LucideProps } from "lucide-react";
import {
  LayoutGrid,
  SearchCode,
  Map,
  Settings2,
  Bell,
  CalendarPlus,
  FileOutput,
  BookmarkCheck,
  FileText,
  Crown,
  Settings,
  HelpCircle,
  Globe,
} from "lucide-react";

export interface SideBarData {
  id: number;
  title: string;
  translation: string;
  icon: React.ComponentType<LucideProps>;
  section: "main" | "footer";
}

export const sideBarData: SideBarData[] = [
  {
    id: 1,
    title: "نظرة عامة",
    translation: "Overview",
    icon: LayoutGrid,
    section: "main",
  },
  {
    id: 2,
    title: "خصائص البحث",
    translation: "Search Properties",
    icon: SearchCode,
    section: "main",
  },
  {
    id: 3,
    title: "خريطة عقارساس",
    translation: "Aqarsas Map",
    icon: Map,
    section: "main",
  },
  {
    id: 4,
    title: "مؤشرات",
    translation: "Indicators",
    icon: Settings2,
    section: "main",
  },
  {
    id: 5,
    title: "الإشعارات",
    translation: "Notifications",
    icon: Bell,
    section: "main",
  },
  {
    id: 6,
    title: "عقارساس GPT",
    translation: "Aqarsas GPT",
    icon: CalendarPlus,
    section: "main",
  },
  {
    id: 7,
    title: "تصدير البيانات",
    translation: "Export Data",
    icon: FileOutput,
    section: "main",
  },
  {
    id: 8,
    title: "حفظ العناصر",
    translation: "Saved Items",
    icon: BookmarkCheck,
    section: "main",
  },
  {
    id: 9,
    title: "أخبار",
    translation: "News",
    icon: FileText,
    section: "main",
  },
  {
    id: 10,
    title: "اشتراك",
    translation: "Subscription",
    icon: Crown,
    section: "main",
  },
  {
    id: 11,
    title: "الإعدادات",
    translation: "Settings",
    icon: Settings,
    section: "footer",
  },
  {
    id: 12,
    title: "مركز المساعدة",
    translation: "Help Center",
    icon: HelpCircle,
    section: "footer",
  },
  {
    id: 13,
    title: "اللغة",
    translation: "Language",
    icon: Globe,
    section: "footer",
  },
];
