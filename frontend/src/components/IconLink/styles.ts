/**
 * IconLink component styles.
 */
import { Styles } from 'react-jss';
import Color from 'color';
import { lbIconColor, green } from '../../theme';

export default {
  link: {
    color: lbIconColor,
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'color 0.15s ease, transform 0.12s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: Color(lbIconColor).lighten(0.3).string(),
      transform: 'scale(1.08)',
    },
    '&:active': {
      transform: 'scale(0.96)',
    },
    '&:last-of-type': {
      marginBottom: '20px',
    },
  },
  iconWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  icon: {
    padding: '10px',
  },
  badge: {
    position: 'absolute',
    right: '4px',
    top: '4px',
    fontSize: '0.8em',
    backgroundColor: green,
    borderRadius: '4px',
    color: '#111',
    padding: '1px 2px',
    opacity: '0.9',
  },
} as Styles;
