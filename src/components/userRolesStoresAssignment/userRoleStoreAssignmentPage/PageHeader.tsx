/**
 * PageHeader Component
 * 
 * Displays the page title and description for the User Role Store Assignment page.
 * Fully responsive design with CSS variables for light/dark mode compatibility.
 */

import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 sm:space-y-3">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
        User Role Store Assignment
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        Manage user role assignments across different stores. Search and assign roles to users and stores.
      </p>
    </div>
  );
};

export default PageHeader;