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

// Three.js Scene Setup (Floating Components)
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00f2ff, 2, 50); // Cyan
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x39ff14, 2, 50); // Green
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Objects (Abstract Hardware Components)
const objects = [];

// Innovation Badge (Code Kumbh)
const badgeGeometry = new THREE.IcosahedronGeometry(2.5, 0);
const badgeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x39ff14, 
    roughness: 0.1, 
    metalness: 0.8,
    wireframe: true,
    emissive: 0x39ff14,
    emissiveIntensity: 0.2
});
const badge1 = new THREE.Mesh(badgeGeometry, badgeMaterial);
badge1.position.set(-6, 2, -4);
scene.add(badge1);
objects.push({ mesh: badge1, rotSpeedX: 0.005, rotSpeedY: 0.01, floatSpeed: 0.015, floatOffset: 0 });

// Interactive Mesh Background (Points)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// User Interactivity for Mesh
let mousePos = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation Loop
let time = 0;
function animateThree() {
    requestAnimationFrame(animateThree);
    time += 0.01;

    // Rotate and float objects
    objects.forEach(obj => {
        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
        // Floating effect
        obj.mesh.position.y += Math.sin(time * obj.floatSpeed * 100 + obj.floatOffset) * 0.005;
    });

    // Animate Particles Mesh based on mouse
    particlesMesh.rotation.y = mousePos.x * 0.2 + time * 0.05;
    particlesMesh.rotation.x = -mousePos.y * 0.2 + time * 0.05;

    // Parallax effect based on mouse (mild)
    camera.position.x += (mousePos.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mousePos.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

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

// Project Nexus Deep Dive (Modal Logic)
const modal = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const projectCards = document.querySelectorAll('.bento-card[data-project]');

const projectData = {
    'resolve': {
        title: 'JEC-RESOLVE',
        tech: 'React.js, Web Tech, Database.',
        badge: 'Best in Open Innovation @ Code Kumbh 2.0',
        link: 'https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_openinnovation-firsthackathon-webdevelopment-activity-7438593608766615552-pN-e?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4',
        desc: `🏆 Champions of Open Innovation Category at My First Ever Hackathon! 🚀\n\n24 hours of relentless coding, fixing complex database routing bugs at 3 AM, and deploying a live project just minutes before the final pitch. The adrenaline rush of building something impactful from scratch is absolutely unmatched.\nI am incredibly proud to share that in my very first year of engineering, my team, The Code Matrix, secured the Position (Best in Open Innovation) at the CODE KUMBH 2.0 Hackathon held at Jabalpur Engineering College (JEC). 🥇\n\n💡 The Vision: Institutional grievance systems often suffer from delayed responses, lost paperwork, and a lack of accountability. We wanted to change that by forcing transparency.\n\n🔥 The Product: We engineered JEC-RESOLVE—an enterprise-grade Smart Grievance Ecosystem designed for 100% accountable digital governance.\n\n⚙️ The Core Architecture:\n🔹 Smart Routing: Our algorithm auto-assigns student complaints directly to the exact department head, eliminating middleman delays.\n🔹 SLA Time-Locks: Authorities are forced to set a strict resolution deadline. Until then, the system is time-locked to prevent ticket spamming.\n🔹 Auto-Escalation: The ultimate game-changer. If a ticket remains unresolved past the deadline, it automatically escalates up a 4-tier chain (Local Admin ➡️ Dept Head ➡️ Branch HOD ➡️ Principal).\n🔹 Public Ledger: Every single campus issue is visible on a live public feed, ensuring complete transparency for everyone.\n\n🙌 The Dream Team:\nBuilding a full-stack application (React + Supabase) in 24 hours and executing it flawlessly under immense pressure was only possible because of this squad's dedication:\n👑 Team Leader: [Karan Singh]\n💻 Team Members : OM GIRI GOSWAMI| [Punit Simaiya] | [Nitin Kushwaha] | [yogendra Gayakwad]\nMassive gratitude to the JLUG JEC for hosting this incredible 24-hour heckhaton.\nWe came. We coded. We innovated. On to the next challenge! 💻🔥\n\n#OpenInnovation #FirstHackathon #WebDevelopment #ReactJS #JECJabalpur #SoftwareEngineering #TechJourney #TheCodeMatrix #BuildInPublic`
    },
    'doorlock': {
        title: 'Smart Security Lock',
        tech: 'C++, Arduino, Wokwi Simulation.',
        badge: 'Key Skill: Embedded Logic & Circuit Design.',
        link: 'https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_jecjabalpur-ecestudent-arduino-activity-7430947209938092032-5kXe?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4',
        desc: `As an ECE student at Jabalpur Engineering College, I’m always curious about how the devices around us actually work. With my second semester approaching, I decided to dive into the world of microcontrollers early through simulation.\nI recently built a Smart Door Lock System to understand the logic behind security automation. While I haven't worked with these components in a physical lab yet, simulation has been an incredible way to visualize the "why" and "how" of circuit design.\n\nWhat I explored in this project:\n🔹 Parallel Communication: Learning how a Standard 16-pin LCD receives data across multiple channels simultaneously.\n🔹 Input Logic: Using a 4x4 Keypad to capture user data.\n🔹 Mechanical Actuation: Controlling a Micro Servo motor to simulate a physical lock.\n\nThe "Magic" Moment: When the correct 4-digit PIN is accepted, the system triggers the motor to rotate, unlocking the mechanism for 5 seconds.\nI don't know yet when I’ll get to build this with real hardware in our college labs, but this virtual "head start" has made me even more excited for my upcoming ECE coursework!\n\n#JECJabalpur #ECEStudent #Arduino #FutureEngineer #LearningByDoing #EmbeddedSystems #Electronics.`
    },
    'hygiene': {
        title: 'Touchless Safety System',
        tech: 'Arduino, Tinkercad, Ultrasonic Sensors.',
        badge: 'Key Skill: Sensor Integration & ECE Fundamentals.',
        link: 'https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_jecjabalpur-ece-arduino-activity-7436074118791331840-QAa5?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4',
        desc: `🚀 Project Spotlight: Smart Non-Contact Hygiene & Safety System\nAfter successfully building a Smart Door Lock, I wanted to push my boundaries by exploring Autonomous Sensing and Touchless Interaction. This project is a step forward in creating smart, real-world solutions using Embedded Systems.\n\n⚡ Working:\nThe system continuously monitors the environment using ultrasonic waves. It automatically triggers a sanitizer dispenser when a hand is detected and provides real-time proximity alerts to maintain social distancing.\n\n🛠️ Key Features:\n🔹 Touchless Actuation: Automatic sanitizer dispensing using a Servo Motor.\n🔹 Real-time Proximity Sensing: Distance calculation using the HC-SR04 Ultrasonic Sensor.\n🔹 Visual & Audio Alerts: Dual-LED (Red/Green) and Piezo Buzzer for instant user feedback.\n🔹 Threshold Logic: Autonomous decision-making based on distance zones (<10cm for action, 10–40cm for alert).\n\n🧰 Components Used:\nArduino Uno (The Brain)\nHC-SR04 Ultrasonic Sensor (The Eyes)\nMicro Servo Motor (The Actuator)\nPiezo Buzzer & LEDs (The Interface)\nResistors & Breadboard\n\n⚙️ Technologies & Tools:\nEmbedded C++ (Programming)\nTinkercad (Circuit Design & Simulation)\nLogic-based Automation\n\n💡 Future Scope:\nIntegration with an LCD Display for status monitoring.\nIoT-based Remote Monitoring to track sanitizer levels.\nPredictive maintenance using sensor data history.\n\nAs a first-year student at Jabalpur Engineering College, I am constantly exploring the "why" and "how" of ECE.\n\n#JECJabalpur #ECE #Arduino #EmbeddedSystems #Automation #TouchlessTech #Innovation #LearningByDoing #FutureEngineer`
    }
};

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const data = projectData[projectId];
        
        if(data) {
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-desc').textContent = data.desc;
            document.getElementById('modal-tech').textContent = data.tech;
            
            const badgeEl = document.getElementById('modal-badge');
            if(data.badge) {
                badgeEl.style.display = 'inline-block';
                badgeEl.textContent = data.badge;
            } else {
                badgeEl.style.display = 'none';
            }
            
            const linkBtn = document.getElementById('modal-linkedin-btn');
            if(data.link) {
                linkBtn.style.display = 'inline-block';
                linkBtn.href = data.link;
            } else {
                linkBtn.style.display = 'none';
            }
            
            // Re-bind magnetic listeners if necessary or just rely on existing
            // Open modal
            modal.classList.add('active');
            
            // Stop scroll
            lenis.stop();
        }
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    lenis.start();
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
