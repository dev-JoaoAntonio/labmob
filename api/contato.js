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
                <div style="background-color: #f4f7f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-top: 6px solid #0066CC;">
                        
                        <div style="padding: 30px; text-align: center; background: #ffffff;">
                            <h1 style="margin: 0; color: #0066CC; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">LABMOB™ PRO</h1>
                            <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Solicitação de Estudo de Viabilidade</p>
                        </div>

                        <hr style="border: 0; border-top: 1px solid #eee; margin: 0;">

                        <div style="padding: 40px;">
                            <p style="font-size: 16px; color: #333; margin-bottom: 25px;">Um novo gestor público solicitou informações técnicas através do portal:</p>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; width: 120px;"><strong>Gestor:</strong></td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${Nome}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888;"><strong>Órgão:</strong></td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${Orgao}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888;"><strong>E-mail:</strong></td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;"><a href="mailto:${Email}" style="color: #0066CC; text-decoration: none;">${Email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888;"><strong>Telefone:</strong></td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333;">
                                        <a href="https://wa.me/55${Telefone.replace(/\D/g, '')}" style="color: #0066CC; text-decoration: none;">${Telefone} (WhatsApp)</a>
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top: 35px; text-align: center;">
                                <a href="mailto:${Email}" style="background-color: #0066CC; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Responder Agora</a>
                            </div>
                        </div>

                        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                            Este é um e-mail gerado automaticamente pela infraestrutura Catalucca.<br>
                            © 2026 LabMob América do Sul.
                        </div>
                    </div>
                </div>
            `
        });
        
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error("Erro no envio do e-mail:", error);
        res.status(500).json({ error: 'Erro interno ao disparar e-mail.' });
    }
}