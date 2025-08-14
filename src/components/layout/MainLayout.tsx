import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <main className="flex-1 pt-8">{children}</main>
      <Footer />
    </div>
  );
}
