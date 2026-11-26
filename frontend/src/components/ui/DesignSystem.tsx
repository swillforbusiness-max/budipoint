import React from 'react';
import { motion } from 'framer-motion';
import { BudiIcon } from '../icons/BudiIcon';
import type { IconName } from '../../types/service.types';

/**
 * Formats a decimal string or number into NGN currency display.
 */
export function formatNaira(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(num)) return 'NGN 0.00';
  return `NGN ${num.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const SimulationBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-[#FC5050]/30 bg-[#FC5050]/10 px-2.5 py-0.5 text-xs font-semibold text-[#FC5050]"
        title="Simulated mock operation — no live third-party provider called"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#FC5050]" />
        SIMULATED MODE
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#FC5050]/25 bg-white px-4 py-2.5 text-xs text-[#111D30] shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-[#FC5050]" />
        <span className="font-bold uppercase tracking-wider text-[#FC5050]">
          Sandbox / Mock Architecture Active
        </span>
        <span className="text-[#64748B]">
          All balances, funding operations, and service transactions shown are simulated until live third-party API credentials are connected.
        </span>
      </div>
    </div>
  );
};

export const StatusBadge: React.FC<{
  status: 'successful' | 'pending' | 'failed' | 'active' | 'ready_for_api' | 'maintenance' | 'disabled' | 'suspended' | 'pending_verification';
}> = ({ status }) => {
  const map: Record<string, { label: string; classes: string }> = {
    successful: {
      label: 'Successful',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    active: {
      label: 'Active',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    pending: {
      label: 'Pending',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    pending_verification: {
      label: 'Pending Verification',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    ready_for_api: {
      label: 'Awaiting Provider API',
      classes: 'bg-slate-100 text-[#111D30] border-slate-300',
    },
    maintenance: {
      label: 'Maintenance',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    failed: {
      label: 'Failed',
      classes: 'bg-[#FC5050]/10 text-[#FC5050] border-[#FC5050]/25',
    },
    suspended: {
      label: 'Suspended',
      classes: 'bg-[#FC5050]/10 text-[#FC5050] border-[#FC5050]/25',
    },
    disabled: {
      label: 'Disabled',
      classes: 'bg-slate-100 text-slate-500 border-slate-200',
    },
  };

  const item = map[status] ?? {
    label: status,
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${item.classes}`}
    >
      {item.label}
    </span>
  );
};

export interface BudiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'navy' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  isLoading?: boolean;
}

export const BudiButton: React.FC<BudiButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...rest
}) => {
  const variantClasses = {
    primary: 'bg-[#FC5050] text-white hover:bg-[#E64242] border border-[#FC5050] shadow-xs',
    navy: 'bg-[#111D30] text-white hover:bg-[#1A2B45] border border-[#111D30] shadow-xs',
    outline: 'bg-white text-[#111D30] border border-[#E2E8F0] hover:border-[#111D30]/40 hover:bg-slate-50',
    ghost: 'bg-transparent text-[#111D30] hover:bg-slate-100 border border-transparent',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  }[size];

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      disabled={disabled || isLoading}
      className={`inline-flex cursor-pointer items-center justify-center font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${sizeClasses} ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && <BudiIcon name={icon} size={size === 'sm' ? 15 : 18} />
      )}
      {children}
    </motion.button>
  );
};

export const BudiCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className = '', padding = 'md' }) => {
  const padClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs ${padClass} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const EmptyState: React.FC<{
  icon: IconName;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F9FB] text-[#111D30]">
      <BudiIcon name={icon} size={24} active />
    </div>
    <h3 className="text-base font-bold text-[#111D30]">{title}</h3>
    <p className="mt-1 max-w-md text-sm text-[#64748B]">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading Budipoint data...' }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FC5050] border-t-transparent" />
    <p className="mt-3 text-sm font-medium text-[#64748B]">{label}</p>
  </div>
);
