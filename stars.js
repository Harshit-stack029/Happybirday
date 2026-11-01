// Twinkling night sky + shooting stars, shared by every page
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .night-sky { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .night-sky .star {
            position: absolute; border-radius: 50%; background: #fff;
            animation: starTwinkle var(--d) ease-in-out infinite; animation-delay: var(--delay);
        }
        .night-sky .star.lav { background: #d8b4fe; box-shadow: 0 0 6px #c084fc; }
        .night-sky .star.pink { background: #fbcfe8; box-shadow: 0 0 6px #f472b6; }
        @keyframes starTwinkle { 0%, 100% { opacity: 0.15; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.2); } }
        .night-sky .shoot {
            position: absolute; width: 140px; height: 1.5px;
            background: linear-gradient(90deg, rgba(255,255,255,0.9), transparent);
            transform: rotate(-25deg); opacity: 0;
            animation: shoot 1.4s ease-out forwards;
        }
        @keyframes shoot {
            0% { opacity: 0; translate: 0 0; }
            15% { opacity: 1; }
            100% { opacity: 0; translate: -420px 200px; }
        }
    `;
    document.head.appendChild(style);

    const sky = document.createElement('div');
    sky.className = 'night-sky';
    const count = window.innerWidth < 600 ? 90 : 170;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        const r = Math.random();
        s.className = 'star' + (r < 0.12 ? ' lav' : r < 0.2 ? ' pink' : '');
        const size = Math.random() * 2 + 0.6;
        s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
            `--d:${(Math.random() * 3 + 2).toFixed(2)}s;--delay:${(-Math.random() * 5).toFixed(2)}s`;
        sky.appendChild(s);
    }
    document.body.prepend(sky);

    setInterval(() => {
        const s = document.createElement('div');
        s.className = 'shoot';
        s.style.left = (40 + Math.random() * 60) + '%';
        s.style.top = (Math.random() * 40) + '%';
        sky.appendChild(s);
        setTimeout(() => s.remove(), 1500);
    }, 4500);
})();
