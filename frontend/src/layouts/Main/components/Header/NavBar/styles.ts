/**
 * NavBar component styles.
 */
import { Styles } from 'react-jss';
import Color from 'color';
import {
  bgMidBlue,
  bgDarkBlue,
  textWhite,
  textLightBlue,
  sSize,
  breakpoints,
  sansFont,
  heights,
} from '../../../../../theme';

export default {
  root: {
    fontFamily: sansFont,
    height: heights.navBar,
    overflowX: 'auto',
    overflowY: 'hidden',
    // Hide scrollbar but keep functionality
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  list: {
    color: textLightBlue,
    listStyle: 'none',
    margin: '0',
    padding: '0',
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    minWidth: 'max-content',
  },
  listItem: {
    display: 'inline-flex',
    flexShrink: 0,
    '& a': {
      borderRight: `1px solid ${Color(bgMidBlue).darken(0.05).string()}`,
      borderTop: `2px solid transparent`,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: sSize,
      letterSpacing: '0.5px',
      padding: '10px 15px',
      textTransform: 'lowercase',
      transition: 'background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease',
      minHeight: '44px', // accessibility: min touch target
      [`@media screen and (max-width: ${breakpoints.desktop})`]: {
        letterSpacing: '0',
        padding: '10px 10px',
      },
      [`@media screen and (max-width: ${breakpoints.mobile})`]: {
        padding: '8px 8px',
      },
      '&:hover': {
        background: Color(bgDarkBlue).lighten(0.04).string(),
        color: textWhite,
      },
      '&[aria-current="page"]': {
        background: bgMidBlue,
        borderTopColor: '#528bff',
        color: textWhite,
      },
    },
  },
} as Styles;
