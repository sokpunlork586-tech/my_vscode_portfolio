'use client';

import { library, config, IconProp, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
  faHome,
  faGraduationCap,
  faCog,
  faTimes,
  faUniversity,
  faSlidersH,
  faCodeBranch,
  faSmile,
  faStar,
  faCopy,
  faSearch,
  faQuestionCircle,
  faCheckSquare,
  faCoffee,
  faBriefcase,
  faTerminal,
  faFolder,
  faFolderOpen,
  faColumns,
  faChevronRight,
  faChevronDown,
  faMinus,
  faTrash,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faGoodreads,
  faJs,
  faSass,
} from '@fortawesome/free-brands-svg-icons';

// Prevent FontAwesome from dynamically inserting <style> tags on the client
config.autoAddCss = false;

// Register all icons in the library for global fallback support
library.add(
  faHome,
  faGraduationCap,
  faCog,
  faTimes,
  faUniversity,
  faSlidersH,
  faCodeBranch,
  faSmile,
  faStar,
  faCopy,
  faSearch,
  faQuestionCircle,
  faCheckSquare,
  faCoffee,
  faBriefcase,
  faTerminal,
  faFolder,
  faFolderOpen,
  faColumns,
  faChevronRight,
  faChevronDown,
  faMinus,
  faTrash,
  faEnvelope,
  faGithub,
  faLinkedin,
  faGoodreads,
  faJs,
  faSass,
);

export const iconMap: Record<string, IconDefinition> = {
  home: faHome,
  house: faHome,
  'graduation-cap': faGraduationCap,
  cog: faCog,
  gear: faCog,
  times: faTimes,
  close: faTimes,
  university: faUniversity,
  'sliders-h': faSlidersH,
  sliders: faSlidersH,
  'code-branch': faCodeBranch,
  smile: faSmile,
  star: faStar,
  copy: faCopy,
  search: faSearch,
  'question-circle': faQuestionCircle,
  'check-square': faCheckSquare,
  coffee: faCoffee,
  github: faGithub,
  linkedin: faLinkedin,
  goodreads: faGoodreads,
  js: faJs,
  sass: faSass,
  briefcase: faBriefcase,
  terminal: faTerminal,
  folder: faFolder,
  'folder-open': faFolderOpen,
  columns: faColumns,
  'chevron-right': faChevronRight,
  'chevron-down': faChevronDown,
  minus: faMinus,
  trash: faTrash,
  envelope: faEnvelope,
  email: faEnvelope,
  mail: faEnvelope,
};

export const resolveIcon = (icon: any): IconProp => {
  if (!icon) return faQuestionCircle;
  if (typeof icon === 'object' && 'icon' in icon && 'prefix' in icon) {
    return icon as IconDefinition;
  }
  if (Array.isArray(icon)) {
    const name = icon[1] || icon[0];
    if (typeof name === 'string' && iconMap[name]) {
      return iconMap[name];
    }
    return icon as IconProp;
  }
  if (typeof icon === 'string' && iconMap[icon]) {
    return iconMap[icon];
  }
  return icon as IconProp;
};

export {
  faHome,
  faGraduationCap,
  faCog,
  faTimes,
  faUniversity,
  faSlidersH,
  faCodeBranch,
  faSmile,
  faStar,
  faCopy,
  faSearch,
  faQuestionCircle,
  faCheckSquare,
  faCoffee,
  faBriefcase,
  faTerminal,
  faFolder,
  faFolderOpen,
  faColumns,
  faChevronRight,
  faChevronDown,
  faMinus,
  faTrash,
  faEnvelope,
  faGithub,
  faLinkedin,
  faGoodreads,
  faJs,
  faSass,
};

export default library;
