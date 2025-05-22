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
    const themeToggle = document.getElementById('theme-toggle');
    
    // Function to set theme
    function setTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        themeToggle.checked = isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Listen for toggle changes
    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
});
