import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANOS_VALIDOS = {
    '12_meses': {
        priceId: 'price_1T4xOBPgH1JJJSGSW3GdQgdq', 
        meses: 12,
        mode: 'subscription'
    },
    '24_meses': {
        priceId: 'price_1T4xOkPgH1JJJSGSR693thvT',
        meses: 24,
        mode: 'subscription'
    },
    '48_meses': {
        priceId: 'price_1T4xPFPgH1JJJSGSyqZN7ctU',
        meses: 48,
        mode: 'subscription'
    },
    'venda_direta': {
        priceId: 'price_1T4xPYPgH1JJJSGSIBz7BJXv',
        meses: 0,
        mode: 'payment'
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { planoSelecionado } = req.body;

    const plano = PLANOS_VALIDOS[planoSelecionado];
    if (!plano) {
        return res.status(400).json({ error: 'Tentativa de manipulação detectada: Plano inválido.' });
    }

    try {
        const sessionConfig = {
            payment_method_types: ['card'],
            mode: plano.mode,
            line_items: [
                {
                    price: plano.priceId,
                    quantity: 1,
                },
            ],
            success_url: `https://${req.headers.host}/obrigado.html`,
            cancel_url: `https://${req.headers.host}/`,
        };

        if (plano.mode === 'subscription') {
            sessionConfig.subscription_data = {
                metadata: {
                    limite_meses: plano.meses
                }
            };
        } 
        else if (plano.mode === 'payment') {
            sessionConfig.payment_method_options = {
                card: {
                    installments: {
                        enabled: true
                    }
                }
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        
        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao processar comunicação com gateway.' });
    }
}