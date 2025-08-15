import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
