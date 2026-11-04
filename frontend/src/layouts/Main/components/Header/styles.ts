/**
 * Header component styles.
 */
import { Styles } from 'react-jss';
import { bgDarkBlue, heights, textDark, textLightBlue, textWhite } from '../../../../theme';

export default {
  root: {
    background: bgDarkBlue,
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100%',
    height: heights.navBar,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
  },
  navContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 8px',
    flexShrink: 0,
  },
  controlBtn: {
    background: 'none',
    border: 'none',
    color: textDark,
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '3px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s ease, background-color 0.15s ease, transform 0.1s ease',
    '&:hover': {
      color: textLightBlue,
      background: 'rgba(255, 255, 255, 0.06)',
    },
    '&:active': {
      transform: 'scale(0.94)',
    },
  },
  activeControlBtn: {
    color: textWhite,
    background: 'rgba(255, 255, 255, 0.1)',
  },
} as Styles;
