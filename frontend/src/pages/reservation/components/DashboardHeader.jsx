import React from "react";

const DashboardHeader = ({ title, description }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
        {description}
      </p>
    </div>
  );
};

export default DashboardHeader;
