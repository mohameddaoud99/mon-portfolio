
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { loginAdmin, logoutAdmin } from '@/services/firebase';
import AboutAdmin from './admin/AboutAdmin';
import EducationAdmin from './admin/EducationAdmin';
import ExperienceAdmin from './admin/ExperienceAdmin';
import CertificationsAdmin from './admin/CertificationsAdmin';
import ProjectsAdmin from './admin/ProjectsAdmin';
import ContactsAdmin from './admin/ContactsAdmin';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Handle login form change
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if Firebase is configured
      if (import.meta.env.VITE_FIREBASE_API_KEY) {
        await loginAdmin(loginData.email, loginData.password);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "You are now logged in as an administrator.",
        });
      } else {
        // Demo mode login
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAuthenticated(true);
        toast({
          title: "Demo Login",
          description: "This is a demo login. In a real app, you would authenticate with Firebase.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      if (import.meta.env.VITE_FIREBASE_API_KEY) {
        await logoutAdmin();
      }
      setIsAuthenticated(false);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="admin@example.com"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full bg-portfolio-blue hover:bg-portfolio-dark-blue"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <p className="text-gray-500">
                  Demo credentials: admin@example.com / password
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button onClick={() => navigate("/")} variant="outline">
              View Site
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <AboutAdmin />
          </TabsContent>
          
          <TabsContent value="education" className="mt-6">
            <EducationAdmin />
          </TabsContent>
          
          <TabsContent value="experience" className="mt-6">
            <ExperienceAdmin />
          </TabsContent>
          
          <TabsContent value="certifications" className="mt-6">
            <CertificationsAdmin />
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <ProjectsAdmin />
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-6">
            <ContactsAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
