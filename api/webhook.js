import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Método não permitido');
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const body = await new Promise((resolve, reject) => {
            let chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            req.on('error', reject);
        });

        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.mode === 'subscription' && session.subscription) {
            try {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                const limiteMeses = parseInt(subscription.metadata.limite_meses);

                if (limiteMeses && limiteMeses > 0) {
                    if (subscription.cancel_at) {
                        return res.json({ received: true });
                    }

                    const dataInicio = new Date(subscription.current_period_start * 1000);
                    dataInicio.setMonth(dataInicio.getMonth() + limiteMeses);
                    const dataCancelamento = Math.floor(dataInicio.getTime() / 1000);

                    await stripe.subscriptions.update(subscription.id, {
                        cancel_at: dataCancelamento
                    });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Erro ao programar a expiração do contrato.' });
            }
        }
    }

    res.json({ received: true });
}