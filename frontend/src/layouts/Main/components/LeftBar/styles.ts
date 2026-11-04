/**
 * LeftBar component styles.
 */
import { Styles } from 'react-jss';
import Color from 'color';
import {
  bgLightBlue,
  lbIconColor,
  textWhite,
  breakpoints,
  widths,
} from '../../../../theme';

export default {
  root: {
    alignItems: 'center',
    background: bgLightBlue,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${widths.leftBar}px`,
    zIndex: 100,
    // Hide on mobile (below desktop breakpoint)
    [`@media screen and (max-width: ${breakpoints.desktop})`]: {
      display: 'none',
    },
    '& div': {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '10px 0',
      width: '100%',
    },
  },
  actionButton: {
    background: 'none',
    border: 'none',
    color: lbIconColor,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
    transition: 'color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease',
    '&:hover': {
      color: textWhite,
      background: 'rgba(255, 255, 255, 0.04)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  activeActionButton: {
    color: textWhite,
    borderLeft: '2px solid #528bff',
  },
  divider: {
    height: '1px',
    background: Color(bgLightBlue).lighten(0.35).string(),
    width: '75%',
    marginTop: '6px',
    marginBottom: '12px',
  },
} as Styles;
