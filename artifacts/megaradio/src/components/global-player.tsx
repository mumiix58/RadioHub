import { useState, useMemo } from "react";
import { useGlobalPlayer } from "@/hooks/useGlobalPlayer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import StationControlButtonGroup from "@/components/ui/station-control-button-group";
import { getStationControlLabels } from '@/utils/station-control-labels';
import { StationLogo } from "@/components/ui/station-logo";
import MetaActionsButtonGroup from "@/components/ui/meta-actions-button-group";
import { Link } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { useSeoRouting } from "@/hooks/useSeoRouting";
import AskToSignupModal from "@/components/modals/AskToSignupModal";
import { useIsMobile } from '@/hooks/use-mobile';
import { useSignupPrompt, SIGNUP_BANNER_DELAY_MS, SIGNUP_MODAL_DELAY_MS } from '@/hooks/useSignupPrompt';
import './global-player.css';

export default function GlobalPlayer() {
  const { currentStation, isPlaying, stationMeta, volume = 0.7, setVolume } = useGlobalPlayer();
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { t, language, localeTranslations } = useTranslation();
  const controlLabels = useMemo(() => getStationControlLabels(language, localeTranslations), [language, localeTranslations]);
  const { getLocalizedUrl, englishPath } = useSeoRouting();

  // Use englishPath (language-stripped) so /tr/profile/..., /de/profile/...
  // and other localized profile routes are also detected. Without this the
  // player would overlap the sidebar on every non-English profile page.
  const isProfilePage = englishPath.startsWith('/profile');

  // Hide mini-player on station detail page (it has its own player)
  const isStationDetailPage = englishPath.startsWith('/station/') || englishPath.startsWith('/stations/');
  const isAccountPage = /^\/(?:auth|login|signup|forgot-password|reset-password|verify-email|profile|admin)(?:\/|$)/.test(englishPath);
  // One invitation surface only: don't stack a modal on top of the desktop banner.
  const useSignupModal = isMobile || isStationDetailPage;
  const { isOpen: showSignupPrompt, dismiss: dismissSignupPrompt } = useSignupPrompt({
    eligible: !isAuthenticated && !authLoading && !authError && Boolean(currentStation) && isPlaying
      && !isAccountPage && (useSignupModal || !collapsed),
    delayMs: useSignupModal ? SIGNUP_MODAL_DELAY_MS : SIGNUP_BANNER_DELAY_MS,
  });
  const showSignupBanner = showSignupPrompt && !useSignupModal;
  const showSignupModal = showSignupPrompt && useSignupModal;
  
  const getCurrentLanguage = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
    return match ? match[1] : '';
  };
  
  const currentLanguage = getCurrentLanguage();
  const langPrefix = currentLanguage ? `/${currentLanguage}` : '';
  const currentStationPlayerUrl = `${langPrefix}/station/${currentStation?.slug || currentStation?._id}`;
  
  const getCountryImage = (countrycode: string, size: number = 40) => {
    return `/flags/${countrycode.toLowerCase()}-${size}.webp`;
  };
  
  const metadata = stationMeta;
  const trackTitle = metadata?.title?.trim()
    ? [metadata.artist?.trim(), metadata.title.trim()].filter(Boolean).join(' - ')
    : currentStation?.country || '';
  const countryCode = currentStation?.countryCode || (currentStation as any)?.countrycode;

  const togglePlayerView = () => {
    setCollapsed(!collapsed);
  };

  if (!currentStation) return null;
  
  // On station detail page, only render the signup modal (mini-player UI is hidden)
  if (isStationDetailPage) {
    return (
      <AskToSignupModal 
        isOpen={showSignupModal && !isAuthenticated}
        onClose={dismissSignupPrompt}
      />
    );
  }

  return (
    <div>
      {/* Ask To Signup Banner — also offset by sidebar on profile pages to
          stay consistent with the player wrapper below it. (In practice
          profile pages require auth so the banner is never shown there,
          but the offset prevents any future regression.) */}
      {showSignupBanner && !isAuthenticated && !collapsed && (
        <div 
          className={cn(
            "fixed z-30 right-0 hidden md:block",
            isProfilePage ? "left-0 lg:left-[250px]" : "left-0"
          )}
          style={{ 
            bottom: '110px',
            height: '86px',
            background: 'linear-gradient(238.94deg, #FF55A4 8.29%, #BD52FF 97.54%)'
          }}
        >
          <div 
            className="w-full max-w-[1512px] mx-auto h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-[153px]"
            data-testid="player-signup-banner"
          >
            <div className="flex flex-col justify-center">
              <h4 
                className="text-white font-bold"
                style={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  lineHeight: '120%'
                }}
              >
                {t('seems_you_like_megaradio', 'Seems you like MegaRadio!')}
              </h4>
              <p 
                className="text-white opacity-90"
                style={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 'clamp(11px, 2vw, 14px)',
                  lineHeight: '140%'
                }}
              >
                {t('signup_banner_full_description', 'Sign up for MegaRadio for unlimited access and amazing features. Registration is completely free!')}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                onClick={dismissSignupPrompt}
                data-testid="player-signup-later-button"
                className="text-white text-sm hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'Ubuntu, sans-serif' }}
              >
                {t('later', 'Later')}
              </button>
              <Link 
                href={getLocalizedUrl('/signup')} 
                className="bg-white hover:bg-gray-100 transition-colors flex items-center justify-center"
                style={{
                  height: '40px',
                  borderRadius: '25px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#BD52FF'
                }}
                onClick={dismissSignupPrompt}
                data-testid="player-signup-button"
              >
                {t('signup', 'Signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div
        className={cn('mini-player fixed bottom-0 right-0 z-20',
          collapsed && 'mini-player--collapsed',
          isProfilePage ? 'left-0 lg:left-[250px]' : 'left-0')}
        data-testid="global-player-wrapper"
      >
        <div className="mini-player-inner" data-testid="global-player">
          <div className="mini-player-station">
            <div className="mini-player-artwork">
              <StationLogo station={currentStation} className="mini-player-logo" sizes="72px" alt={`${currentStation.name} radio station logo`} />
              {countryCode && <img
                src={getCountryImage(countryCode)} alt={`${currentStation.country || countryCode} flag`}
                className="mini-player-flag" width={isMobile ? 18 : 24} height={isMobile ? 18 : 24}
                onError={event => { event.currentTarget.style.display = 'none'; }}
              />}
            </div>
            <div className="mini-player-copy">
              {!collapsed && <div className={cn('mini-player-equalizer', isPlaying && 'mini-player-equalizer--playing')} aria-hidden="true"><i /><i /><i /></div>}
              <Link to={currentStationPlayerUrl} className="mini-player-name" title={currentStation.name}>
                {currentStation.name}
              </Link>
              <div className="mini-player-track-row">
                <span className="mini-player-track" title={trackTitle}>{trackTitle}</span>
                {!collapsed && <MetaActionsButtonGroup className="mini-player-meta" iconSize={26} hideChromecast appearance="mini-player" />}
              </div>
            </div>
          </div>
          {!collapsed && <div className="mini-player-controls">
            <StationControlButtonGroup currentPageStation={currentStation} size={isMobile ? 'mobile' : 'default'} labels={controlLabels} appearance="mini-player" />
            <div className="mini-player-volume">
              <img src="/icons/mini-player/volume.svg" width="30" height="30" alt="" />
              <div className="mini-player-volume-track">
                <div className="mini-player-volume-fill" style={{ width: `${volume * 100}%` }} />
                <input type="range" min="0" max="100" value={Math.round(volume * 100)}
                  aria-label={t('player_volume', 'Volume')}
                  onChange={event => setVolume(Number(event.target.value) / 100)} />
              </div>
            </div>
          </div>}
          <button type="button" className="mini-player-toggle" onClick={togglePlayerView}
            data-testid={isMobile ? (collapsed ? 'mobile-player-expand' : 'mobile-player-collapse') : 'desktop-player-toggle'}
            aria-label={collapsed ? t('player_expand', 'Expand player') : t('player_collapse', 'Collapse player')}
            aria-expanded={!collapsed}>
            {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Ask To Signup Modal */}
      <AskToSignupModal 
        isOpen={showSignupModal && !isAuthenticated}
        onClose={dismissSignupPrompt}
      />
    </div>
  );
}
