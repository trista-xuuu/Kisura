import React from 'react';

export const RoundIcon = ({ size = 24, color = 'currentColor', weight = 'regular' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight === 'bold' ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="12" r="3.5" />
    <circle cx="16.5" cy="12" r="3.5" />
    <path d="M11 12 C11.5 10.5, 12.5 10.5, 13 12" />
    <path d="M2 12 H4" />
    <path d="M20 12 H22" />
  </svg>
);

export const SquareIcon = ({ size = 24, color = 'currentColor', weight = 'regular' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight === 'bold' ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="9.5" width="7" height="5" rx="1" />
    <rect x="13.5" y="9.5" width="7" height="5" rx="1" />
    <path d="M10.5 11 C11.5 10, 12.5 10, 13.5 11" />
    <path d="M2 11 H3.5" />
    <path d="M20.5 11 H22" />
  </svg>
);

export const BostonIcon = ({ size = 24, color = 'currentColor', weight = 'regular' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight === 'bold' ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 11 C4.5 9, 9.5 9, 10.5 11 C11 14.5, 8.5 15.5, 7 15.5 C5.5 15.5, 3 14.5, 3.5 11 Z" />
    <path d="M13.5 11 C14.5 9, 19.5 9, 20.5 11 C21 14.5, 18.5 15.5, 17 15.5 C15.5 15.5, 13 14.5, 13.5 11 Z" />
    <path d="M10.5 11 C11.5 9.5, 12.5 9.5, 13.5 11" />
    <path d="M2 10.5 H3.5" />
    <path d="M20.5 10.5 H22" />
  </svg>
);
