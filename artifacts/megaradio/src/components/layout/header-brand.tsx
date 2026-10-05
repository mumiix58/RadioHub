import { Link } from 'wouter';
import './header-brand.css';

interface HeaderBrandProps {
  href: string;
  variant?: 'public' | 'profile';
}

/** The public header's brand lockup; footer and admin sizing stay independent. */
export function HeaderBrand({ href, variant = 'public' }: HeaderBrandProps) {
  return (
    <Link href={href} aria-label="MegaRadio" className={`not-active header-brand${variant === 'profile' ? ' header-brand--profile' : ''}`}>
      <span className="header-brand__mark" aria-hidden="true">
        <img
          src="/logo-icon.webp"
          width={322}
          height={299}
          loading="eager"
          decoding="async"
          alt=""
          className="header-brand__image"
        />
      </span>
      <span className="header-brand__wordmark font-ubuntu" aria-hidden="true">
        <span className="header-brand__mega">mega</span><span>radio</span>
      </span>
    </Link>
  );
}
