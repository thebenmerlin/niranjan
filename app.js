class DeveloperPortfolio {
    constructor() {
        this.currentPage = 'home';
        this.isMobileMenuOpen = false;
        this.animationObserver = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
        this.initScrollAnimations();
        this.showPage('home');
        this.startTypingAnimation();
        this.animateStats();
        
        // Handle initial URL
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            this.showPage(hash);
        }

        // Ensure sidebar is visible on desktop
        this.handleResize();
    }

    bindEvents() {
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-item').getAttribute('data-page');
                this.showPage(page);
                this.closeMobileMenu();
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-toggle') && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || window.location.hash.substring(1) || 'home';
            this.showPage(page, false);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Project cards interaction
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProjectCard(card, true);
            });
            card.addEventListener('mouseleave', () => {
                this.animateProjectCard(card, false);
            });
        });

        // Skill tags interaction
        const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.pulseElement(tag);
            });
        });
    }

    showPage(pageId, updateUrl = true) {
        console.log(`Switching to page: ${pageId}`);
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.add('hidden');
            page.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.style.display = 'block';
            this.currentPage = pageId;
            
            // Update navigation
            this.updateNavigation(pageId);
            
            // Update URL
            if (updateUrl) {
                const newUrl = pageId === 'home' ? '#home' : `#${pageId}`;
                window.history.pushState({ page: pageId }, '', newUrl);
            }
            
            // Trigger page animations
            setTimeout(() => {
                this.triggerPageAnimations(pageId);
            }, 100);
            
            // Track page view
            this.trackPageView(pageId);
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            console.error(`Page ${pageId} not found`);
        }
    }

    updateNavigation(activePageId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === activePageId) {
                item.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.getElementById('mobile-toggle');
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            sidebar.classList.add('open');
            if (mobileToggle) {
                mobileToggle.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.getElementById('mobile-toggle');
        
        this.isMobileMenuOpen = false;
        sidebar.classList.remove('open');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    handleResize() {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.querySelector('.mobile-toggle');
        
        if (window.innerWidth <= 1024) {
            // Mobile/tablet view
            if (mobileToggle) {
                mobileToggle.style.display = 'flex';
            }
            if (!this.isMobileMenuOpen) {
                sidebar.style.transform = 'translateX(-100%)';
            }
        } else {
            // Desktop view
            if (mobileToggle) {
                mobileToggle.style.display = 'none';
            }
            sidebar.style.transform = 'translateX(0)';
            sidebar.classList.remove('open');
            this.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    startTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Building with Java | Solving with DSA | Exploring AI-ML',
            'CSBS Student | Silver Medalist | Tech Enthusiast',
            'Problem Solver | Full-Stack Developer | Innovation Seeker',
            'Organizing Change @ Rotaract & PDC | LeetCode Solver'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, typingSpeed);
        };

        // Start typing animation after a delay
        setTimeout(type, 1000);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number, .stat-value');
        
        const animateValue = (element, start, end, duration, suffix = '') => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
    
                // Easing for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = easeOutQuart * (end - start) + start;
    
                // ✅ Handle decimals, integers, and large numbers separately
                if (end % 1 !== 0) {
                    // If target number has decimals → keep 2 decimal places
                    element.textContent = current.toFixed(2) + suffix;
                } else if (end > 999999) {
                    // Large integers → add commas
                    element.textContent = Math.floor(current).toLocaleString() + suffix;
                } else {
                    // Normal integers
                    element.textContent = Math.floor(current) + suffix;
                }
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
    
            requestAnimationFrame(animate);
        };
    
        // Animate stats when they scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent.replace(/,/g, '');
                    const value = parseFloat(text);
    
                    if (!isNaN(value) && value > 0) {
                        element.textContent = '0';
                        setTimeout(() => {
                            animateValue(element, 0, value, 2000);
                        }, 200);
                    }
    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
    
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    

    initAnimations() {
        // Add entrance animations to cards
        const cards = document.querySelectorAll('.card, .project-card, .education-card, .certification-card, .achievement-card, .leetcode-card, .about-card, .skill-category');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            card.style.transitionDelay = `${index * 100}ms`;
        });
    }

    initScrollAnimations() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll(
            '.card, .project-card, .education-card, .certification-card, .achievement-card, .skill-category, .timeline-item, .leetcode-card, .about-card'
        );
        
        animateElements.forEach(element => {
            element.classList.add('fade-in');
            this.animationObserver.observe(element);
        });
    }

    triggerPageAnimations(pageId) {
        const page = document.getElementById(pageId);
        if (!page) return;

        // Reset and trigger animations for the current page
        const animateElements = page.querySelectorAll('.fade-in, .card, .project-card, .education-card, .certification-card, .achievement-card, .skill-category, .leetcode-card, .about-card');
        
        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Special animations for specific pages
        if (pageId === 'leetcode') {
            this.animateLeetCodeStats();
        } else if (pageId === 'skills') {
            this.animateSkillBars();
        }
    }

    animateLeetCodeStats() {
        setTimeout(() => {
            const statCards = document.querySelectorAll('#leetcode .stat-card');
            
            statCards.forEach((card, index) => {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }, index * 150);
            });

            // Animate skill badges
            setTimeout(() => {
                const skillBadges = document.querySelectorAll('#leetcode .skill-badge');
                skillBadges.forEach((badge, index) => {
                    badge.style.transform = 'translateX(-20px)';
                    badge.style.opacity = '0';
                    
                    setTimeout(() => {
                        badge.style.transition = 'all 0.4s ease-out';
                        badge.style.transform = 'translateX(0)';
                        badge.style.opacity = '1';
                    }, index * 50);
                });
            }, 800);
        }, 500);
    }

    animateSkillBars() {
        setTimeout(() => {
            const skillItems = document.querySelectorAll('#skills .skill-item');
            
            skillItems.forEach((item, index) => {
                item.style.transform = 'translateX(-50px)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s ease-out';
                    item.style.transform = 'translateX(0)';
                    item.style.opacity = '1';
                }, index * 100);
            });
        }, 300);
    }

    animateProjectCard(card, isHovering) {
        const techTags = card.querySelectorAll('.tech-tag');
        
        if (isHovering) {
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px) scale(1.05)';
                    tag.style.background = 'var(--dev-accent-blue)';
                    tag.style.color = 'white';
                }, index * 50);
            });
        } else {
            techTags.forEach(tag => {
                tag.style.transform = '';
                tag.style.background = '';
                tag.style.color = '';
            });
        }
    }

    pulseElement(element) {
        element.style.animation = 'pulse 0.3s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
        
        // Add pulse keyframes if not already present
        if (!document.querySelector('#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Analytics and tracking
    trackPageView(page) {
        console.log(`📊 Page view: ${page}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: page,
                page_location: window.location.href
            });
        }
    }

    trackEvent(category, action, label) {
        console.log(`📈 Event: ${category} - ${action} - ${label}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Keyboard navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const pages = ['home', 'education', 'projects', 'skills', 'experience', 'certifications', 'achievements', 'leetcode'];
                const currentIndex = pages.indexOf(this.currentPage);
                
                if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
                    e.preventDefault();
                    this.showPage(pages[currentIndex + 1]);
                } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    e.preventDefault();
                    this.showPage(pages[currentIndex - 1]);
                }
            }
        });
    }

    // Easter eggs
    initEasterEggs() {
        // Logo click counter
        let logoClicks = 0;
        const logo = document.querySelector('.logo');
        
        if (logo) {
            logo.addEventListener('click', () => {
                logoClicks++;
                
                if (logoClicks === 5) {
                    this.showSecretMessage();
                    logoClicks = 0;
                }
            });
        }
    }

    showSecretMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--dev-bg-secondary);
                border: 2px solid var(--dev-accent-blue);
                border-radius: var(--radius-lg);
                padding: var(--space-24);
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                text-align: center;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            ">
                <h3 style="color: var(--dev-accent-blue); margin-bottom: var(--space-16);">🎉 You found it!</h3>
                <p style="color: var(--dev-text-primary); margin-bottom: var(--space-16);">
                    Thanks for exploring my portfolio! I'm always excited to connect with fellow developers and discuss new opportunities.
                </p>
                <button onclick="this.closest('div').remove()" style="
                    background: var(--dev-accent-blue);
                    color: white;
                    border: none;
                    padding: var(--space-8) var(--space-16);
                    border-radius: var(--radius-base);
                    cursor: pointer;
                    font-weight: 500;
                ">Close</button>
            </div>
            <div onclick="this.remove()" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
            "></div>
        `;
        
        document.body.appendChild(message);
    }

    // Performance optimization
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Cleanup method
    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new DeveloperPortfolio();
    
    // Initialize additional features
    portfolio.initEasterEggs();
    portfolio.initLazyLoading();
    portfolio.initKeyboardNavigation();
    
    // Make portfolio instance globally available for debugging
    window.portfolio = portfolio;
    
    // Debug information
    console.log(`
    🚀 Niranjan Prasad - Developer Analytics Hub
    ==========================================
    
    Built with vanilla HTML, CSS, and JavaScript
    Design: Clean Technical Developer Analytics
    
    Navigation: Use the sidebar or Alt + Arrow keys
    Easter eggs: Click the logo 5 times
    
    Contact: niranjanprasad1641@gmail.com
    LinkedIn: https://www.linkedin.com/in/niranjanp-dev
    GitHub: https://github.com/niranjanprasad
    LeetCode: https://leetcode.com/niranjanprasad
    `);
    
    // Ensure all pages are properly initialized
    const pages = document.querySelectorAll('.page');
    console.log(`Found ${pages.length} pages:`, Array.from(pages).map(p => p.id));
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const [navigationEntry] = performance.getEntriesByType('navigation');
            const loadTime = navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.startTime : 0;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        });
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeveloperPortfolio;
}