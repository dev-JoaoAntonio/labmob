import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { Nome, Orgao, Email, Telefone } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: 'suporte@catalucca.com.br',
            subject: `🚨 Novo Estudo de Viabilidade: ${Orgao}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>Novo Pedido de Estudo de Viabilidade</h2>
                    <p><strong>Nome:</strong> ${Nome}</p>
                    <p><strong>Órgão:</strong> ${Orgao}</p>
                    <p><strong>E-mail:</strong> ${Email}</p>
                    <p><strong>Telefone:</strong> ${Telefone}</p>
                </div>
            `
        });
        
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error("Erro no envio do e-mail:", error);
        res.status(500).json({ error: 'Erro interno ao disparar e-mail.' });
    }
}