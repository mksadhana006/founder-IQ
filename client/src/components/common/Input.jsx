/**
 * components/common/Input.jsx
 * Reusable form input with label, error, and icon support.
 */

const Input = ({
  label,
  id,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  helpText,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {props.required && <span className="text-danger-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
        )}
        <input
          id={id}
          className={`form-input ${Icon ? 'pl-10' : ''} ${
            error ? 'border-danger-500/50 focus:ring-danger-500/50 focus:border-danger-500/50' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default Input;
