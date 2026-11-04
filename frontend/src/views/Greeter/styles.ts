/**
 * Greeter component styles.
 */
import { Styles } from 'react-jss';

import {
  bgDarkBlue,
  textMid,
  textDark,
  midBlue,
  mllSize,
  lSize,
  breakpoints,
  mlSize,
  mSize,
  sansFont,
  heights,
} from '../../theme';

export default {
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: `calc(100vh - ${heights.navBar + heights.statusBar}px)`,
    justifyContent: 'center',
    fontFamily: sansFont,
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  heading: {
    color: textMid,
    fontWeight: 400,
    fontSize: lSize,
    letterSpacing: '2px',
    margin: '10px 20px',
    padding: '0',
    textShadow: `5px 5px ${bgDarkBlue}`,
    userSelect: 'none',
    [`@media screen and (max-width: ${breakpoints.tablet})`]: {
      fontSize: mllSize,
      letterSpacing: '1px',
      margin: '8px 12px',
    },
    [`@media screen and (max-width: ${breakpoints.mobile})`]: {
      fontSize: mlSize,
      letterSpacing: '0.5px',
      margin: '6px 8px',
    },
  },
  typedWrap: {
    color: textDark,
    fontSize: mllSize,
    fontWeight: 400,
    margin: '5px',
    padding: '0',
    userSelect: 'none',
    '& a': {
      textDecoration: 'none',
      borderBottom: `1px dashed ${textDark}`,
    },
    '& strong': {
      fontWeight: '500',
    },
    [`@media screen and (max-width: ${breakpoints.tablet})`]: {
      fontSize: mlSize,
    },
    [`@media screen and (max-width: ${breakpoints.mobile})`]: {
      fontSize: mSize,
    },
  },
  '.typed-cursor': {
    color: midBlue,
  },
} as Styles;
