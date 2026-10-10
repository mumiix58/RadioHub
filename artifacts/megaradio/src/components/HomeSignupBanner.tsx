import { Link } from 'wouter';
import { useSeoRouting } from '@/hooks/useSeoRouting';
import { useTranslation } from '@/hooks/useTranslation';
import './home-signup-banner.css';

export default function HomeSignupBanner() {
  const { t } = useTranslation();
  const { getLocalizedUrl } = useSeoRouting();

  return (
    <div className="home-signup-banner" data-testid="signup-banner">
      <div className="home-signup-banner__copy">
        <h3>{t('sign_up_for_more_features', 'Sign up for more features')}</h3>
        <p>{t('favorites_recording_statistics_and_more', 'Favorites, recording, statistics and more')}</p>
        <Link href={getLocalizedUrl('/signup')} className="home-signup-banner__button" data-testid="signup-banner-button">
          {t('sign_up', 'Sign Up')}
        </Link>
      </div>
      <img
        src="/images/signup-listener.png"
        width={1312}
        height={1592}
        alt=""
        loading="lazy"
        decoding="async"
        className="home-signup-banner__image"
      />
    </div>
  );
}
