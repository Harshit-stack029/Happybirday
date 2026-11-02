// Cursor following effect
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Typing effect for greeting
const greetingText = "Hey KATHYAYINI, you know what? You're the most adorable human I've ever met! 💖";
const greetingElement = document.querySelector('.greeting');
let charIndex = 0;

// The not-yet-typed part is rendered invisibly, so the greeting takes its
// final height from the start and never pushes into the lines below it.
const typedSpan = document.createElement('span');
const restSpan = document.createElement('span');
restSpan.style.visibility = 'hidden';
greetingElement.append(typedSpan, restSpan);
restSpan.textContent = greetingText;

function typeGreeting() {
    if (charIndex < greetingText.length) {
        // step over whole emoji (surrogate pairs) so they never show half-drawn
        const cp = greetingText.codePointAt(charIndex);
        charIndex += cp > 0xffff ? 2 : 1;
        typedSpan.textContent = greetingText.slice(0, charIndex);
        restSpan.textContent = greetingText.slice(charIndex);
        setTimeout(typeGreeting, 100);
    }
}

// Create floating elements
const floatingElements = ['💖', '✨', '🪻', '💜', '💕', '🪻'];
function createFloating() {
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = Math.random() * 100 + 'vh';
    element.style.fontSize = (Math.random() * 20 + 20) + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -500,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        opacity: 1,
        ease: "none",
        onComplete: () => element.remove()
    });
}

// Initialize animations
window.addEventListener('load', () => {
    // Title animation
    gsap.to('h1', {
        opacity: 1,
        duration: 1,
        y: 20,
        ease: "bounce.out"
    });

    // Start typing effect
    typeGreeting();

    // Create floating elements periodically
    setInterval(createFloating, 1000);
});

// Hover effects
       // Hover effects
       document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
        });

        // Smooth page transition on click
        button.addEventListener('click', () => {
            gsap.to('body', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    window.location.href = 'cause.html'; // Replace with the actual URL of the next page
                }
            });
        });
    });

// ---------- Cake: blow out the candle ----------
const flame = document.getElementById('flame');
const smoke = document.getElementById('smoke');
const blowText = document.getElementById('blowText');
const cakeEl = document.getElementById('cake');
let candleOut = false;

function blowOut() {
    if (candleOut) return;
    candleOut = true;
    flame.classList.add('out');
    smoke.classList.add('puff');
    stopMic();

    blowText.classList.add('done');
    blowText.innerHTML = 'Yayyy! Happy Birthday, my love 🎉💖';
    gsap.fromTo(blowText, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out' });
    gsap.fromTo(cakeEl, { rotation: -4 }, { rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });

    burstConfetti();

    const btn = document.querySelector('.cta-button');
    btn.classList.add('ready');
    gsap.to(btn, { opacity: 1, y: -20, duration: 1, delay: 0.8, ease: 'back.out' });
}

function burstConfetti() {
    const colors = ['#f472b6', '#c084fc', '#fde68a', '#a5f3fc', '#fbcfe8', '#ffffff'];
    const rect = cakeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.3;
    for (let i = 0; i < 90; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.background = colors[i % colors.length];
        c.style.left = cx + 'px';
        c.style.top = cy + 'px';
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(c);
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 260;
        gsap.to(c, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 80,
            rotation: Math.random() * 720,
            duration: 1.2 + Math.random(),
            ease: 'power2.out'
        });
        gsap.to(c, {
            y: '+=' + (300 + Math.random() * 300),
            opacity: 0,
            duration: 1.6,
            delay: 1.1,
            ease: 'power1.in',
            onComplete: () => c.remove()
        });
    }
}

// Tap / click / keyboard
flame.addEventListener('click', blowOut);
cakeEl.addEventListener('click', blowOut);
cakeEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blowOut(); }
});

// Optional: blow into the microphone
let micStream = null;
let micCtx = null;
async function startMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = micCtx.createAnalyser();
        analyser.fftSize = 512;
        micCtx.createMediaStreamSource(micStream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        let loudFrames = 0;
        (function listen() {
            if (candleOut) return;
            analyser.getByteTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                const v = (data[i] - 128) / 128;
                sum += v * v;
            }
            const rms = Math.sqrt(sum / data.length);
            loudFrames = rms > 0.18 ? loudFrames + 1 : 0;
            if (loudFrames > 6) blowOut();
            else requestAnimationFrame(listen);
        })();
    } catch (err) {
        // Mic denied or unavailable: tapping still works
    }
}
function stopMic() {
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    if (micCtx) micCtx.close();
    micStream = null;
    micCtx = null;
}
const micHint = blowText.querySelector('small');
micHint.addEventListener('click', (e) => { e.stopPropagation(); startMic(); });
micHint.style.cursor = 'pointer';
micHint.style.textDecoration = 'underline dotted';
