const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'faturas');
const outFile = path.join(__dirname, 'index.html');

function buildIndex() {
  if (!fs.existsSync(folder)) {
    console.error('Pasta faturas/ não encontrada. Gere ao menos uma fatura.');
    process.exit(1);
  }

  const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));
  const items = files.map(f => {
    const name = f.replace(/-/g, ' ');
    return `<li><a href="faturas/${f}">${f}</a></li>`;
  }).join('\n    ');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Faturas - Patrick Transportes</title>
</head>
<body>
  <h1>Faturas — Patrick Transportes</h1>
  <p>Faturas disponíveis:</p>
  <ul>
    ${items || '<li>(nenhuma fatura encontrada)</li>'}
  </ul>
  <p>Gerado em ${new Date().toLocaleString()}</p>
</body>
</html>`;

  fs.writeFileSync(outFile, html, 'utf8');
  console.log('index.html atualizado com', files.length, 'faturas.');
}

buildIndex();
