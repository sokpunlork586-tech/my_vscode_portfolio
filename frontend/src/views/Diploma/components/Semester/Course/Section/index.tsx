'use client';

/**
 * Section component.
 */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { DiplomaTypes } from '../../../../../../models';
import { calculateSectionProgress } from '../../../../../../utils';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface SectionProps {
  section: DiplomaTypes.Section;
}

const Section: React.FC<SectionProps> = ({ section }) => {
  const classes = useStyles();
  const { title, url } = section;

  const progress = calculateSectionProgress(section);
  const progressText = `${progress}% done`;

  return (
    <li className={classes.bookItem}>
      <span data-tip={progressText} data-tooltip-id="diploma-tooltip" data-tooltip-content={progressText}>
        <CircularProgressbar
          value={progress}
          className={classes.progress}
          strokeWidth={24}
        />
      </span>

      <a
        href={url}
        aria-label={title}
        data-class={classes.toolTip}
        data-place="right"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    </li>
  );
};

export default Section;
