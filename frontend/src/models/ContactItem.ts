import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Linkable } from './Linkable';

export interface ContactItem extends Linkable {
  name: string;
  icon: string | string[] | IconProp;
  url: string;
  isMain?: boolean;
  badge?: any;
}
