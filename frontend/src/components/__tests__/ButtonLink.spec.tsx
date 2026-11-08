import React from 'react';
import { render } from '@testing-library/react';
import ButtonLink from '../ButtonLink';

describe('<ButtonLink />', () => {
  test('should render correctly', () => {
    const { asFragment } = render(
      <ButtonLink
        text="turali.js.org"
        title="turali.js.org"
        href="https://turali.js.org"
        icon={{
          prefix: 'fas',
          iconName: 'coffee',
        }}
        size="lg"
        showCount={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render mailto link without target="_blank"', () => {
    const { getByRole } = render(
      <ButtonLink
        text="Contact Me"
        title="Contact Me"
        href="mailto:sokpunlork586@gmail.com"
        icon={{
          prefix: 'fas',
          iconName: 'envelope',
        }}
        size="lg"
      />,
    );
    const link = getByRole('link', { name: 'Contact Me' });
    expect(link).toHaveAttribute('href', 'mailto:sokpunlork586@gmail.com');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
