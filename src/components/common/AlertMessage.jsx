import React from 'react';
import clsx from 'clsx';

const alertStyles = {
    error: 'text-red-700 bg-red-100 border-red-400',
    warning: 'text-yellow-700 bg-yellow-100 border-yellow-400',
    info: 'text-blue-700 bg-blue-100 border-blue-400',
    success: 'text-green-700 bg-green-100 border-green-400',
  };

function AlertMessage({type ='info', message}, ) {
    if(!message) return null;
  return (

    <div
      className={clsx(
        'mt-2 p-3 border rounded text-sm',
        alertStyles[type]
      )}
    >
      {message}
    </div>
  )
}

export default AlertMessage