const fs = require('fs');
const path = 'src/styles/login.css';
let content = fs.readFileSync(path, 'utf8');

const match = content.match(/:root \{[\s\S]*?\}/);
if (!match) { console.log('root not found'); process.exit(1); }

const newRoot = `:root {
    --bg-dark: #141414;
    --form-bg: #1C1C1C;
    --accent: #C0392B;
    --accent-light: #E74C3C;
    --text-primary: #F5F5F5;
    --text-muted: #A0A0A0;
    --border: #333333;
}`;

content = content.replace(match[0], newRoot);
content = content.replace('background-color: #a53224;', 'background-color: #E74C3C;');
content = content.replace('background-color: #222222;', 'background-color: var(--form-bg);');

fs.writeFileSync(path, content);
console.log('Login CSS updated successfully');
