import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="site-shell">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <div className="layout-frame">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}