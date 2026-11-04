import React from 'react';
import Greeter from '../views/Greeter';
import Diploma from '../views/Diploma';
import { PageLink, TabLink } from '../models';
import { jsOrange, midBlue, green, pink, cyan, red } from '../theme/colors';
import {
  faHome,
  faGraduationCap,
  faJs,
  faUniversity,
  faSlidersH,
  faSass,
  faBriefcase,
  faEnvelope,
} from '../theme/icons';

import staticData from './json/static.json';
import contactData from './json/contact.json';
import sweData from './json/swe.json';
import baData from './json/ba.json';
import pkg from '../../package.json';

import { calculateDiplomaProgress } from '../utils';

export const pages: PageLink[] = [
  {
    name: 'Home',
    url: '/',
    icon: faHome,
    isInternal: true,
    comp: () => (
      <Greeter
        staticData={staticData}
        contactData={contactData}
        repoUrl={pkg.repository.url}
      />
    ),
  },
  {
    name: 'Software Engineering',
    url: '/swe',
    icon: faGraduationCap,
    isInternal: true,
    badge: `${calculateDiplomaProgress(sweData, 0)}%`,
    comp: () => <Diploma diplomaData={sweData} />,
  },
  {
    name: 'Business Administration',
    url: '/ba',
    icon: faGraduationCap,
    isInternal: true,
    badge: `${calculateDiplomaProgress(baData, 0)}%`,
    comp: () => <Diploma diplomaData={baData} />,
  },
];

export const tabs: TabLink[] = [
  {
    name: 'skills.js',
    url: '/skills',
    icon: faJs,
    color: jsOrange,
    mdFileName: 'skills',
  },
  {
    name: '.educationrc',
    url: '/education',
    icon: faUniversity,
    color: midBlue,
    mdFileName: 'education',
  },
  {
    name: 'projects.config',
    url: '/projects',
    icon: faSlidersH,
    color: green,
    mdFileName: 'projects',
  },
  {
    name: 'experience.json',
    url: '/experience',
    icon: faBriefcase,
    color: cyan,
    mdFileName: 'experience',
  },
  {
    name: 'certificates.sass',
    url: '/certificates',
    icon: faSass,
    color: pink,
    mdFileName: 'certificates',
  },
  {
    name: 'contact.json',
    url: '/contact',
    icon: faEnvelope,
    color: red,
    mdFileName: 'contact',
  },
];
