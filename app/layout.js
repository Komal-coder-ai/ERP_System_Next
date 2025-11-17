export const metadata = {
  title: 'ERP System - Full Stack Application',
  description: 'Complete Next.js full-stack ERP system with authentication',
};

import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import RTLHandler from './components/RTLHandler';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <RTLHandler />
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
