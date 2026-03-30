const fs = require('fs');

// ─── style.css ──────────────────────────────────────────────────────────────
const stylePath = 'src/styles/style.css';
let style = fs.readFileSync(stylePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Replace :root block
const rootMatch = style.match(/:root \{[\s\S]*?\}/);
if (!rootMatch) { console.error('root not found'); process.exit(1); }

const newRoot = `:root {
    /* === Brand Reds === */
    --primary: #E63946;
    --primary-light: #FF4D5A;
    --primary-dark: #C0303C;
    --primary-glow: rgba(230, 57, 70, 0.40);

    /* === Secondary — Gold === */
    --accent: #F4A261;
    --accent-hover: #FFB703;
    --accent-glow: rgba(244, 162, 97, 0.35);

    /* === Backgrounds === */
    --bg-dark: #0B0B0D;
    --bg-mid: #121212;
    --bg-card: #1A1A1D;
    --bg-card-hover: #222226;
    --bg-footer: #080809;
    --bg-header: #08080A;

    /* === Text === */
    --text-main: #FFFFFF;
    --text-muted: #B0B0B0;
    --text-dim: #6C757D;

    /* === Glass / Surfaces === */
    --card-bg: #ffffff;
    --glass-bg: rgba(255, 255, 255, 0.04);
    --glass-border: rgba(255, 255, 255, 0.08);

    /* === Borders === */
    --border-subtle: #2A2A2E;

    /* === Shadows === */
    --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.40);
    --shadow-hover: 0 20px 50px rgba(0, 0, 0, 0.60);
    --shadow-red: 0 8px 24px rgba(230, 57, 70, 0.35);

    /* === Gradients === */
    --grad-red: linear-gradient(135deg, #E63946 0%, #FF4D5A 100%);
    --grad-dark: linear-gradient(160deg, #121212 0%, #0B0B0D 100%);
    --grad-surface: linear-gradient(160deg, #1A1A1D 0%, #121212 100%);

    --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}`;

style = style.replace(rootMatch[0], newRoot);

// 2. Body radial glows → new red
style = style.replace(/rgba\(192, 57, 43, 0\.06\)/g, 'rgba(230, 57, 70, 0.07)');
style = style.replace(/rgba\(192, 57, 43, 0\.04\)/g, 'rgba(230, 57, 70, 0.05)');

// 3. All old hardcoded bg colors
style = style
  .replace(/background: linear-gradient\(180deg, #1C1C1C 0%, #181818 100%\)/g,
           'background: linear-gradient(180deg, #121212 0%, #0B0B0D 100%)')
  .replace(/background-color: #252525/g, 'background-color: #1A1A1D')
  .replace(/background-color: var\(--bg-dark\)/g, 'background-color: var(--bg-dark)');

// 4. CTA primary button — replace solid bg with gradient
style = style.replace(
  '.primary-cta {\n    background: var(--primary);\n    color: #fff;\n    box-shadow: 0 10px 30px rgba(192, 57, 43, 0.40);\n}',
  '.primary-cta {\n    background: var(--grad-red);\n    color: #fff;\n    box-shadow: 0 10px 30px rgba(230, 57, 70, 0.45);\n}'
);
// Also replace rgba hover glow colors for CTA
style = style
  .replace(/rgba\(192, 57, 43, 0\.45\)/g, 'rgba(230, 57, 70, 0.45)')
  .replace(/rgba\(192, 57, 43, 0\.55\)/g, 'rgba(230, 57, 70, 0.55)')
  .replace(/rgba\(192, 57, 43, 0\.65\)/g, 'rgba(230, 57, 70, 0.65)')
  .replace(/rgba\(192, 57, 43, 0\.30\)/g, 'rgba(230, 57, 70, 0.30)')
  .replace(/rgba\(192, 57, 43, 0\.18\)/g, 'rgba(230, 57, 70, 0.15)')
  .replace(/rgba\(192, 57, 43, 0\.20\)/g, 'rgba(230, 57, 70, 0.20)')
  .replace(/rgba\(192, 57, 43, 0\.07\)/g, 'rgba(230, 57, 70, 0.07)')
  .replace(/rgba\(192, 57, 43, 0\.12\)/g, 'rgba(230, 57, 70, 0.12)')
  .replace(/rgba\(192, 57, 43, 0\.15\)/g, 'rgba(230, 57, 70, 0.15)')
  .replace(/rgba\(192, 57, 43, 0\.25\)/g, 'rgba(230, 57, 70, 0.25)')
  .replace(/rgba\(192, 57, 43, 0\.40\)/g, 'rgba(230, 57, 70, 0.40)')
  .replace(/rgba\(192, 57, 43, 0\.35\)/g, 'rgba(230, 57, 70, 0.35)')
  .replace(/#C0392B/g, '#E63946');

// 5. Logo glow upgrade
style = style.replace(
  'box-shadow: 0 0 16px rgba(192, 57, 43, 0.30);',
  'box-shadow: 0 0 20px rgba(230, 57, 70, 0.40);'
);
style = style.replace(
  'box-shadow: 0 0 24px rgba(192, 57, 43, 0.55);',
  'box-shadow: 0 0 28px rgba(230, 57, 70, 0.60);'
);

// 6. Inventory section upgrade
style = style.replace(
  'background: linear-gradient(180deg, #1C1C1C 0%, #181818 100%);',
  'background: linear-gradient(180deg, #121212 0%, #0B0B0D 100%);'
);

// 7. Car card background (white cards stay white, but section bg gets darker)
// Filter sidebar bg
style = style.replace(
  'background-color: rgba(26, 26, 26, 0.5);',
  'background-color: rgba(18, 18, 18, 0.6);'
);

// 8. Navbar scrolled shadow update
style = style.replace(
  '0 4px 30px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(192, 57, 43, 0.20)',
  '0 4px 30px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(230, 57, 70, 0.25)'
);

// 9. Footer background
style = style.replace(
  'background: linear-gradient(160deg, #141414 0%, #0a0a0a 100%);',
  'background: linear-gradient(160deg, #0D0D0F 0%, #080809 100%);'
);

fs.writeFileSync(stylePath, style.replace(/\n/g, '\r\n'));
console.log('style.css updated');

// ─── login.css ───────────────────────────────────────────────────────────────
const loginPath = 'src/styles/login.css';
let login = fs.readFileSync(loginPath, 'utf8').replace(/\r\n/g, '\n');

const loginRootMatch = login.match(/:root \{[\s\S]*?\}/);
if (loginRootMatch) {
  login = login.replace(loginRootMatch[0], `:root {
    --bg-dark: #0B0B0D;
    --form-bg: #121212;
    --accent: #E63946;
    --accent-light: #FF4D5A;
    --text-primary: #FFFFFF;
    --text-muted: #B0B0B0;
    --border: #2A2A2E;
}`);
}
login = login
  .replace('background-color: #a53224;', 'background: linear-gradient(135deg, #E63946, #FF4D5A);')
  .replace('background-color: #222222;', 'background-color: #121212;')
  .replace('background-color: var(--form-bg);', 'background-color: var(--form-bg);');

fs.writeFileSync(loginPath, login.replace(/\n/g, '\r\n'));
console.log('login.css updated');
