"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
