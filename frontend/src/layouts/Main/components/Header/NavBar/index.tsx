'use client';

/**
 * NavBar component.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import NavItem from './NavItem';
import { TabLink } from '@/models';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface NavBarProps {
  tabs: TabLink[];
  onCloseTab?: (url: string) => void;
}

const Navbar: React.FC<NavBarProps> = ({ tabs, onCloseTab }) => {
  const classes = useStyles();

  return (
    <nav className={classes.root} aria-label="Open Tabs">
      <ul className={classes.list}>
        {tabs.map((tab) => (
          <li className={classes.listItem} key={tab.name}>
            <NavItem {...tab} onCloseTab={onCloseTab} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
