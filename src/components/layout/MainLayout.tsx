import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "../error/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <ErrorBoundary componentName="header">
        <Header />
      </ErrorBoundary>
      <div className="min-h-screen flex flex-col pt-20">
        <main className="flex-1 pb-8">
          <ErrorBoundary componentName="main-content">
            {children}
          </ErrorBoundary>
        </main>
        <ErrorBoundary componentName="footer">
          <Footer />
        </ErrorBoundary>
      </div>
    </>
  );
}
