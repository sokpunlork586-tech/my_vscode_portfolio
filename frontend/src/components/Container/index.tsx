'use client';

/**
 * Container components used in tabs.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface ContainerProps {
  title?: string;
  subtitle?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Container;
