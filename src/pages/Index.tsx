
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-gray-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/lovable-uploads/4ca15042-e89a-4f8f-8662-4075c5cbe7ca.png" 
                alt="LeadsRush Africa" 
                className="h-24 w-24"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block">Manage Your Business with</span>
              <span className="block text-red-600">LeadsRush Africa</span>
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              All-in-one client management platform for businesses. Track projects, send invoices, and grow your business efficiently.
            </motion.p>
            <motion.div 
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="rounded-md shadow">
                <Link to="/auth">
                  <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10">
                    Login / Register
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <motion.h2 
              className="text-base text-red-600 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Features
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              A better way to manage your clients
            </motion.p>
            <motion.p 
              className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              LeadsRush Africa is designed to streamline your client management process, making it easier to focus on growing your business.
            </motion.p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    {/* Heroicon name: outline/globe-alt */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Project Management</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Keep your projects on track with our intuitive project management tools. Assign tasks, set deadlines, and monitor progress.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    {/* Heroicon name: outline/scale */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M3 6V4m0 2L5 8m-3 6l4 1m0 0l1-5a5.002 5.002 0 00-6.002 0M3 16V18m0-2l1-5m5 0v2m0 4v2m-5-7l6 1" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Invoicing and Payments</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Generate professional invoices and accept payments online. Stay on top of your finances and get paid faster.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    {/* Heroicon name: outline/lightning-bolt */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Client Communication</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Communicate with your clients seamlessly through our integrated messaging system. Keep everyone informed and engaged.
                </dd>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    {/* Heroicon name: outline/annotation */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7m-4-4v8m4-4h12" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Task Automation</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Automate repetitive tasks and focus on what matters most. Streamline your workflow and increase productivity.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <motion.h2 
              className="text-base text-red-600 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              Testimonials
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              What our clients are saying
            </motion.p>
            <motion.p 
              className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              We are proud to have helped numerous businesses grow and succeed. Here are some of their stories.
            </motion.p>
          </div>

          <div className="mt-10">
            <motion.div 
              className="md:grid md:grid-cols-2 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <div className="relative">
                <blockquote className="mt-8">
                  <div className="text-base text-gray-500">
                    <p>
                      "LeadsRush Africa has transformed the way we manage our clients. It's intuitive, efficient, and has significantly improved our productivity."
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3 divide-x divide-gray-200 text-sm">
                      <div className="font-medium text-gray-900">Sarah Johnson</div>
                      <div className="pl-3 font-medium text-gray-500">CEO, Company XYZ</div>
                    </div>
                  </footer>
                </blockquote>
              </div>

              <div className="relative">
                <blockquote className="mt-8">
                  <div className="text-base text-gray-500">
                    <p>
                      "We've been using LeadsRush Africa for over a year now, and it's been a game-changer. The invoicing and payment features have saved us countless hours."
                    </p>
                  </div>
                  <footer className="mt-3">
                    <div className="flex items-center space-x-3 divide-x divide-gray-200 text-sm">
                      <div className="font-medium text-gray-900">Michael Brown</div>
                      <div className="pl-3 font-medium text-gray-500">Founder, ABC Agency</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-red-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-red-200">Start using LeadsRush Africa today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/auth">
                <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
