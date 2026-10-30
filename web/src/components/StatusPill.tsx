import React from 'react';

interface StatusPillProps {
  type?: 'green' | 'yellow' | 'red';
  text: string;
  pulse?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  type = 'green',
  text,
  pulse = true,
}) => {
  return (
    <div className={`status-pill status-pill-${type}`}>
      {pulse && <span className="pulse-dot" />}
      <span>{text}</span>
    </div>
  );
};
