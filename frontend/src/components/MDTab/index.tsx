'use client';

/**
 * MDTab component.
 */
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '../Container';
import { createUseStyles } from 'react-jss';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface MDTabProps {
  fileName: string;
  initialContent?: string;
}

const MDTab: React.FC<MDTabProps> = ({ fileName, initialContent }) => {
  const [contents, setContents] = useState<string>(initialContent || '');
  const classes = useStyles();

  useEffect(() => {
    if (initialContent) {
      setContents(initialContent);
      return;
    }

    const loadFile = async () => {
      try {
        const file = await import(`../../data/tabs/${fileName}.md`);
        const text = typeof file.default === 'string' ? file.default : await (await fetch(file.default)).text();
        setContents(text);
      } catch {
        // Fallback
      }
    };
    loadFile();
  }, [fileName, initialContent]);

  return (
    <Container>
      <div className={classes.mdpage}>
        <ReactMarkdown>{contents}</ReactMarkdown>
      </div>
    </Container>
  );
};

export default MDTab;
