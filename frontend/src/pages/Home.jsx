import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, Users, ArrowRight, Shield, Zap } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <div className="relative z-10">
          <h1>Master Your Team's Productivity</h1>
          <p>
            The all-in-one task management solution built for modern teams. 
            Organize projects, assign tasks, and track progress effortlessly.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Get Started for Free <ArrowRight size={20} className="inline ml-2" />
            </Link>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
            <BarChart2 size={24} />
          </div>
          <h3>Detailed Analytics</h3>
          <p>Get insights into your team's performance with real-time dashboards and status reports.</p>
        </div>

        <div className="feature-card">
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl w-fit">
            <Users size={24} />
          </div>
          <h3>Team Collaboration</h3>
          <p>Assign tasks to team members and keep everyone on the same page with project roles.</p>
        </div>

        <div className="feature-card">
          <div className="mb-4 p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
            <CheckCircle size={24} />
          </div>
          <h3>Task Tracking</h3>
          <p>Mark tasks as pending, in-progress, or completed. Never miss a deadline again.</p>
        </div>

        <div className="feature-card">
          <div className="mb-4 p-3 bg-orange-50 text-orange-600 rounded-xl w-fit">
            <Zap size={24} />
          </div>
          <h3>Real-time Updates</h3>
          <p>Changes are reflected across your team instantly. Stay synchronized without refreshing.</p>
        </div>

        <div className="feature-card">
          <div className="mb-4 p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <Shield size={24} />
          </div>
          <h3>Secure & Private</h3>
          <p>Role-based access control ensures that only authorized members can manage projects.</p>
        </div>

        <div className="feature-card">
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl w-fit">
            <ArrowRight size={24} />
          </div>
          <h3>Easy Onboarding</h3>
          <p>Start your first project in minutes with our intuitive and clean user interface.</p>
        </div>
      </section>

      <footer className="mt-20 py-8 border-t border-slate-200 text-slate-500 text-sm">
        <p>&copy; 2026 TaskMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
