const fs = require("fs");
const path = require("path");

function gerarNomeArquivo(clienteNome) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `fatura-${clienteNome.replace(/\s+/g, "_")}-${ano}-${mes}-${dia}.html`;
}

const clientes = JSON.parse(fs.readFileSync("dados/clientes.json", "utf-8"));
const fretes = JSON.parse(fs.readFileSync("dados/fretes.json", "utf-8"));

clientes.forEach(cliente => {
  const fretesCliente = fretes.filter(f => f.clienteId === cliente.id);

  if (fretesCliente.length === 0) return;

  let total = 0;
  let linhas = "";

  fretesCliente.forEach(frete => {
    const subtotal = frete.quantidade * frete.valorUnitario;
    total += subtotal;
    linhas += `
      <tr>
        <td>${frete.produto}</td>
        <td>${frete.quantidade}</td>
        <td>R$ ${frete.valorUnitario.toFixed(2)}</td>
        <td>R$ ${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  const conteudo = `
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Fatura - ${cliente.nome}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
        h1 { color: #333; }
        .total { text-align: right; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Fatura - ${cliente.nome}</h1>
      <p><strong>CNPJ:</strong> ${cliente.cnpj}</p>
      <p><strong>Endereço:</strong> ${cliente.endereco}</p>
      <hr>
      <table>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Subtotal</th>
        </tr>
        ${linhas}
        <tr>
          <td colspan="3" class="total">Total</td>
          <td><strong>R$ ${total.toFixed(2)}</strong></td>
        </tr>
      </table>
      <hr>
      <p><strong>Dados Bancários para pagamento:</strong></p>
      <p>Banco: Nubank</p>
      <p>Agência: 0001</p>
      <p>Conta: 123456-7</p>
      <p>Pix: 11999999999</p>
    </body>
  </html>
  `;

  const nomeArquivo = path.join("faturas", gerarNomeArquivo(cliente.nome));
  fs.writeFileSync(nomeArquivo, conteudo);
  console.log(`✅ Fatura gerada para ${cliente.nome}: ${nomeArquivo}`);
});
