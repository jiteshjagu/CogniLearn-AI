import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { LoginView } from './components/auth/LoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  // Initialize storage once on mount
  useEffect(() => {
    StorageService.initialize();
    const stored = StorageService.getCurrentUser();
    if (stored?.user && stored?.role) {
      setCurrentUser(stored.user);
      setCurrentRole(stored.role);
    }
  }, []);

  const handleLoginSuccess = (user, role) => {
    setCurrentUser(user);
    setCurrentRole(role);
    StorageService.setCurrentUser(user, role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    StorageService.setCurrentUser(null, null);
  };

  const handleSwitchUser = (user, role) => {
    setCurrentUser(user);
    setCurrentRole(role);
    StorageService.setCurrentUser(user, role);
  };

  const handleDataReset = () => {
    StorageService.resetToDefaults();
    // Default to Alex Rivera student profile after reset
    const defaultStudent = StorageService.getStudents()[0];
    setCurrentUser(defaultStudent);
    setCurrentRole('student');
    StorageService.setCurrentUser(defaultStudent, 'student');
  };

  const handleAdminOrMentorNavigateToStudent = (studentObj) => {
    setCurrentUser(studentObj);
    setCurrentRole('student');
    StorageService.setCurrentUser(studentObj, 'student');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onDataReset={handleDataReset}
        onNavigateHome={() => {
          if (!currentUser) {
            handleLogout();
          }
        }}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {!currentUser || !currentRole ? (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : currentRole === 'admin' ? (
          <AdminDashboard
            currentUser={currentUser}
            onBackToLogin={handleLogout}
            onNavigateStudent={handleAdminOrMentorNavigateToStudent}
          />
        ) : currentRole === 'mentor' ? (
          <MentorDashboard
            currentUser={currentUser}
            onBackToLogin={handleLogout}
            onNavigateStudent={handleAdminOrMentorNavigateToStudent}
          />
        ) : (
          <StudentDashboard
            currentUser={currentUser}
            onBackToLogin={handleLogout}
            onUpdateCurrentUser={(updatedStudent) => {
              setCurrentUser(updatedStudent);
              StorageService.setCurrentUser(updatedStudent, 'student');
            }}
          />
        )}
      </div>

    </div>
  );
}
