'use client';

/**
 * NavItem component.
 */
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createUseStyles } from 'react-jss';
import { TabSpec, TabLink } from '../../../../../../models';
import { faTimes, resolveIcon } from '../../../../../../theme/icons';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface NavItemProps extends TabSpec, TabLink {
  onCloseTab?: (url: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  url,
  mdFileName: _mdFileName,
  onCloseTab,
  ...iconProps
}) => {
  const classes = useStyles();
  const router = useRouter();
  const pathname = usePathname();
  const isCurrent = pathname === url;

  const onCloseClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCloseTab) {
      onCloseTab(url);
    } else {
      router.push('/');
    }
  };

  const closeTitleId = `close-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <span className={classes.root}>
      <Link
        href={url}
        className={isCurrent ? classes.currentTab : classes.otherTab}
        aria-current={isCurrent ? 'page' : undefined}
      >
        <FontAwesomeIcon
          {...iconProps}
          icon={resolveIcon(iconProps.icon)}
          size={iconProps.size || 'lg'}
        />
        <span className={classes.navText}>{name}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={onCloseClicked}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              if (onCloseTab) {
                onCloseTab(url);
              } else {
                router.push('/');
              }
            }
          }}
          className="closeButton"
          title="Close (Ctrl+W / Alt+W)"
          aria-label={`Close ${name} tab`}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="1x"
            titleId={closeTitleId}
          />
        </span>
      </Link>
    </span>
  );
};

export default NavItem;
