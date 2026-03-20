const fs = require('fs');

const filepath = "./script.js";
let lines = fs.readFileSync(filepath, 'utf-8').split('\n');

// Find first modal block
let startOldModal = -1;
let endOldModal = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("// Project Nexus Deep Dive (Modal Logic)")) {
        startOldModal = i;
        break;
    }
}

if (startOldModal !== -1) {
    for (let i = startOldModal; i < lines.length; i++) {
        if (lines[i].includes("// Handle Resize")) {
            endOldModal = i;
            break;
        }
    }
}

const missingProjects = `    resolve: {
        title: 'JEC-RESOLVE',
        tech: 'React.js, Web Tech, Database.',
        badge: 'Best in Open Innovation @ Code Kumbh 2.0',
        image: 'resolve_photo.png', 
        linkedin: 'https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_openinnovation-firsthackathon-webdevelopment-activity-7438593608766615552-pN-e?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4',
        btnText: 'Verify Win on LinkedIn',
        desc: \`🏆 Champions of Open Innovation Category at My First Ever Hackathon! 🚀\\n\\n24 hours of relentless coding, fixing complex database routing bugs at 3 AM, and deploying a live project just minutes before the final pitch.\\nI am incredibly proud to share that in my very first year of engineering, my team, The Code Matrix, secured the Position (Best in Open Innovation) at the CODE KUMBH 2.0 Hackathon held at Jabalpur Engineering College (JEC). 🥇\\n\\nValidation of Innovation: Direct IIT Kanpur Qualification\\nA pivotal moment in validating JEC-RESOLVE’s innovation was achieving direct qualification for the prestigious Hackathon round at TechKriti '26, IIT Kanpur.\\n\\n💡 The Vision: Institutional grievance systems often suffer from delayed responses, lost paperwork, and a lack of accountability. We wanted to change that by forcing transparency.\\n\\n🔥 The Product: We engineered JEC-RESOLVE—an enterprise-grade Smart Grievance Ecosystem designed for 100% accountable digital governance.\\n\\n⚙️ The Core Architecture:\\n🔹 Smart Routing: Our algorithm auto-assigns student complaints directly to the exact department head, eliminating middleman delays.\\n🔹 SLA Time-Locks: Authorities are forced to set a strict resolution deadline. Until then, the system is time-locked to prevent ticket spamming.\\n🔹 Auto-Escalation: The ultimate game-changer. If a ticket remains unresolved past the deadline, it automatically escalates up a 4-tier chain (Local Admin ➡️ Dept Head ➡️ Branch HOD ➡️ Principal).\\n🔹 Public Ledger: Every single campus issue is visible on a live public feed, ensuring complete transparency for everyone.\\n\\n🙌 The Dream Team:\\nBuilding a full-stack application (React + Supabase) in 24 hours and executing it flawlessly under immense pressure was only possible because of this squad's dedication:\\n👑 Team Leader: [Karan Singh]\\n💻 Team Members : OM GIRI GOSWAMI| [Punit Simaiya] | [Nitin Kushwaha] | [yogendra Gayakwad]\\nMassive gratitude to the JLUG JEC for hosting this incredible 24-hour heckhaton.\\nWe came. We coded. We innovated. On to the next challenge! 💻🔥\\n\\n#OpenInnovation #FirstHackathon #WebDevelopment #ReactJS #JECJabalpur #SoftwareEngineering #TechJourney #TheCodeMatrix #BuildInPublic\`
    },
    doorlock: {
        title: 'Smart Security Lock',
        tech: 'C++, Arduino, Wokwi Simulation.',
        badge: 'Key Skill: Embedded Logic & Circuit Design.',
        linkedin: 'https://wokwi.com/arduino',
        btnText: 'View Live Schematic on Wokwi',
        desc: \`As an ECE student at Jabalpur Engineering College, I’m always curious about how the devices around us actually work. With my second semester approaching, I decided to dive into the world of microcontrollers early through simulation.\\nI recently built a Smart Door Lock System to understand the logic behind security automation. While I haven't worked with these components in a physical lab yet, simulation has been an incredible way to visualize the "why" and "how" of circuit design.\\n\\nWhat I explored in this project:\\n🔹 Parallel Communication: Learning how a Standard 16-pin LCD receives data across multiple channels simultaneously.\\n🔹 Input Logic: Using a 4x4 Keypad to capture user data.\\n🔹 Mechanical Actuation: Controlling a Micro Servo motor to simulate a physical lock.\\n\\nThe "Magic" Moment: When the correct 4-digit PIN is accepted, the system triggers the motor to rotate, unlocking the mechanism for 5 seconds.\\nI don't know yet when I’ll get to build this with real hardware in our college labs, but this virtual "head start" has made me even more excited for my upcoming ECE coursework!\\n\\n#JECJabalpur #ECEStudent #Arduino #FutureEngineer #LearningByDoing #EmbeddedSystems #Electronics.\`
    },
    hygiene: {
        title: 'Touchless Safety System',
        tech: 'Arduino, Tinkercad, Ultrasonic Sensors.',
        badge: 'Key Skill: Sensor Integration & ECE Fundamentals.',
        linkedin: 'https://tinkercad.com/things',
        btnText: 'View Live Tinkercad Circuit',
        desc: \`🚀 Project Spotlight: Smart Non-Contact Hygiene & Safety System\\nAfter successfully building a Smart Door Lock, I wanted to push my boundaries by exploring Autonomous Sensing and Touchless Interaction. This project is a step forward in creating smart, real-world solutions using Embedded Systems.\\n\\n⚡ Working:\\nThe system continuously monitors the environment using ultrasonic waves. It automatically triggers a sanitizer dispenser when a hand is detected and provides real-time proximity alerts to maintain social distancing.\\n\\n🛠️ Key Features:\\n🔹 Touchless Actuation: Automatic sanitizer dispensing using a Servo Motor.\\n🔹 Real-time Proximity Sensing: Distance calculation using the HC-SR04 Ultrasonic Sensor.\\n🔹 Visual & Audio Alerts: Dual-LED (Red/Green) and Piezo Buzzer for instant user feedback.\\n🔹 Threshold Logic: Autonomous decision-making based on distance zones (<10cm for action, 10–40cm for alert).\\n\\n🧰 Components Used:\\nArduino Uno (The Brain)\\nHC-SR04 Ultrasonic Sensor (The Eyes)\\nMicro Servo Motor (The Actuator)\\nPiezo Buzzer & LEDs (The Interface)\\nResistors & Breadboard\\n\\n⚙️ Technologies & Tools:\\nEmbedded C++ (Programming)\\nTinkercad (Circuit Design & Simulation)\\nLogic-based Automation\\n\\n💡 Future Scope:\\nIntegration with an LCD Display for status monitoring.\\nIoT-based Remote Monitoring to track sanitizer levels.\\nPredictive maintenance using sensor data history.\\n\\nAs a first-year student at Jabalpur Engineering College, I am constantly exploring the "why" and "how" of ECE.\\n\\n#JECJabalpur #ECE #Arduino #EmbeddedSystems #Automation #TouchlessTech #Innovation #LearningByDoing #FutureEngineer\`
    },`;

if (startOldModal !== -1 && endOldModal !== -1) {
    lines.splice(startOldModal, endOldModal - startOldModal);
}

// Find second modal block by checking for 'const projectData = {'
let startNewModal = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("const projectData = {")) {
        startNewModal = i;
        break;
    }
}

if (startNewModal !== -1) {
    lines.splice(startNewModal + 1, 0, missingProjects);
}

for (let i = startNewModal; i < lines.length; i++) {
    if (lines[i].includes("document.querySelectorAll('.deep-dive-btn').forEach(btn => {")) {
        lines[i] = "document.querySelectorAll('.bento-card[data-project]').forEach(card => {";
    }
    if (lines[i].includes("btn.addEventListener('click', (e) => {")) {
        lines[i] = "    card.addEventListener('click', (e) => {";
    }
    if (lines[i].includes("const card = e.target.closest('.bento-card');")) {
        lines[i] = `        // const card = e.target.closest('.bento-card');
        if (e.target.closest('a')) return;  // Ignore clicks on links
        // If clicking inside .card-content but NOT on .deep-dive-btn, AND it has deep-dive, maybe ignore?
        // Let's just allow clicking the card.`;
    }
}

fs.writeFileSync(filepath, lines.join('\\n'), 'utf-8');
console.log('Script fixed!');
