const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const bentoHTML = `
        <!-- THE REPOSITORY: BENTO GRID -->
        <section id="repository" class="bento-repository">
            <div class="bento-header" style="text-align: center; margin-bottom: 50px;">
                <h1 style="font-family: 'Playfair Display', serif; font-size: 3.5rem; color: #fff; margin-bottom: 10px;">THE REPOSITORY <span style="font-size: 1.5rem; color: var(--text-muted); font-family: 'Inter', sans-serif;">(Om’s Codex)</span></h1>
                <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">A comprehensive look into Om Giri Goswami's engineering journey at Jabalpur Engineering College.</p>
            </div>

            <div class="bento-grid">
                
                <!-- Tile 1: Identity & Intro (ID: home mapped for nav) -->
                <div id="home" class="bento-tile identity-tile hover-glow">
                    <h2 style="color: #fff; font-size: 1.8rem; margin-bottom: 8px;">Om Giri Goswami <span style="font-size: 1rem; color: var(--accent-cyan); font-weight: 500;">(19, ECE Undergraduate)</span></h2>
                    <h3 style="color: var(--accent-indigo); font-size: 1.1rem; margin-bottom: 15px; letter-spacing: 1px;">Hardware Prototyping <span style="color: var(--text-muted);">|</span> AI-Assisted 'Vibe Coding'</h3>
                    <p style="color: var(--text-muted); font-size: 1rem;">Jabalpur Engineering College (JEC), Jabalpur.</p>
                </div>

                <!-- Tile 2: Strategic Accolades -->
                <div class="bento-tile accolades-tile hover-glow">
                    <h3 class="tile-title">Strategic Accolades</h3>
                    <ul class="accolade-list">
                        <li><span class="emoji">🏆</span> <strong>Winner:</strong> Code Kumbh 2.0 (Best in Open Innovation) with 'THE CODE HUSTLERS'.</li>
                        <li><span class="emoji">🚀</span> <strong>Direct Qualifier:</strong> TechKriti '24 Hackathon (IIT Kanpur). <a href="iitk mail final.jpeg" target="_blank" class="subtle-link">View Verification &nearr;</a></li>
                        <li><span class="emoji">🏎️</span> <strong>Participant:</strong> Inertia 2.0 (The Robo Race competition).</li>
                    </ul>
                </div>

                <!-- Tile 3: The Forge (ID: showcase mapped for nav) -->
                <div id="showcase" class="bento-tile forge-tile hover-glow">
                    <h3 class="tile-title">The Forge <span class="tile-subtitle">(Projects Showcase)</span></h3>
                    <div class="forge-grid">
                        <div class="forge-item">
                            <h4>JEC-RESOLVE <span class="highlight-badge">Winner Code Kumbh, IITK Qualifier</span></h4>
                            <p>Full-stack Smart Grievance Ecosystem.</p>
                            <a href="https://www.linkedin.com/posts/om-giri-goswami-7b03a8374_openinnovation-firsthackathon-webdevelopment-activity-7438593608766615552-pN-e?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFybSHQBva5Jjva8Ivu5Jlzv5AxXG4ve4-4" target="_blank" class="cyber-link">Verify on LinkedIn &nearr;</a>
                        </div>
                        <div class="forge-item">
                            <h4>Smart Security Lock</h4>
                            <p>Arduino, Keypad, Servo.</p>
                            <a href="https://wokwi.com/arduino" target="_blank" class="cyber-link">View Wokwi Schematic &nearr;</a>
                        </div>
                        <div class="forge-item">
                            <h4>Touchless Safety System</h4>
                            <p>Arduino, Ultrasonic Sensor.</p>
                            <a href="https://tinkercad.com/things" target="_blank" class="cyber-link">View Tinkercad Schematic &nearr;</a>
                        </div>
                        <div class="forge-item">
                            <h4>RC Car</h4>
                            <p>Hardware Integration & Robotics.</p>
                        </div>
                    </div>
                </div>

                <!-- Tile 4: The Lab (ID: skills mapped for nav) -->
                <div id="skills" class="bento-tile lab-tile hover-glow">
                    <h3 class="tile-title">The Lab <span class="tile-subtitle">(Technical Stack)</span></h3>
                    <div class="skills-list">
                        <div class="skill-category"><strong>Programming Languages:</strong> C, C++</div>
                        <div class="skill-category"><strong>Web Development:</strong> HTML, CSS, Netlify Deployment.</div>
                        <div class="skill-category"><strong>Embedded Systems:</strong> Arduino, ESP32, Robotics, Sensor Integration.</div>
                        <div class="skill-category"><strong>Simulation Tools:</strong> Wokwi, Tinkercad.</div>
                        <div class="skill-category"><strong>Methodology:</strong> AI-Assisted Architecture, Vibe Coding.</div>
                    </div>
                </div>

                <!-- Tile 5: Professional Dynamics (ID: clubs mapped for nav) -->
                <div id="clubs" class="bento-tile dynamics-tile hover-glow">
                    <h3 class="tile-title">Professional Dynamics</h3>
                    <div class="dynamics-list">
                        <div class="dynamic-item">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/NCC_logo.png/400px-NCC_logo.png" alt="NCC Crest" class="club-logo">
                            <div>
                                <h4>NCC Cadet</h4>
                                <p>Discipline, Protocols, High-Pressure Teamwork.</p>
                            </div>
                        </div>
                        <div class="dynamic-item">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="Linux Icon" class="club-logo">
                            <div>
                                <h4>JLUG JEC</h4>
                                <p>Technical Team, Open Source Culture, Linux Environments.</p>
                            </div>
                        </div>
                        <div class="dynamic-item">
                            <img src="https://www.svgrepo.com/show/530412/network-nodes.svg" alt="Matrix Icon" class="club-logo" style="filter: invert(1);">
                            <div>
                                <h4>MATRIX.JEC</h4>
                                <p>Strategic Communication, Public Relations, Analytical Growth.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tile 6: Contact Gateway (ID: contact mapped for nav) -->
                <div id="contact" class="bento-tile contact-tile hover-glow">
                    <h3 class="tile-title">Contact Gateway <span class="tile-subtitle">(The Hub)</span></h3>
                    <p class="bio-text">I am an ECE undergrad bridging the gap between hardware execution and digital interfaces via AI-assisted 'Vibe Coding'. Ready to architect and innovate.</p>
                    
                    <div class="social-pills" style="margin-bottom: 25px;">
                        <a href="mailto:omgiri68649@gmail.com" class="pill email-pill">omgiri68649@gmail.com</a>
                        <a href="https://www.linkedin.com/in/om-giri-goswami-7b03a8374" target="_blank" class="pill linkedin-pill">LinkedIn</a>
                        <a href="https://github.com/omcodes16" target="_blank" class="pill github-pill">GitHub</a>
                    </div>
                    
                    <form class="minimal-contact-form" action="#" onsubmit="event.preventDefault(); window.location.href='mailto:omgiri68649@gmail.com';">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email Address" required>
                        <input type="text" placeholder="Collaboration Request" required>
                        <button type="submit" class="cyber-btn">Send Message &nearr;</button>
                    </form>
                </div>
            </div>
        </section>
        
        <!-- OLD ARCHIVED SECTIONS (HIDDEN) -->
        <div style="display: none !important;">
`;

const startIndex = html.indexOf('<main class="content-wrapper">') + '<main class="content-wrapper">'.length;
const endIndex = html.lastIndexOf('</main>');

if (startIndex > '<main class="content-wrapper">'.length - 1 && endIndex > startIndex) {
    let oldBlock = html.substring(startIndex, endIndex);
    oldBlock = oldBlock.replace(/id="home"/g, 'id="home-old"');
    oldBlock = oldBlock.replace(/id="showcase"/g, 'id="showcase-old"');
    oldBlock = oldBlock.replace(/id="skills"/g, 'id="skills-old"');
    oldBlock = oldBlock.replace(/id="clubs"/g, 'id="clubs-old"');
    oldBlock = oldBlock.replace(/id="contact"/g, 'id="contact-old"');

    html = html.substring(0, startIndex) + '\n' + bentoHTML + oldBlock + '\n        </div>\n    ' + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log('SUCCESS: Injected Bento Grid layout safely.');
} else {
    console.log('ERROR: Tags not found.');
}
