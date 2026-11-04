/**
 * ButtonLink component styles.
 */
import { Styles } from 'react-jss';
import Color from 'color';
import { bgDarkBlue, textLightBlue, midBlue, sSize } from '../../theme';

export default {
  root: {
    background: bgDarkBlue,
    borderRadius: '4px',
    color: textLightBlue,
    display: 'flex',
    margin: '8px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease',
    '&:hover': {
      background: Color(bgDarkBlue).darken(0.1).string(),
      borderColor: 'rgba(82, 139, 255, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
    '&:hover .icon': {
      color: midBlue,
    },
  },
  contents: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '24px',
    padding: '6px 10px',
  },
  text: {
    fontSize: sSize,
    fontWeight: 400,
    marginLeft: '6px',
  },
  count: {
    fontSize: sSize,
    background: Color(bgDarkBlue).lighten(0.5).string(),
    borderRadius: '50%',
    marginLeft: '10px',
    padding: '4px 8px',
  },
} as Styles;
