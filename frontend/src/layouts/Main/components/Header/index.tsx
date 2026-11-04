'use client';

/**
 * Header component.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import NavBar from './NavBar';
import { TabProps } from '../..';
import { faCopy, faTerminal, faColumns } from '../../../../theme/icons';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface HeaderProps extends TabProps {
  explorerOpen?: boolean;
  terminalOpen?: boolean;
  rightSidebarOpen?: boolean;
  onToggleExplorer?: () => void;
  onToggleTerminal?: () => void;
  onToggleRightSidebar?: () => void;
  onCloseTab?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  tabs,
  explorerOpen,
  terminalOpen,
  rightSidebarOpen,
  onToggleExplorer,
  onToggleTerminal,
  onToggleRightSidebar,
  onCloseTab,
}) => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <div className={classes.navContainer}>
        <NavBar tabs={tabs} onCloseTab={onCloseTab} />
      </div>

      <div className={classes.controls}>
        {onToggleExplorer && (
          <button
            type="button"
            className={clsx(classes.controlBtn, {
              [classes.activeControlBtn]: explorerOpen,
            })}
            onClick={onToggleExplorer}
            title="Toggle File Explorer (Ctrl+B)"
            aria-label="Toggle File Explorer"
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}

        {onToggleTerminal && (
          <button
            type="button"
            className={clsx(classes.controlBtn, {
              [classes.activeControlBtn]: terminalOpen,
            })}
            onClick={onToggleTerminal}
            title="Toggle Terminal (Ctrl+`)"
            aria-label="Toggle Terminal"
          >
            <FontAwesomeIcon icon={faTerminal} />
          </button>
        )}

        {onToggleRightSidebar && (
          <button
            type="button"
            className={clsx(classes.controlBtn, {
              [classes.activeControlBtn]: rightSidebarOpen,
            })}
            onClick={onToggleRightSidebar}
            title="Toggle Secondary Sidebar (Outline & Info)"
            aria-label="Toggle Secondary Sidebar"
          >
            <FontAwesomeIcon icon={faColumns} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
