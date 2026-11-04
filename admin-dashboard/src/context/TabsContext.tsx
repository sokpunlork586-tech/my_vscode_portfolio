"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FileCode,
  FileJson,
  FileSpreadsheet,
  Settings2,
  Sparkles,
  User,
} from "lucide-react";

export interface EditorTab {
  name: string;
  url: string;
  icon: React.ElementType;
  color: string;
}

export const initialAvailableTabs: EditorTab[] = [
  { name: "overview.json", url: "/", icon: FileJson, color: "text-vscode-yellow" },
  { name: "intro.json", url: "/intro", icon: Sparkles, color: "text-vscode-yellow" },
  { name: "profile.json", url: "/profile", icon: User, color: "text-vscode-purple" },
  { name: "projects.tsx", url: "/projects", icon: FileCode, color: "text-vscode-cyan" },
  { name: "skills.ts", url: "/skills", icon: FileCode, color: "text-vscode-blue" },
  { name: "inquiries.sql", url: "/messages", icon: FileSpreadsheet, color: "text-vscode-purple" },
  { name: "settings.env", url: "/settings", icon: Settings2, color: "text-vscode-green" },
];

interface TabsContextType {
  openTabs: EditorTab[];
  activeTab: EditorTab | null;
  closeTab: (url: string) => void;
  openTab: (tab: EditorTab) => void;
  closeActiveTab: () => void;
  initialAvailableTabs: EditorTab[];
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [openTabs, setOpenTabs] = useState<EditorTab[]>(initialAvailableTabs);
  const pathname = usePathname();
  const router = useRouter();
  const closingUrlRef = useRef<string | null>(null);

  // Find active tab based on current pathname ONLY if it is in openTabs
  const activeTab = openTabs.find((t) => t.url === pathname) || null;

  // Auto-open tab if navigating to a route not currently in openTabs
  useEffect(() => {
    if (!pathname || pathname === "/login") return;

    if (closingUrlRef.current === pathname) {
      closingUrlRef.current = null;
      return;
    }

    const matchingTab = initialAvailableTabs.find((t) => t.url === pathname);
    if (matchingTab) {
      setOpenTabs((prev) => {
        if (prev.some((t) => t.url === pathname)) {
          return prev;
        }
        return [...prev, matchingTab];
      });
    }
  }, [pathname]);

  const closeTab = useCallback(
    (urlToClose: string) => {
      closingUrlRef.current = urlToClose;

      const tabIndex = openTabs.findIndex((t) => t.url === urlToClose);
      const nextTabs = openTabs.filter((t) => t.url !== urlToClose);

      setOpenTabs(nextTabs);

      // Perform route transition outside of state updater
      if (pathname === urlToClose) {
        if (nextTabs.length > 0) {
          const nextIndex = Math.min(
            tabIndex >= 0 ? tabIndex : 0,
            nextTabs.length - 1
          );
          router.push(nextTabs[nextIndex].url);
        }
      }
    },
    [openTabs, pathname, router]
  );

  const openTab = useCallback(
    (tab: EditorTab) => {
      closingUrlRef.current = null;
      setOpenTabs((prev) => {
        if (!prev.some((t) => t.url === tab.url)) {
          return [...prev, tab];
        }
        return prev;
      });
      router.push(tab.url);
    },
    [router]
  );

  const closeActiveTab = useCallback(() => {
    if (pathname && pathname !== "/login") {
      closeTab(pathname);
    }
  }, [pathname, closeTab]);

  // Keyboard shortcut Ctrl+W / Cmd+W / Alt+W / Ctrl+F4 to close active tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === "w") ||
        (e.ctrlKey && e.key === "F4")
      ) {
        e.preventDefault();
        closeActiveTab();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeActiveTab]);

  return (
    <TabsContext.Provider
      value={{
        openTabs,
        activeTab,
        closeTab,
        openTab,
        closeActiveTab,
        initialAvailableTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}
