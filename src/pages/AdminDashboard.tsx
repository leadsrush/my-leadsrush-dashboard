
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { UserManagement } from '@/components/admin/UserManagement';

const AdminDashboard = () => {
  return (
    <PageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid gap-6">
          <UserManagement />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
