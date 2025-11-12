import React from 'react';
import Navbar from './LandingNavbar';
import OverviewCards from './OverviewCards';
import PerformanceChart from './PerformanceChart';
import ResourceChart from './ResourceChart';
import ResourceTable from './ResourceTable';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar onLoginClick={onLoginClick} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Hospitrax
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your comprehensive hospital management and resource tracking system
          </p>
        </div>

        {/* Overview Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Hospital Resources Overview</h2>
          <OverviewCards />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart />
          <ResourceChart />
        </div>

        {/* Resource Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Resource Requests</h2>
          <ResourceTable />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

