// Main application initialization and integration

class PortfolioApp {
    constructor() {
        this.inkEffect = null;
        this.threeScene = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        try {
            this.setupInkEffect();
            this.setupThreeScene();
            this.setupSmoothScrolling();
            this.setupParallaxEffects();
            this.setupIntersectionObserver();
            this.setupPerformanceOptimizations();
            this.setupWorkInteractions();
            
            this.isInitialized = true;
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
        }
    }
    
    setupInkEffect() {
        const canvas = document.getElementById('inkCanvas');
        if (canvas && window.InkDragEffect) {
            this.inkEffect = new InkDragEffect(canvas);
            
            // Add some initial ink drops for visual appeal
            setTimeout(() => {
                this.createInitialInkDrops();
            }, 1000);
        }
    }
    
    setupThreeScene() {
        if (window.THREE && window.ThreeScene) {
            this.threeScene = new ThreeScene();
        }
    }
    
    setupWorkInteractions() {
        const workItems = document.querySelectorAll('.work-item');
        
        workItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.onWorkItemHover(e, item);
            });
            
            item.addEventListener('mouseleave', (e) => {
                this.onWorkItemLeave(e, item);
            });
        });
    }
    
    onWorkItemHover(event, item) {
        // Add hover effects
        item.style.transform = 'translateY(-8px) scale(1.02)';
        
        // Create particle effect
        this.createWorkParticles(event, item);
    }
    
    onWorkItemLeave(event, item) {
        // Reset hover effects
        item.style.transform = 'translateY(0) scale(1)';
    }
    
    createWorkParticles(event, item) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create floating particles around the work item
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'work-particle';
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#ff6b35';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 50 + Math.random() * 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }
    
    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupParallaxEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-content');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupIntersectionObserver() {
        // Animate elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.skill-item, .project-card, .section-title');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        });
        
        // Optimize resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    createInitialInkDrops() {
        if (!this.inkEffect) return;
        
        const canvas = this.inkEffect.canvas;
        const rect = canvas.getBoundingClientRect();
        
        // Create some random ink drops for visual appeal
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                // Simulate mouse movement to create ink
                this.inkEffect.mouse.x = x;
                this.inkEffect.mouse.y = y;
                this.inkEffect.isMouseDown = true;
                this.inkEffect.inkIntensity = 0.8;
                
                setTimeout(() => {
                    this.inkEffect.isMouseDown = false;
                    this.inkEffect.inkIntensity = 1.0;
                }, 200);
            }, i * 500);
        }
    }
    
    handleScroll() {
        // Update header background based on scroll position
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.9)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
    }
    
    handleResize() {
        // Reinitialize components if needed
        if (this.inkEffect) {
            this.inkEffect.resizeCanvas();
        }
        
        if (this.threeScene) {
            this.threeScene.handleResize();
        }
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Public methods for external control
    clearInkEffect() {
        if (this.inkEffect) {
            this.inkEffect.clear();
        }
    }
    
    setInkIntensity(intensity) {
        if (this.inkEffect) {
            this.inkEffect.setInkIntensity(intensity);
        }
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Additional utility functions
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideIn(element, direction = 'up', duration = 300) {
        const start = performance.now();
        const startTransform = direction === 'up' ? 'translateY(30px)' : 'translateX(30px)';
        
        element.style.transform = startTransform;
        element.style.opacity = '0';
        element.style.display = 'block';
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            
            element.style.opacity = easeProgress;
            element.style.transform = direction === 'up' ? 
                `translateY(${30 * (1 - easeProgress)}px)` : 
                `translateX(${30 * (1 - easeProgress)}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.metrics.frameTime = (currentTime - lastTime) / frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Log performance warnings
                if (this.metrics.fps < 30) {
                    console.warn('Low FPS detected:', this.metrics.fps);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        
        // Monitor memory usage if available
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            }, 5000);
        }
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize the application
let portfolioApp;
let performanceMonitor;

// Start the app
portfolioApp = new PortfolioApp();
performanceMonitor = new PerformanceMonitor();

// Export for debugging
window.portfolioApp = portfolioApp;
window.AnimationUtils = AnimationUtils;
window.PerformanceMonitor = PerformanceMonitor;

// Add some CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .nav-links a.active {
        color: var(--secondary-color);
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);