/**
 * MainButtons component styles.
 */
import { Styles } from 'react-jss';
import { breakpoints } from '../../../../theme';

export default {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '40px',
    width: '100%',
    '& div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '8px',
      width: '100%',
      [`@media screen and (max-width: ${breakpoints.mobile})`]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  },
} as Styles;
