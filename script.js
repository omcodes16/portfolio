// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// =============================================
// UNIFIED PRELOADER LOGIC
// Phase 1: Welcome (0-3s) → Phase 2: 6-Stage Scrollytelling → Grand Reveal
// =============================================
(function() {
    const preloader = document.getElementById('unified-preloader');
    if (!preloader) { lenis.start(); return; }

    lenis.stop();

    // ---- 3D PRELOADER PARTICLE MESH ----
    const plCanvas = document.getElementById('preloader-canvas');
    const plCtx   = plCanvas.getContext('2d');
    let plW, plH, particles = [], plMouseX = 0, plMouseY = 0;
    let plScrollRotY = 0, plScrollRotX = 0;
    let plAnimId;

    function resizePreloaderCanvas() {
        plW = plCanvas.width  = window.innerWidth;
        plH = plCanvas.height = window.innerHeight;
    }
    resizePreloaderCanvas();
    window.addEventListener('resize', resizePreloaderCanvas);

    // Build particle field
    const PARTICLE_COUNT = 140;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: Math.random() * 2 - 1,
            r: Math.random() * 1.8 + 0.6,
            speed: (Math.random() * 0.0003 + 0.0001)
        });
    }

    function project(px, py, pz, fov) {
        const scale = fov / (fov + pz);
        return { sx: px * scale, sy: py * scale, scale };
    }

    let plTime = 0;
    function drawPreloaderCanvas() {
        plAnimId = requestAnimationFrame(drawPreloaderCanvas);
        plCtx.clearRect(0, 0, plW, plH);
        plTime += 0.003;

        // Mouse parallax offsets
        const mx = (plMouseX / plW) * 2 - 1;
        const my = (plMouseY / plH) * 2 - 1;

        const rotY = plScrollRotY + plTime * 0.12 + mx * 0.15;
        const rotX = plScrollRotX + plTime * 0.05 + my * 0.08;

        const fov = 320;
        const cx  = plW / 2, cy = plH / 2;
        const projPts = [];

        particles.forEach((p, idx) => {
            // 3D rotation: Y then X
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            let x = p.x, y = p.y, z = p.z;
            // Rotate Y
            let x1 = x * cosY - z * sinY;
            let z1 = x * sinY + z * cosY;
            // Rotate X
            let y2 = y * cosX - z1 * sinX;
            let z2 = y * sinX + z1 * cosX;

            const proj = project(x1, y2, z2 + 2.5, fov);
            const sx = cx + proj.sx * plW * 0.38;
            const sy = cy + proj.sy * plH * 0.38;
            const alpha = Math.min(1, Math.max(0.15, proj.scale));
            const size  = p.r * proj.scale;

            projPts.push({ sx, sy, alpha, size, idx });

            // Draw node
            plCtx.beginPath();
            plCtx.arc(sx, sy, size, 0, Math.PI * 2);
            // Color: deep indigo → emerald blend based on y
            const g = Math.floor((p.y + 1) * 0.5 * 60);
            plCtx.fillStyle = `rgba(${26 + g}, ${26 + g*2}, ${58 + g}, ${alpha * 0.85})`;
            plCtx.fill();
        });

        // Draw edges between nearby nodes
        for (let a = 0; a < projPts.length; a++) {
            for (let b = a + 1; b < projPts.length; b++) {
                const dx = projPts[a].sx - projPts[b].sx;
                const dy = projPts[a].sy - projPts[b].sy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    const edgeAlpha = (1 - dist/120) * 0.22;
                    plCtx.beginPath();
                    plCtx.moveTo(projPts[a].sx, projPts[a].sy);
                    plCtx.lineTo(projPts[b].sx, projPts[b].sy);
                    plCtx.strokeStyle = `rgba(100, 120, 200, ${edgeAlpha})`;
                    plCtx.lineWidth = 0.7;
                    plCtx.stroke();
                }
            }
        }
    }

    // Track mouse for parallax
    window.addEventListener('mousemove', (e) => {
        plMouseX = e.clientX;
        plMouseY = e.clientY;
    });

    drawPreloaderCanvas();

    // ---- PHASE 1: WELCOME TYPEWRITER ----
    const welcomePhase   = document.getElementById('welcome-phase');
    const welcomeTextEl  = document.getElementById('welcome-text');
    const narrativePhase = document.getElementById('narrative-phase');

    const welcomeMsg = '> Thank you for visiting my profile.';

    function typeWriter(el, text, speed, done) {
        let i = 0;
        el.innerHTML = '<span class="terminal-cursor"></span>';
        const cursor = el.querySelector('.terminal-cursor');
        const tick = () => {
            if (i < text.length) {
                el.insertBefore(document.createTextNode(text[i++]), cursor);
                setTimeout(tick, speed);
            } else {
                if (done) done(cursor);
            }
        };
        setTimeout(tick, speed);
    }

    setTimeout(() => {
        typeWriter(welcomeTextEl, welcomeMsg, 28, (cursor) => {
            // Hold 0.5s then blur-fade out the welcome phase
            setTimeout(() => {
                cursor.remove();
                welcomePhase.classList.add('fade-blur-out');

                // After welcome fades (400ms), show narrative phase
                setTimeout(() => {
                    welcomePhase.style.display = 'none';
                    narrativePhase.classList.remove('hidden');
                    activateNarrativePhase();
                }, 420);
            }, 500);
        });
    }, 200);

    // ---- PHASE 2: SCROLL-TRIGGERED NARRATIVE ----
    const stages       = Array.from(document.querySelectorAll('.narrative-stage'));
    const totalStages  = stages.length; // 6
    const progressFill = document.getElementById('scroll-progress-fill');
    let currentStage   = 0;
    let scrollAcc      = 0;
    const SCROLL_THRESH = 130; // px needed to advance
    let narrativeActive = false;

    function activateNarrativePhase() {
        narrativeActive = true;
        showStage(0);
    }

    function showStage(idx) {
        stages.forEach((s, i) => {
            s.classList.toggle('active', i === idx);
        });
        currentStage = idx;
        if (progressFill) {
            progressFill.style.width = ((idx / (totalStages - 1)) * 100) + '%';
        }
        // Spin the 3D mesh with scroll
        plScrollRotY = (idx / (totalStages - 1)) * Math.PI * 0.8 * 15 * Math.PI/180;
        plScrollRotX = (idx / (totalStages - 1)) * Math.PI * 0.8 * 5  * Math.PI/180;
    }

    function handleNarrativeScroll(e) {
        if (!narrativeActive) return;
        scrollAcc += e.deltaY;

        if (scrollAcc > SCROLL_THRESH) {
            scrollAcc = 0;
            if (currentStage < totalStages - 1) {
                showStage(currentStage + 1);
            } else {
                // Grand Reveal
                triggerGrandReveal();
            }
        } else if (scrollAcc < -SCROLL_THRESH) {
            scrollAcc = 0;
            if (currentStage > 0) {
                showStage(currentStage - 1);
            }
        }
    }

    // Touch support
    let touchStartY2 = 0;
    window.addEventListener('touchstart', (e) => { touchStartY2 = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!narrativeActive) return;
        const delta = (touchStartY2 - e.touches[0].clientY) * 2;
        handleNarrativeScroll({ deltaY: delta });
        touchStartY2 = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('wheel', handleNarrativeScroll, { passive: true });

    // ---- GRAND REVEAL ----
    function triggerGrandReveal() {
        narrativeActive = false;
        cancelAnimationFrame(plAnimId); // Stop preloader canvas

        preloader.classList.add('grand-reveal');

        setTimeout(() => {
            preloader.style.display = 'none';
            lenis.start();
            if (typeof initHeroAnimation === 'function') initHeroAnimation();
        }, 820);
    }

})();


function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Magnetic Cursor Setup
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const magneticElements = document.querySelectorAll('.magnetic');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// Update mouse coordinates on move
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Render cursor position
function renderCursor() {
    // Easing for the dot
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    
    // Easing for the follower
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

    requestAnimationFrame(renderCursor);
}
renderCursor();

// Magnetic Pull Logic
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        // Strength of magnetic pull
        const strength = el.getAttribute('data-strength') || 20;

        // Apply transform to element
        gsap.to(el, {
            x: ((distX / rect.width) * strength),
            y: ((distY / rect.height) * strength),
            duration: 0.4,
            ease: "power2.out"
        });

        // Add hover classes to cursor
        cursor.classList.add('hover-magnetic');
        cursorFollower.classList.add('hover-magnetic');
    });

    el.addEventListener('mouseleave', () => {
        // Reset element transform
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });

        // Remove hover classes from cursor
        cursor.classList.remove('hover-magnetic');
        cursorFollower.classList.remove('hover-magnetic');
    });
});

// Three.js Scene Setup (Cyber-Grid Topology)
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Cyber-Grid Topology (Points & Lines)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800; // Optimal for performance & aesthetics
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread out across a wide area
    posArray[i] = (Math.random() - 0.5) * 60;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Deep Indigo and Cyber Lime Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x3f51b5, // Electric Indigo base
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Optional: Subtle connection lines (Wireframe Sphere to simulate mesh network)
const meshGeometry = new THREE.IcosahedronGeometry(20, 2);
const meshMaterial = new THREE.MeshBasicMaterial({
    color: 0xccff00, // Cyber Lime nodes
    wireframe: true,
    transparent: true,
    opacity: 0.03,
    blending: THREE.AdditiveBlending
});
const meshNetwork = new THREE.Mesh(meshGeometry, meshMaterial);
scene.add(meshNetwork);

// Handle window resize dynamically inside ThreeJS setup
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let time = 0;
function animateThree() {
    requestAnimationFrame(animateThree);
    time += 0.005;

    // Slow organic rotation
    particlesMesh.rotation.y = time * 0.5;
    particlesMesh.rotation.x = time * 0.2;
    meshNetwork.rotation.y = -time * 0.3;
    meshNetwork.rotation.z = time * 0.1;

    // Interactive Mouse Parallax (translating camera slightly)
    if (typeof mouseX !== 'undefined') {
        const mx = (mouseX / window.innerWidth) * 2 - 1;
        const my = -(mouseY / window.innerHeight) * 2 + 1;
        camera.position.x += (mx * 2 - camera.position.x) * 0.05;
        camera.position.y += (my * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
}
animateThree();

// Drift Transitions (Intersection Observer)
const driftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-drift').forEach((el) => {
    driftObserver.observe(el);
});

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Trace Line Animation (GSAP ScrollTrigger)
gsap.registerPlugin(ScrollTrigger);

const traceLine = document.querySelector('.trace-line');

// Assuming path is drawn, we animate strokeDashoffset
gsap.to(traceLine, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// Matter.js Interactive Physics Logic (The Tech Stack)
window.addEventListener('load', () => {
    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engine.world.gravity.y = 0.2; // Low gravity for Anti Gravity feel

    const physicsContainer = document.getElementById('physics-container');
    const containerRect = physicsContainer.getBoundingClientRect();

    // Static Walls to keep elements inside container
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(containerRect.width/2, containerRect.height + 25, containerRect.width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, containerRect.height/2, 50, containerRect.height * 2, wallOptions);
    const rightWall = Bodies.rectangle(containerRect.width + 25, containerRect.height/2, 50, containerRect.height * 2, wallOptions);
    const ceiling = Bodies.rectangle(containerRect.width/2, -25, containerRect.width, 50, wallOptions);

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Physical Bodies linked to DOM nodes
    const techItems = document.querySelectorAll('.physics-item');
    const bodiesMap = new Map();

    techItems.forEach(item => {
        let width = item.offsetWidth || 120;
        let height = item.offsetHeight || 120;
        let type = item.classList.contains('soft') ? 'soft' : 'hard';
        
        // Spawn randomly inside
        let startX = Math.random() * (containerRect.width - width) + (width/2);
        let startY = Math.random() * (containerRect.height/2) + (height/2);

        let body = Bodies.rectangle(startX, startY, width, height, {
            angle: Math.random() * Math.PI,
            restitution: type === 'soft' ? 0.9 : 0.4, // Soft bounces more
            friction: 0.1,
            frictionAir: 0.02,
        });

        Composite.add(engine.world, body);
        bodiesMap.set(item, body);
    });

    // Sync DOM elements with Physics Bodies
    Matter.Events.on(engine, 'afterUpdate', function() {
        bodiesMap.forEach((body, domItem) => {
            domItem.style.transform = `translate(-50%, -50%) translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
        });
    });

    // Add Mouse Dragging
    const mouse = Mouse.create(physicsContainer);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    Composite.add(engine.world, mouseConstraint);

    // Prevent matter.js mouse scroll from interfering with page scroll
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Run the engine
    Runner.run(Runner.create(), engine);

    // Random 'Anti-Gravity' bumps
    setInterval(() => {
        bodiesMap.forEach((body) => {
            // Only bump if not currently dragged
            if (mouseConstraint.body !== body) {
                Matter.Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.05,
                    y: (Math.random() - 0.5) * 0.05
                });
            }
        });
    }, 2000);
    
    // Handle container resize (simple fix: just widen the right wall)
    window.addEventListener('resize', () => {
        const newRect = physicsContainer.getBoundingClientRect();
        Matter.Body.setPosition(rightWall, { x: newRect.width + 25, y: newRect.height/2 });
        Matter.Body.setPosition(ground, { x: newRect.width/2, y: newRect.height + 25 });
        Matter.Body.setPosition(ceiling, { x: newRect.width/2, y: -25 });
    });
});

// ==========================================
// GSAP SCROLLTRIGGER ANIMATIONS
// ==========================================

// 1. Hero Entrance Animation (Triggered after Preloader)
function initHeroAnimation() {
    const tl = gsap.timeline();
    // Start pulsing the background wireframe (simulated by scaling the canvas slightly)
    gsap.to('#canvas-container', { scale: 1.05, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    tl.to('.gsap-hero-name', { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power3.out' })
      .to('.gsap-hero-sub', { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.5")
      .to('.gsap-hero-btn', { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' }, "-=0.3");
}

// (Removed redundant originalPreloaderExit logic)

// 2. Project Forge cascade (Fade & sweep left to right)
gsap.utils.toArray('.bento-card').forEach((card, i) => {
    // Only target projects (those inside vault-container)
    if(card.closest('.vault-container')) {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.vault-container',
                start: "top 80%",
            },
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.2 // Stagger based on index
        });
    }
});

// 3. JEC Network Clubs (Slide UP from bottom staggered)
ScrollTrigger.batch('.gsap-club-card', {
    onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }),
    start: "top 85%"
});

// 4. Skills Lab (Gravity drop for blocks, right-slide for text)
ScrollTrigger.batch('.gsap-skill-block', {
    onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "bounce.out" }),
    start: "top 80%"
});

// 5. Contact Hub (Typewriter bio, input slides)
ScrollTrigger.create({
    trigger: '#contact',
    start: "top 75%",
    onEnter: () => {
        // Typewriter effect for bio
        const bio = document.querySelector('.gsap-contact-text');
        const text = bio.innerText;
        bio.innerText = '';
        bio.style.opacity = 1;
        let i = 0;
        const typeWriter = setInterval(() => {
            if (i < text.length) {
                bio.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
            }
        }, 15); // Speed of typing

        // Input fields glow/slide
        gsap.to('.gsap-contact-input', { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power2.out" });
        // Social pills left-slide
        gsap.to('.social-pill', { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.8, ease: "back.out(1.5)" });
    }
});

// ==========================================
// DYNAMIC NAVIGATION (SCROLL SPY)
// ==========================================
const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let currentId = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
}, { threshold: 0.4 }); // Section is active when 40% visible

document.querySelectorAll('section').forEach(section => {
    scrollSpyObserver.observe(section);
});

// Smooth Anchor Scrolling using Lenis
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            // Update active class immediately on click for snappier UI
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active-nav'));
            link.classList.add('active-nav');
            
            lenis.scrollTo(targetSection, {
                offset: 0, 
                duration: 1.2
            });
        }
    });
});

// Form Submission Success State
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('contact-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = '✓ Message Sent';
            submitBtn.style.color = '#fff';
            submitBtn.style.border = '1px solid var(--accent-indigo)';
            submitBtn.style.background = 'rgba(79, 70, 229, 0.2)';
            submitBtn.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.6)';
        }
    });
}


// --- Project Deep Dive Modal Logic ---
const projectData = {
    'resolve': {
        title: 'JEC-RESOLVE',
        tech: 'React.js, Web Tech, Database.',
        badge: 'Best in Open Innovation @ Code Kumbh 2.0',
        img: 'resolve_photo.jpg', /* Deep Dive Image */
        link: 'https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_openinnovation-firsthackathon-webdevelopment-activity-7438593608766615552-pN-e?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4',
        btnText: 'Verify Win on LinkedIn',
        desc: `🏆 Champions of Open Innovation Category at My First Ever Hackathon! 🚀\n\n24 hours of relentless coding, fixing complex database routing bugs at 3 AM, and deploying a live project just minutes before the final pitch. The adrenaline rush of building something impactful from scratch is absolutely unmatched.\nI am incredibly proud to share that in my very first year of engineering, my team, The Code Matrix, secured the Position (Best in Open Innovation) at the CODE KUMBH 2.0 Hackathon held at Jabalpur Engineering College (JEC). 🥇\n\nValidation of Innovation: Direct IIT Kanpur Qualification\nA pivotal moment in validating JEC-RESOLVE’s innovation was achieving direct qualification for the prestigious Hackathon round at TechKriti '26, IIT Kanpur. Documented in the attached official email, this direct entry validates the unique problem-solving approach and technical merit of the grievance ecosystem, receiving recognition from a premier engineering institution without requiring standard preliminary stages.\n\n💡 The Vision: Institutional grievance systems often suffer from delayed responses, lost paperwork, and a lack of accountability. We wanted to change that by forcing transparency.\n\n🔥 The Product: We engineered JEC-RESOLVE—an enterprise-grade Smart Grievance Ecosystem designed for 100% accountable digital governance.\n\n⚙️ The Core Architecture:\n🔹 Smart Routing: Our algorithm auto-assigns student complaints directly to the exact department head, eliminating middleman delays.\n🔹 SLA Time-Locks: Authorities are forced to set a strict resolution deadline. Until then, the system is time-locked to prevent ticket spamming.\n🔹 Auto-Escalation: The ultimate game-changer. If a ticket remains unresolved past the deadline, it automatically escalates up a 4-tier chain (Local Admin ➡️ Dept Head ➡️ Branch HOD ➡️ Principal).\n🔹 Public Ledger: Every single campus issue is visible on a live public feed, ensuring complete transparency for everyone.\n\n🙌 The Dream Team:\nBuilding a full-stack application (React + Supabase) in 24 hours and executing it flawlessly under immense pressure was only possible because of this squad's dedication:\n👑 Team Leader: [Karan Singh]\n💻 Team Members : UTTAM JAISINGHPURE| [Punit Simaiya] | [Nitin Kushwaha] | [yogendra Gayakwad]\nMassive gratitude to the JLUG JEC for hosting this incredible 24-hour heckhaton.\nWe came. We coded. We innovated. On to the next challenge! 💻🔥\n\n#OpenInnovation #FirstHackathon #WebDevelopment #ReactJS #JECJabalpur #SoftwareEngineering #TechJourney #TheCodeMatrix #BuildInPublic`
    },
    'doorlock': {
        title: 'Smart Security Lock',
        tech: 'C++, Arduino, Wokwi Simulation.',
        badge: 'Key Skill: Embedded Logic & Circuit Design.',
        link: 'https://wokwi.com/arduino',
        btnText: 'View Live Schematic on Wokwi',
        image: 'doorlock_sim.png',
        caption: 'Circuit Diagram of the Smart Security Lock with Keypad & LCD',
        desc: `As an ECE student at Jabalpur Engineering College, I’m always curious about how the devices around us actually work. With my second semester approaching, I decided to dive into the world of microcontrollers early through simulation.\nI recently built a Smart Door Lock System to understand the logic behind security automation. While I haven't worked with these components in a physical lab yet, simulation has been an incredible way to visualize the "why" and "how" of circuit design.\n\nWhat I explored in this project:\n🔹 Parallel Communication: Learning how a Standard 16-pin LCD receives data across multiple channels simultaneously.\n🔹 Input Logic: Using a 4x4 Keypad to capture user data.\n🔹 Mechanical Actuation: Controlling a Micro Servo motor to simulate a physical lock.\n\nThe "Magic" Moment: When the correct 4-digit PIN is accepted, the system triggers the motor to rotate, unlocking the mechanism for 5 seconds.\nI don't know yet when I’ll get to build this with real hardware in our college labs, but this virtual "head start" has made me even more excited for my upcoming ECE coursework!\n\n#JECJabalpur #ECEStudent #Arduino #FutureEngineer #LearningByDoing #EmbeddedSystems #Electronics.`
    },
    'hygiene': {
        title: 'Touchless Safety System',
        tech: 'Arduino, Tinkercad, Ultrasonic Sensors.',
        badge: 'Key Skill: Sensor Integration & ECE Fundamentals.',
        link: 'https://tinkercad.com/things',
        btnText: 'View Live Tinkercad Circuit',
        image: 'hygiene_sim.png',
        caption: 'Design & Simulation of the Touchless Safety Concept in Tinkercad',
        desc: `🚀 Project Spotlight: Smart Non-Contact Hygiene & Safety System\nAfter successfully building a Smart Door Lock, I wanted to push my boundaries by exploring Autonomous Sensing and Touchless Interaction. This project is a step forward in creating smart, real-world solutions using Embedded Systems.\n\n⚡ Working:\nThe system continuously monitors the environment using ultrasonic waves. It automatically triggers a sanitizer dispenser when a hand is detected and provides real-time proximity alerts to maintain social distancing.\n\n🛠️ Key Features:\n🔹 Touchless Actuation: Automatic sanitizer dispensing using a Servo Motor.\n🔹 Real-time Proximity Sensing: Distance calculation using the HC-SR04 Ultrasonic Sensor.\n🔹 Visual & Audio Alerts: Dual-LED (Red/Green) and Piezo Buzzer for instant user feedback.\n🔹 Threshold Logic: Autonomous decision-making based on distance zones (<10cm for action, 10–40cm for alert).\n\n🧰 Components Used:\nArduino Uno (The Brain)\nHC-SR04 Ultrasonic Sensor (The Eyes)\nMicro Servo Motor (The Actuator)\nPiezo Buzzer & LEDs (The Interface)\nResistors & Breadboard\n\n⚙️ Technologies & Tools:\nEmbedded C++ (Programming)\nTinkercad (Circuit Design & Simulation)\nLogic-based Automation\n\n💡 Future Scope:\nIntegration with an LCD Display for status monitoring.\nIoT-based Remote Monitoring to track sanitizer levels.\nPredictive maintenance using sensor data history.\n\nAs a first-year student at Jabalpur Engineering College, I am constantly exploring the "why" and "how" of ECE.\n\n#JECJabalpur #ECE #Arduino #EmbeddedSystems #Automation #TouchlessTech #Innovation #LearningByDoing #FutureEngineer`
    },
    'roborace': {
        badge: "ROBO RACE",
        title: "Deep Dive: Kinetic Showdown",
        tech: "Team THE ROBO RANGERS | Hosted by COSMOS at INERTIA 2.0",
        desc: "Engineering a high-speed, agile robotic platform for navigating complex obstacle courses required maximizing power-to-weight, ensuring structural integrity, and developing precise motor control algorithms in C++ for immediate physical input execution.",
        linkedin: "",
        image: "roborace.jpg",
        caption: "Team THE ROBO RANGERS with competing platform.",
        showCustomStack: true,
        customHardware: [
            "⚙️ ESP32 Microcontroller (Logic Controller)",
            "⚙️ High-Torque DC Motors & L298N Dual H-Bridge Motor Driver (Power Delivery)",
            "⚙️ HC-05 Bluetooth Module (Wireless Communication)",
            "⚙️ High-Capacity Li-Ion Battery Pack",
            "⚙️ Custom 4-Wheel Drive Robotic Chassis"
        ],
        customFirmware: [
            "💻 Optimized C++ Control Firmware (ESP-IDF / Arduino core) for precision steering and speed control."
        ]
    }
};

const modal = document.getElementById('project-modal');
const modalBadge = document.getElementById('modal-badge');
const modalTitle = document.getElementById('modal-title');
const modalTech = document.getElementById('modal-tech');
const modalDesc = document.getElementById('modal-desc');
const modalLinkedin = document.getElementById('modal-linkedin-btn');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-image-caption');
const modalRight = document.getElementById('modal-right');
const modalCustomStack = document.getElementById('modal-custom-tech-stack');
const closeBtn = document.querySelector('.close-modal');

document.querySelectorAll('.bento-card[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // Ignore clicks on links

        const projectId = card.getAttribute('data-project');
        
        if (projectData[projectId]) {
            const data = projectData[projectId];
            
            modalBadge.textContent = data.badge;
            modalTitle.textContent = data.title;
            modalTech.innerHTML = data.tech;
            modalDesc.textContent = data.desc;
            
            if(data.link || data.linkedin) {
                modalLinkedin.href = data.link || data.linkedin;
                modalLinkedin.style.display = 'inline-flex';
                modalLinkedin.textContent = data.btnText || 'View Journey on External Link';
            } else {
                modalLinkedin.style.display = 'none';
            }
            
            if(data.img || data.image) {
                modalImage.src = data.img || data.image; // Use uploaded image
                modalRight.style.display = 'flex';
                if(data.caption || data.imgCaption) {
                    modalCaption.textContent = data.caption || data.imgCaption;
                    modalCaption.style.display = 'block';
                } else {
                    modalCaption.style.display = 'none';
                }
            } else {
                modalRight.style.display = 'none';
            }

            if(data.showCustomStack) {
                let hwHTML = `
                    <h4 style="color: var(--accent-green); margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; letter-spacing: 0.5px;">Hardware & Firmware Architecture</h4>
                    <p style="color: var(--text-primary); margin-bottom: 8px; font-weight: 600; font-size: 0.82rem;">Hardware:</p>
                    <ul style="list-style: none; padding: 0; margin: 0 0 12px 0; font-size: 0.82rem; line-height: 1.9; color: #e2e8f0;">
                `;
                data.customHardware.forEach(item => { hwHTML += `<li>${item}</li>`; });
                hwHTML += `</ul><p style="color: var(--text-primary); margin-bottom: 8px; font-weight: 600; font-size: 0.82rem;">Software/Logic:</p>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.82rem; line-height: 1.9; color: #e2e8f0;">`;
                data.customFirmware.forEach(item => { hwHTML += `<li>${item}</li>`; });
                hwHTML += `</ul>`;
                
                modalCustomStack.innerHTML = hwHTML;
                modalCustomStack.style.display = 'block';
            } else {
                modalCustomStack.style.display = 'none';
            }
            
            modal.classList.add('active');
            if (typeof lenis !== 'undefined') lenis.stop(); // Pause scrolling
        }
    });
});

if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (typeof lenis !== 'undefined') lenis.start();
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        if (typeof lenis !== 'undefined') lenis.start();
    }
});

// 4b. Visual Archive Gallery
ScrollTrigger.batch('.gsap-gallery-item', {
    onEnter: batch => gsap.fromTo(batch, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    ),
    start: "top 85%"
});