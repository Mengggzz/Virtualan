import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const CtaButton: React.FC<ButtonProps> = ({ children, icon, className = '', ...props }) => {
  return (
    <button className={`cta-button ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
};

export const GhostButton: React.FC<ButtonProps> = ({ children, icon, className = '', ...props }) => {
  return (
    <button className={`ghost-button ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
};
