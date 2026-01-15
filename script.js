// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Progress bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
});

// AI Dream Analysis
async function analyzeDream() {
    const input = document.getElementById('dreamInput').value.trim();
    const responseDiv = document.getElementById('aiResponse');
    const button = document.getElementById('analyzeBtn');

    if (!input) {
        alert('Please describe your dream first!');
        return;
    }

    button.disabled = true;
    button.innerHTML = '<span>Analyzing...</span>';
    responseDiv.className = 'ai-response visible';
    responseDiv.innerHTML = '<p class="loading"><i data-lucide="brain" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;"></i> Thinking deeply about your dream...</p>';
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `You are a supportive dream architect helping someone refine their idea. Analyze this dream/idea and provide:

1. **Clarity Check**: Restate their dream in clear, concise terms
2. **Core Value**: Identify the main value or problem being solved
3. **Target Audience**: Who would benefit most from this?
4. **Key Questions**: 3-4 critical questions they should answer to refine their idea
5. **Next Steps**: 2-3 immediate actions they can take

Be encouraging, specific, and actionable. Keep it under 300 words.

Their dream: ${input}`
                }]
            })
        });

        const data = await response.json();
        const analysisText = data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');

        responseDiv.innerHTML = `
            <h4 style="margin-bottom: 1rem; color: var(--primary-blue); font-family: 'Fraunces', serif; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="sparkles" style="width: 24px; height: 24px;"></i> Dream Analysis</h4>
            <div style="white-space: pre-wrap; line-height: 1.8;">${analysisText}</div>
        `;
        // Re-initialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        responseDiv.innerHTML = `
            <p style="color: var(--text-medium);">
                I'm having trouble connecting right now. But here's what I can tell you: Your dream matters. 
                Take a moment to write down these questions and answer them yourself:
                <br><br>
                • What specific problem does your idea solve?<br>
                • Who needs this solution the most?<br>
                • What's the smallest version you could build to test it?<br>
                • What's stopping you from starting today?
            </p>
        `;
    } finally {
        button.disabled = false;
        button.innerHTML = '<span>Analyze My Dream</span>';
    }
}

// Add click event to analyze button
document.getElementById('analyzeBtn').addEventListener('click', analyzeDream);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.obstacle-card, .timeline-item, .framework-phase, .delivery-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
