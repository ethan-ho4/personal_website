import { useEffect } from 'react';
import { Timeline } from '../components/Timeline';

export function ExperiencePage() {
  useEffect(() => {
    document.documentElement.classList.add('no-scrollbar');
    document.body.classList.add('no-scrollbar');
    return () => {
      document.documentElement.classList.remove('no-scrollbar');
      document.body.classList.remove('no-scrollbar');
    };
  }, []);

  return (
    <div className="size-full">
      <Timeline />
    </div>
  );
}