const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const startTag = '<div class="vault-container">';
const endTag = '</section>\r\n\r\n        <!-- JEC NETWORK';
let endTagUsed = endTag;

if (html.indexOf(endTag) === -1) {
    endTagUsed = '</section>\n\n        <!-- JEC NETWORK';
}

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTagUsed);

if (startIndex !== -1 && endIndex !== -1) {
    const newHtml = `            <div class="vault-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; width: 100%; position: relative;">

                <!-- Card 1: JEC-RESOLVE (Top Left) -->
                <div class="bento-card hover-lift tilt-effect" style="height: 100%; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: rgba(10, 15, 20, 0.6); backdrop-filter: blur(25px); border: none; border-radius: 20px; box-shadow: 0 0 25px rgba(0, 242, 255, 0.15); overflow: hidden; position: relative; padding: 40px;" data-project="resolve">
                    <div style="position: absolute; inset: 0; border-radius: 20px; padding: 1px; background: linear-gradient(to bottom right, var(--accent-cyan), var(--accent-green)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; opacity: 1; z-index: 10;"></div>
                    <div style="position: absolute; top: -50px; left: -50px; width: 140%; height: 140%; opacity: 0.15; z-index: 0; background-image: url('https://www.svgrepo.com/show/408453/network-chart-diagram-graph-node-analysis.svg'); background-size: cover; background-position: center;"></div>
                    <div class="card-content" style="position: relative; z-index: 1; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; height: 100%;">
                        <div class="tag" style="display: inline-block; color: #000; background: var(--accent-green); border: none; font-weight: 800; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 8px; box-shadow: 0 0 10px rgba(57, 255, 20, 0.4); text-transform: uppercase;">JEC-RESOLVE</div>
                        <h3 style="font-size: 2.2rem; margin: 0; font-weight: 800; letter-spacing: 1px;">Smart Grievance Ecosystem</h3>
                        <p style="color: #e2e8f0; font-size: 0.95rem; line-height: 1.5; margin-bottom: 5px;">Architected a comprehensive digital grievance ecosystem utilizing advanced technical architecture.</p>
                        <button class="btn-primary deep-dive-btn magnetic" data-strength="10" style="border-radius: 50px; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); background: rgba(0, 242, 255, 0.1); padding: 10px 24px; font-family: 'Inter', sans-serif; transition: all 0.3s ease; color: #fff; font-size: 0.85rem;">DEEP DIVE</button>
                    </div>
                </div>

                <!-- Card 2: Smart Security Lock (Top Right) -->
                <div class="bento-card hover-lift tilt-effect" style="height: 100%; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: rgba(10, 15, 20, 0.6); backdrop-filter: blur(25px); border: none; border-radius: 20px; box-shadow: 0 0 20px rgba(0, 242, 255, 0.1); overflow: hidden; position: relative; padding: 40px;" data-project="doorlock">
                    <div style="position: absolute; inset: 0; border-radius: 20px; padding: 1px; background: linear-gradient(to bottom right, var(--accent-cyan), var(--accent-green)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; opacity: 1; z-index: 10;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; height: 140px; opacity: 0.05; z-index: 0; background-image: url('https://www.svgrepo.com/show/532392/lock-keyhole.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                    <div class="card-content" style="position: relative; z-index: 1; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 15px; align-items: center; justify-content: center; height: 100%;">
                        <div class="tag" style="display: inline-block; color: var(--accent-cyan); border: 1px solid var(--accent-cyan); background: rgba(0, 242, 255, 0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Smart Security Lock</div>
                        <h3 style="margin: 0; font-weight: 700; letter-spacing: 1.5px; font-size: 1.8rem;">Hardware Prototyping</h3>
                        <button class="btn-primary deep-dive-btn magnetic" data-strength="10" style="border-radius: 50px; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); background: rgba(0, 242, 255, 0.1); padding: 10px 24px; font-family: 'Inter', sans-serif; transition: all 0.3s ease; color: #fff; font-size: 0.85rem;">DEEP DIVE</button>
                    </div>
                </div>

                <!-- Card 3: Non-Contact Hygiene Card (Bottom Left) -->
                <div class="bento-card hover-lift tilt-effect" style="height: 100%; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: rgba(10, 15, 20, 0.6); backdrop-filter: blur(25px); border: none; border-radius: 20px; box-shadow: 0 0 20px rgba(0, 242, 255, 0.1); overflow: hidden; position: relative; padding: 40px;" data-project="hygiene">
                    <div style="position: absolute; inset: 0; border-radius: 20px; padding: 1px; background: linear-gradient(to bottom right, var(--accent-cyan), var(--accent-green)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; opacity: 1; z-index: 10;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; height: 140px; opacity: 0.05; z-index: 0; background-image: url('https://www.svgrepo.com/show/532353/sensor-ultrasonic.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                    <div class="card-content" style="position: relative; z-index: 1; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 15px; align-items: center; justify-content: center; height: 100%;">
                        <div class="tag" style="display: inline-block; color: var(--accent-cyan); border: 1px solid var(--accent-cyan); background: rgba(0, 242, 255, 0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Touchless Safety System</div>
                        <h3 style="margin: 0; font-weight: 700; letter-spacing: 1.5px; font-size: 1.8rem;">Embedded Logic Validation</h3>
                        <button class="btn-primary deep-dive-btn magnetic" data-strength="10" style="border-radius: 50px; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); background: rgba(0, 242, 255, 0.1); padding: 10px 24px; font-family: 'Inter', sans-serif; transition: all 0.3s ease; color: #fff; font-size: 0.85rem;">DEEP DIVE</button>
                    </div>
                </div>

                <!-- Card 4: ROBO RACE (Bottom Right) -->
                <div class="bento-card hover-lift tilt-effect" style="height: 100%; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: rgba(10, 15, 20, 0.6); backdrop-filter: blur(25px); border: none; border-radius: 20px; box-shadow: 0 0 25px rgba(0, 242, 255, 0.15); overflow: hidden; position: relative; padding: 40px;" data-project="roborace">
                    <div style="position: absolute; inset: 0; border-radius: 20px; padding: 1px; background: linear-gradient(to bottom right, var(--accent-cyan), var(--accent-green)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; opacity: 1; z-index: 10;"></div>
                    <div style="position: absolute; top: -50px; left: -50px; width: 140%; height: 140%; opacity: 0.05; z-index: 0; background-image: url('https://www.svgrepo.com/show/367676/robot.svg'); background-size: cover; background-position: center; filter: invert(1);"></div>
                    <div class="card-content" style="position: relative; z-index: 1; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; height: 100%;">
                        <div class="tag" style="display: inline-block; color: #000; background: var(--accent-green); border: none; font-weight: 800; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 8px; box-shadow: 0 0 10px rgba(57, 255, 20, 0.4); text-transform: uppercase;">ROBO RACE</div>
                        <h3 style="font-size: 2.2rem; margin: 0; font-weight: 800; letter-spacing: 1px; color: #fff;">Kinetic Showdown</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; font-style: italic; margin-bottom: 5px;">Team: THE ROBO RANGERS</p>
                        <p style="color: #e2e8f0; font-size: 0.95rem; line-height: 1.5; margin-bottom: 15px;">Precision Robotics & High-Speed Performance Validation.</p>
                        <button class="btn-primary deep-dive-btn magnetic" data-strength="10" style="border-radius: 50px; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); background: rgba(0, 242, 255, 0.1); padding: 10px 24px; font-family: 'Inter', sans-serif; transition: all 0.3s ease; color: #fff; font-size: 0.85rem;">DEEP DIVE</button>
                    </div>
                </div>

            </div>
        </section>

        <!-- JEC NETWORK`;
        
    html = html.substring(0, startIndex) + newHtml + html.substring(endIndex + endTagUsed.length);
    fs.writeFileSync('index.html', html);
    console.log('Finished updating HTML grid');
} else {
    console.log('Could not locate grid boundaries');
}
