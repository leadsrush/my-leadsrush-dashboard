import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { slideUp } from '@/utils/transitions';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (!error && data) {
        // Login successful
        toast({
          title: 'Login successful',
          description: 'Welcome to My LeadsRush dashboard',
        });
        
        // Redirect based on role
        if (hasRole(['admin', 'project_manager', 'team_member'])) {
          navigate('/team-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      } else {
        // Login failed
        toast({
          title: 'Login failed',
          description: error?.message || 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, provide some logins
  const demoLogins = [
    { email: 'alex@leadsrush.com', role: 'Admin' },
    { email: 'jamie@leadsrush.com', role: 'Project Manager' },
    { email: 'casey@leadsrush.com', role: 'Team Member' },
    { email: 'taylor@client.com', role: 'Client' },
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password'); // In a real app, you'd never do this!
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with gradient background */}
      <div className="relative flex-grow flex flex-col md:flex-row">
        {/* Left side - Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="flex-1 flex flex-col justify-center p-8 md:p-16"
        >
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">My LeadsRush</h1>
              <div className="inline-block mb-6">
                <div className="text-xs uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Client Portal
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Access your marketing projects, communicate with your team, and track your growth all in one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-2">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                {demoLogins.map((demo) => (
                  <Button
                    key={demo.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(demo.email)}
                    className="text-xs justify-start"
                  >
                    <span className="truncate">{demo.email}</span>
                    <span className="ml-auto text-muted-foreground">({demo.role})</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use password "password" for demo accounts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Image/Graphics */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-gradient-to-br from-primary/80 to-primary/40 hidden md:flex items-center justify-center"
        >
          <div className="p-12 glass rounded-3xl shadow-xl max-w-lg">
            <div className="space-y-6">
              <div className="h-40 bg-white/20 rounded-lg backdrop-blur-sm animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded-full w-3/4 backdrop-blur-sm"></div>
                <div className="h-4 bg-white/20 rounded-full backdrop-blur-sm"></div>
                <div className="h-4 bg-white/20 rounded-full w-5/6 backdrop-blur-sm"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="h-20 bg-white/20 rounded-lg backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 text-center text-sm text-gray-500">
        <p>© 2023 LeadsRush. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
