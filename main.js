// --- THEME TOGGLE (LIGHT/DARK MODE) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList.toggle('light-mode', currentTheme === 'light');
    if (currentTheme === 'light') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.classList.add('light-mode');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
}

// Listen for a click on the button 
themeToggleBtn.addEventListener('click', function (e) {
    // Prevent spam clicking while animating
    const overlay = document.getElementById('theme-transition-overlay');
    if (overlay.classList.contains('animating')) return;

    // Set origin of the overlay to be the button's position
    const rect = themeToggleBtn.getBoundingClientRect();
    overlay.style.top = `${rect.top + rect.height / 2}px`;
    overlay.style.left = `${rect.left + rect.width / 2}px`;

    // Start the expansion animation
    overlay.classList.add('animating');

    // Midway through the animation (750ms out of 1.5s), switch the DOM themes
    setTimeout(() => {
        document.body.classList.toggle('light-mode');

        // Switch the icons
        let theme = 'dark';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light';
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }

        // Save the user's preference in localStorage
        localStorage.setItem('theme', theme);

        // Match the overlay color to the NEW background to make the fade out seamless
        overlay.style.background = getComputedStyle(document.body).backgroundColor;

    }, 750);

    // Remove the animation class once the animation is fully complete
    setTimeout(() => {
        overlay.classList.remove('animating');
        // Reset overlay background for next time to be the opposite of current theme
        overlay.style.background = 'var(--text-main)';
    }, 1500);
});

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- MOBILE MENU TOGGLE ---
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');

    // Animate hamburger to close icon logic could go here
    if (isExpanded) {
        mobileBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg>`;
    } else {
        mobileBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            mobileBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
        }
    });
});

// --- INTERSECTION OBSERVER FOR FADE UPS ---
const fadeElements = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// --- BUBBLY REVEAL FOR HERO ---
document.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll('.bubbly-reveal');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15 + 0.2}s`;

        // Trigger reflow
        void el.offsetWidth;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    renderGallery('all');
});

// --- DYNAMIC GALLERY rendering ---
const galleryData = [
    { id: 1, type: 'photo', title: 'Neon Nights', src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', wide: false },
    { id: 2, type: 'video', title: 'Desert Drifter', src: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', wide: true },
    { id: 3, type: 'photo', title: 'Urban Portraits', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', wide: false },
    { id: 4, type: 'photo', title: 'High-Fashion Editorial', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', wide: false },
    { id: 5, type: 'video', title: 'Ocean Deep Doc', src: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', wide: true },
    { id: 6, type: 'photo', title: 'Automotive Shoot', src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', wide: false },
];

const galleryGrid = document.getElementById('gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderGallery(filterType) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const filtered = galleryData.filter(item => filterType === 'all' || item.type === filterType);

    filtered.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `gallery-item ${item.type} ${item.wide && filterType === 'all' ? 'wide' : ''}`;

        // Add staggered animation initial state
        itemEl.style.opacity = '0';
        itemEl.style.transform = 'scale(0.95)';
        itemEl.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        let playIconHtml = '';
        if (item.type === 'video') {
            playIconHtml = `
            <div class="play-icon">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>`;
        }

        itemEl.innerHTML = `
            <div class="gallery-img-wrapper">
                <img src="${item.src}" alt="${item.title}" class="gallery-img" loading="lazy">
                ${playIconHtml}
            </div>
            <div class="gallery-overlay">
                <h3>${item.title}</h3>
                <p>${item.type === 'photo' ? 'Photography' : 'Videography'}</p>
            </div>
        `;

        galleryGrid.appendChild(itemEl);

        // Animate in staggered
        setTimeout(() => {
            itemEl.style.opacity = '1';
            itemEl.style.transform = 'scale(1)';
        }, 50 + (index * 100));
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderGallery(e.target.dataset.filter);
    });
});

// --- SMOOTH SCROLLING FOR ID LINKS ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- FORM SUBMISSION PREVENT DEFAULT ---
const form = document.getElementById('booking-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.innerHTML = 'Sending... <span style="display:inline-block; animation: spin 1s infinite linear">⏳</span>';

        setTimeout(() => {
            btn.innerHTML = 'Request Sent! ✨';
            btn.style.background = '#4CAF50';
            btn.style.boxShadow = '0 8px 24px rgba(76, 175, 80, 0.4)';
            form.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
            }, 3000);
        }, 1500);
    });
}
