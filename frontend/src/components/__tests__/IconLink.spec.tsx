import React from 'react';
import { render } from '@testing-library/react';
import IconLink from '../IconLink';

describe('<IconLink />', () => {
  test('should render correctly', () => {
    const internalLink = {
      name: 'Home',
      url: '/',
      icon: 'home',
      isInternal: true,
    };
    const { asFragment } = render(<IconLink {...internalLink} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render mailto link without target="_blank"', () => {
    const mailtoLink = {
      name: 'Email',
      url: 'mailto:sokpunlork586@gmail.com',
      icon: 'envelope',
      isInternal: false,
    };
    const { getByRole } = render(<IconLink {...mailtoLink} />);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', 'mailto:sokpunlork586@gmail.com');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
