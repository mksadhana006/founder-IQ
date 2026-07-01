/**
 * components/common/Button.jsx
 * Reusable button component with variant support.
 */

import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    accent: 'btn-accent',
    danger: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-danger-600 hover:bg-danger-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: '!px-4 !py-2 !text-sm',
    md: '',
    lg: '!px-8 !py-4 !text-lg',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
