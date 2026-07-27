document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const topbarNav = document.getElementById('topbar-nav');
    const topbar = document.getElementById('topbar');

    if (menuToggle && topbarNav) {
        menuToggle.addEventListener('click', () => {
            const open = topbarNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', e => {
            if (!topbar.contains(e.target) && topbarNav.classList.contains('open')) {
                topbarNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (topbar) {
        let topScrolled = false;
        window.addEventListener('scroll', () => {
            const shouldScroll = window.scrollY > 40;
            if (shouldScroll !== topScrolled) {
                topScrolled = shouldScroll;
                topbar.classList.toggle('scrolled', shouldScroll);
            }
        }, { passive: true });
    }

    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (a) {
            e.preventDefault();
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                if (topbarNav && topbarNav.classList.contains('open')) {
                    topbarNav.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        let bttVisible = false;
        window.addEventListener('scroll', () => {
            const shouldShow = window.scrollY > 500;
            if (shouldShow !== bttVisible) {
                bttVisible = shouldShow;
                backToTop.classList.toggle('show', shouldShow);
            }
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .entrance-stagger').forEach(el => {
        revealObserver.observe(el);
    });

    function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._hide);
        t._hide = setTimeout(() => t.classList.remove('show'), 2000);
    }
});
