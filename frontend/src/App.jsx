import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { CampusMap } from './components/CampusMap';
import { getAllLocations } from './services/locationService';
import OfflineStatus from './components/OfflineStatus';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campusLocations, setCampusLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch locations from API on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLocations();
        if (data && data.length > 0) {
          setCampusLocations(data);
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Unable to load campus locations. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const sortedLocations = [...campusLocations].sort((a, b) => a.name.localeCompare(b.name));

  const handleLocationSelect = (locationId) => {
    const location = campusLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setSidebarCollapsed(false);
    }
  };



  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      <OfflineStatus />
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          locations={sortedLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Campus Map Area */}
        <CampusMap
          selectedLocation={selectedLocation}
          onLocationClick={handleLocationSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Floating Bus Button */}
      <div className={`absolute top-4 z-[9999] pointer-events-auto transition-all duration-300 ${sidebarCollapsed ? 'left-4' : 'left-0 ml-[320px]'}`}>
        <SearchBar />
      </div>
    </div>
  );
}
