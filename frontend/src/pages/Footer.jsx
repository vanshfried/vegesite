import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>FreshVeggie Delivery</h3>
        <p>Farm-fresh vegetables delivered to your doorstep in Jammu & Kashmir.</p>

        <ul className="footer-links">
          <li>
            📞 <a href="tel:+919876543210">+91 98765 43210</a>
          </li>
          <li>
            📧 <a href="mailto:vanshfried07@gmail.com">vanshfried07@gmail.com</a>
          </li>
          <li>
            💬{" "}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </li>
          <li>📍 Gandhi Nagar, Jammu, J&K, India</li>
        </ul>

        <p className="footer-copy">© {new Date().getFullYear()} FreshVeggie Delivery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
