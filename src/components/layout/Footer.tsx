import Link from "next/link";
import styles from "./Footer.module.css";


const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Timeline", path: "/timeline" },
  { name: "Instructions", path: "/instructions" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/nssvitbhopal?igsh=MXNvZXZ1MmhhcmVhcw==",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/nss-vitb/",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />

      <div className={styles.container}>
        {/* Single compact row */}
        <div className={styles.mainRow}>
          {/* Left: Brand */}
          <div className={styles.brand}>
            <span className={styles.logoText}>VBNYP <span className={styles.logoYear}>2026</span></span>
            <span className={styles.separator}>·</span>
            <span className={styles.nssText}>NSS Unit, VIT Bhopal</span>
            <span className={styles.motto}>— Not Me But You</span>
          </div>

          {/* Center: Social Icons */}
          <div className={styles.socials}>
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={styles.socialBtn}
              >
                {s.svg}
              </a>
            ))}
          </div>

          {/* Right: Nav Links */}
          <nav className={styles.links}>
            {navLinks.map((link, i) => (
              <span key={link.name} className={styles.linkWrap}>
                <Link href={link.path} className={styles.link}>{link.name}</Link>
                {i < navLinks.length - 1 && <span className={styles.dot}>·</span>}
              </span>
            ))}
          </nav>
        </div>

        <div className={styles.divider} />

        {/* Bottom: copyright */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {currentYear} Viksit Bharat National Youth Parliament · All rights reserved
          </p>
          <p className={styles.builtBy}>
            Built by <span className={styles.devName}>Yash Goyal</span> · <span className={styles.devName}>Pratyush Dubey</span> · <span className={styles.devName}>Aditya Jain</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
