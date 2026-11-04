/**
 * RightSidebar component styles.
 */
import { Styles } from 'react-jss';
import {
  widths,
  heights,
  bgDarkBlue,
  bgMidBlue,
  textLightBlue,
  textWhite,
  textDark,
  midBlue,
  green,
  breakpoints,
  monoFont,
} from '../../../../theme';

export default {
  root: {
    background: bgDarkBlue,
    height: `calc(100vh - ${heights.statusBar}px)`,
    position: 'fixed',
    top: 0,
    right: 0,
    width: `${widths.rightBar}px`,
    zIndex: 90,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #181a1f',
    userSelect: 'none',
    fontFamily: monoFont,
    overflowY: 'auto',
    willChange: 'transform, opacity',
    [`@media screen and (max-width: ${breakpoints.wide})`]: {
      zIndex: 150,
      boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.6)',
    },
  },
  rootOpen: {
    animation: '$slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  rootClosing: {
    animation: '$slideOutRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px 8px 14px',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '1px',
    color: textDark,
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: textDark,
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '2px 4px',
    '&:hover': {
      color: textWhite,
    },
  },
  section: {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: textDark,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '10px',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: midBlue,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.4rem',
  },
  profileName: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: textWhite,
  },
  profileRole: {
    fontSize: '1.1rem',
    color: textLightBlue,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '1.1rem',
    color: green,
    marginTop: '6px',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '6px',
  },
  tag: {
    background: bgMidBlue,
    color: textLightBlue,
    fontSize: '1.1rem',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    marginTop: '8px',
    background: bgMidBlue,
    color: textWhite,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontFamily: monoFont,
    transition: 'all 0.15s ease',
    '&:hover': {
      background: '#3a3f4b',
      borderColor: midBlue,
    },
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 0',
    color: textLightBlue,
    fontSize: '1.2rem',
    textDecoration: 'none',
    '&:hover': {
      color: midBlue,
    },
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 140,
    willChange: 'opacity',
    [`@media screen and (min-width: ${breakpoints.wide})`]: {
      display: 'none',
    },
  },
  backdropOpen: {
    animation: '$fadeIn 0.22s ease forwards',
  },
  backdropClosing: {
    animation: '$fadeOut 0.2s ease forwards',
    pointerEvents: 'none',
  },
  '@keyframes slideInRight': {
    from: {
      transform: 'translateX(100%)',
      opacity: 0.85,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  '@keyframes slideOutRight': {
    from: {
      transform: 'translateX(0)',
      opacity: 1,
    },
    to: {
      transform: 'translateX(100%)',
      opacity: 0.85,
    },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes fadeOut': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
} as Styles;

