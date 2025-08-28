import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-contact">
        <h3 className="footer-contact-title">Contact Us</h3>
        <p className="footer-contact-info">Phone Number</p>
        <p className="footer-contact-info">Email</p>
      </div>

      <div className="footer-center">
        <h3 className="footer-center-title">Entertainment Guild</h3>
        <p className="footer-center-subtitle">Let us entertain you</p>
      </div>

      <div className="footer-payment">
        <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="footer-payment-icon" />
        <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="footer-payment-icon" />
      </div>
    </footer>
  );
}
