export const metadata = {
  title: 'ERP System - Full Stack Application',
  description: 'Complete Next.js full-stack ERP system with authentication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
