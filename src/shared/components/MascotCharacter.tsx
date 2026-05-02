/* ============================================
   🐬 MASCOT CHARACTER — SVG mascot sống động
   Mỗi loài có chuyển động riêng để thu hút trẻ em
   ============================================ */
import { useEffect, useState } from 'react';
import { getThemeById, useTheme } from '../themes';

type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<MascotSize, number> = {
  xs: 32, sm: 48, md: 64, lg: 96, xl: 128,
};

interface MascotCharacterProps {
  size?: MascotSize;
  className?: string;
  onClick?: () => void;
  themeId?: string;
}

export function MascotCharacter({ size = 'md', className = '', onClick, themeId }: MascotCharacterProps) {
  const { theme: currentTheme } = useTheme();
  const theme = themeId ? getThemeById(themeId) : currentTheme;
  const px = sizeMap[size];
  const Mascot = mascotMap[theme.id] || DolphinMascot;
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const useAvatarImage = Boolean(theme.mascotAvatarSrc) && !avatarLoadFailed && (size === 'xs' || size === 'sm' || size === 'md');

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [theme.id, theme.mascotAvatarSrc, size]);

  if (useAvatarImage && theme.mascotAvatarSrc) {
    return (
      <span
        className={`mascot-character mascot-char-${theme.id} ${className}`}
        style={{ display: 'inline-flex', width: px, height: px, cursor: onClick ? 'pointer' : undefined }}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      >
        <img
          src={theme.mascotAvatarSrc}
          alt={theme.mascotName}
          draggable={false}
          onError={() => setAvatarLoadFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: size === 'xs' ? 'scale(1.22)' : 'scale(1.16)',
            transformOrigin: 'center',
            userSelect: 'none',
            filter: 'drop-shadow(0 8px 18px rgba(14, 165, 233, 0.22))',
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={`mascot-character mascot-char-${theme.id} ${className}`}
      style={{ display: 'inline-flex', width: px, height: px, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <Mascot size={px} color={theme.colors.primary} />
    </span>
  );
}

/* ============================================
   SVG Mascots — mỗi con có animation riêng
   ============================================ */

interface SVGMascotProps { size: number; color: string; }

/* 🐬 Cá heo Dopi — SVG chibi dễ thương */
function DolphinMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none" style={{ animation: 'dopi-swim 2.5s ease-in-out infinite' }}>
      {/* water ripple bg */}
      <circle cx="60" cy="60" r="56" fill="url(#dopiWater)" opacity="0.25" />
      {/* body */}
      <ellipse cx="60" cy="62" rx="30" ry="24" fill={color} style={{ animation: 'dopi-body 3s ease-in-out infinite' }}>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* belly */}
      <ellipse cx="60" cy="68" rx="18" ry="13" fill="#E0F2FE" />
      {/* dorsal fin */}
      <path d="M55 40 Q58 28 64 38 Q60 42 55 40Z" fill={color} opacity="0.85" />
      {/* tail */}
      <path d="M30 60 Q22 50 18 58 Q24 64 30 60Z" fill={color} opacity="0.9">
        <animateTransform attributeName="transform" type="rotate" values="0 30 60;-12 30 60;0 30 60" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* left flipper */}
      <ellipse cx="48" cy="72" rx="8" ry="4" fill={color} opacity="0.7" transform="rotate(-20 48 72)">
        <animateTransform attributeName="transform" type="rotate" values="-20 48 72;-8 48 72;-20 48 72" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* beak/snout */}
      <ellipse cx="82" cy="58" rx="12" ry="7" fill={color} />
      {/* mouth smile */}
      <path d="M80 62 Q86 66 92 62" stroke="#1E3A5F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* left eye */}
      <circle cx="72" cy="54" r="5" fill="white" />
      <circle cx="73.5" cy="53.5" r="2.8" fill="#1E293B" />
      <circle cx="74.5" cy="52" r="1" fill="white" />
      {/* blush */}
      <ellipse cx="78" cy="62" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.5" />
      {/* bubbles */}
      <circle cx="96" cy="44" r="3" fill="white" opacity="0.6">
        <animate attributeName="cy" values="44;36;44" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="50" r="2" fill="white" opacity="0.4">
        <animate attributeName="cy" values="50;40;50" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="93" cy="38" r="1.5" fill="white" opacity="0.5">
        <animate attributeName="cy" values="38;30;38" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* defs */}
      <defs>
        <radialGradient id="dopiWater" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
        <style>{`
          @keyframes dopi-body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        `}</style>
      </defs>
    </svg>
  );
}

/* 🐰 Thỏ Bông — nhảy nhảy, rung tai */
function BunnyMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
      <defs>
        <radialGradient id="bong-g" cx="50%" cy="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="110" rx="22" ry="5" fill="url(#bong-g)">
        <animate attributeName="rx" values="22;18;22" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-12;0,0" dur="0.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" />
        {/* Tai trái */}
        <ellipse cx="45" cy="22" rx="9" ry="22" fill={color}>
          <animateTransform attributeName="transform" type="rotate" values="0 45 38;-12 45 38;0 45 38" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="45" cy="22" rx="5" ry="16" fill="white" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" values="0 45 38;-12 45 38;0 45 38" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Tai phải */}
        <ellipse cx="75" cy="22" rx="9" ry="22" fill={color}>
          <animateTransform attributeName="transform" type="rotate" values="0 75 38;12 75 38;0 75 38" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="75" cy="22" rx="5" ry="16" fill="white" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" values="0 75 38;12 75 38;0 75 38" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Đầu */}
        <circle cx="60" cy="52" r="24" fill={color} />
        {/* Bụng */}
        <ellipse cx="60" cy="82" rx="20" ry="18" fill={color} />
        <ellipse cx="60" cy="84" rx="14" ry="13" fill="white" opacity="0.85" />
        {/* Chân */}
        <ellipse cx="48" cy="100" rx="10" ry="6" fill={color} />
        <ellipse cx="72" cy="100" rx="10" ry="6" fill={color} />
        {/* Tay */}
        <ellipse cx="38" cy="78" rx="6" ry="10" fill={color} transform="rotate(15 38 78)" />
        <ellipse cx="82" cy="78" rx="6" ry="10" fill={color} transform="rotate(-15 82 78)" />
        {/* Mặt */}
        <circle cx="50" cy="48" r="4" fill="white" />
        <circle cx="70" cy="48" r="4" fill="white" />
        <circle cx="51" cy="47" r="2.5" fill="#1a1a2e" />
        <circle cx="71" cy="47" r="2.5" fill="#1a1a2e" />
        <circle cx="52" cy="46" r="0.8" fill="white" />
        <circle cx="72" cy="46" r="0.8" fill="white" />
        {/* Mũi + miệng */}
        <ellipse cx="60" cy="55" rx="3" ry="2" fill="#FF8FA3" />
        <path d="M57 58 Q60 62 63 58" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Má hồng */}
        <circle cx="43" cy="55" r="5" fill="#FF8FA3" opacity="0.3" />
        <circle cx="77" cy="55" r="5" fill="#FF8FA3" opacity="0.3" />
        {/* Đuôi tròn */}
        <circle cx="60" cy="100" r="5" fill="white" opacity="0.9" />
      </g>
    </svg>
  );
}

/* 🐻 Gấu Mochi — lắc lư, vỗ tay */
function BearMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
      <ellipse cx="60" cy="112" rx="28" ry="5" fill={color} opacity="0.15" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-3 60 70;3 60 70;-3 60 70" dur="2s" repeatCount="indefinite" />
        {/* Tai */}
        <circle cx="38" cy="28" r="12" fill={color} />
        <circle cx="38" cy="28" r="7" fill="white" opacity="0.4" />
        <circle cx="82" cy="28" r="12" fill={color} />
        <circle cx="82" cy="28" r="7" fill="white" opacity="0.4" />
        {/* Đầu */}
        <circle cx="60" cy="46" r="26" fill={color} />
        {/* Mặt sáng */}
        <ellipse cx="60" cy="50" rx="18" ry="16" fill="white" opacity="0.15" />
        {/* Thân */}
        <ellipse cx="60" cy="84" rx="24" ry="22" fill={color} />
        <ellipse cx="60" cy="86" rx="16" ry="15" fill="white" opacity="0.7" />
        {/* Chân */}
        <ellipse cx="46" cy="104" rx="10" ry="7" fill={color} />
        <ellipse cx="74" cy="104" rx="10" ry="7" fill={color} />
        {/* Tay — vỗ */}
        <ellipse cx="34" cy="78" rx="8" ry="12" fill={color} transform="rotate(20 34 78)">
          <animateTransform attributeName="transform" type="rotate" values="20 34 78;-10 34 78;20 34 78" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="86" cy="78" rx="8" ry="12" fill={color} transform="rotate(-20 86 78)">
          <animateTransform attributeName="transform" type="rotate" values="-20 86 78;10 86 78;-20 86 78" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Mắt */}
        <circle cx="50" cy="42" r="4" fill="white" />
        <circle cx="70" cy="42" r="4" fill="white" />
        <circle cx="51" cy="41" r="2.5" fill="#1a1a2e" />
        <circle cx="71" cy="41" r="2.5" fill="#1a1a2e" />
        <circle cx="52" cy="40" r="0.8" fill="white" />
        <circle cx="72" cy="40" r="0.8" fill="white" />
        {/* Mũi */}
        <ellipse cx="60" cy="50" rx="5" ry="3.5" fill="#8B6E5C" />
        <ellipse cx="60" cy="49" rx="2" ry="1" fill="white" opacity="0.5" />
        {/* Miệng */}
        <path d="M56 54 Q60 58 64 54" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Má hồng */}
        <circle cx="42" cy="50" r="5" fill="#FF8FA3" opacity="0.25" />
        <circle cx="78" cy="50" r="5" fill="#FF8FA3" opacity="0.25" />
      </g>
    </svg>
  );
}

/* 🐱 Mèo Miu — vẫy đuôi, nháy mắt */
function CatMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
      <ellipse cx="60" cy="112" rx="24" ry="4" fill={color} opacity="0.15" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="3s" repeatCount="indefinite" />
        {/* Đuôi */}
        <path d="M82 90 Q100 80 105 60 Q108 50 100 48" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="rotate" values="0 82 90;-15 82 90;0 82 90;15 82 90;0 82 90" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Tai trái */}
        <path d="M38 35 L30 12 L50 28Z" fill={color} />
        <path d="M40 33 L34 16 L48 28Z" fill="white" opacity="0.4" />
        {/* Tai phải */}
        <path d="M82 35 L90 12 L70 28Z" fill={color} />
        <path d="M80 33 L86 16 L72 28Z" fill="white" opacity="0.4" />
        {/* Đầu */}
        <circle cx="60" cy="46" r="26" fill={color} />
        {/* Thân */}
        <ellipse cx="60" cy="82" rx="22" ry="20" fill={color} />
        <ellipse cx="60" cy="84" rx="15" ry="14" fill="white" opacity="0.8" />
        {/* Chân */}
        <ellipse cx="46" cy="102" rx="8" ry="6" fill={color} />
        <ellipse cx="74" cy="102" rx="8" ry="6" fill={color} />
        {/* Tay */}
        <ellipse cx="36" cy="78" rx="6" ry="10" fill={color} transform="rotate(10 36 78)" />
        <ellipse cx="84" cy="78" rx="6" ry="10" fill={color} transform="rotate(-10 84 78)" />
        {/* Mắt — nháy */}
        <g>
          <circle cx="50" cy="42" r="5" fill="white" />
          <circle cx="51" cy="41" r="3" fill="#1a1a2e" />
          <circle cx="52" cy="40" r="1" fill="white" />
        </g>
        <g>
          <circle cx="70" cy="42" r="5" fill="white">
            <animate attributeName="ry" values="5;0.5;5" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;1" />
          </circle>
          <circle cx="71" cy="41" r="3" fill="#1a1a2e">
            <animate attributeName="ry" values="3;0.3;3" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;1" />
          </circle>
          <circle cx="72" cy="40" r="1" fill="white">
            <animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite" keyTimes="0;0.05;1" />
          </circle>
        </g>
        {/* Mũi */}
        <ellipse cx="60" cy="50" rx="3" ry="2" fill="#FF8FA3" />
        {/* Ria mép */}
        <line x1="40" y1="48" x2="28" y2="44" stroke="#1a1a2e" strokeWidth="1" opacity="0.4" />
        <line x1="40" y1="52" x2="28" y2="52" stroke="#1a1a2e" strokeWidth="1" opacity="0.4" />
        <line x1="80" y1="48" x2="92" y2="44" stroke="#1a1a2e" strokeWidth="1" opacity="0.4" />
        <line x1="80" y1="52" x2="92" y2="52" stroke="#1a1a2e" strokeWidth="1" opacity="0.4" />
        {/* Miệng */}
        <path d="M56 54 Q60 58 64 54" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Má */}
        <circle cx="42" cy="52" r="5" fill="#FF8FA3" opacity="0.25" />
        <circle cx="78" cy="52" r="5" fill="#FF8FA3" opacity="0.25" />
      </g>
    </svg>
  );
}

/* 🦉 Cú Zizi — xoay đầu, mắt to nhấp nháy */
function OwlMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
      <ellipse cx="60" cy="112" rx="20" ry="4" fill={color} opacity="0.15" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="2.5s" repeatCount="indefinite" />
        {/* Cánh trái */}
        <ellipse cx="30" cy="72" rx="12" ry="22" fill={color} transform="rotate(15 30 72)">
          <animateTransform attributeName="transform" type="rotate" values="15 30 72;-10 30 72;15 30 72" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Cánh phải */}
        <ellipse cx="90" cy="72" rx="12" ry="22" fill={color} transform="rotate(-15 90 72)">
          <animateTransform attributeName="transform" type="rotate" values="-15 90 72;10 90 72;-15 90 72" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Thân */}
        <ellipse cx="60" cy="78" rx="24" ry="28" fill={color} />
        <ellipse cx="60" cy="82" rx="16" ry="20" fill="white" opacity="0.7" />
        {/* Đầu */}
        <circle cx="60" cy="44" r="26" fill={color} />
        {/* Sừng tai */}
        <path d="M38 24 L30 6 L44 22Z" fill={color} />
        <path d="M82 24 L90 6 L76 22Z" fill={color} />
        {/* Vành mắt */}
        <circle cx="48" cy="44" r="14" fill="white" />
        <circle cx="72" cy="44" r="14" fill="white" />
        {/* Mắt to — xoay nhìn */}
        <g>
          <circle cx="48" cy="44" r="8" fill="#1a1a2e">
            <animate attributeName="cx" values="48;50;48;46;48" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="48" cy="42" r="2.5" fill="white">
            <animate attributeName="cx" values="48;50;48;46;48" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
        <g>
          <circle cx="72" cy="44" r="8" fill="#1a1a2e">
            <animate attributeName="cx" values="72;74;72;70;72" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="72" cy="42" r="2.5" fill="white">
            <animate attributeName="cx" values="72;74;72;70;72" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Mỏ */}
        <path d="M56 52 L60 60 L64 52Z" fill="#F59E0B" />
        {/* Chân */}
        <g transform="translate(0,0)">
          <path d="M48 104 L44 112 L48 110 L52 112 L48 104Z" fill="#F59E0B" />
          <path d="M72 104 L68 112 L72 110 L76 112 L72 104Z" fill="#F59E0B" />
        </g>
        {/* Lông ngực pattern */}
        <path d="M52 72 Q56 68 60 72 Q64 68 68 72" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M50 78 Q55 74 60 78 Q65 74 70 78" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}

/* 🐶 Chó Lucky — vẫy đuôi, thè lưỡi */
function DogMascot({ size, color }: SVGMascotProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
      <ellipse cx="60" cy="112" rx="24" ry="4" fill={color} opacity="0.15" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.5s" repeatCount="indefinite" />
        {/* Đuôi vẫy */}
        <path d="M84 82 Q95 68 100 52 Q102 46 96 48" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="rotate" values="-15 84 82;20 84 82;-15 84 82" dur="0.5s" repeatCount="indefinite" />
        </path>
        {/* Tai trái — rủ */}
        <ellipse cx="36" cy="36" rx="10" ry="18" fill={color} transform="rotate(20 36 36)">
          <animateTransform attributeName="transform" type="rotate" values="20 36 36;25 36 36;20 36 36" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Tai phải — rủ */}
        <ellipse cx="84" cy="36" rx="10" ry="18" fill={color} transform="rotate(-20 84 36)">
          <animateTransform attributeName="transform" type="rotate" values="-20 84 36;-25 84 36;-20 84 36" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Đầu */}
        <circle cx="60" cy="44" r="26" fill={color} />
        {/* Mặt sáng */}
        <ellipse cx="60" cy="52" rx="16" ry="14" fill="white" opacity="0.2" />
        {/* Thân */}
        <ellipse cx="60" cy="82" rx="22" ry="20" fill={color} />
        <ellipse cx="60" cy="84" rx="14" ry="14" fill="white" opacity="0.7" />
        {/* Chân */}
        <ellipse cx="46" cy="102" rx="8" ry="7" fill={color} />
        <ellipse cx="74" cy="102" rx="8" ry="7" fill={color} />
        {/* Tay */}
        <ellipse cx="36" cy="78" rx="7" ry="11" fill={color} transform="rotate(10 36 78)" />
        <ellipse cx="84" cy="78" rx="7" ry="11" fill={color} transform="rotate(-10 84 78)" />
        {/* Mắt */}
        <circle cx="50" cy="40" r="5" fill="white" />
        <circle cx="70" cy="40" r="5" fill="white" />
        <circle cx="51" cy="39" r="3" fill="#1a1a2e" />
        <circle cx="71" cy="39" r="3" fill="#1a1a2e" />
        <circle cx="52" cy="38" r="1" fill="white" />
        <circle cx="72" cy="38" r="1" fill="white" />
        {/* Mũi */}
        <ellipse cx="60" cy="50" rx="5" ry="3.5" fill="#1a1a2e" />
        <ellipse cx="60" cy="49" rx="2" ry="1" fill="white" opacity="0.5" />
        {/* Miệng + lưỡi thè */}
        <path d="M54 54 Q60 60 66 54" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <ellipse cx="60" cy="59" rx="5" ry="6" fill="#FF6B8A">
          <animate attributeName="ry" values="6;7;6" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Má hồng */}
        <circle cx="40" cy="48" r="5" fill="#FF8FA3" opacity="0.25" />
        <circle cx="80" cy="48" r="5" fill="#FF8FA3" opacity="0.25" />
        {/* Vòng cổ */}
        <ellipse cx="60" cy="64" rx="18" ry="3" fill="#EF4444" opacity="0.8" />
        <circle cx="60" cy="67" r="3" fill="#FBBF24" />
      </g>
    </svg>
  );
}

/* Map theme id → SVG component */
const mascotMap: Record<string, React.ComponentType<SVGMascotProps>> = {
  ocean: DolphinMascot,
  garden: BunnyMascot,
  forest: BearMascot,
  sunset: CatMascot,
  galaxy: OwlMascot,
  sunny: DogMascot,
};

/* ============================================
   AllMascotsParade — Showcase toàn bộ 6 nhân vật
   ============================================ */
const MASCOT_PARADE_DATA = [
  { id: 'ocean',  color: '#0EA5E9', name: 'Dopi',  Mascot: DolphinMascot },
  { id: 'garden', color: '#EC4899', name: 'Bông',  Mascot: BunnyMascot   },
  { id: 'forest', color: '#22C55E', name: 'Mochi', Mascot: BearMascot    },
  { id: 'sunset', color: '#F97316', name: 'Miu',   Mascot: CatMascot     },
  { id: 'galaxy', color: '#8B5CF6', name: 'Zizi',  Mascot: OwlMascot     },
  { id: 'sunny',  color: '#EAB308', name: 'Lucky', Mascot: DogMascot     },
] as const;

/** Hiển thị 6 nhân vật mascot cùng lúc, mỗi con tự chạy animation riêng. */
export function AllMascotsParade({ size = 96 }: { size?: number }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 md:gap-7">
      {MASCOT_PARADE_DATA.map(({ id, color, name, Mascot }) => (
        <div key={id} className="flex flex-col items-center gap-2">
          <span style={{ display: 'inline-flex', width: size, height: size }}>
            <Mascot size={size} color={color} />
          </span>
          <span
            className="text-[13px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              color,
              background: `${color}22`,
              border: `1px solid ${color}55`,
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
