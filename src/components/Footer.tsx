export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content footer-content-enhanced">
          <div>
            <p className="footer-brand">Web Alchemist Labs</p>
            <p className="footer-copy">
              A portfolio ecommerce experience designed to showcase modern
              storefront architecture with a refined classic presentation.
            </p>
          </div>

          <div className="footer-meta">
            © {new Date().getFullYear()} Web Alchemist Labs
          </div>
        </div>
      </div>
    </footer>
  );
}