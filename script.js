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

    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Scroll-based focus detection
    const sections = document.querySelectorAll('main > section');
    const focusableImages = document.querySelectorAll(
        '#about .profile-photo, ' +
        '#skills .decorative-icon, ' +
        '#certifications .certification-badge, ' +
        '#certifications .aws-logo, ' +
        '#education .decorative-icon, ' +
        '#achievements .decorative-icon, ' +
        '#projects .project-gif'
    );

    function handleScroll() {
        const windowHeight = window.innerHeight;
        const focusZoneTop = windowHeight * 0.10;
        const focusZoneBottom = windowHeight * 0.90;

        sections.forEach(section => {
            if (section && section.id) { // Ensure section and section.id exist
                const rect = section.getBoundingClientRect();
                const sectionCenterY = rect.top + rect.height / 2;
                const isInFocus = sectionCenterY > focusZoneTop && sectionCenterY < focusZoneBottom;

                console.log(`Section ${section.id} is ${isInFocus ? 'in' : 'out of'} focus`);

                const textContainers = [];
                if (section.id === 'about') {
                    const container = section.querySelector('#about .section-content-container > p');
                    if (container) textContainers.push(container);
                } else if (section.id === 'skills') {
                    const container = section.querySelector('#skills .section-content-container > ul');
                    if (container) textContainers.push(container);
                } else if (section.id === 'certifications') {
                    const container = section.querySelector('#certifications .section-content-container > ul');
                    if (container) textContainers.push(container);
                } else if (section.id === 'education') {
                    const container = section.querySelector('#education .section-content-container > p');
                    if (container) textContainers.push(container);
                } else if (section.id === 'achievements') {
                    const container = section.querySelector('#achievements .section-content-container > ul');
                    if (container) textContainers.push(container);
                } else if (section.id === 'projects') {
                    const projectTextDivs = section.querySelectorAll('#projects .project-layout-container > div');
                    projectTextDivs.forEach(div => {
                        // Ensure we are not targeting the div containing the GIF
                        if (!div.querySelector('img.project-gif')) {
                            textContainers.push(div);
                        }
                    });
                }

                textContainers.forEach(container => {
                    if (isInFocus) {
                        container.classList.add('text-in-focus');
                    } else {
                        container.classList.remove('text-in-focus');
                    }
                });
            }
        });

        // Image focus handling
        let imageInFocusFound = false;

        for (const image of focusableImages) {
            const rect = image.getBoundingClientRect();
            const imageCenterY = rect.top + rect.height / 2;
            const isImageInFocus = imageCenterY > focusZoneTop && imageCenterY < focusZoneBottom;
            const parentSection = image.closest('main > section');

            if (parentSection) {
                if (isImageInFocus && !imageInFocusFound) {
                    // If this section already has this specific image as background, mark as found and continue
                    if (parentSection.classList.contains('image-background-active') &&
                        parentSection.style.getPropertyValue('--section-dynamic-bg-image') === `url("${image.src}")`) {
                        imageInFocusFound = true;
                        continue; 
                    }

                    // Clear from other sections
                    sections.forEach(s => {
                        if (s !== parentSection) {
                            s.classList.remove('image-background-active');
                            s.style.removeProperty('--section-dynamic-bg-image');
                        }
                    });
                    
                    parentSection.classList.add('image-background-active');
                    parentSection.style.setProperty('--section-dynamic-bg-image', `url("${image.src}")`);
                    imageInFocusFound = true;
                    // Do not break here, allow other images in the same section to be processed (though only the first one would have set the background)
                    // However, the prompt implies the *first* image found in focus across *all* images should win.
                    // To achieve that, we would break. Let's stick to the current loop structure for now,
                    // which means the last image in focusableImages within a section could override previous ones in the same section if imageInFocusFound was not set yet.
                    // The current logic correctly ensures only *one* section has the background due to `imageInFocusFound` and clearing other sections.
                } else {
                    // If this specific image was the one that set the background for this parentSection, remove it.
                    if (parentSection.classList.contains('image-background-active') &&
                        parentSection.style.getPropertyValue('--section-dynamic-bg-image') === `url("${image.src}")`) {
                        parentSection.classList.remove('image-background-active');
                        parentSection.style.removeProperty('--section-dynamic-bg-image');
                        // Note: imageInFocusFound remains true if another image in focus already set the background.
                        // If this was the image that set imageInFocusFound to true, and it's now out of focus,
                        // the flag isn't reset here, which is handled by the final check.
                    }
                }
            }
        }

        // If no image was found in focus at all after checking all images, clear any remaining active section.
        if (!imageInFocusFound) {
            sections.forEach(s => {
                s.classList.remove('image-background-active');
                s.style.removeProperty('--section-dynamic-bg-image');
            });
        }
    }

    // Add debounced scroll listener
    window.addEventListener('scroll', debounce(handleScroll, 100));

    // Initial check on page load
    handleScroll();
});
