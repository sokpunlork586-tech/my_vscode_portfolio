'use client';

/**
 * LeftBar component.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import IconLink from '../../../../components/IconLink';
import { ContactItem } from '../../../../models';
import { pages } from './../../../../data';
import { faCog, faCopy } from '../../../../theme/icons';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface LeftBarProps {
  contactData: ContactItem[];
  explorerOpen?: boolean;
  onToggleExplorer?: () => void;
}

const LeftBar: React.FC<LeftBarProps> = ({
  contactData,
  explorerOpen,
  onToggleExplorer,
}) => {
  const classes = useStyles();

  // Internal links.
  const internals = pages.map(({ name, url, icon, isInternal, badge }) => ({
    name,
    url,
    icon,
    isInternal,
    badge,
  }));

  const bottom: ContactItem[] = [
    {
      name: 'Settings',
      url: '',
      icon: faCog,
      isInternal: true,
    },
  ];

  const renderData = (data: ContactItem[]) => {
    return data.map((contactItem) => (
      <IconLink key={contactItem.name} {...contactItem} />
    ));
  };

  const renderDivider = () => <span className={classes.divider} />;

  return (
    <aside className={classes.root} aria-label="Activity Bar">
      <div>
        {onToggleExplorer && (
          <button
            type="button"
            className={clsx(classes.actionButton, {
              [classes.activeActionButton]: explorerOpen,
            })}
            onClick={onToggleExplorer}
            title="Toggle File Explorer"
            aria-label="Toggle File Explorer"
          >
            <FontAwesomeIcon icon={faCopy} size="lg" />
          </button>
        )}
        {renderData(internals)}
        {renderDivider()}
        {renderData(contactData)}
      </div>
      <div>{renderData(bottom)}</div>
    </aside>
  );
};

export default LeftBar;
