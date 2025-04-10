
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Home, LineChart, PenTool, CheckSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link to={to}>
    <Button
      variant="ghost"
      className={cn(
        "flex items-center w-full justify-start gap-2 mb-1",
        active && "bg-primary/10 text-primary"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

const Navbar: React.FC<{ activePage?: string }> = ({ activePage = "dashboard" }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-screen p-4 border-r border-border bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">J</span>
        </div>
        <h1 className="text-xl font-bold">Journalix</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {user ? (
        <div className="flex flex-col flex-1">
          <nav className="space-y-1 mb-8">
            <NavItem 
              to="/dashboard" 
              icon={<Home size={18} />} 
              label="Dashboard" 
              active={activePage === "dashboard"} 
            />
            <NavItem 
              to="/journal" 
              icon={<PenTool size={18} />} 
              label="Journal" 
              active={activePage === "journal"} 
            />
            <NavItem 
              to="/tasks" 
              icon={<CheckSquare size={18} />} 
              label="Tasks" 
              active={activePage === "tasks"} 
            />
            <NavItem 
              to="/calendar" 
              icon={<Calendar size={18} />} 
              label="Calendar" 
              active={activePage === "calendar"} 
            />
            <NavItem 
              to="/insights" 
              icon={<LineChart size={18} />} 
              label="Insights" 
              active={activePage === "insights"} 
            />
          </nav>

          <div className="mt-auto">
            <div className="p-4 rounded-lg bg-secondary mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2" 
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <Link to="/auth/login">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link to="/auth/signup">
            <Button variant="outline" className="w-full">Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
