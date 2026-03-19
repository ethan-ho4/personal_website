import { Outlet, useLocation, ScrollRestoration } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const isExperience = location.pathname.startsWith('/experience');

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ScrollRestoration />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isExperience && <Footer />}
    </div>
  );
}
