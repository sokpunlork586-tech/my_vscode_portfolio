/**
 * Terminal component styles.
 */
import { Styles } from 'react-jss';
import {
  heights,
  widths,
  bgDarkBlue,
  bgMidBlue,
  textLightBlue,
  textWhite,
  textDark,
  green,
  breakpoints,
  monoFont,
} from '../../../../theme';

export default {
  root: {
    position: 'fixed',
    bottom: `${heights.statusBar}px`,
    left: `${widths.leftBar}px`,
    width: `calc(100% - ${widths.leftBar}px)`,
    height: `${heights.terminal}px`,
    background: bgDarkBlue,
    borderTop: '1px solid #181a1f',
    zIndex: 95,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: monoFont,
    fontSize: '1.2rem',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.4)',
    willChange: 'transform, opacity',
    [`@media screen and (max-width: ${breakpoints.desktop})`]: {
      left: 0,
      width: '100%',
    },
  },
  rootOpen: {
    animation: '$slideInBottom 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  rootClosing: {
    animation: '$slideOutBottom 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: bgDarkBlue,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0 10px',
    height: '32px',
    userSelect: 'none',
  },
  tabGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    height: '100%',
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: textDark,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    cursor: 'pointer',
    height: '100%',
    padding: '0 4px',
    borderBottom: '2px solid transparent',
    '&:hover': {
      color: textLightBlue,
    },
  },
  activeTab: {
    color: textWhite,
    borderBottom: '2px solid #528bff',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controlBtn: {
    background: 'none',
    border: 'none',
    color: textDark,
    cursor: 'pointer',
    padding: '3px 6px',
    fontSize: '1.1rem',
    borderRadius: '3px',
    '&:hover': {
      color: textWhite,
      background: 'rgba(255, 255, 255, 0.08)',
    },
  },
  body: {
    flex: 1,
    padding: '10px 14px',
    overflowY: 'auto',
    color: textLightBlue,
    lineHeight: '1.6',
    cursor: 'text',
  },
  welcomeBanner: {
    color: textDark,
    marginBottom: '8px',
  },
  commandLine: {
    marginBottom: '4px',
  },
  promptUser: {
    color: green,
    fontWeight: 700,
  },
  promptPath: {
    color: '#56b6c2',
    fontWeight: 700,
  },
  outputBlock: {
    marginBottom: '6px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: textWhite,
    fontFamily: monoFont,
    fontSize: '1.2rem',
    marginLeft: '6px',
    caretColor: '#528bff',
  },
  '@keyframes slideInBottom': {
    from: {
      transform: 'translateY(100%)',
      opacity: 0.85,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  '@keyframes slideOutBottom': {
    from: {
      transform: 'translateY(0)',
      opacity: 1,
    },
    to: {
      transform: 'translateY(100%)',
      opacity: 0.85,
    },
  },
} as Styles;

