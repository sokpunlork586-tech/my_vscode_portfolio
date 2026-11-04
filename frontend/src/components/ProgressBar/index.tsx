/**
 * ProgressBar component.
 */
import React from 'react';
import Color from 'color';
import { bgMidBlue, green } from '../../theme';

export interface ProgressBarProps {
  value: number;
  color?: string;
  bgColor?: string;
  width?: number | string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = green,
  bgColor = Color(bgMidBlue).lighten(0.125).string(),
  width = '100%',
  height = 3,
}) => {
  const containerStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    maxWidth: '100%',
    height,
    backgroundColor: bgColor,
    marginTop: '3px',
  };

  const fillerStyles: React.CSSProperties = {
    height: '100%',
    width: `${value}%`,
    backgroundColor: color,
    transition: 'width 500ms ease',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}></div>
    </div>
  );
};

export default ProgressBar;
