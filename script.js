document.addEventListener('DOMContentLoaded', () => {
    
    const lenis = new Lenis({
        duration: 3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        infinite: false,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement);
            }
        });
    });

    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = 'none';
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (navContainer && navLinks) {
        navContainer.insertAdjacentHTML('beforeend', `
            <button class="mobile-menu-btn" aria-label="Abrir menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        `);

        const actionButtons = navContainer.querySelectorAll('.header-actions .btn');
        
        if (actionButtons.length > 0) {
            actionButtons.forEach(btn => {
                btn.classList.add('btn-desktop-only');
                
                const mobileBtn = btn.cloneNode(true);
                mobileBtn.classList.remove('btn-desktop-only');
                mobileBtn.classList.add('btn-mobile-only');
                mobileBtn.style.marginTop = btn.classList.contains('btn-primary') ? '1rem' : '2rem';
                navLinks.appendChild(mobileBtn);
            });
        }

        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                document.body.style.overflow = '';
            }
        });

        const links = navLinks.querySelectorAll('a:not(.btn)');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                document.body.style.overflow = '';
            });
        });
    }
});

// Lógica Segura de Checkout Stripe
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButtons = document.querySelectorAll('.btn-checkout');

    checkoutButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const planoSelecionado = this.getAttribute('data-plano');
            const textoOriginal = this.innerText;
            
            this.innerText = 'Processando...';
            this.disabled = true;
            this.style.opacity = '0.7';

            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ planoSelecionado })
                });
                
                const data = await response.json();
                
                if (response.ok && data.url) {
                    window.location.href = data.url; 
                } else {
                    alert('Erro: ' + (data.error || 'Falha ao iniciar checkout.'));
                    this.innerText = textoOriginal;
                    this.disabled = false;
                    this.style.opacity = '1';
                }
            } catch (error) {
                console.error('Erro de rede:', error);
                alert('Erro de conexão ao comunicar com o servidor de pagamentos.');
                this.innerText = textoOriginal;
                this.disabled = false;
                this.style.opacity = '1';
            }
        });
    });
});