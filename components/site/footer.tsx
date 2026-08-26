import Link from "next/link";
import { Brand } from "@/components/site/brand";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="navy-gradient mt-auto text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Brand light />
          <p className="max-w-xs text-sm text-white/70">{SITE.tagline}. {SITE.description}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
          <ul className="space-y-2 text-sm text-white/75">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Support</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <a href="mailto:support@prepxpert.in" className="hover:text-white">
                support@prepxpert.in
              </a>
            </li>
            <li>
              <a href="tel:+919876543210" className="hover:text-white">
                +91 98765 43210
              </a>
            </li>
            <li>Counselling: 10:00 AM – 8:00 PM IST</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Account</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
