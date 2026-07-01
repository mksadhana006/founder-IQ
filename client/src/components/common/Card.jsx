/**
 * components/common/Card.jsx
 * Glassmorphism card container.
 */

const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        glass-card
        ${hover ? 'glass-card-hover cursor-pointer' : ''}
        ${glow ? 'animate-pulse-glow' : ''}
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;
