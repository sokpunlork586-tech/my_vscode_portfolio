/**
 * StatusBar component styles.
 */
import { Styles } from 'react-jss';
import {
  bgDarkBlue,
  bgMidBlue,
  textLightBlue,
  sSize,
  sansFont,
  heights,
} from '../../../../theme';

export default {
  root: {
    bottom: '0',
    background: bgDarkBlue,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: sansFont,
    fontWeight: 400,
    left: '0',
    position: 'fixed',
    width: '100%',
    height: heights.statusBar,
    zIndex: 200,
    overflow: 'hidden',
    '& span, & a': {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.15s ease, color 0.15s ease',
      '&:hover': {
        background: bgMidBlue,
        cursor: 'pointer',
      },
      '&:active': {
        background: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  icon: {
    color: textLightBlue,
  },
  text: {
    color: textLightBlue,
    fontSize: sSize,
    padding: '0 4px',
  },
} as Styles;
