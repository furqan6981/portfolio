// ===========================
// Portfolio V2 - JavaScript
// ===========================

// ===========================
// Utility: Check if element is initially visible
// ===========================

const isInitiallyVisible = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight + 100;
};

// ===========================
// Floating Nav
// ===========================

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.floating-nav .nav-link');
let lastScroll = 0;
let ticking = false;

const updateNavbar = () => {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isMobile = window.innerWidth <= 768;

    if (currentScroll > lastScroll && currentScroll > 50 && currentScroll < documentHeight - windowHeight - 50) {
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
        navbar.style.transform = isMobile ? 'translateY(100px)' : 'translateX(-50%) translateY(20px)';
    } else {
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'all';
        navbar.style.transform = isMobile ? 'translateY(0)' : 'translateX(-50%) translateY(0)';
    }

    lastScroll = currentScroll;
    ticking = false;
};

if (navbar) {
    navbar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    const handleResize = () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            navbar.style.left = '12px';
            navbar.style.right = '12px';
            navbar.style.width = 'auto';
            navbar.style.transform = 'translateY(0)';
        } else {
            navbar.style.left = '50%';
            navbar.style.right = 'auto';
            navbar.style.width = 'auto';
            navbar.style.transform = 'translateX(-50%)';
        }
        updateNavbar();
    };

    handleResize();

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', handleResize, { passive: true });
}

// ===========================
// Smooth Scroll & Active Links
// ===========================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                updateActiveLink(link);
            }
        }
    });
});

function updateActiveLink(activeLink) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
}

// ===========================
// Section Observer
// ===========================

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.floating-nav a[href="#${id}"]`);
            if (link) updateActiveLink(link);
        }
    });
}, { threshold: 0.3, rootMargin: '0px 0px -20% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ===========================
// Scroll Animations (matching reference)
// ===========================

// GPU-accelerated scroll observer using translate3d
const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate3d(0, 0, 0)';
            entry.target.style.willChange = 'auto';
            animateObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.01, rootMargin: '300px 0px 0px 0px' });

// Section headers reveal
const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            headerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header').forEach(el => {
    headerObserver.observe(el);
});

// Project & Experience cards (staggered, GPU-accelerated)
const projectElements = document.querySelectorAll('.project-card, .timeline-item');
projectElements.forEach((el, i) => {
    if (isInitiallyVisible(el)) {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    } else {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 15px, 0)';
        el.style.transition = `opacity 0.3s ease ${i * 0.02}s, transform 0.3s ease ${i * 0.02}s`;
    }
    el.style.willChange = 'opacity, transform';
    animateObserver.observe(el);
});

// Other elements (staggered, GPU-accelerated)
const otherElements = document.querySelectorAll(
    '.bento-card, .service-card, .review-card, .contact-item, .process-step, .value-card, .tech-category'
);
otherElements.forEach((el, i) => {
    if (isInitiallyVisible(el)) {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    } else {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 20px, 0)';
        el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
    }
    el.style.willChange = 'opacity, transform';
    animateObserver.observe(el);
});

// Contact left section
document.querySelectorAll('.contact-left').forEach(el => {
    if (!isInitiallyVisible(el)) {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 20px, 0)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.willChange = 'opacity, transform';
        animateObserver.observe(el);
    }
});

// ===========================
// Parallax Effect (Hero)
// ===========================

const heroBackground = document.querySelector('.hero-background');
const gradientOrbs = document.querySelectorAll('.gradient-orb');
let parallaxTicking = false;

const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 1000;

    if (scrolled < heroHeight) {
        if (heroBackground) {
            heroBackground.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        }
        gradientOrbs.forEach((orb, index) => {
            const speed = 0.05 + (index * 0.02);
            orb.style.transform = `translate3d(${scrolled * speed}px, ${scrolled * speed}px, 0)`;
        });
    }
    parallaxTicking = false;
};

if (heroBackground || gradientOrbs.length > 0) {
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
}

// Scroll progress bar removed

// ===========================
// Scroll to Top (Enhanced, matching reference)
// ===========================

// Scroll to top button removed

// ===========================
// Project Image Galleries
// ===========================

const initGalleries = () => {
    document.querySelectorAll('.project-image-gallery').forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-img');
        const nav = gallery.closest('.project-image-wrap')?.querySelector('.gallery-nav');
        const dots = nav ? nav.querySelectorAll('.dot') : [];
        if (images.length <= 1) return;

        let current = 0;
        let interval = null;

        const show = (idx) => {
            images.forEach((img, i) => img.classList.toggle('active', i === idx));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
            current = idx;
        };

        const next = () => show((current + 1) % images.length);

        const startAutoRotate = () => { interval = setInterval(next, 4000); };
        const stopAutoRotate = () => { clearInterval(interval); interval = null; };

        dots.forEach((dot, i) => {
            dot.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                show(i);
                stopAutoRotate();
                startAutoRotate();
            });
        });

        const wrap = gallery.closest('.project-image-wrap');
        if (wrap) {
            wrap.addEventListener('mouseenter', stopAutoRotate);
            wrap.addEventListener('mouseleave', startAutoRotate);
        }

        startAutoRotate();
    });
};

// ===========================
// Demo Videos
// ===========================

const initDemoVideos = () => {
    document.querySelectorAll('.demo-card').forEach(card => {
        const video = card.querySelector('.demo-video');
        const playBtn = card.querySelector('.demo-play');
        if (!video) return;

        if (playBtn) playBtn.addEventListener('click', () => video.play());
        video.addEventListener('play', () => {
            card.classList.add('is-playing');
            // Pause other demos when one starts playing
            document.querySelectorAll('.demo-video').forEach(v => {
                if (v !== video) v.pause();
            });
        });
        video.addEventListener('pause', () => card.classList.remove('is-playing'));
        video.addEventListener('ended', () => card.classList.remove('is-playing'));
    });
};

// ===========================
// Scroll Hook (hero cue)
// ===========================

const initScrollHook = () => {
    const hook = document.getElementById('scrollHook');
    if (!hook) return;

    const onScroll = () => {
        hook.classList.toggle('is-hidden', window.pageYOffset > 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    hook.addEventListener('click', () => track('scroll_hook_click'));
    onScroll();
};

// ===========================
// Analytics (GA4 events)
// ===========================

// Aggregate only - GA4 forbids personally identifying data.
const track = (name, params = {}) => {
    if (typeof gtag !== 'function') return;
    gtag('event', name, { transport_type: 'beacon', ...params });
};

// Which page area a link sits in, for context in reports
const areaOf = (el) => {
    const section = el.closest('section[id]');
    if (el.closest('.footer')) return 'footer';
    if (el.closest('.floating-nav')) return 'nav';
    return section ? section.id : 'other';
};

const CONTACT_MATCHERS = [
    { method: 'phone',    test: (h) => h.startsWith('tel:') },
    { method: 'email',    test: (h) => h.startsWith('mailto:') },
    { method: 'whatsapp', test: (h) => h.includes('wa.me') },
    { method: 'linkedin', test: (h) => h.includes('linkedin.com') },
    { method: 'github',   test: (h) => h.includes('github.com') },
    { method: 'upwork',   test: (h) => h.includes('upwork.com') },
];

const initAnalytics = () => {
    // One delegated listener covers every current and future link
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        const area = areaOf(link);

        const contact = CONTACT_MATCHERS.find(m => m.test(href));
        if (contact) {
            track('contact_click', { method: contact.method, area });
            return;
        }

        if (link.classList.contains('btn-primary') || link.classList.contains('btn-ghost')) {
            track('cta_click', { cta_text: link.textContent.trim().slice(0, 60), area });
            return;
        }

        if (link.classList.contains('project-link')) {
            const title = link.closest('.project-card')?.querySelector('h3')?.textContent.trim();
            track('project_link_click', { project: title || 'unknown', area });
        }
    }, { passive: true });

    // Demo video plays
    document.querySelectorAll('.demo-card').forEach(card => {
        const video = card.querySelector('.demo-video');
        const title = card.querySelector('h3')?.textContent.trim() || 'unknown';
        if (!video) return;
        let counted = false;
        video.addEventListener('play', () => {
            if (counted) return;
            counted = true;
            track('demo_play', { demo_name: title });
        });
        video.addEventListener('ended', () => track('demo_complete', { demo_name: title }));
    });

    // Scroll depth milestones
    const milestones = [25, 50, 75, 100];
    const hit = new Set();
    let depthTicking = false;
    const checkDepth = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? (window.pageYOffset / scrollable) * 100 : 0;
        milestones.forEach(m => {
            if (pct >= m && !hit.has(m)) {
                hit.add(m);
                track('scroll_depth', { percent: m });
            }
        });
        depthTicking = false;
    };
    window.addEventListener('scroll', () => {
        if (!depthTicking) {
            window.requestAnimationFrame(checkDepth);
            depthTicking = true;
        }
    }, { passive: true });

    // Section views (fires once per section)
    const seen = new Set();
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (entry.isIntersecting && !seen.has(id)) {
                seen.add(id);
                track('section_view', { section: id });
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('section[id]').forEach(s => viewObserver.observe(s));
};

// ===========================
// Local Time
// ===========================

const updateLocalTime = () => {
    const el = document.getElementById('localTime');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) + ' local time';
    }
};

setInterval(updateLocalTime, 60000);

// ===========================
// Counter Animation (matching reference)
// ===========================

const animateCounter = (element, target, suffix = '', duration = 2000) => {
    // Keep any decimals (e.g. "3.5+") while counting up
    const decimals = (String(target).split('.')[1] || '').length;
    const increment = target / (duration / 16);
    let current = 0;
    const update = () => {
        current += increment;
        if (current < target) {
            element.textContent = (decimals ? current.toFixed(decimals) : Math.floor(current)) + suffix;
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    };
    update();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.querySelectorAll('.stat-value, .hstat-value').forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text);
                if (!isNaN(number)) {
                    const suffix = text.replace(String(number), '');
                    animateCounter(stat, number, suffix);
                }
            });
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats-bar, .hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===========================
// Lazy Loading Images
// ===========================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// Custom Cursor Glow Effect
// ===========================

const createCursorEffect = () => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        will-change: transform;
        mix-blend-mode: screen;
    `;

    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.02) 40%, transparent 70%);
        pointer-events: none;
        z-index: 9997;
        opacity: 0;
        will-change: transform;
        transition: opacity 0.4s ease;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
        cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
    }, { passive: true });

    // Smooth glow follow with RAF
    const animateGlow = () => {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.transform = `translate3d(${glowX - 150}px, ${glowY - 150}px, 0)`;
        requestAnimationFrame(animateGlow);
    };
    animateGlow();

    // Enlarge on interactive elements
    const interactiveEls = 'a, button, .btn-primary, .btn-ghost, .social-link, .contact-item, .project-card, .service-card, .nav-link';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveEls)) {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;
            cursor.style.background = 'radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 70%)';
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveEls)) {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent 70%)';
        }
    }, { passive: true });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
    });
};

createCursorEffect();

// ===========================
// Init
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initGalleries();
    initDemoVideos();
    initScrollHook();
    initAnalytics();
    updateLocalTime();
});

document.documentElement.style.visibility = 'visible';
