import React from 'react';

/**
 * Candy House Fairytale Vector Illustration
 */
export const CandyHouseBackground: React.FC<{
  className?: string;
  dimmed?: boolean;
}> = ({ className = '', dimmed = false }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${dimmed ? 'opacity-40 filter blur-xs' : 'opacity-100'} ${className}`}>
      <svg
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="40%" stopColor="#fdba74" />
            <stop offset="85%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <linearGradient id="gingerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="waferRoof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <pattern id="waferGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <rect x="2" y="2" width="16" height="16" fill="#d97706" opacity="0.6" />
          </pattern>

          <linearGradient id="caneStripe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#ef4444" />
            <stop offset="25.1%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="50.1%" stopColor="#ef4444" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="75.1%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1200" height="675" fill="url(#skyGrad)" />

        {/* Candy clouds */}
        <g opacity="0.85" className="animate-float-slow">
          <ellipse cx="220" cy="110" rx="90" ry="36" fill="#fdf2f8" />
          <ellipse cx="270" cy="95" rx="60" ry="40" fill="#fce7f3" />
          <ellipse cx="170" cy="115" rx="55" ry="30" fill="#fce7f3" />

          <ellipse cx="980" cy="130" rx="110" ry="40" fill="#fdf2f8" />
          <ellipse cx="930" cy="110" rx="70" ry="45" fill="#fce7f3" />
          <ellipse cx="1040" cy="135" rx="60" ry="32" fill="#fce7f3" />
        </g>

        {/* Candy Sun / Giant Peppermint Swirl in sky */}
        <g transform="translate(1080, 80)">
          <circle r="46" fill="#fef08a" filter="url(#softGlow)" />
          <circle r="40" fill="#fef08a" />
          <circle r="36" fill="#fde047" stroke="#f59e0b" strokeWidth="3" />
          {/* Swirl rays */}
          <path d="M0,0 Q20,-30 40,-10 Q20,10 0,0" fill="#fb923c" opacity="0.4" />
          <path d="M0,0 Q-30,-20 -10,-40 Q10,-20 0,0" fill="#fb923c" opacity="0.4" />
          <path d="M0,0 Q-20,30 -40,10 Q-20,-10 0,0" fill="#fb923c" opacity="0.4" />
        </g>

        {/* Distant Hills */}
        <path d="M-50,480 Q250,330 600,420 T1250,360 L1250,675 L-50,675 Z" fill="url(#hillGrad2)" opacity="0.9" />
        <path d="M-50,420 Q300,280 750,370 T1250,320 L1250,675 L-50,675 Z" fill="url(#hillGrad1)" opacity="0.75" />

        {/* Background Candy Trees */}
        <g id="candy-trees">
          {/* Lollipop trees left */}
          <rect x="90" y="300" width="12" height="150" fill="#fef08a" rx="4" />
          <circle cx="96" cy="270" r="48" fill="#f43f5e" />
          <circle cx="96" cy="270" r="36" fill="#fb7185" />
          <circle cx="96" cy="270" r="24" fill="#fda4af" />
          <circle cx="96" cy="270" r="12" fill="#fff1f2" />

          <rect x="180" y="340" width="10" height="120" fill="#fef08a" rx="4" />
          <circle cx="185" cy="310" r="36" fill="#06b6d4" />
          <circle cx="185" cy="310" r="26" fill="#38bdf8" />
          <circle cx="185" cy="310" r="16" fill="#7dd3fc" />

          {/* Lollipop trees right */}
          <rect x="1020" y="320" width="12" height="140" fill="#fef08a" rx="4" />
          <circle cx="1026" cy="290" r="44" fill="#a855f7" />
          <circle cx="1026" cy="290" r="32" fill="#c084fc" />
          <circle cx="1026" cy="290" r="18" fill="#e9d5ff" />

          <rect x="1110" y="350" width="10" height="110" fill="#fef08a" rx="4" />
          <circle cx="1115" cy="330" r="34" fill="#10b981" />
          <circle cx="1115" cy="330" r="22" fill="#34d399" />
        </g>

        {/* Foreground Meadow */}
        <path d="M-20,490 Q350,440 600,480 T1220,460 L1220,675 L-20,675 Z" fill="#16a34a" />

        {/* Sugar Biscuit Cobblestone Path */}
        <path d="M600,490 C580,530 520,580 440,675 L760,675 C680,580 620,530 600,490 Z" fill="#fed7aa" stroke="#fb923c" strokeWidth="4" />
        {/* Candy sprinkles on path */}
        <circle cx="560" cy="540" r="6" fill="#ec4899" />
        <circle cx="630" cy="560" r="7" fill="#3b82f6" />
        <circle cx="510" cy="610" r="8" fill="#eab308" />
        <circle cx="670" cy="620" r="7" fill="#10b981" />
        <circle cx="590" cy="640" r="9" fill="#a855f7" />

        {/* THE GINGERBREAD CANDY HOUSE */}
        <g id="gingerbread-house" transform="translate(360, 210)">
          {/* Chimney */}
          <rect x="360" y="20" width="55" height="110" fill="#7c2d12" stroke="#451a03" strokeWidth="4" rx="6" />
          <ellipse cx="387" cy="20" rx="30" ry="10" fill="#f8fafc" />
          {/* Candy smoke puffs */}
          <circle cx="395" cy="-10" r="14" fill="#fdf2f8" opacity="0.8" />
          <circle cx="410" cy="-35" r="20" fill="#fce7f3" opacity="0.7" />
          <circle cx="430" cy="-65" r="26" fill="#fbcfe8" opacity="0.6" />

          {/* Main House Box */}
          <rect x="60" y="110" width="360" height="210" fill="url(#gingerGrad)" stroke="#451a03" strokeWidth="6" rx="16" />

          {/* Candy cane corner pillars */}
          <g>
            <rect x="52" y="105" width="22" height="215" fill="url(#caneStripe)" rx="10" stroke="#7f1d1d" strokeWidth="2" />
            <rect x="406" y="105" width="22" height="215" fill="url(#caneStripe)" rx="10" stroke="#7f1d1d" strokeWidth="2" />
          </g>

          {/* Wafer Roof */}
          <polygon points="240,10 20,135 460,135" fill="url(#waferGrid)" stroke="#451a03" strokeWidth="6" />

          {/* Frosting / Royal Icing Drips along Roof edge */}
          <path
            d="M15,135 
               Q30,155 45,135 
               Q65,165 85,135 
               Q110,160 135,135 
               Q160,170 185,135 
               Q210,165 240,135 
               Q265,170 295,135 
               Q325,160 355,135 
               Q380,168 405,135 
               Q435,160 465,135 
               L465,130 L15,130 Z"
            fill="#ffffff"
            filter="drop-shadow(0 3px 2px rgba(0,0,0,0.15))"
          />

          {/* Roof Candy Topper */}
          <circle cx="240" cy="14" r="22" fill="#ef4444" stroke="#ffffff" strokeWidth="4" />
          <circle cx="240" cy="14" r="14" fill="#dc2626" />

          {/* Attic Window - Peppermint swirl */}
          <circle cx="240" cy="85" r="30" fill="#ffffff" stroke="#e11d48" strokeWidth="6" />
          <circle cx="240" cy="85" r="22" fill="#fef08a" />
          <line x1="240" y1="55" x2="240" y2="115" stroke="#e11d48" strokeWidth="4" />
          <line x1="210" y1="85" x2="270" y2="85" stroke="#e11d48" strokeWidth="4" />

          {/* Gingerbread Door */}
          <rect x="195" y="210" width="90" height="110" rx="45" fill="#451a03" stroke="#fed7aa" strokeWidth="5" />
          <rect x="205" y="225" width="70" height="95" rx="35" fill="#78350f" />
          {/* Wafer Door handle */}
          <circle cx="260" cy="275" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          {/* Door icing garland */}
          <path d="M205,240 Q240,260 275,240" fill="none" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />

          {/* Windows (Left and Right) */}
          {/* Left Window */}
          <rect x="100" y="165" width="65" height="75" rx="14" fill="#fef08a" stroke="#ffffff" strokeWidth="5" />
          <line x1="132" y1="165" x2="132" y2="240" stroke="#f59e0b" strokeWidth="3" />
          <line x1="100" y1="202" x2="165" y2="202" stroke="#f59e0b" strokeWidth="3" />
          {/* Window Icing awning */}
          <ellipse cx="132" cy="165" rx="36" ry="10" fill="#f43f5e" />

          {/* Right Window */}
          <rect x="315" y="165" width="65" height="75" rx="14" fill="#fef08a" stroke="#ffffff" strokeWidth="5" />
          <line x1="347" y1="165" x2="347" y2="240" stroke="#f59e0b" strokeWidth="3" />
          <line x1="315" y1="202" x2="380" y2="202" stroke="#f59e0b" strokeWidth="3" />
          <ellipse cx="347" cy="165" rx="36" ry="10" fill="#06b6d4" />
        </g>

        {/* Gumdrop bushes in front of house */}
        <g id="gumdrops">
          {/* Left bushes */}
          <path d="M300,530 C300,470 360,470 360,530 Z" fill="#ec4899" stroke="#be185d" strokeWidth="3" />
          <path d="M250,545 C250,495 300,495 300,545 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <path d="M330,550 C330,505 380,505 380,550 Z" fill="#10b981" stroke="#047857" strokeWidth="3" />

          {/* Right bushes */}
          <path d="M840,530 C840,470 900,470 900,530 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
          <path d="M890,545 C890,495 940,495 940,545 Z" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
          <path d="M810,550 C810,505 860,505 860,550 Z" fill="#ec4899" stroke="#be185d" strokeWidth="3" />
        </g>

        {/* Huge Candy Canes Framing foreground */}
        <g transform="translate(140, 420) rotate(-15)">
          <path d="M0,180 L0,40 C0,-10 50,-10 50,25" fill="none" stroke="url(#caneStripe)" strokeWidth="24" strokeLinecap="round" />
        </g>
        <g transform="translate(1040, 420) rotate(15) scale(-1, 1)">
          <path d="M0,180 L0,40 C0,-10 50,-10 50,25" fill="none" stroke="url(#caneStripe)" strokeWidth="24" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Rusty Iron Gate at Night with Hansel & Gretel Illustration
 */
export const IronGateNightBackground: React.FC<{
  className?: string;
  dimmed?: boolean;
  /** 'accepted'/'closed' = chained shut, 'chain-fall' = chain drops to the ground,
   *  'open' = both gate leaves swing aside, 'children-run' = kids happily run out */
  stage?: 'accepted' | 'closed' | 'chain-fall' | 'open' | 'children-run';
}> = ({ className = '', dimmed = false, stage = 'closed' }) => {
  const gateOpen = stage === 'open' || stage === 'children-run';
  const chainClass =
    stage === 'chain-fall' ? 'gate-chain-falling' : gateOpen ? 'gate-chain-fallen' : '';
  const leftGateClass = gateOpen ? 'gate-left-opening' : '';
  const rightGateClass = gateOpen ? 'gate-right-opening' : '';
  const childrenClass = stage === 'children-run' ? 'children-escape' : '';

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${dimmed ? 'opacity-40 filter blur-xs' : 'opacity-100'} ${className}`}>
      <svg
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#090a1a" />
            <stop offset="40%" stopColor="#1e1b4b" />
            <stop offset="85%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="ironRust" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#475569" />
            <stop offset="60%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Night Sky */}
        <rect width="1200" height="675" fill="url(#nightSky)" />

        {/* Twinkling Stars */}
        <g fill="#ffffff" opacity="0.9">
          <circle cx="150" cy="80" r="2.5" />
          <circle cx="280" cy="120" r="1.5" />
          <circle cx="410" cy="70" r="2" />
          <circle cx="560" cy="95" r="3" />
          <circle cx="680" cy="60" r="1.5" />
          <circle cx="820" cy="110" r="2.5" />
          <circle cx="950" cy="75" r="2" />
          <circle cx="1100" cy="130" r="2.5" />
          <polygon points="560,90 562,95 567,97 562,99 560,104 558,99 553,97 558,95" fill="#fef08a" />
          <polygon points="820,105 822,110 827,112 822,114 820,119 818,114 813,112 818,110" fill="#fef08a" />
        </g>

        {/* Crescent Moon */}
        <g transform="translate(1000, 100)">
          <circle cx="0" cy="0" r="48" fill="#fef08a" filter="url(#moonGlow)" opacity="0.7" />
          <circle cx="0" cy="0" r="42" fill="#fef08a" />
          <circle cx="-16" cy="-8" r="38" fill="#1e1b4b" />
        </g>

        {/* Spooky Silhouette Trees */}
        <g fill="#0f172a" opacity="0.95">
          <path d="M-30,675 L-30,300 Q40,320 80,450 Q110,340 140,430 L160,675 Z" />
          <path d="M1060,675 L1080,320 Q1120,310 1150,420 Q1180,330 1220,380 L1240,675 Z" />
        </g>

        {/* Distant Candy Witch Cottage with glowing eerie windows */}
        <g transform="translate(520, 240) scale(0.65)" opacity="0.75">
          <polygon points="120,20 20,90 220,90" fill="#3b0764" />
          <rect x="40" y="90" width="160" height="90" fill="#1e1b4b" />
          <rect x="90" y="110" width="45" height="50" rx="8" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
        </g>

        {/* Night Mist Ground */}
        <rect x="0" y="440" width="1200" height="235" fill="url(#mistGrad)" />
        <ellipse cx="600" cy="620" rx="650" ry="120" fill="#090d16" />

        {/* THE TWO CHILDREN: HANSEL & GRETEL BEHIND BARS */}
        <g id="children-behind-bars" className={childrenClass} transform="translate(460, 290)">
          {/* Halloween bats fluttering out with the escaping children */}
          {stage === 'children-run' && (
            <g id="halloween-bats">
              {[
                { x: -150, y: 20, s: 1.3, dir: 'l', dur: '2.2s', delay: '0s' },
                { x: -195, y: 115, s: 0.9, dir: 'l', dur: '2.4s', delay: '0.3s' },
                { x: 335, y: 30, s: 1.2, dir: 'r', dur: '2.3s', delay: '0.15s' },
                { x: 385, y: 125, s: 0.85, dir: 'r', dur: '2.5s', delay: '0.45s' }
              ].map((b, i) => (
                <g
                  key={i}
                  className={b.dir === 'l' ? 'bat-drift-l' : 'bat-drift-r'}
                  style={{ animationDuration: b.dur, animationDelay: b.delay }}
                >
                  <g transform={`translate(${b.x},${b.y}) scale(${b.s})`}>
                    <g className="bat-flap" style={{ transformOrigin: '16px 4px' }} fill="#3b3663" stroke="#1e1b4b" strokeWidth="0.8">
                      {/* Wings */}
                      <path d="M16,5 C13,0 8,-3 1,0 C5,2 6,6 3,10 C9,6 13,8 15,11 C15.4,8 16,7 16,5 Z" />
                      <path d="M16,5 C19,0 24,-3 31,0 C27,2 26,6 29,10 C23,6 19,8 17,11 C16.6,8 16,7 16,5 Z" />
                      {/* Body + ears */}
                      <ellipse cx="16" cy="7" rx="3.2" ry="4.2" />
                      <path d="M13.5,3.5 L14,0.2 L15.3,3.2 Z" />
                      <path d="M16.7,3.2 L18,0.2 L18.5,3.5 Z" />
                      {/* Glowing pumpkin-orange eyes */}
                      <circle cx="14.7" cy="6" r="0.8" fill="#f97316" stroke="none" />
                      <circle cx="17.3" cy="6" r="0.8" fill="#f97316" stroke="none" />
                    </g>
                  </g>
                </g>
              ))}
            </g>
          )}

          {/* Subtle lantern glow on their faces */}
          <ellipse cx="140" cy="110" rx="140" ry="90" fill="#fbbf24" opacity="0.15" filter="url(#moonGlow)" />

          {/* Hansel (Left Boy) */}
          <g id="hansel" transform="translate(40, 20)">
          {/* Body / Shirt */}
          <rect x="18" y="70" width="48" height="60" rx="8" fill="#0284c7" />
          {/* Legs */}
          <line x1="30" y1="128" x2="28" y2="152" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
          <line x1="54" y1="128" x2="56" y2="152" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="26" cy="155" rx="9" ry="5" fill="#1e293b" />
          <ellipse cx="58" cy="155" rx="9" ry="5" fill="#1e293b" />
            {/* Suspenders */}
            <rect x="24" y="70" width="6" height="60" fill="#78350f" />
            <rect x="54" y="70" width="6" height="60" fill="#78350f" />

            {/* Head */}
            <circle cx="42" cy="42" r="28" fill="#fed7aa" />
            {/* Cheeks */}
            <ellipse cx="28" cy="48" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="56" cy="48" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
            {/* Eyes (big expressive cartoon eyes looking out) */}
            <ellipse cx="34" cy="38" rx="6" ry="8" fill="#ffffff" />
            <circle cx="34" cy="38" r="4" fill="#1e293b" />
            <circle cx="36" cy="35" r="1.5" fill="#ffffff" />

            <ellipse cx="50" cy="38" rx="6" ry="8" fill="#ffffff" />
            <circle cx="50" cy="38" r="4" fill="#1e293b" />
            <circle cx="52" cy="35" r="1.5" fill="#ffffff" />

            {/* Eyebrows (worried / hopeful) */}
            <path d="M28,28 Q34,25 38,28" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M46,28 Q50,25 56,28" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

            {/* Mouth */}
            <path d="M38,53 Q42,56 46,53" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />

            {/* Brown Hair & Bavarian Cap */}
            <path d="M16,36 C16,14 68,14 68,36 Z" fill="#92400e" />
            <path d="M20,24 Q42,10 64,24 L56,12 Q42,4 28,12 Z" fill="#15803d" />
            {/* Feather in cap */}
            <path d="M54,12 Q65,-4 62,-10 Q58,-4 54,12" fill="#ef4444" />

            {/* Hands clutching iron bars */}
            <circle cx="10" cy="88" r="7" fill="#fed7aa" />
            <circle cx="74" cy="88" r="7" fill="#fed7aa" />
          </g>

          {/* GRETEL (Right Girl) */}
          <g id="gretel" transform="translate(150, 24)">
            {/* Dress */}
            <polygon points="42,70 12,130 72,130" fill="#e11d48" />
            {/* Legs */}
            <line x1="30" y1="128" x2="29" y2="148" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <line x1="52" y1="128" x2="54" y2="148" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            {/* Shoes */}
            <ellipse cx="28" cy="151" rx="7" ry="4" fill="#9f1239" />
            <ellipse cx="56" cy="151" rx="7" ry="4" fill="#9f1239" />
            {/* White Apron */}
            <polygon points="42,75 24,130 60,130" fill="#f8fafc" />

            {/* Head */}
            <circle cx="42" cy="40" r="26" fill="#fed7aa" />
            {/* Cheeks */}
            <ellipse cx="29" cy="46" rx="5" ry="3" fill="#f43f5e" opacity="0.45" />
            <ellipse cx="55" cy="46" rx="5" ry="3" fill="#f43f5e" opacity="0.45" />

            {/* Big cute cartoon eyes */}
            <ellipse cx="34" cy="37" rx="6" ry="8" fill="#ffffff" />
            <circle cx="34" cy="37" r="4" fill="#047857" />
            <circle cx="36" cy="35" r="1.5" fill="#ffffff" />

            <ellipse cx="50" cy="37" rx="6" ry="8" fill="#ffffff" />
            <circle cx="50" cy="37" r="4" fill="#047857" />
            <circle cx="52" cy="35" r="1.5" fill="#ffffff" />

            {/* Eyebrows */}
            <path d="M29,28 Q34,25 38,28" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M46,28 Q50,25 55,28" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />

            {/* Smile / hope */}
            <path d="M38,51 Q42,55 46,51" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />

            {/* Blonde Braids Hair with Pink Bows */}
            <path d="M16,36 C16,14 68,14 68,36 Z" fill="#facc15" />
            {/* Braids hanging down */}
            <circle cx="16" cy="46" r="6" fill="#facc15" />
            <circle cx="14" cy="56" r="5" fill="#facc15" />
            <circle cx="12" cy="66" r="4" fill="#facc15" />
            <circle cx="68" cy="46" r="6" fill="#facc15" />
            <circle cx="70" cy="56" r="5" fill="#facc15" />
            <circle cx="72" cy="66" r="4" fill="#facc15" />
            {/* Pink Bow on top */}
            <ellipse cx="36" cy="16" rx="6" ry="4" fill="#ec4899" />
            <ellipse cx="48" cy="16" rx="6" ry="4" fill="#ec4899" />
            <circle cx="42" cy="16" r="3" fill="#be185d" />

            {/* Hands clutching iron bars */}
            <circle cx="12" cy="88" r="7" fill="#fed7aa" />
            <circle cx="72" cy="88" r="7" fill="#fed7aa" />
          </g>
        </g>

        {/* WROUGHT IRON GATE (IN FOREGROUND IN FRONT OF CHILDREN) */}
        <g id="wrought-iron-gate">
          {/* Gate Pillars (static) */}
          <rect x="220" y="160" width="45" height="480" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="4" rx="4" />
          <polygon points="215,160 242,110 270,160" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="242" cy="110" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />

          <rect x="935" y="160" width="45" height="480" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="4" rx="4" />
          <polygon points="930,160 957,110 985,160" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="957" cy="110" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />

          {/* LEFT GATE LEAF */}
          <g id="gate-leaf-left" className={leftGateClass}>
            <rect x="240" y="220" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            <rect x="240" y="440" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            <rect x="240" y="600" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            {[290, 345, 400, 455, 510, 565].map((x) => (
              <g key={`l-${x}`}>
                <rect x={x - 6} y="190" width="12" height="430" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="2.5" rx="3" />
                <polygon points={`${x - 10},190 ${x},140 ${x + 10},190`} fill="#475569" stroke="#0f172a" strokeWidth="2" />
              </g>
            ))}
            {/* Central Gate Join Bar */}
            <rect x="590" y="180" width="20" height="440" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          </g>

          {/* RIGHT GATE LEAF */}
          <g id="gate-leaf-right" className={rightGateClass}>
            <rect x="607" y="220" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            <rect x="607" y="440" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            <rect x="607" y="600" width="353" height="18" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="3" rx="4" />
            {[620, 675, 730, 785, 840, 895].map((x) => (
              <g key={`r-${x}`}>
                <rect x={x - 6} y="190" width="12" height="430" fill="url(#ironRust)" stroke="#0f172a" strokeWidth="2.5" rx="3" />
                <polygon points={`${x - 10},190 ${x},140 ${x + 10},190`} fill="#475569" stroke="#0f172a" strokeWidth="2" />
              </g>
            ))}
          </g>

          {/* Heavy Linked Chains wrapped around gate center */}
          <g id="gate-chains" className={chainClass} transform="translate(600, 390)">
            <ellipse cx="-45" cy="0" rx="30" ry="16" fill="none" stroke="#94a3b8" strokeWidth="9" />
            <ellipse cx="-20" cy="5" rx="26" ry="14" fill="none" stroke="#64748b" strokeWidth="8" />
            <ellipse cx="10" cy="-5" rx="28" ry="15" fill="none" stroke="#94a3b8" strokeWidth="9" />
            <ellipse cx="40" cy="2" rx="30" ry="16" fill="none" stroke="#64748b" strokeWidth="8" />
          </g>
        </g>

        {/* Fireflies — slow lazy drift, scattered all across the night scene */}
        <g fill="#fef08a">
          {[
            { x: 150, y: 240, r: 3.5, dur: '7s', delay: '0s' },
            { x: 330, y: 430, r: 4, dur: '9s', delay: '1.5s' },
            { x: 520, y: 250, r: 3, dur: '8s', delay: '3s' },
            { x: 700, y: 500, r: 4.5, dur: '10s', delay: '0.8s' },
            { x: 880, y: 270, r: 3.5, dur: '7.5s', delay: '2.2s' },
            { x: 1060, y: 430, r: 4, dur: '9.5s', delay: '4s' },
            { x: 620, y: 570, r: 3, dur: '8.5s', delay: '5s' },
            { x: 240, y: 560, r: 3.5, dur: '11s', delay: '6s' },
            { x: 980, y: 580, r: 3, dur: '9s', delay: '3.5s' }
          ].map((f, i) => (
            <circle
              key={i}
              cx={f.x}
              cy={f.y}
              r={f.r}
              filter="url(#moonGlow)"
              className="firefly"
              style={{ animationDuration: f.dur, animationDelay: f.delay }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

/**
 * Forest Escape Victory Illustration (Panel 8)
 */
export const ForestEscapeBackground: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="35%" stopColor="#3730a3" />
            <stop offset="70%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <radialGradient id="goldenFreedomGaze" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3730a3" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="675" fill="url(#winSky)" />

        {/* Radiant freedom glow in center path */}
        <ellipse cx="600" cy="400" rx="500" ry="320" fill="url(#goldenFreedomGaze)" />

        {/* Moonlit enchanted trees framing the exit */}
        <path d="M-40,675 L-40,150 Q120,280 180,675 Z" fill="#0f172a" />
        <path d="M1240,675 L1240,150 Q1080,280 1020,675 Z" fill="#0f172a" />

        {/* Swung open gates on the sides! */}
        <g id="open-left-gate" transform="translate(140, 220) rotate(-40)">
          <rect x="0" y="0" width="16" height="340" fill="#475569" stroke="#0f172a" strokeWidth="4" />
          <rect x="30" y="0" width="12" height="340" fill="#475569" stroke="#0f172a" strokeWidth="3" />
          <rect x="60" y="0" width="12" height="340" fill="#475569" stroke="#0f172a" strokeWidth="3" />
          <rect x="-10" y="60" width="90" height="14" fill="#334155" />
          <rect x="-10" y="240" width="90" height="14" fill="#334155" />
        </g>

        <g id="open-right-gate" transform="translate(1040, 220) rotate(40)">
          <rect x="0" y="0" width="16" height="340" fill="#475569" stroke="#0f172a" strokeWidth="4" />
          <rect x="-30" y="0" width="12" height="340" fill="#475569" stroke="#0f172a" strokeWidth="3" />
          <rect x="-60" y="0" width="12" height="340" fill="#475569" stroke="#0f172a" strokeWidth="3" />
          <rect x="-80" y="60" width="90" height="14" fill="#334155" />
          <rect x="-80" y="240" width="90" height="14" fill="#334155" />
        </g>

        {/* Fallen Broken Chains on the Ground */}
        <g id="fallen-chains" transform="translate(560, 560)">
          <ellipse cx="-50" cy="10" rx="28" ry="12" fill="none" stroke="#94a3b8" strokeWidth="7" transform="rotate(15)" />
          <ellipse cx="-20" cy="18" rx="24" ry="10" fill="none" stroke="#64748b" strokeWidth="6" transform="rotate(-10)" />
          <ellipse cx="20" cy="22" rx="26" ry="11" fill="none" stroke="#94a3b8" strokeWidth="7" transform="rotate(25)" />
          <ellipse cx="60" cy="15" rx="30" ry="13" fill="none" stroke="#64748b" strokeWidth="7" transform="rotate(-15)" />
          {/* Shattered padlock lying open */}
          <rect x="90" y="0" width="34" height="30" rx="6" fill="#eab308" stroke="#854d0e" strokeWidth="3" />
          <path d="M102,0 L102,-14 Q107,-22 116,-18 L122,-8" fill="none" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Moonlit Path winding into freedom */}
        <path d="M420,675 Q580,480 600,340 Q620,480 780,675 Z" fill="#fde047" opacity="0.3" />

        {/* HANSEL & GRETEL RUNNING FREE TOWARDS FREEDOM! */}
        <g id="running-children" transform="translate(530, 310)">
          {/* Motion speed lines */}
          <line x1="-70" y1="90" x2="-20" y2="90" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <line x1="-90" y1="120" x2="-35" y2="120" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <line x1="-50" y1="150" x2="-10" y2="150" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

          {/* Hansel Running */}
          <g transform="translate(0, 20) rotate(12)">
            <ellipse cx="30" cy="25" rx="22" ry="22" fill="#fed7aa" />
            <path d="M12,20 C12,0 48,0 48,20 Z" fill="#92400e" />
            <path d="M14,12 Q30,2 46,12 L40,2 Q30,-4 20,2 Z" fill="#15803d" />
            <path d="M40,2 Q50,-10 48,-14" fill="#ef4444" stroke="#ef4444" strokeWidth="3" />
            {/* Joyful eyes & smile */}
            <circle cx="36" cy="22" r="3" fill="#1e293b" />
            <path d="M28,32 Q34,38 40,32" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Body running */}
            <rect x="14" y="45" width="34" height="42" rx="6" fill="#0284c7" />
            {/* Suspender */}
            <rect x="20" y="45" width="5" height="42" fill="#78350f" />
            {/* Legs in stride */}
            <line x1="22" y1="87" x2="10" y2="120" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
            <line x1="38" y1="87" x2="55" y2="115" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
            {/* Arms pumping */}
            <line x1="16" y1="55" x2="-5" y2="70" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <line x1="42" y1="55" x2="70" y2="50" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* Gretel Running hand-in-hand */}
          <g transform="translate(75, 25) rotate(-8)">
            <ellipse cx="28" cy="24" rx="20" ry="20" fill="#fed7aa" />
            <path d="M10,20 C10,0 46,0 46,20 Z" fill="#facc15" />
            {/* Braids flying in wind */}
            <circle cx="6" cy="30" r="5" fill="#facc15" />
            <circle cx="-2" cy="36" r="4" fill="#facc15" />
            <circle cx="48" cy="28" r="5" fill="#facc15" />
            {/* Joyful face */}
            <circle cx="24" cy="22" r="2.5" fill="#047857" />
            <path d="M22,31 Q28,37 34,31" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Dress running */}
            <polygon points="28,44 6,95 50,95" fill="#e11d48" />
            <polygon points="28,48 16,95 40,95" fill="#ffffff" />
            {/* Legs running */}
            <line x1="18" y1="95" x2="8" y2="125" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <line x1="36" y1="95" x2="48" y2="118" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            {/* Arms */}
            <line x1="12" y1="55" x2="-8" y2="45" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
            <line x1="38" y1="55" x2="60" y2="72" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>

        {/* Celebration Confetti */}
        <g id="confetti" opacity="0.95">
          <circle cx="250" cy="160" r="7" fill="#f43f5e" />
          <rect x="320" y="110" width="12" height="6" fill="#3b82f6" transform="rotate(30)" />
          <polygon points="460,90 468,102 454,106" fill="#eab308" />
          <circle cx="580" cy="140" r="6" fill="#10b981" />
          <rect x="710" y="95" width="14" height="7" fill="#ec4899" transform="rotate(-40)" />
          <polygon points="840,130 848,142 834,146" fill="#a855f7" />
          <circle cx="950" cy="180" r="8" fill="#f97316" />

          <circle cx="180" cy="320" r="5" fill="#fbbf24" />
          <rect x="290" y="380" width="10" height="5" fill="#06b6d4" transform="rotate(15)" />
          <polygon points="880,310 888,322 874,326" fill="#ec4899" />
          <circle cx="1020" cy="360" r="6" fill="#22c55e" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Jagged Electric Sparks Overlay (Panel 5 & 6)
 */
export const SparksOverlay: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-20 ${className}`}>
      <svg viewBox="0 0 400 300" className="w-full h-full animate-sparks">
        <defs>
          <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Jagged spark lightning lines */}
        <path
          d="M 50,40 L 90,80 L 70,110 L 120,160 L 100,190 L 140,240"
          fill="none"
          stroke="#fde047"
          strokeWidth="4"
          filter="url(#electricGlow)"
        />
        <path
          d="M 350,50 L 310,95 L 330,125 L 280,180 L 305,210 L 260,260"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          filter="url(#electricGlow)"
        />
        <path
          d="M 160,20 L 190,50 L 175,70 L 220,100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          filter="url(#electricGlow)"
        />
        <path
          d="M 120,260 L 160,240 L 180,270 L 230,245 L 270,280"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          filter="url(#electricGlow)"
        />
      </svg>
    </div>
  );
};

/**
 * Red Vignette Overlay for Panic / 5-Fails Shake (Panel 6)
 */
export const VignetteOverlay: React.FC<{
  intensity?: 'medium' | 'high';
}> = ({ intensity = 'medium' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 transition-all duration-300 ${
        intensity === 'high'
          ? 'shadow-[inset_0_0_120px_40px_rgba(239,68,68,0.85)] animate-pulse'
          : 'shadow-[inset_0_0_70px_20px_rgba(239,68,68,0.5)]'
      }`}
    />
  );
};
