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
        const projectArticles = document.querySelectorAll('#projects article');

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
                    if (container) {
                        console.log('Education section focus status:', isInFocus, 'Targeting container for class toggle:', container);
                        textContainers.push(container);
                    } else {
                        // This else block can be used to log if the container wasn't found, though it's unlikely with current HTML.
                        console.log('Education section in focus:', isInFocus, 'BUT #education .section-content-container > p NOT FOUND');
                    }
                } else if (section.id === 'achievements') {
                    const container = section.querySelector('#achievements .section-content-container > ul');
                    if (container) textContainers.push(container);
                } 
                // Removed: else if (section.id === 'projects') { ... } 
                // Project text scaling is now handled independently per article.

                textContainers.forEach(container => {
                    if (isInFocus) {
                        container.classList.add('text-in-focus');
                    } else {
                        container.classList.remove('text-in-focus');
                    }
                });
            }
        });

        // Image focus handling (now removed from scroll)
        // let imageInFocusFound = false; // No longer needed here
        // The for (const image of focusableImages) loop and its content are removed.
        // The if (!imageInFocusFound) block is also removed.

        // Individual Project Article Text Scaling
        projectArticles.forEach(article => {
            const rect = article.getBoundingClientRect();
            // focusZoneTop and focusZoneBottom are already defined above
            const articleCenterY = rect.top + rect.height / 2;
            const isArticleInFocus = articleCenterY > focusZoneTop && articleCenterY < focusZoneBottom;

            const projectTextDivs = article.querySelectorAll('.project-layout-container > div');
            projectTextDivs.forEach(div => {
                // Exclude div containing the project-gif from scaling
                if (!div.querySelector('img.project-gif')) {
                    if (isArticleInFocus) {
                        div.classList.add('text-in-focus');
                        // console.log('Project article in focus, scaling text div:', div);
                    } else {
                        div.classList.remove('text-in-focus');
                        // console.log('Project article out of focus, removing scale from text div:', div);
                    }
                }
            });
        });
    }

    // Add debounced scroll listener
    window.addEventListener('scroll', debounce(handleScroll, 100));

    // Initial check on page load (for text scaling, not image backgrounds)
    handleScroll();

    // Image hover effect for background change
    const hoverableImageSelector = 
        '#skills .decorative-icon, ' +
        '#achievements .decorative-icon, ' +
        '#certifications .certification-badge, ' +
        '#certifications .aws-logo';
    const hoverableImages = document.querySelectorAll(hoverableImageSelector);

    function handleImageHover(event) {
        const hoveredImage = event.target;
        const parentSection = hoveredImage.closest('main > section');
        if (!parentSection) return;

        const newBgImageUrl = `url("${hoveredImage.src}")`;
        const currentBgImageUrl = parentSection.style.getPropertyValue('--section-dynamic-bg-image');

        if (parentSection.classList.contains('image-background-active') && newBgImageUrl !== currentBgImageUrl) {
            // Section is active with a different image, fade out then fade in new one
            parentSection.classList.add('fade-out-bg');
            setTimeout(() => {
                parentSection.style.setProperty('--section-dynamic-bg-image', newBgImageUrl);
                parentSection.classList.remove('fade-out-bg'); // This triggers fade-in
            }, 250); 
        } else if (!parentSection.classList.contains('image-background-active')) {
            // Section is not currently active, set image and fade it in
            parentSection.style.setProperty('--section-dynamic-bg-image', newBgImageUrl);
            parentSection.classList.add('image-background-active');
        }
        // Else: section is active with the same image, do nothing.
    }

    function handleImageLeave(event) {
        const hoveredImage = event.target;
        const parentSection = hoveredImage.closest('main > section');
        if (!parentSection) return;

        const relatedTarget = event.relatedTarget;
        // Check if the mouse has moved to another hoverable image within the same section
        if (relatedTarget && parentSection.contains(relatedTarget) && relatedTarget.matches(hoverableImageSelector)) {
            return; // Still inside another hoverable image in the same section
        }

        // Mouse has left the boundaries of all hoverable images in the section
        parentSection.classList.remove('image-background-active'); // This will trigger fade-out
        // As per instruction, not removing --section-dynamic-bg-image to avoid issues with quick re-hover
        // setTimeout(() => {
        //     parentSection.style.removeProperty('--section-dynamic-bg-image');
        // }, 250); 
    }

    hoverableImages.forEach(image => {
        image.addEventListener('mouseenter', handleImageHover);
        image.addEventListener('mouseleave', handleImageLeave);
    });
});
