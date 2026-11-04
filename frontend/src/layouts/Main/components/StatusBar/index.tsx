'use client';

/**
 * StatusBar component.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch,
  faSmile,
  faTerminal,
  faFolderOpen,
  faColumns,
} from '../../../../theme/icons';
import styles from './styles';
import pkg from '../../../../../package.json';

const useStyles = createUseStyles(styles);

export interface StatusBarProps {
  terminalOpen?: boolean;
  explorerOpen?: boolean;
  rightSidebarOpen?: boolean;
  onToggleTerminal?: () => void;
  onToggleExplorer?: () => void;
  onToggleRightSidebar?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  terminalOpen,
  explorerOpen,
  rightSidebarOpen,
  onToggleTerminal,
  onToggleExplorer,
  onToggleRightSidebar,
}) => {
  const classes = useStyles();

  return (
    <footer className={classes.root} suppressHydrationWarning>
      <div>
        <a href={pkg.repository.url} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon
            className={classes.icon}
            icon={faCodeBranch}
            size="xs"
            inverse
          />
          <span className={classes.text}>master</span>
        </a>

        {onToggleExplorer && (
          <span
            onClick={onToggleExplorer}
            role="button"
            tabIndex={0}
            title="Toggle File Explorer"
            style={{ color: explorerOpen ? '#528bff' : undefined }}
          >
            <FontAwesomeIcon
              className={classes.icon}
              icon={faFolderOpen}
              size="xs"
            />
            <span className={classes.text}>Explorer</span>
          </span>
        )}

        {onToggleTerminal && (
          <span
            onClick={onToggleTerminal}
            role="button"
            tabIndex={0}
            title="Toggle Terminal Panel (Ctrl+`)"
            style={{ color: terminalOpen ? '#528bff' : undefined }}
          >
            <FontAwesomeIcon
              className={classes.icon}
              icon={faTerminal}
              size="xs"
            />
            <span className={classes.text}>Terminal</span>
          </span>
        )}
      </div>

      <div>
        {onToggleRightSidebar && (
          <span
            onClick={onToggleRightSidebar}
            role="button"
            tabIndex={0}
            title="Toggle Secondary Sidebar"
            style={{ color: rightSidebarOpen ? '#528bff' : undefined }}
          >
            <FontAwesomeIcon
              className={classes.icon}
              icon={faColumns}
              size="xs"
            />
            <span className={classes.text}>Outline & Info</span>
          </span>
        )}

        <span>
          <FontAwesomeIcon
            className={classes.icon}
            icon={faSmile}
            size="sm"
            inverse
          />
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;
