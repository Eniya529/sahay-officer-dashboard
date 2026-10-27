import React from 'react';
import { OfficerSidebar } from './OfficerSidebar';

export const OfficerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row selection:bg-teal-200 selection:text-teal-900">
      {/* Fixed Sidebar */}
      <OfficerSidebar />

      {/* Main Content Workspace Area */}
      <main className="relative flex-1 min-w-0 pb-12 overflow-x-hidden bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.07),transparent_28rem)]">
        {children}
      </main>
    </div>
  );
};