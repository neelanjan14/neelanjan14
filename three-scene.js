// Three.js 3D Scene Implementation

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        this.objects = [];
        
        this.init();
    }
    
    init() {
        this.canvas = document.getElementById('threeCanvas');
        if (!this.canvas) return;
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
    }
    
    setupCamera() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }
    
    createObjects() {
        // Create floating geometric shapes
        this.createFloatingShapes();
        
        // Create particle system
        this.createParticleSystem();
        
        // Create wireframe objects
        this.createWireframeObjects();
    }
    
    createFloatingShapes() {
        const geometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 32, 32),
            new THREE.ConeGeometry(0.3, 0.8, 8),
            new THREE.TorusGeometry(0.3, 0.1, 16, 100)
        ];
        
        const materials = [
            new THREE.MeshBasicMaterial({ 
                color: 0xff6b35, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x4ecdc4, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x45b7d1, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0xf9ca24, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            })
        ];
        
        for (let i = 0; i < 8; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = (Math.random() - 0.5) * 5;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Store original position for animation
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.5
            };
            
            this.scene.add(mesh);
            this.objects.push(mesh);
        }
    }
    
    createParticleSystem() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Color
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.1, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createWireframeObjects() {
        // Create wireframe sphere
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        this.wireframeSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.wireframeSphere.position.set(0, 0, -2);
        this.scene.add(this.wireframeSphere);
        
        // Create wireframe torus
        const torusGeometry = new THREE.TorusGeometry(1.5, 0.3, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        this.wireframeTorus = new THREE.Mesh(torusGeometry, torusMaterial);
        this.wireframeTorus.position.set(0, 0, -1);
        this.scene.add(this.wireframeTorus);
    }
    
    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Rotate camera based on scroll
        this.camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 2;
        this.camera.position.y = scrollProgress * 2;
        this.camera.lookAt(0, 0, 0);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Animate floating shapes
        this.objects.forEach((object, index) => {
            const userData = object.userData;
            
            // Rotation
            object.rotation.x += userData.rotationSpeed.x;
            object.rotation.y += userData.rotationSpeed.y;
            object.rotation.z += userData.rotationSpeed.z;
            
            // Floating motion
            object.position.y = userData.originalPosition.y + Math.sin(elapsedTime * userData.floatSpeed + index) * 0.5;
            object.position.x = userData.originalPosition.x + Math.cos(elapsedTime * userData.floatSpeed + index) * 0.3;
            
            // Mouse interaction
            object.position.x += this.mouse.x * 0.1;
            object.position.y += this.mouse.y * 0.1;
        });
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
        }
        
        // Animate wireframe objects
        if (this.wireframeSphere) {
            this.wireframeSphere.rotation.x += 0.002;
            this.wireframeSphere.rotation.y += 0.003;
        }
        
        if (this.wireframeTorus) {
            this.wireframeTorus.rotation.x += 0.003;
            this.wireframeTorus.rotation.y += 0.002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Public methods
    addObject(object) {
        this.scene.add(object);
        this.objects.push(object);
    }
    
    removeObject(object) {
        this.scene.remove(object);
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }
    
    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    
    getCameraPosition() {
        return this.camera.position;
    }
}

// Export for use in main.js
window.ThreeScene = ThreeScene;