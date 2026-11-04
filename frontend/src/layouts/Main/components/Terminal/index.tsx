'use client';

/**
 * VS Code Interactive Terminal component.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useTransitionMount } from '../../../../hooks';
import { faTimes, faTrash, faMinus } from '../../../../theme/icons';
import styles from './styles';

const useStyles = createUseStyles(styles);

export interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

interface CommandEntry {
  command: string;
  output: string;
}

const Terminal: React.FC<TerminalProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const router = useRouter();
  const [history, setHistory] = useState<CommandEntry[]>([
    {
      command: '',
      output:
        'Welcome to VS Code Portfolio Terminal [Version 2.0.0]\nType "help" to view available commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const shouldRender = useTransitionMount(open, 220);

  if (!shouldRender) return null;

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { command: '', output: '' }]);
      return;
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(' ');
    const lowerCmd = cmd.toLowerCase();

    let output = '';

    switch (lowerCmd) {
      case 'help':
        output = [
          'Available Commands:',
          '  help        - List all available commands',
          '  ls / dir    - List files & tabs in this workspace',
          '  whoami      - Display developer profile info',
          '  skills      - Show key skills & navigate to /skills',
          '  projects    - List portfolio projects & navigate to /projects',
          '  contact     - Display contact links (GitHub, LinkedIn, etc.)',
          '  date        - Print current local date and time',
          '  echo <text> - Print text to console',
          '  clear / cls - Clear terminal output',
          '  exit        - Close the terminal panel',
        ].join('\n');
        break;

      case 'ls':
      case 'dir':
        output = [
          'drwxr-xr-x  app/              (page.tsx, swe.tsx, ba.tsx)',
          '-rw-r--r--  skills.js         (TypeScript, React, Next.js, Node.js)',
          '-rw-r--r--  .educationrc      (Formal education & credentials)',
          '-rw-r--r--  projects.config   (Portfolio showcase & apps)',
          '-rw-r--r--  experience.json   (Professional work experience)',
          '-rw-r--r--  certificates.sass (Completed certifications)',
          '-rw-r--r--  contact.json      (Email, GitHub, Direct links)',
        ].join('\n');
        break;

      case 'whoami':
        output =
          'Punlork - Software Engineering Apprentice & Full-Stack Developer.\nBuilding fast, accessible, and clean web applications.';
        break;

      case 'skills':
        output =
          'Core Skills: TypeScript, React 18, Next.js 14, Node.js, React-JSS, Jest, Git.\nNavigating to /skills...';
        router.push('/skills');
        break;

      case 'projects':
        output =
          'Projects: Bilen Adam, 2●48, WatcherCatBot, My VS Code Portfolio.\nNavigating to /projects...';
        router.push('/projects');
        break;

      case 'contact':
        output = [
          'Contact Links:',
          '  Email:    sokpunlork586@gmail.com',
          '  GitHub:   https://github.com/sokpunlork586-tech',
          '  LinkedIn: https://linkedin.com/in/caglarturali',
          'Navigating to /contact...',
        ].join('\n');
        router.push('/contact');
        break;

      case 'date':
        output = new Date().toLocaleString();
        break;

      case 'echo':
        output = args.join(' ');
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'exit':
        onClose();
        return;

      default:
        output = `bash: command not found: ${trimmed}. Type "help" for a list of commands.`;
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <section
      className={clsx(classes.root, open ? classes.rootOpen : classes.rootClosing)}
      aria-label="Integrated Terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className={classes.header}>
        <div className={classes.tabGroup}>
          <span className={classes.tab}>Problems (0)</span>
          <span className={classes.tab}>Output</span>
          <span className={classes.tab}>Debug Console</span>
          <span className={`${classes.tab} ${classes.activeTab}`}>
            Terminal (bash)
          </span>
        </div>
        <div className={classes.controls}>
          <button
            type="button"
            className={classes.controlBtn}
            onClick={(e) => {
              e.stopPropagation();
              setHistory([]);
            }}
            title="Clear Terminal"
            aria-label="Clear Terminal"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            type="button"
            className={classes.controlBtn}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close Terminal"
            aria-label="Close Terminal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      <div className={classes.body} ref={bodyRef}>
        {history.map((entry, idx) => (
          <div key={`term-entry-${idx}`}>
            {entry.command && (
              <div className={classes.commandLine}>
                <span className={classes.promptUser}>punlork@vscode</span>:
                <span className={classes.promptPath}>~</span>$&nbsp;
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <div className={classes.outputBlock}>{entry.output}</div>
            )}
          </div>
        ))}

        <div className={classes.inputRow}>
          <span className={classes.promptUser}>punlork@vscode</span>:
          <span className={classes.promptPath}>~</span>$&nbsp;
          <input
            ref={inputRef}
            type="text"
            className={classes.input}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </section>
  );
};

export default Terminal;

