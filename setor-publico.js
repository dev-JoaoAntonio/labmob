document.getElementById('form-viabilidade').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const msg = document.getElementById('form-msg');

    btn.innerText = 'Enviando...';
    btn.disabled = true;
    msg.style.display = 'none';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            msg.style.display = 'block';
            msg.style.color = '#10B981';
            msg.innerText = 'Estudo solicitado com sucesso! Nossa equipe entrará em contato.';
            e.target.reset();
        } else {
            throw new Error('Falha');
        }
    } catch (err) {
        msg.style.display = 'block';
        msg.style.color = '#EF4444';
        msg.innerText = 'Erro ao enviar solicitação. Tente novamente mais tarde.';
    } finally {
        btn.innerText = 'Solicitar Estudo de Viabilidade';
        btn.disabled = false;
    }
});