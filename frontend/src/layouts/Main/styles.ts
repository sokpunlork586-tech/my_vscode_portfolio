/**
 * Main layout styles.
 */
import Color from 'color';
import { Styles } from 'react-jss';
import {
  bgMidBlue,
  textLightBlue,
  mSize,
  monoFont,
  breakpoints,
  widths,
  heights,
} from '../../theme';

export default {
  '@global': {
    html: {
      fontSize: '62.5%',
    },
    body: {
      fontFamily: monoFont,
      fontSize: mSize,
      background: bgMidBlue,
      boxSizing: 'border-box',
    },
    button: {
      cursor: 'pointer',
      '&:disabled': {
        cursor: 'default',
      },
    },
    a: {
      color: textLightBlue,
      textDecoration: 'none',
      transition: 'color 0.15s ease, background-color 0.15s ease',
      '&:visited': {
        color: Color(textLightBlue).darken(0.1).string(),
      },
    },
    '.color-transform': {
      transition: 'color 0.15s ease',
    },
  },
  root: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    padding: 0,
    margin: 0,
    overflowX: 'hidden',
  },
  content: {
    position: 'relative',
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: `${heights.statusBar}px`,
    minHeight: '100vh',
    width: '100%',
    transition: 'margin 0.22s cubic-bezier(0.16, 1, 0.3, 1), width 0.22s cubic-bezier(0.16, 1, 0.3, 1), padding-bottom 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
    [`@media screen and (min-width: ${breakpoints.desktop})`]: {
      marginLeft: `${widths.leftBar}px`,
      width: `calc(100% - ${widths.leftBar}px)`,
    },
  },
  pageWrapper: {
    animation: '$pageFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    width: '100%',
    minHeight: `calc(100vh - ${heights.navBar + heights.statusBar}px)`,
  },
  '@keyframes pageFadeIn': {
    from: {
      opacity: 0.65,
      transform: 'translateY(4px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  explorerOpen: {
    [`@media screen and (min-width: ${breakpoints.desktop})`]: {
      marginLeft: `${widths.leftBar + widths.explorer}px`,
      width: `calc(100% - ${widths.leftBar + widths.explorer}px)`,
    },
  },
  rightSidebarOpen: {
    [`@media screen and (min-width: ${breakpoints.wide})`]: {
      marginRight: `${widths.rightBar}px`,
      width: `calc(100% - ${widths.leftBar + widths.rightBar}px)`,
    },
  },
  bothSidebarsOpen: {
    [`@media screen and (min-width: ${breakpoints.wide})`]: {
      marginLeft: `${widths.leftBar + widths.explorer}px`,
      marginRight: `${widths.rightBar}px`,
      width: `calc(100% - ${widths.leftBar + widths.explorer + widths.rightBar}px)`,
    },
  },
  terminalOpen: {
    paddingBottom: `${heights.statusBar + heights.terminal + 10}px`,
  },
} as Styles;
