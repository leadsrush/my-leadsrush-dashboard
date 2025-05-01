
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminServiceAnalytics } from '@/components/dashboard/AdminServiceAnalytics';
import { InvoiceSummary } from '@/components/dashboard/InvoiceSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, DollarSign, BarChart, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, view analytics, and oversee operations</p>
          </div>
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/4ca15042-e89a-4f8f-8662-4075c5cbe7ca.png" 
              alt="LeadsRush Africa" 
              className="h-12 w-12 mr-4"
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold">184</h3>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <h3 className="text-3xl font-bold">$42,580</h3>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <h3 className="text-3xl font-bold">27</h3>
                <p className="text-sm text-yellow-600">Same as last month</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <BarChart className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <h3 className="text-3xl font-bold">92%</h3>
                <p className="text-sm text-green-600">+4% from last month</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Service Analytics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Service Analytics</CardTitle>
                <Button variant="outline" size="sm">
                  View All <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <AdminServiceAnalytics />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Invoice Summary</CardTitle>
                <Button variant="outline" size="sm">
                  View All <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <InvoiceSummary />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid gap-6">
          <UserManagement />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
