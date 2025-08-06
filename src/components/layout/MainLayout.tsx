import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function MainLayout({ children, showSearch, searchValue, onSearchChange }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-background)' }}>
      <Header 
        showSearch={showSearch}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />
      <main className="flex-grow pt-16" style={{ background: 'var(--color-background)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}