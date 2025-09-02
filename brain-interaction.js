// Interactive Brain SVG with Hover Effects

class BrainInteraction {
    constructor() {
        this.brainSvg = document.getElementById('brainSvg');
        this.brainRegions = document.querySelectorAll('.brain-region');
        this.neuralConnections = document.querySelectorAll('.neural-connection');
        this.regionLabels = document.querySelectorAll('.region-label');
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.brainSvg) return;
        
        this.setupEventListeners();
        this.createParticleSystem();
        this.startAnimation();
    }
    
    setupEventListeners() {
        // Add hover effects to brain regions
        this.brainRegions.forEach((region, index) => {
            region.addEventListener('mouseenter', (e) => {
                this.onRegionHover(e, region, index);
            });
            
            region.addEventListener('mouseleave', (e) => {
                this.onRegionLeave(e, region, index);
            });
            
            region.addEventListener('mousemove', (e) => {
                this.onRegionMouseMove(e, region);
            });
        });
        
        // Add click effects
        this.brainRegions.forEach((region, index) => {
            region.addEventListener('click', (e) => {
                this.onRegionClick(e, region, index);
            });
        });
        
        // Add touch support for mobile
        this.brainRegions.forEach((region, index) => {
            region.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.onRegionHover(e, region, index);
            });
            
            region.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.onRegionLeave(e, region, index);
            });
        });
    }
    
    onRegionHover(event, region, index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Get region data
        const regionType = region.dataset.region;
        const regionInfo = this.getRegionInfo(regionType);
        
        // Add active class
        region.classList.add('active');
        
        // Animate the region expansion
        this.animateRegionExpansion(region, event);
        
        // Animate connected regions
        this.animateConnectedRegions(region, index);
        
        // Show region information
        this.showRegionInfo(regionInfo, event);
        
        // Create particle effect
        this.createHoverParticles(event);
        
        // Animate neural connections
        this.animateNeuralConnections(index);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
    
    onRegionLeave(event, region, index) {
        // Remove active class
        region.classList.remove('active');
        
        // Reset all regions
        this.brainRegions.forEach(r => r.classList.remove('connected'));
        
        // Hide region information
        this.hideRegionInfo();
        
        // Reset neural connections
        this.resetNeuralConnections();
        
        // Stop particle effects
        this.stopHoverParticles();
    }
    
    onRegionMouseMove(event, region) {
        // Update particle position
        this.updateHoverParticles(event);
    }
    
    onRegionClick(event, region, index) {
        const regionType = region.dataset.region;
        const regionInfo = this.getRegionInfo(regionType);
        
        // Create click effect
        this.createClickEffect(event, region);
        
        // Show detailed information
        this.showDetailedInfo(regionInfo);
    }
    
    animateRegionExpansion(region, event) {
        const rect = this.brainSvg.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate transform origin based on mouse position
        const svgRect = this.brainSvg.getBoundingClientRect();
        const originX = (mouseX / svgRect.width) * 100;
        const originY = (mouseY / svgRect.height) * 100;
        
        // Apply transform
        region.style.transformOrigin = `${originX}% ${originY}%`;
        region.style.transform = 'scale(1.2)';
        region.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add glow effect
        region.style.filter = 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.6))';
    }
    
    animateConnectedRegions(activeRegion, activeIndex) {
        const connections = this.getConnectedRegions(activeIndex);
        
        connections.forEach(index => {
            if (index !== activeIndex && this.brainRegions[index]) {
                this.brainRegions[index].classList.add('connected');
                this.brainRegions[index].style.transform = 'scale(1.05)';
                this.brainRegions[index].style.transition = 'transform 0.3s ease';
            }
        });
    }
    
    getConnectedRegions(regionIndex) {
        // Define connections between brain regions
        const connections = {
            0: [1, 2], // Frontal lobe connects to parietal and temporal
            1: [0, 2, 3], // Parietal lobe connects to frontal, temporal, and occipital
            2: [0, 1], // Temporal lobe connects to frontal and parietal
            3: [1] // Occipital lobe connects to parietal
        };
        
        return connections[regionIndex] || [];
    }
    
    animateNeuralConnections(activeIndex) {
        this.neuralConnections.forEach((connection, index) => {
            connection.classList.add('active');
            
            // Create flowing animation
            const path = connection;
            const length = path.getTotalLength();
            
            // Set up the animation
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = 'neuralFlow 2s ease-in-out infinite';
        });
    }
    
    resetNeuralConnections() {
        this.neuralConnections.forEach(connection => {
            connection.classList.remove('active');
            connection.style.animation = '';
            connection.style.strokeDasharray = '';
            connection.style.strokeDashoffset = '';
        });
    }
    
    getRegionInfo(regionType) {
        const regionData = {
            frontal: {
                name: 'Frontal Lobe',
                description: 'Responsible for executive functions, decision making, and motor control.',
                functions: ['Decision Making', 'Problem Solving', 'Motor Control', 'Language Production'],
                color: 'rgba(255, 100, 150, 0.8)'
            },
            parietal: {
                name: 'Parietal Lobe',
                description: 'Processes sensory information and spatial awareness.',
                functions: ['Spatial Processing', 'Sensory Integration', 'Attention', 'Mathematical Reasoning'],
                color: 'rgba(100, 255, 150, 0.8)'
            },
            temporal: {
                name: 'Temporal Lobe',
                description: 'Handles auditory processing, memory, and language comprehension.',
                functions: ['Auditory Processing', 'Memory Formation', 'Language Comprehension', 'Emotion Processing'],
                color: 'rgba(255, 200, 100, 0.8)'
            },
            occipital: {
                name: 'Occipital Lobe',
                description: 'Primary visual processing center of the brain.',
                functions: ['Visual Processing', 'Color Recognition', 'Motion Detection', 'Pattern Recognition'],
                color: 'rgba(200, 100, 255, 0.8)'
            }
        };
        
        return regionData[regionType] || regionData.frontal;
    }
    
    showRegionInfo(regionInfo, event) {
        // Create or update info tooltip
        let tooltip = document.getElementById('brain-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'brain-tooltip';
            tooltip.className = 'brain-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.innerHTML = `
            <h4>${regionInfo.name}</h4>
            <p>${regionInfo.description}</p>
            <ul>
                ${regionInfo.functions.map(func => `<li>${func}</li>`).join('')}
            </ul>
        `;
        
        // Position tooltip
        const rect = this.brainSvg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        tooltip.style.left = `${event.clientX + 20}px`;
        tooltip.style.top = `${event.clientY - 20}px`;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
    }
    
    hideRegionInfo() {
        const tooltip = document.getElementById('brain-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        }
    }
    
    showDetailedInfo(regionInfo) {
        // Create detailed modal
        const modal = document.createElement('div');
        modal.className = 'brain-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>${regionInfo.name}</h2>
                <p>${regionInfo.description}</p>
                <div class="functions-grid">
                    ${regionInfo.functions.map(func => `
                        <div class="function-item">
                            <span class="function-icon">🧠</span>
                            <span class="function-name">${func}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    }
    
    createParticleSystem() {
        this.particles = [];
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        this.particleContainer.style.position = 'absolute';
        this.particleContainer.style.top = '0';
        this.particleContainer.style.left = '0';
        this.particleContainer.style.width = '100%';
        this.particleContainer.style.height = '100%';
        this.particleContainer.style.pointerEvents = 'none';
        this.particleContainer.style.zIndex = '10';
        
        document.querySelector('.brain-container').appendChild(this.particleContainer);
    }
    
    createHoverParticles(event) {
        const rect = this.brainSvg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create multiple particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'rgba(100, 200, 255, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            // Random direction and speed
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 20 + Math.random() * 30;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            
            this.particleContainer.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }
    
    updateHoverParticles(event) {
        // Update existing particles position if needed
    }
    
    stopHoverParticles() {
        // Stop any ongoing particle animations
        const particles = this.particleContainer.querySelectorAll('.hover-particle');
        particles.forEach(particle => {
            particle.style.animation = 'none';
        });
    }
    
    createClickEffect(event, region) {
        const rect = this.brainSvg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.position = 'absolute';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.border = '2px solid rgba(100, 200, 255, 0.8)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        this.particleContainer.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '100px', height: '100px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        };
    }
    
    startAnimation() {
        // Continuous subtle animations
        this.animateLabels();
        this.animateConnections();
    }
    
    animateLabels() {
        this.regionLabels.forEach((label, index) => {
            label.style.animation = `labelPulse 3s ease-in-out infinite ${index * 0.5}s`;
        });
    }
    
    animateConnections() {
        this.neuralConnections.forEach((connection, index) => {
            connection.style.animation = `connectionGlow 4s ease-in-out infinite ${index * 0.8}s`;
        });
    }
}

// Export for use in main.js
window.BrainInteraction = BrainInteraction;