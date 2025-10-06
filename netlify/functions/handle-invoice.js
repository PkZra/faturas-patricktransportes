const Twilio = require("twilio");

exports.handler = async (event) => {
  try {
    const secret = event.headers["x-webhook-secret"];
    if (secret !== process.env.WEBHOOK_SECRET) {
      return { statusCode: 403, body: "Forbidden" };
    }

    const data = JSON.parse(event.body);
    const { invoiceNumber, clientName, clientPhone, pdfUrl } = data;

    console.log("📄 Fatura recebida:", data);

    const client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${clientPhone}`,
      body: `Olá ${clientName}, sua fatura ${invoiceNumber} está pronta!\nBaixe aqui: ${pdfUrl}`,
    });

    console.log("✅ Mensagem enviada com sucesso!");
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Erro na função handle-invoice:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
