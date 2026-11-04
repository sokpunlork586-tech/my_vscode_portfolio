/**
 * NavItem component styles.
 */
import { Styles } from 'react-jss';
import { breakpoints, textLightBlue, textWhite } from '../../../../../../theme';

export default {
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    '& a[aria-current="page"] span': {
      display: 'inline-block !important',
    },
  },
  navText: {
    marginLeft: '8px',
    [`@media screen and (max-width: ${breakpoints.desktop})`]: {
      display: 'none',
    },
  },
  currentTab: {
    '& .closeButton': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textLightBlue,
      marginLeft: '8px',
      padding: '2px 4px',
      borderRadius: '3px',
      cursor: 'pointer',
      opacity: 1,
      transition: 'opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease',
      [`@media screen and (max-width: ${breakpoints.desktop})`]: {
        padding: '2px',
        marginLeft: '4px',
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: textWhite,
      },
    },
  },
  otherTab: {
    '& .closeButton': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textLightBlue,
      marginLeft: '8px',
      padding: '2px 4px',
      borderRadius: '3px',
      cursor: 'pointer',
      opacity: 0,
      transition: 'opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease',
      [`@media screen and (max-width: ${breakpoints.desktop})`]: {
        padding: '2px',
        marginLeft: '4px',
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: textWhite,
      },
    },
    '&:hover .closeButton': {
      opacity: 1,
    },
  },
} as Styles;
