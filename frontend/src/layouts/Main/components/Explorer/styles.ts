/**
 * Explorer component styles.
 */
import { Styles } from 'react-jss';
import {
  widths,
  heights,
  bgDarkBlue,
  textLightBlue,
  textWhite,
  textDark,
  breakpoints,
  monoFont,
} from '../../../../theme';

export default {
  root: {
    background: bgDarkBlue,
    height: `calc(100vh - ${heights.statusBar}px)`,
    position: 'fixed',
    top: 0,
    left: `${widths.leftBar}px`,
    width: `${widths.explorer}px`,
    zIndex: 90,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #181a1f',
    userSelect: 'none',
    fontFamily: monoFont,
    overflowY: 'auto',
    willChange: 'transform, opacity',
    [`@media screen and (max-width: ${breakpoints.desktop})`]: {
      left: 0,
      width: '260px',
      zIndex: 150,
      boxShadow: '4px 0 16px rgba(0, 0, 0, 0.6)',
    },
  },
  rootOpen: {
    animation: '$slideInLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  rootClosing: {
    animation: '$slideOutLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px 6px 14px',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '1px',
    color: textDark,
    textTransform: 'uppercase',
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
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    cursor: 'pointer',
    color: textLightBlue,
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    '&:hover': {
      color: textWhite,
    },
  },
  chevron: {
    fontSize: '1.0rem',
    marginRight: '6px',
    color: textDark,
    width: '10px',
  },
  folderTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px 4px 18px',
    cursor: 'pointer',
    color: textLightBlue,
    fontSize: '1.2rem',
    '&:hover': {
      color: textWhite,
    },
  },
  folderIcon: {
    marginRight: '6px',
    color: '#dcb67a',
    fontSize: '1.2rem',
  },
  treeList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  treeItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 12px 5px 32px',
    color: textLightBlue,
    fontSize: '1.2rem',
    textDecoration: 'none',
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
    transition: 'background 0.15s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.05)',
      color: textWhite,
    },
  },
  activeItem: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: textWhite,
    borderLeft: '2px solid #528bff',
  },
  itemIcon: {
    marginRight: '8px',
    width: '14px',
    textAlign: 'center',
  },
  badge: {
    marginLeft: 'auto',
    fontSize: '1.0rem',
    color: textDark,
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '1px 5px',
    borderRadius: '8px',
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
    [`@media screen and (min-width: ${breakpoints.desktop})`]: {
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
  '@keyframes slideInLeft': {
    from: {
      transform: 'translateX(-100%)',
      opacity: 0.85,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  '@keyframes slideOutLeft': {
    from: {
      transform: 'translateX(0)',
      opacity: 1,
    },
    to: {
      transform: 'translateX(-100%)',
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
