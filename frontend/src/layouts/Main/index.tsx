'use client';

/**
 * Main layout.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import Header from './components/Header';
import LeftBar from './components/LeftBar';
import Explorer from './components/Explorer';
import RightSidebar from './components/RightSidebar';
import Terminal from './components/Terminal';
import StatusBar from './components/StatusBar';
import { ContactItem, TabLink } from '../../models';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface TabProps {
  tabs: TabLink[];
}

export interface ContactProps {
  contactData: ContactItem[];
}

export interface MainLayoutProps extends TabProps, ContactProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  tabs,
  contactData,
}) => {
  const [openTabs, setOpenTabs] = useState<TabLink[]>(tabs);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const classes = useStyles();

  const toggleExplorer = useCallback(() => setExplorerOpen((prev) => !prev), []);
  const toggleRightSidebar = useCallback(() => setRightSidebarOpen((prev) => !prev), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((prev) => !prev), []);

  // Auto-open tab in NavBar when navigating to its route
  useEffect(() => {
    if (!pathname || pathname === '/') return;
    const matchingTab = tabs.find((t) => t.url === pathname);
    if (matchingTab) {
      setOpenTabs((prev) => {
        if (prev.some((t) => t.url === pathname)) {
          return prev;
        }
        return [...prev, matchingTab];
      });
    }
  }, [pathname, tabs]);

  const closeTab = useCallback(
    (urlToClose: string) => {
      const tabIndex = openTabs.findIndex((t) => t.url === urlToClose);
      const nextTabs = openTabs.filter((t) => t.url !== urlToClose);

      setOpenTabs(nextTabs);

      // If closing the currently active tab, switch route to adjacent tab or home
      if (pathname === urlToClose) {
        if (nextTabs.length > 0) {
          const nextIndex = Math.min(
            tabIndex >= 0 ? tabIndex : 0,
            nextTabs.length - 1
          );
          router.push(nextTabs[nextIndex].url);
        } else {
          router.push('/');
        }
      }
    },
    [openTabs, pathname, router]
  );

  const closeCurrentTab = useCallback(() => {
    if (pathname === '/swe' || pathname === '/ba') {
      router.push('/');
    } else if (pathname && pathname !== '/') {
      closeTab(pathname);
    }
  }, [pathname, router, closeTab]);

  // Keyboard shortcuts:
  // - Ctrl+` for Terminal
  // - Ctrl+B for Explorer
  // - Ctrl+W / Cmd+W / Alt+W for Close Active Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Terminal: Ctrl+`
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
        return;
      }

      // Toggle Explorer: Ctrl+B
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setExplorerOpen((prev) => !prev);
        return;
      }

      // Close Active Tab: Ctrl+W, Cmd+W, Alt+W, or Ctrl+Shift+W
      const isCtrlW = (e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W');
      const isAltW = e.altKey && (e.key === 'w' || e.key === 'W');

      if (isCtrlW || isAltW) {
        e.preventDefault();
        e.stopPropagation();
        closeCurrentTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [closeCurrentTab]);

  const bothOpen = explorerOpen && rightSidebarOpen;

  return (
    <div className={classes.root}>
      <LeftBar
        contactData={contactData}
        explorerOpen={explorerOpen}
        onToggleExplorer={toggleExplorer}
      />
      <Explorer
        tabs={tabs}
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
      />
      <RightSidebar
        open={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        onToggleTerminal={toggleTerminal}
        onToggleExplorer={toggleExplorer}
      />
      <main
        className={clsx(classes.content, {
          [classes.explorerOpen]: explorerOpen && !bothOpen,
          [classes.rightSidebarOpen]: rightSidebarOpen && !bothOpen,
          [classes.bothSidebarsOpen]: bothOpen,
          [classes.terminalOpen]: terminalOpen,
        })}
      >
        <Header
          tabs={openTabs}
          onCloseTab={closeTab}
          explorerOpen={explorerOpen}
          terminalOpen={terminalOpen}
          rightSidebarOpen={rightSidebarOpen}
          onToggleExplorer={toggleExplorer}
          onToggleTerminal={toggleTerminal}
          onToggleRightSidebar={toggleRightSidebar}
        />
        <div key={pathname} className={classes.pageWrapper}>
          {children}
        </div>
      </main>
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <StatusBar
        terminalOpen={terminalOpen}
        explorerOpen={explorerOpen}
        rightSidebarOpen={rightSidebarOpen}
        onToggleTerminal={toggleTerminal}
        onToggleExplorer={toggleExplorer}
        onToggleRightSidebar={toggleRightSidebar}
      />
    </div>
  );
};

export default MainLayout;
