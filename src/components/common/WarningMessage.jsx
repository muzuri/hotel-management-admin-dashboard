import React from 'react'

const WarningMessage = ({message, type}) => {
  return (
    <div role="alert" class="mb-4 relative flex w-full p-3 text-sm text-white bg-orange-600 rounded-md">
    {message}
    
  </div>
  )
}

export default WarningMessage