document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('#main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('nav-active');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = mainNav.classList.contains('nav-active');
            hamburgerMenu.setAttribute('aria-expanded', isExpanded);
            // Toggle active class on hamburger icon itself for styling (e.g., transform to "X")
            hamburgerMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('header nav ul#main-nav li a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get header height to offset scroll position
                // This is important if the header is fixed and overlays content
                let headerHeight = 0;
                const header = document.querySelector('header');
                // Check if header is fixed and currently visible (not static on mobile, for instance)
                if (header && getComputedStyle(header).position === 'fixed') {
                    headerHeight = header.offsetHeight;
                }

                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Optional: Close mobile menu after clicking a link
                if (mainNav && mainNav.classList.contains('nav-active')) {
                    mainNav.classList.remove('nav-active');
                    hamburgerMenu.classList.remove('active');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme Switch Functionality
    const themeSwitchBtn = document.getElementById('theme-switch-btn');
    const sunIcon = document.querySelector('#theme-switch-btn .sun-icon');
    const moonIcon = document.querySelector('#theme-switch-btn .moon-icon');

    // Function to set theme and update icons
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    }

    if (themeSwitchBtn && sunIcon && moonIcon) {
        themeSwitchBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            setTheme(!isDark); // Toggle the theme
        });

        // Check for saved theme preference on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme === 'dark');
        } else {
            // Default to light theme if no preference is stored
            // or could use window.matchMedia('(prefers-color-scheme: dark)').matches for system preference
            setTheme(false); 
        }
    } else {
        // Fallback for icons if button exists but icons might be missing (e.g. during dev)
        // Or if button itself is missing.
        // Ensure default state (light theme) if elements are not found
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
        // If button is missing, no theme switching can occur, so localStorage interaction is skipped.
    }
});
