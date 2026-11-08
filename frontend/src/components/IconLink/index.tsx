'use client';

/**
 * IconLink component.
 */
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createUseStyles } from 'react-jss';
import { ContactItem } from '../../models';
import { resolveIcon } from '../../theme/icons';
import styles from './styles';

const useStyles = createUseStyles(styles);

const IconLink: React.FC<ContactItem> = ({
  name,
  url,
  icon,
  isInternal,
  badge,
}) => {
  const classes = useStyles();

  const iconComp = (
    <span className={classes.iconWrapper}>
      <FontAwesomeIcon
        className={classes.icon}
        icon={resolveIcon(icon)}
        size="lg"
      />
      {badge && <span className={classes.badge}>{badge}</span>}
    </span>
  );

  if (isInternal) {
    return (
      <Link
        href={url || '#'}
        key={`left-bar-${name}`}
        className={classes.link}
        aria-label={name}
        title={name}
        onClick={!url ? (e) => e.preventDefault() : undefined}
      >
        {iconComp}
      </Link>
    );
  }

  const isMailto = url?.startsWith('mailto:');

  return (
    <a
      href={url}
      key={`left-bar-${name}`}
      className={classes.link}
      aria-label={`Find me on ${name}`}
      title={`Find me on ${name}`}
      target={isMailto ? undefined : '_blank'}
      rel={isMailto ? undefined : 'noopener noreferrer'}
    >
      {iconComp}
    </a>
  );
};

export default IconLink;
