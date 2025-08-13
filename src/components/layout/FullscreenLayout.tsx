interface FullscreenLayoutProps {
  children: React.ReactNode;
}

export default function FullscreenLayout({ children }: FullscreenLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {children}
    </div>
  );
}
