'use client';

/**
 * RightSidebar (Secondary Side Bar) component.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useTransitionMount } from '../../../../hooks';
import {
  faTimes,
  faTerminal,
  faFolderOpen,
  faCodeBranch,
  faBriefcase,
  faGraduationCap,
  faEnvelope,
} from '../../../../theme/icons';
import profileData from '../../../../data/json/profile.json';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface RightSidebarProps {
  open: boolean;
  onClose?: () => void;
  onToggleTerminal?: () => void;
  onToggleExplorer?: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  open,
  onClose,
  onToggleTerminal,
  onToggleExplorer,
}) => {
  const classes = useStyles();
  const shouldRender = useTransitionMount(open, 220);
  const [avatarError, setAvatarError] = useState(false);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={clsx(classes.backdrop, open ? classes.backdropOpen : classes.backdropClosing)}
        onClick={onClose}
      />
      <aside
        className={clsx(classes.root, open ? classes.rootOpen : classes.rootClosing)}
        aria-label="Secondary Sidebar"
      >
        <div className={classes.header}>
          <span>Outline & Info</span>
          {onClose && (
            <button
              type="button"
              className={classes.closeBtn}
              onClick={onClose}
              title="Close Sidebar"
              aria-label="Close Sidebar"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className={classes.section}>
          <div className={classes.profileCard}>
            <div className={classes.avatar} style={{ overflow: 'hidden' }}>
              {!avatarError ? (
                <img
                  src="/images/profile.png"
                  alt={profileData.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                profileData.name.charAt(0)
              )}
            </div>
            <div>
              <div className={classes.profileName}>{profileData.name}</div>
              <div className={classes.profileRole}>{profileData.role}</div>
            </div>
          </div>
          <div className={classes.statusBadge}>
            <span>●</span>
            <span>{profileData.status}</span>
          </div>
        </div>

        {/* Tech Stack Overview */}
        <div className={classes.section}>
          <div className={classes.sectionTitle}>Tech Stack</div>
          <div className={classes.tagList}>
            {profileData.techStack.map((tech) => (
              <span key={tech} className={classes.tag}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Quick Nav Outline */}
        <div className={classes.section}>
          <div className={classes.sectionTitle}>Quick Navigation</div>
          {((profileData as any).quickNavigation && (profileData as any).quickNavigation.length > 0
            ? (profileData as any).quickNavigation
            : [
                { label: 'Software Engineering', href: '/swe' },
                { label: 'Business Administration', href: '/ba' },
                { label: 'Core Skills (skills.js)', href: '/skills' },
                { label: 'Contact (contact.json)', href: '/contact' },
              ]
          ).map((item: any) => {
            let icon = faCodeBranch;
            if (item.href.includes('swe')) icon = faGraduationCap;
            else if (item.href.includes('ba')) icon = faBriefcase;
            else if (item.href.includes('skill')) icon = faCodeBranch;
            else if (item.href.includes('project')) icon = faFolderOpen;
            else if (item.href.includes('contact')) icon = faEnvelope;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={classes.linkItem}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Workspace Quick Actions */}
        <div className={classes.section}>
          <div className={classes.sectionTitle}>Workspace Tools</div>
          {onToggleTerminal && (
            <button
              type="button"
              className={classes.actionBtn}
              onClick={onToggleTerminal}
            >
              <FontAwesomeIcon icon={faTerminal} />
              <span>Toggle Terminal</span>
            </button>
          )}
          {onToggleExplorer && (
            <button
              type="button"
              className={classes.actionBtn}
              onClick={onToggleExplorer}
            >
              <FontAwesomeIcon icon={faFolderOpen} />
              <span>Toggle Explorer</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;

