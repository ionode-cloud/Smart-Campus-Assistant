import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { CampusMap } from './components/CampusMap';
import { getAllLocations } from './services/locationService';

// Fallback static data (used when API is offline)
const fallbackLocations = [
  { id: 'block-a', name: 'Block A', description: 'Block A provides higher education courses such as: Bachelor of Technology (B.Tech), Master of Business Administration (MBA), Master of Computer Applications (MCA).', departments: ['Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical and Electronics Engineering (EEE)', 'Mechanical Engineering', 'Civil Engineering', 'Master of Business Administration (MBA)'], timings: '8:00 AM to 4:00 PM', type: 'academic' },
  { id: 'block-b', name: 'Block B', description: 'Block B offers Diploma courses in Civil, Mechanical, Electrical, Electronics and Telecommunication, and Computer Science.', departments: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics and Telecommunication Engineering', 'Computer Science'], timings: '8:00 AM to 4:00 PM', type: 'academic' },
  { id: 'block-c', name: 'Block C', description: 'Block C provides BCA, B.Sc Nursing, JNM, and +3 Programs.', departments: ['Bachelor of Computer Applications (BCA)', 'B.Sc Nursing', 'JNM', '+3 Programs'], timings: '8:00 AM to 4:00 PM', type: 'academic' },
  { id: 'boys-hostel', name: "Boys' Hostel", description: "Residential facility for male students with furnished rooms, mess, and recreational areas.", timings: '6:00 AM to 10:00 PM', type: 'residential' },
  { id: 'girls-hostel', name: "Girls' Hostel", description: "Secure residential facility for female students with CCTV and warden supervision.", timings: '6:00 AM to 10:00 PM', type: 'residential' },
  { id: 'ground', name: 'College Ground', description: 'Open area for sports, physical activities, and campus events.', timings: '8:00 AM to 4:00 PM', type: 'sports' },
  { id: 'canteen', name: 'Canteen', description: 'Campus cafeteria serving fresh meals and snacks throughout the day.', timings: '7:00 AM - 9:00 PM', type: 'facility' },
  { id: 'main-gate', name: 'Main Gate', description: 'Primary entrance to the campus with security checkpoint.', timings: '24/7 Access', type: 'entrance' },
  { id: 'gate-2', name: 'Gate 2', description: 'Secondary entrance with security checkpoint and vehicle access.', timings: '24/7 Access', type: 'entrance' },
  { id: 'gate-3', name: 'Gate 3', description: 'Tertiary entrance for auxiliary access with security verification.', timings: '24/7 Access', type: 'entrance' },
  { id: 'bus-parking', name: 'Bus Parking', description: 'Designated parking area for campus buses and transportation vehicles.', timings: '6:00 AM - 8:00 PM', type: 'facility' },
  { id: 'student-parking', name: 'Student Parking', description: 'Designated parking area for students with short-term and long-term bays.', timings: '6:00 AM - 10:00 PM', type: 'facility' },
  { id: 'security-room', name: 'Security Room', description: 'Campus security headquarters and monitoring center.', timings: '24/7 Access', type: 'facility' },
  { id: 'center', name: 'Center', description: 'Central point of the campus — common meeting area.', type: 'landmark' },
  { id: 'kalam', name: 'Kalam Higher Secondary School', description: 'Higher secondary education in Science stream.', departments: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Information Technology (IT)'], timings: '8:00 AM to 4:00 PM', type: 'academic' }
];

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campusLocations, setCampusLocations] = useState(fallbackLocations);

  // Fetch locations from API on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        if (data && data.length > 0) {
          setCampusLocations(data);
        }
      } catch (err) {
        // API offline — using fallback static data silently
        console.warn('Backend offline, using static location data.');
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
        <SearchBar />
      </div>
    </div>
  );
}
