import React from 'react';
import type { IconName } from '../../types/service.types';

export interface BudiIconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  active?: boolean;
  className?: string;
}

/**
 * Pure custom SVG Icon System for Budipoint.
 * Enforces consistent viewBox (0 0 24 24), stroke width, dimensions, and active/inactive brand coloring.
 * Zero external icon libraries, icon fonts, or emojis.
 */
export const BudiIcon: React.FC<BudiIconProps> = ({
  name,
  size = 20,
  strokeWidth = 1.85,
  active = false,
  className = '',
}) => {
  const strokeColor = active ? '#FC5050' : 'currentColor';

  const renderPaths = () => {
    switch (name) {
      case 'airtime':
        return (
          <>
            <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
            <path d="M10 5.5h4" />
            <circle cx="12" cy="18" r="1" />
            <path d="M16.5 8.5a3.5 3.5 0 0 1 0 5" />
          </>
        );
      case 'data':
        return (
          <>
            <path d="M2.5 9.5a15 15 0 0 1 19 0" />
            <path d="M5.5 13a10.5 10.5 0 0 1 13 0" />
            <path d="M8.5 16.5a6 6 0 0 1 7 0" />
            <circle cx="12" cy="19.5" r="1.25" />
          </>
        );
      case 'giftcard':
        return (
          <>
            <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
            <path d="M2.5 10.5h19" />
            <path d="M10 5.5v13" />
            <circle cx="10" cy="10.5" r="2" />
          </>
        );
      case 'utility':
        return (
          <>
            <path d="M13 2.5L5.5 13.5h6l-1 8 8-11h-6l.5-8z" />
          </>
        );
      case 'esim':
        return (
          <>
            <path d="M7 3h7.5L19 7.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
            <rect x="8.5" y="10" width="7" height="7" rx="1.2" />
            <path d="M12 10v7" />
            <path d="M8.5 13.5h7" />
          </>
        );
      case 'verification':
        return (
          <>
            <path d="M12 2.5l7.5 3.2v5.8c0 5-3.2 8.9-7.5 10.2-4.3-1.3-7.5-5.2-7.5-10.2V5.7L12 2.5z" />
            <path d="M9 12.2l2.1 2.1 4.2-4.3" />
          </>
        );
      case 'convert':
        return (
          <>
            <path d="M4 8h13l-3.5-3.5" />
            <path d="M20 16H7l3.5 3.5" />
          </>
        );
      case 'virtualcard':
        return (
          <>
            <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
            <path d="M2.5 9.5h19" />
            <path d="M6.5 14.5h4" />
            <path d="M14.5 14.5h2.5" />
          </>
        );
      case 'gaming':
        return (
          <>
            <rect x="2.5" y="6.5" width="19" height="11" rx="4.5" />
            <path d="M7.5 10v4" />
            <path d="M5.5 12h4" />
            <circle cx="15.5" cy="11" r="0.9" />
            <circle cx="17.5" cy="13" r="0.9" />
          </>
        );
      case 'education':
        return (
          <>
            <path d="M12 4L2.5 9 12 14l9.5-5L12 4z" />
            <path d="M6.5 11.5v5c0 1.8 2.5 3.3 5.5 3.3s5.5-1.5 5.5-3.3v-5" />
            <path d="M21.5 9v6" />
          </>
        );
      case 'dashboard':
        return (
          <>
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" />
          </>
        );
      case 'wallet':
        return (
          <>
            <rect x="2.5" y="5.5" width="19" height="13.5" rx="2.4" />
            <path d="M16 12.2h5.5" />
            <circle cx="16.2" cy="12.2" r="1.2" />
            <path d="M5.5 5.5l9.5-2.5v2.5" />
          </>
        );
      case 'transactions':
        return (
          <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h10" />
            <circle cx="18" cy="17" r="2" />
          </>
        );
      case 'services':
        return (
          <>
            <circle cx="6.5" cy="6.5" r="3" />
            <circle cx="17.5" cy="6.5" r="3" />
            <circle cx="6.5" cy="17.5" r="3" />
            <path d="M14.5 17.5h6" />
            <path d="M17.5 14.5v6" />
          </>
        );
      case 'profile':
        return (
          <>
            <circle cx="12" cy="8" r="3.8" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </>
        );
      case 'users':
        return (
          <>
            <circle cx="9" cy="8" r="3.3" />
            <path d="M3 19.5a6 6 0 0 1 12 0" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M15.5 19.5a4.5 4.5 0 0 1 5.5-4.3" />
          </>
        );
      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
          </>
        );
      case 'audit':
        return (
          <>
            <path d="M6 3h9l4 4v13a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4.5A1.5 1.5 0 0 1 6 3z" />
            <path d="M8.5 10.5h7" />
            <path d="M8.5 14h7" />
            <path d="M8.5 17.5h4.5" />
          </>
        );
      case 'bell':
        return (
          <>
            <path d="M18 9a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9" />
            <path d="M10 20a2.2 2.2 0 0 0 4 0" />
          </>
        );
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="6.8" />
            <path d="M16.2 16.2L21 21" />
          </>
        );
      case 'filter':
        return (
          <>
            <path d="M3.5 5.5h17l-6.8 7.5v5.5l-3.4 1.5V13L3.5 5.5z" />
          </>
        );
      case 'plus':
        return (
          <>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </>
        );
      case 'arrow-up-right':
        return (
          <>
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </>
        );
      case 'arrow-down-left':
        return (
          <>
            <path d="M17 7L7 17" />
            <path d="M16 17H7V8" />
          </>
        );
      case 'check-circle':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.3l2.3 2.3 4.8-4.8" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v4.8l3.2 1.9" />
          </>
        );
      case 'alert-circle':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4.5" />
            <circle cx="12" cy="16" r="0.8" />
          </>
        );
      case 'shield':
        return (
          <>
            <path d="M12 2.8l7.5 3.1v5.6c0 4.9-3.1 8.8-7.5 10.1-4.4-1.3-7.5-5.2-7.5-10.1V5.9L12 2.8z" />
          </>
        );
      case 'logout':
        return (
          <>
            <path d="M9 20H5.5A2 2 0 0 1 3.5 18V6a2 2 0 0 1 2-2H9" />
            <path d="M15 16l5-4-5-4" />
            <path d="M20 12H9" />
          </>
        );
      case 'menu':
        return (
          <>
            <path d="M4 6.5h16" />
            <path d="M4 12h16" />
            <path d="M4 17.5h16" />
          </>
        );
      case 'close':
        return (
          <>
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </>
        );
      case 'chevron-right':
        return <path d="M9 6l6 6-6 6" />;
      case 'chevron-down':
        return <path d="M6 9l6 6 6-6" />;
      case 'lock':
        return (
          <>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </>
        );
      case 'eye':
        return (
          <>
            <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
            <circle cx="12" cy="12" r="2.8" />
          </>
        );
      case 'refresh':
        return (
          <>
            <path d="M20 11a8 8 0 1 0-2.1 5.4" />
            <path d="M20 4.5V11h-6.5" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-colors duration-150 ${className}`}
      aria-hidden="true"
    >
      {renderPaths()}
    </svg>
  );
};
