import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MainLayout from '../index';
import { tabs } from '../../../data';
import contactData from '../../../data/json/contact.json';

const mockPush = jest.fn();
let currentMockPathname = '/skills';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => currentMockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

describe('Tab Closing Functionality & Shortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentMockPathname = '/skills';
  });

  test('Clicking close button on an active tab removes it from the NavBar and navigates', () => {
    render(<MainLayout tabs={tabs} contactData={contactData} />);

    // Initially skills.js is in the tab bar
    expect(screen.getByText('skills.js')).toBeInTheDocument();

    // Find close button for skills.js
    const closeBtn = screen.getByLabelText('Close skills.js tab');
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);

    // Tab should be removed from the NavBar
    expect(screen.queryByText('skills.js')).not.toBeInTheDocument();

    // Router should have navigated to adjacent tab
    expect(mockPush).toHaveBeenCalledWith('/education');
  });

  test('Keyboard shortcut Alt+W closes the currently active tab', () => {
    currentMockPathname = '/education';
    render(<MainLayout tabs={tabs} contactData={contactData} />);

    expect(screen.getByText('.educationrc')).toBeInTheDocument();

    // Trigger Alt+W
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'w',
          code: 'KeyW',
          altKey: true,
          bubbles: true,
          cancelable: true,
        })
      );
    });

    // .educationrc should be closed
    expect(screen.queryByText('.educationrc')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalled();
  });
});

