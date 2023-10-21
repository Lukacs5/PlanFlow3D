import { error } from 'console';
import React from 'react';

type ErrorRendererProps = {
  message: string;
  level?: 'warning' | 'error' | string;  // hiba szintjének típusa
};

const ErrorRenderer: React.FC<ErrorRendererProps> = ({ message, level}) => {

  let colorClass = '';

  switch (level) {
    case 'warning':
      colorClass = 'text-yellow-500';
      break;
    case 'error':
    default:
      colorClass = 'text-red-500';
      break;
  }

  return <p className={colorClass}>{message}</p>;
};

export default ErrorRenderer;
