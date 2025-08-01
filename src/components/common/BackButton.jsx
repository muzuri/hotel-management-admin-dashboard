import React from 'react'
const BackButton = ({goBack}) => {
    return (
      <button
        onClick ={goBack}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        ← Back
      </button>
    );
}

export default BackButton