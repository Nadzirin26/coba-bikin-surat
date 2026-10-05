document.addEventListener('DOMContentLoaded', () => {
    // Generate Sparkles Background
    const sparklesContainer = document.getElementById('sparkles-container');
    const numSparkles = 40;
    
    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.width = Math.random() * 4 + 2 + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.animationDuration = Math.random() * 3 + 2 + 's';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparklesContainer.appendChild(sparkle);
    }

    // Feminine Confetti (Pink, White, Rose Gold)
    const fireConfetti = (intense = false) => {
        const duration = intense ? 3500 : 1200;
        const end = Date.now() + duration;
        const colors = ['#b76e79', '#f8c8dc', '#ffffff', '#ffb6c1']; 

        (function frame() {
            confetti({
                particleCount: intense ? 10 : 4,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: intense ? 10 : 4,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    // Navigation logic
    const goToPage = (targetId) => {
        const current = document.querySelector('.page.active');
        const target = document.getElementById(targetId);
        
        if (current && target) {
            current.classList.remove('active');
            current.classList.add('hidden');
            
            setTimeout(() => {
                target.classList.remove('hidden');
                setTimeout(() => {
                    target.classList.add('active');
                    
                    if (targetId === 'page-2') {
                        fireConfetti(false);
                    } else if (targetId === 'page-5') {
                        fireConfetti(true);
                    }
                }, 50);
            }, 700);
        }
    };

    // Event Listeners for standard Next buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            goToPage(target);
        });
    });

    // Landing Box Event
    const giftBtn = document.getElementById('gift-btn');
    giftBtn.addEventListener('click', () => {
        giftBtn.classList.add('open');
        setTimeout(() => {
            goToPage('page-2');
        }, 700);
    });

    // Runaway Button Logic (Shopping Cart)
    const runawayBtn = document.getElementById('runaway-btn');
    const stayBtn = document.getElementById('stay-btn');
    
    runawayBtn.addEventListener('mouseover', function() {
        moveButton();
    });
    
    runawayBtn.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        moveButton();
    });

    function moveButton() {
        const container = runawayBtn.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        const maxW = containerRect.width - runawayBtn.offsetWidth;
        const maxH = 140; 
        
        const randomX = Math.floor(Math.random() * maxW) - (maxW/2); 
        const randomY = Math.floor(Math.random() * maxH) - 90;
        
        runawayBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    runawayBtn.addEventListener('click', () => {
        alert("Wah, matre juga ya! Hahaha canda deng. Nanti aku bayarin cilok aja ya 😝");
    });

    stayBtn.addEventListener('click', () => {
        goToPage('page-5');
    });
});
