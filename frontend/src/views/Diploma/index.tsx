'use client';

/**
 * Diploma component.
 */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '../../theme/icons';
import Container from '../../components/Container';
import Semester from './components/Semester';
import { DiplomaTypes } from '../../models';
import styles from './styles';

const useStyles = createUseStyles(styles);

const Tooltip = dynamic(
  () => import('react-tooltip').then((mod) => mod.Tooltip),
  { ssr: false },
);

export interface DiplomaProps {
  diplomaData: DiplomaTypes.Curriculum;
}

const Diploma: React.FC<DiplomaProps> = ({ diplomaData }) => {
  const [mounted, setMounted] = useState(false);
  const classes = useStyles();
  const {
    semesters,
    metadata: { title, subtitle, info },
  } = diplomaData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipText = info || title;

  return (
    <Container>
      <div
        data-tip={tooltipText}
        data-tooltip-id="diploma-tooltip"
        data-tooltip-content={tooltipText}
        data-class={classes.tip}
        className={classes.title}
      >
        <h2>{title}</h2>
        <FontAwesomeIcon icon={faQuestionCircle} />
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={classes.contents}>
        {semesters.map((s) => (
          <Semester semesterData={s} key={s.name} />
        ))}
      </div>
      {mounted && <Tooltip id="diploma-tooltip" />}
    </Container>
  );
};

export default Diploma;
