/* 
 * Khebra Tech - Animations JS
 * Handles scroll reveals and number counters
 */

 document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };
    
    const animateElements = document.querySelectorAll('.fade-up, .fade-in-right, .fade-in-left');
    
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        elementObserver.observe(el);
    });
    
    // 2. Special Observer for About Section (SVG Path & Numbers)
    const aboutSection = document.getElementById('about');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for SVG animation
                entry.target.classList.add('visible');
                
                // Animate numbers only once
                if (!countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            }
        });
    }, { threshold: 0.3 });
    
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
    
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const fps = 60;
            const frames = duration / (1000 / fps);
            const increment = target / frames;
            
            let current = 0;
            const isFloat = target % 1 !== 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    clearInterval(timer);
                    stat.innerText = target; // Ensure exact final value
                } else {
                    stat.innerText = isFloat ? current.toFixed(1) : Math.floor(current);
                }
            }, 1000 / fps);
        });
    }
});
