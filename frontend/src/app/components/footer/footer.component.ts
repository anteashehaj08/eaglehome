import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-top">


        <!-- Left: Business hours + socials -->
        <div class="footer-col">
          <h4 class="col-title">Business Hours</h4>
          <ul class="hours-list">
            <li><span>Mon – Sun</span><span>08:00 – 20:00</span></li>
          </ul>
          <div class="socials">
            <a href="https://www.facebook.com/MobileriEagleFier/" target="_blank" class="social-icon" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://wa.me/355686034177" target="_blank" class="social-icon" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/mobileri_eagle_fier?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="social-icon" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@mobileri_eagle_eglo_fier?is_from_webapp=1&sender_device=pc" target="_blank" class="social-icon" title="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Center: Logo -->
        <div class="footer-logo-col">
          <a routerLink="/" class="logo">
            <img src="https://i.postimg.cc/YSTsWCTh/logo-eagle-home.png" alt="Logo" class="logo-img">
          </a>
          <p class="footer-tagline">Crafting spaces with intention.</p>
        </div>


        <!-- Right: Contact -->
        <div class="footer-col footer-col-right">
          <h4 class="col-title">Contact Us</h4>
          <ul class="contact-list">
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:eaglehome2007@gmail.com">eaglehome2007</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:+355686034183">+355686034183</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:+355686034177">+355686034177</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Mobileri Eagle & Ndriçues Aurstriakë Eglo, Rruga "Shenjt Leonardo Murialdo", Fier, 9301, Shqipëri</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Map -->
      <div class="footer-map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2169.282792596569!2d19.575502699999998!3d40.7265982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135aadfc22c8a21d%3A0x38f9b511e5156006!2sMobileri%20Eagle%20%26%20Ndri%C3%A7ues%20Austriak%C3%AB%20Eglo!5e1!3m2!1sen!2s!4v1775232118575!5m2!1sen!2s"
                width="100%" height="220" style="border:0;" allowfullscreen loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
      
      <!-- Copyright -->
      <div class="footer-bottom">
        <span>© {{ year }} EagleFier. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: var(--nav-bg); color: #fff; }

    .footer-top {
      max-width: 1200px; margin: 0 auto;
      padding: 52px 32px 40px;
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 40px;
      align-items: start;
    }
    @media (max-width: 768px) {
      .footer-top { grid-template-columns: 1fr; text-align: center; }
      .footer-col-right { text-align: center; }
      .contact-list li { justify-content: center; }
    }

    .col-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 14px; font-weight: 400;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: #fff; margin-bottom: 16px;
      padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.25);
    }

    /* Hours */
    .hours-list { list-style: none; }
    .hours-list li { display: flex; justify-content: space-between; gap: 24px; font-size: 13px; color: rgba(255,255,255,0.8); padding: 5px 0; letter-spacing: 0.02em; }

    /* Socials */
    .socials { display: flex; gap: 14px; margin-top: 20px; }
    .social-icon { color: rgba(255,255,255,0.75); transition: color 0.2s; }
    .social-icon:hover { color: #fff; }

    /* Center logo */
    .footer-logo-col { text-align: center; padding-top: 8px; }
    .logo-img {
      height: 80px;
      width: auto;
      object-fit: contain;
    }
    .footer-tagline { font-size: 12px; color: rgba(255,255,255,0.6); letter-spacing: 0.12em; margin-top: 8px; font-style: italic; }

    /* Contact */
    .contact-list { list-style: none; }
    .contact-list li {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 13px; color: rgba(255,255,255,0.8);
      padding: 5px 0; letter-spacing: 0.02em;
    }
    .contact-list svg { flex-shrink: 0; margin-top: 2px; opacity: 0.7; }
    .contact-list a { color: rgba(255,255,255,0.8); }
    .contact-list a:hover { color: #fff; }

    /* Map */
    .footer-map { opacity: 0.85; }

    /* Bottom */
    .footer-bottom {
      max-width: 1200px; margin: 0 auto;
      padding: 14px 32px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-size: 11px; color: rgba(255,255,255,0.55);
      letter-spacing: 0.06em; text-align: center;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
