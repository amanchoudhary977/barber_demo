'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default: 'bg-white/5 text-neutral-300 border-white/10',
  primary: 'bg-primary-500/10 text-primary-300 border-primary-500/20',
  accent: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
  success: 'bg-success/10 text-green-400 border-success/20',
  warning: 'bg-warning/10 text-amber-400 border-warning/20',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
