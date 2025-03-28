
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Home, BarChart2, LayoutGrid, FileText, Settings, Info } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", name: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/dashboard", name: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
    { path: "/trade-manager", name: "Trade Manager", icon: <BarChart2 className="h-5 w-5" /> },
    { path: "/reporting", name: "Reporting", icon: <FileText className="h-5 w-5" /> },
    { path: "/information", name: "Information", icon: <Info className="h-5 w-5" /> },
    { path: "/settings", name: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Trade Tracker Pro
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 transition-colors hover:text-foreground/80 ${
                  currentPath === item.path ? "text-foreground font-medium" : "text-foreground/60"
                }`}
              >
                {item.icon}
                <span className="hidden md:block">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
