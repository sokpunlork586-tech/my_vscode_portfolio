/**
 * HomeOverview component styles.
 */
import { Styles } from 'react-jss';
import {
  bgDarkBlue,
  bgMidBlue,
  bgLightBlue,
  textMid,
  textDark,
  textLightBlue,
  green,
  cyan,
  midBlue,
  orange,
  purple,
  breakpoints,
  monoFont,
  sansFont,
} from '../../theme';

export default {
  overviewRoot: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 24px 100px',
    fontFamily: sansFont,
    boxSizing: 'border-box',
    color: textLightBlue,
  },
  section: {
    marginBottom: '70px',
    scrollMarginTop: '60px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '8px',
    borderBottom: `1px solid ${bgLightBlue}`,
    paddingBottom: '12px',
  },
  sectionTag: {
    fontFamily: monoFont,
    fontSize: '2rem',
    fontWeight: 600,
    color: midBlue,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionComment: {
    color: textDark,
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  sectionSub: {
    color: textDark,
    fontSize: '1.4rem',
    margin: '6px 0 24px',
  },
  tabButton: {
    fontFamily: monoFont,
    fontSize: '1.3rem',
    color: green,
    background: 'transparent',
    border: `1px solid ${green}`,
    borderRadius: '4px',
    padding: '6px 14px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.18s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(152, 195, 121, 0.12)',
      color: '#b5e890',
      transform: 'translateY(-1px)',
    },
    '&:focus-visible': {
      outline: '2px solid #528bff',
      outlineOffset: '2px',
    },
  },

  // Grid layouts
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    [`@media screen and (max-width: ${breakpoints.tablet})`]: {
      gridTemplateColumns: '1fr',
    },
  },
  gridThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },

  // Generic Card
  card: {
    backgroundColor: bgDarkBlue,
    border: '1px solid #181a1f',
    borderRadius: '6px',
    padding: '20px',
    transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      borderColor: '#3e4451',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
    },
  },
  cardTitle: {
    fontSize: '1.6rem',
    fontWeight: 600,
    color: textMid,
    margin: '0 0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Skills
  skillList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  skillItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  skillMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.35rem',
    fontFamily: monoFont,
  },
  skillName: {
    color: textMid,
  },
  skillPercent: {
    color: textDark,
  },
  barTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#1b1d23',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // Education
  eduDegree: {
    fontFamily: monoFont,
    fontSize: '1.45rem',
    color: orange,
    margin: '4px 0 8px',
  },
  eduPeriod: {
    fontSize: '1.25rem',
    color: textDark,
    marginBottom: '8px',
    display: 'inline-block',
  },
  eduDesc: {
    fontSize: '1.35rem',
    lineHeight: 1.6,
    color: textLightBlue,
    margin: '0 0 12px',
  },
  eduBadge: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    fontSize: '1.2rem',
    fontFamily: monoFont,
    padding: '3px 8px',
    borderRadius: '3px',
    backgroundColor: 'rgba(86, 182, 194, 0.12)',
    color: cyan,
    border: '1px solid rgba(86, 182, 194, 0.3)',
  },

  // Projects
  projectDesc: {
    fontSize: '1.35rem',
    lineHeight: 1.55,
    color: textLightBlue,
    margin: '0 0 16px',
    flex: '1',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  },
  techTag: {
    fontFamily: monoFont,
    fontSize: '1.15rem',
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: '#2c313a',
    color: purple,
    border: '1px solid #3e4451',
  },
  projectLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  projectBtn: {
    fontSize: '1.3rem',
    fontFamily: monoFont,
    color: midBlue,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.15s ease',
    '&:hover': {
      color: '#70baf7',
      textDecoration: 'underline',
    },
  },

  // Contact
  contactCard: {
    backgroundColor: bgDarkBlue,
    border: '1px solid #181a1f',
    borderRadius: '6px',
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  contactLabel: {
    fontSize: '1.2rem',
    color: textDark,
    fontFamily: monoFont,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  contactValue: {
    fontSize: '1.45rem',
    color: textMid,
    wordBreak: 'break-word',
    '& a': {
      color: midBlue,
      textDecoration: 'none',
      transition: 'color 0.15s ease',
      '&:hover': {
        color: '#70baf7',
        textDecoration: 'underline',
      },
    },
  },
} as Styles;
