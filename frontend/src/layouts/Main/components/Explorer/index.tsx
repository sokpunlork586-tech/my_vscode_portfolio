'use client';

/**
 * Explorer component.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import {
  faTimes,
  faChevronDown,
  faChevronRight,
  faFolderOpen,
  faFolder,
  faHome,
  faGraduationCap,
  resolveIcon,
} from '../../../../theme/icons';
import { TabLink } from '../../../../models';
import { useTransitionMount } from '../../../../hooks';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface ExplorerProps {
  tabs: TabLink[];
  open: boolean;
  onClose?: () => void;
}

const Explorer: React.FC<ExplorerProps> = ({ tabs, open, onClose }) => {
  const classes = useStyles();
  const pathname = usePathname();
  const [projectOpen, setProjectOpen] = useState(true);
  const [srcOpen, setSrcOpen] = useState(true);
  const [tabsOpen, setTabsOpen] = useState(true);
  const shouldRender = useTransitionMount(open, 220);

  if (!shouldRender) return null;

  const handleLinkClick = () => {
    // If mobile screen, auto-close explorer on click
    if (typeof window !== 'undefined' && window.innerWidth < 720 && onClose) {
      onClose();
    }
  };

  const pages = [
    { name: 'page.tsx', url: '/', icon: faHome, badge: 'Home' },
    { name: 'swe.tsx', url: '/swe', icon: faGraduationCap, badge: 'SWE' },
    { name: 'ba.tsx', url: '/ba', icon: faGraduationCap, badge: 'BA' },
  ];

  return (
    <>
      <div
        className={clsx(classes.backdrop, open ? classes.backdropOpen : classes.backdropClosing)}
        onClick={onClose}
      />
      <aside
        className={clsx(classes.root, open ? classes.rootOpen : classes.rootClosing)}
        aria-label="File Explorer"
      >
        <div className={classes.header}>
          <span>Explorer: Portfolio</span>
          {onClose && (
            <button
              type="button"
              className={classes.closeBtn}
              onClick={onClose}
              title="Close Explorer"
              aria-label="Close Explorer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Project Section */}
        <div>
          <div
            className={classes.sectionTitle}
            onClick={() => setProjectOpen(!projectOpen)}
            role="button"
            tabIndex={0}
          >
            <FontAwesomeIcon
              icon={projectOpen ? faChevronDown : faChevronRight}
              className={classes.chevron}
            />
            <span>PORTFOLIO</span>
          </div>

          {projectOpen && (
            <div>
              {/* src/app folder */}
              <div
                className={classes.folderTitle}
                onClick={() => setSrcOpen(!srcOpen)}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon
                  icon={srcOpen ? faFolderOpen : faFolder}
                  className={classes.folderIcon}
                />
                <span>app</span>
              </div>

              {srcOpen && (
                <ul className={classes.treeList}>
                  {pages.map((p) => {
                    const isActive = pathname === p.url;
                    return (
                      <li key={p.name}>
                        <Link
                          href={p.url}
                          onClick={handleLinkClick}
                          className={clsx(classes.treeItem, {
                            [classes.activeItem]: isActive,
                          })}
                        >
                          <FontAwesomeIcon
                            icon={p.icon}
                            className={classes.itemIcon}
                            style={{ color: isActive ? '#528bff' : undefined }}
                          />
                          <span>{p.name}</span>
                          <span className={classes.badge}>{p.badge}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* src/tabs folder */}
              <div
                className={classes.folderTitle}
                onClick={() => setTabsOpen(!tabsOpen)}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon
                  icon={tabsOpen ? faFolderOpen : faFolder}
                  className={classes.folderIcon}
                />
                <span>tabs</span>
              </div>

              {tabsOpen && (
                <ul className={classes.treeList}>
                  {tabs.map((tab) => {
                    const isActive = pathname === tab.url;
                    return (
                      <li key={tab.name}>
                        <Link
                          href={tab.url}
                          onClick={handleLinkClick}
                          className={clsx(classes.treeItem, {
                            [classes.activeItem]: isActive,
                          })}
                        >
                          <FontAwesomeIcon
                            icon={resolveIcon(tab.icon)}
                            className={classes.itemIcon}
                            style={{ color: tab.color }}
                          />
                          <span>{tab.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Explorer;
