/**
 * Course component styles.
 */
import { Styles } from 'react-jss';
import { breakpoints } from '../../../../../theme';

export default {
  courseDetails: {
    marginLeft: '20px',
    marginTop: '10px',
    // Summary row — flex to align course name and progress bar
    '& > summary': {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      cursor: 'pointer',
      userSelect: 'none',
      '& > span': {
        flexShrink: 0,
      },
      '& > div': {
        // ProgressBar container
        flex: '1',
        minWidth: 0,
        maxWidth: '500px',
      },
      [`@media screen and (max-width: ${breakpoints.mobile})`]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        '& > div': {
          width: '100%',
          maxWidth: '100%',
        },
      },
    },
  },
  optional: {
    opacity: 0.7,
  },
  bookPanel: {
    marginLeft: '20px',
    marginTop: '6px',
    paddingBottom: '10px',
    '& ul': {
      paddingLeft: '0',
      listStyle: 'none',
    },
  },
} as Styles;
