import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Alex Chen
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Skills
            </button>
            <button onClick={() => scrollToSection('experience')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Experience
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-600 hover:text-gray-900 transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 flex flex-col gap-3">
            <button onClick={() => scrollToSection('about')} className="text-left text-gray-600 hover:text-gray-900 transition-colors py-2">
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="text-left text-gray-600 hover:text-gray-900 transition-colors py-2">
              Skills
            </button>
            <button onClick={() => scrollToSection('experience')} className="text-left text-gray-600 hover:text-gray-900 transition-colors py-2">
              Experience
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-left text-gray-600 hover:text-gray-900 transition-colors py-2">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left">
              Contact
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}