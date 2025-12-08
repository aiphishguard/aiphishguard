import { Shield, Github, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold">
                <span className="text-foreground">PhishGuard</span>
                <span className="text-primary"> AI</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Protecting users from cyber threats with advanced AI technology
              </p>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PhishGuard AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}