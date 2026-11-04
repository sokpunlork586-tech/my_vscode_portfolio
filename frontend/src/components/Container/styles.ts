/**
 * Container component styles.
 */
import { Styles } from 'react-jss';
import {
  breakpoints,
  midBlue,
  textLightBlue,
  textMid,
  mSize,
} from '../../theme';

export default {
  root: {
    maxWidth: '960px',
    width: '100%',
    padding: '0 20px',
    marginBottom: '80px',
    boxSizing: 'border-box',
    '& a:hover': {
      color: textMid,
    },
    '& li': {
      listStyle: 'square',
    },
    [`@media screen and (max-width: ${breakpoints.tablet})`]: {
      padding: '0 16px',
      marginBottom: '60px',
    },
    [`@media screen and (max-width: ${breakpoints.mobile})`]: {
      padding: '0 12px',
      marginBottom: '50px',
    },
  },
  content: {
    color: textLightBlue,
    fontSize: mSize,
    '& h3': {
      color: midBlue,
    },
    '& ul': {
      '& li': {
        paddingBottom: '4px',
      },
      [`@media screen and (max-width: ${breakpoints.desktop})`]: {
        paddingLeft: '20px',
      },
    },
    // Ensure images inside content don't overflow
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    // Tables should scroll on mobile
    '& table': {
      width: '100%',
      overflowX: 'auto',
      display: 'block',
      [`@media screen and (max-width: ${breakpoints.tablet})`]: {
        fontSize: '1.4rem',
      },
    },
  },
} as Styles;
