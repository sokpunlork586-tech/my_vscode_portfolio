import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Explorer from '../components/Explorer';
import RightSidebar from '../components/RightSidebar';
import Terminal from '../components/Terminal';
import { tabs } from '../../../data';

describe('Layout Extensions: Explorer, RightSidebar & Terminal', () => {
  test('Explorer should render when open and handle close callback', () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Explorer tabs={tabs} open={false} onClose={handleClose} />,
    );
    expect(screen.queryByLabelText('File Explorer')).not.toBeInTheDocument();

    rerender(<Explorer tabs={tabs} open={true} onClose={handleClose} />);
    expect(screen.getByLabelText('File Explorer')).toBeInTheDocument();

    const closeBtn = screen.getByTitle('Close Explorer');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('RightSidebar should render when open and show developer profile info', () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <RightSidebar open={false} onClose={handleClose} />,
    );
    expect(screen.queryByLabelText('Secondary Sidebar')).not.toBeInTheDocument();

    rerender(<RightSidebar open={true} onClose={handleClose} />);
    expect(screen.getByLabelText('Secondary Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Punlork')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  test('Terminal should render commands and accept interactive input', () => {
    const handleClose = jest.fn();
    render(<Terminal open={true} onClose={handleClose} />);

    expect(screen.getByLabelText('Integrated Terminal')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to VS Code Portfolio Terminal/i)).toBeInTheDocument();

    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Available Commands:/i)).toBeInTheDocument();
  });
});

