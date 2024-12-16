import React from 'react';
import './ForbiddenSection.css';

const ForbiddenSection = () => {
  return (
    <div className="forbidden-container">
      <h1>403 - Forbidden</h1>
      <p>You don't have permission to access this page.</p>
      <p>Please check your credentials or contact the administrator for access.</p>
    </div>
  );
}

export default ForbiddenSection;
