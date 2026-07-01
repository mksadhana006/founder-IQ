/**
 * components/common/Badge.jsx
 * Status/label badge component.
 */

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantClasses = {
    default: 'bg-slate-700 text-slate-300 border border-slate-600',
    primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
    accent: 'bg-accent-500/15 text-accent-400 border border-accent-500/30',
    warning: 'bg-warning-500/15 text-warning-400 border border-warning-500/30',
    danger: 'bg-danger-500/15 text-danger-400 border border-danger-500/30',
    excellent: 'score-excellent',
    good: 'score-good',
    average: 'score-average',
    poor: 'score-poor',
  };

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
