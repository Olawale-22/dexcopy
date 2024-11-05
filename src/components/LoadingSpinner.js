
import React from 'react';
import '../assets/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-message">
        <p>Awaiting authentication...</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;