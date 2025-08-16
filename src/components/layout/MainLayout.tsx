import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col pt-20">
        <main className="flex-1 pb-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
