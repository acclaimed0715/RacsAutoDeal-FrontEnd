import { readFileSync, writeFileSync } from 'fs';

// ── style.css ────────────────────────────────────────────────────────────────
const stylePath = 'src/styles/style.css';
let s = readFileSync(stylePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Replace :root entirely (find it, replace it)
s = s.replace(/:root \{[\s\S]*?\}/, `:root {
    /* ── Brand Red ── */
    --primary:        #E63946;
    --primary-light:  #FF4D5A;
    --primary-dark:   #C0303C;
    --primary-glow:   rgba(230, 57, 70, 0.40);

    /* ── Gold Accent ── */
    --accent:         #F4A261;
    --accent-hover:   #FFB703;
    --accent-glow:    rgba(244, 162, 97, 0.35);

    /* ── Backgrounds ── */
    --bg-dark:        #0B0B0D;
    --bg-mid:         #121212;
    --bg-card:        #1A1A1D;
    --bg-card-hover:  #222226;
    --bg-footer:      #080809;
    --bg-header:      #08080A;

    /* ── Text ── */
    --text-main:      #FFFFFF;
    --text-muted:     #B0B0B0;
    --text-dim:       #6C757D;

    /* ── Glass ── */
    --card-bg:        #ffffff;
    --glass-bg:       rgba(255, 255, 255, 0.04);
    --glass-border:   rgba(255, 255, 255, 0.08);

    /* ── Borders ── */
    --border-subtle:  #2A2A2E;

    /* ── Shadows ── */
    --shadow-card:    0 8px 32px rgba(0, 0, 0, 0.40);
    --shadow-hover:   0 20px 50px rgba(0, 0, 0, 0.60);
    --shadow-red:     0 8px 24px rgba(230, 57, 70, 0.35);

    /* ── Gradients ── */
    --grad-red:       linear-gradient(135deg, #E63946 0%, #FF4D5A 100%);
    --grad-dark:      linear-gradient(160deg, #121212 0%, #0B0B0D 100%);
    --grad-surface:   linear-gradient(160deg, #1A1A1D 0%, #121212 100%);

    --transition:     0.35s cubic-bezier(0.4, 0, 0.2, 1);
}`);

// 2. Nuke ALL stale old-red rgba variants in one regex sweep
s = s.replace(/rgba\(192, 57, 43, ([0-9.]+)\)/g, (_, a) => `rgba(230, 57, 70, ${a})`);
s = s.replace(/rgba\(139, 41, 29, ([0-9.]+)\)/g, (_, a) => `rgba(230, 57, 70, ${a})`);

// 3. Replace any remaining hardcoded old primaries
s = s
  .replace(/#C0392B/g, '#E63946')
  .replace(/#8B291D/g, '#E63946')
  .replace(/#b83228/g, '#FF4D5A')
  .replace(/#E74C3C/g, '#FF4D5A')
  .replace(/#922B21/g, '#C0303C');

// 4. body background
s = s.replace(
  'background-color: var(--bg-dark);\n    background-image: radial-gradient(ellipse at 20% 50%, rgba(230, 57, 70, 0.06) 0%, transparent 60%),\n        radial-gradient(ellipse at 80% 20%, rgba(230, 57, 70, 0.04) 0%, transparent 60%);',
  'background-color: #0B0B0D;\n    background-image: radial-gradient(ellipse at 15% 40%, rgba(230, 57, 70, 0.08) 0%, transparent 55%),\n        radial-gradient(ellipse at 85% 10%, rgba(230, 57, 70, 0.05) 0%, transparent 55%);'
);

// 5. Logo glow
s = s
  .replace('border: 2px solid rgba(230, 57, 70, 0.45);', 'border: 2px solid rgba(230, 57, 70, 0.50);')
  .replace('box-shadow: 0 0 16px rgba(230, 57, 70, 0.25);', 'box-shadow: 0 0 22px rgba(230, 57, 70, 0.45);')
  .replace('box-shadow: 0 0 24px rgba(230, 57, 70, 0.5);',  'box-shadow: 0 0 28px rgba(230, 57, 70, 0.65);');

// 6. Primary CTA – ensure gradient (in case still flat)
s = s
  .replace(
    /\.primary-cta \{\n    background: [^;]+;\n    color: #fff;\n    box-shadow: [^;]+;\n\}/,
    '.primary-cta {\n    background: linear-gradient(135deg, #E63946 0%, #FF4D5A 100%);\n    color: #fff;\n    box-shadow: 0 10px 30px rgba(230, 57, 70, 0.45);\n}'
  )
  .replace(
    /\.primary-cta:hover \{\n    background: [^;]+;\n    transform: translateY\(-5px\);\n    box-shadow: [^;]+;\n\}/,
    '.primary-cta:hover {\n    background: linear-gradient(135deg, #FF4D5A 0%, #FF6B78 100%);\n    transform: translateY(-5px);\n    box-shadow: 0 16px 40px rgba(230, 57, 70, 0.65);\n}'
  );

// 7. Footer bg
s = s.replace(
  'background: linear-gradient(160deg, #141414 0%, #0a0a0a 100%);',
  'background: linear-gradient(160deg, #0D0D0F 0%, #080809 100%);'
);

// 8. Fix .red-icon — it should be #E63946 brand red (NOT the gold accent)
s = s.replace('.red-icon {\n    color: var(--accent);\n}', '.red-icon {\n    color: #E63946;\n}');

// 9. Inventory section bg
s = s.replace(
  'background: linear-gradient(180deg, #121212 0%, #0B0B0D 100%);',
  'background: linear-gradient(180deg, #0F0F11 0%, #0B0B0D 100%);'
);
s = s.replace('background-color: #1A1A1D;', 'background-color: #141418;');

// 10. Subtitle hero glow
s = s.replace(
  'text-shadow: 0 0 30px rgba(230, 57, 70, 0.80);',
  'text-shadow: 0 0 30px rgba(230, 57, 70, 0.90), 0 0 60px rgba(230, 57, 70, 0.30);'
);

writeFileSync(stylePath, s.replace(/\n/g, '\r\n'));
console.log('style.css — done');

// ── login.css ────────────────────────────────────────────────────────────────
const loginPath = 'src/styles/login.css';
let l = readFileSync(loginPath, 'utf8').replace(/\r\n/g, '\n');

l = l.replace(/:root \{[\s\S]*?\}/, `:root {
    --bg-dark:      #0B0B0D;
    --form-bg:      #121212;
    --accent:       #E63946;
    --accent-light: #FF4D5A;
    --text-primary: #FFFFFF;
    --text-muted:   #B0B0B0;
    --border:       #2A2A2E;
}`);

// Login button gradient
l = l
  .replace(/background-color: #a53224;/, 'background: linear-gradient(135deg, #FF4D5A, #E63946);')
  .replace(/background-color: var\(--accent\);/, 'background: linear-gradient(135deg, #E63946, #FF4D5A);')
  .replace(/background-color: #222222;/, 'background-color: #121212;')
  .replace(/background-color: var\(--form-bg\);/, 'background-color: #121212;')
  .replace(/#444444/, '#2A2A2E');

writeFileSync(loginPath, l.replace(/\n/g, '\r\n'));
console.log('login.css — done');
