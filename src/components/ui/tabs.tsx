import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { motion } from "framer-motion";

// Types
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
  varient: "bordered" | "faded";
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  tabsRef?: React.MutableRefObject<Record<string, HTMLButtonElement>>;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface IndicatorStyle {
  width: number;
  left: number;
}

// Context for managing tab state
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Main Tabs component
export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  children,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList component - contains the tab triggers
export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
  varient,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsList must be used within Tabs");

  const { activeTab } = context;
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    width: 0,
    left: 0,
  });
  const tabsRef = useRef<Record<string, HTMLButtonElement>>({});

  // Get the tabs array to determine position
  const tabs = React.Children.toArray(children);
  const activeIndex = tabs.findIndex(
    (child) =>
      React.isValidElement<TabsTriggerProps>(child) &&
      child.props.value === activeTab
  );
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === tabs.length - 1;

  useEffect(() => {
    const activeElement = tabsRef.current[activeTab];
    if (activeElement) {
      setIndicatorStyle({
        width: activeElement.offsetWidth,
        left: activeElement.offsetLeft,
      });
    }
  }, [activeTab]);

  let roundedClass = "";
  if (varient === "faded" && isFirst) {
    roundedClass = "rounded-r-lg";
  } else if (varient === "faded" && isLast) {
    roundedClass = "rounded-l-lg";
  } else if (varient === "bordered") {
    roundedClass = "rounded-lg";
  }

  return (
    <div
      className={`${
        varient == "bordered" && "border box-border rounded-lg border-muted"
      } relative flex items-center gap-1 w-full rounded-lg  bg-secondary  ${className}`}
    >
      <motion.div
        className={`absolute -top-[1.5px] -bottom-[1.5px] bg-primary shadow-lg ${roundedClass}`}
        animate={{
          width: indicatorStyle.width,
          left: indicatorStyle.left,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsTriggerProps>(child)) {
          return React.cloneElement(child, { tabsRef });
        }
        return child;
      })}
    </div>
  );
};
// TabsTrigger component - individual tab button
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = "",
  tabsRef,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (tabsRef && buttonRef.current) {
      tabsRef.current[value] = buttonRef.current;
    }
  }, [value, tabsRef]);

  return (
    <button
      ref={buttonRef}
      onClick={() => setActiveTab(value)}
      className={`
        relative z-10  rounded-lg cursor-pointer font-medium w-full  transition-colors duration-200
        ${
          isActive
            ? "text-white"
            : "text-muted-foreground hover:text-muted-foreground"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// TabsContent component - content for each tab
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = "",
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className={`mt-4 ${className}`}>{children}</div>;
};
