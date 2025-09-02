// WebGL Ink Drag Effect Implementation

class InkDragEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.program = null;
        this.texture = null;
        this.framebuffer = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.inkIntensity = 1.0;
        this.isMouseDown = false;
        
        this.init();
    }
    
    init() {
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create shader program
        this.createShaderProgram();
        
        // Create geometry
        this.createGeometry();
        
        // Create texture for persistence
        this.createTexture();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    createShaderProgram() {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            
            varying vec2 v_texCoord;
            varying float v_time;
            
            void main() {
                vec2 zeroToOne = a_position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
                
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                v_texCoord = a_texCoord;
                v_time = u_time;
            }
        `);
        
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
            precision mediump float;
            
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform float u_time;
            uniform sampler2D u_texture;
            uniform float u_inkIntensity;
            uniform bool u_mouseDown;
            
            varying vec2 v_texCoord;
            varying float v_time;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                
                vec2 u = f * f * (3.0 - 2.0 * f);
                
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }
            
            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                
                for (int i = 0; i < 4; i++) {
                    value += amplitude * noise(st);
                    st *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
            
            vec3 inkEffect(vec2 uv, vec2 mouse, float time) {
                vec2 center = mouse / u_resolution;
                float dist = distance(uv, center);
                
                // Create multiple ink drops
                float ink1 = smoothstep(0.4, 0.0, dist);
                float ink2 = smoothstep(0.3, 0.0, dist - 0.1 * sin(time * 2.0));
                float ink3 = smoothstep(0.2, 0.0, dist - 0.05 * cos(time * 3.0));
                
                // Add noise for organic feel
                float noiseValue = fbm(uv * 8.0 + time * 0.5);
                ink1 *= (0.8 + 0.2 * noiseValue);
                ink2 *= (0.7 + 0.3 * noiseValue);
                ink3 *= (0.6 + 0.4 * noiseValue);
                
                // Create ink trails
                vec2 trail = uv - center;
                float trailLength = length(trail);
                float trailAngle = atan(trail.y, trail.x);
                
                float trail1 = smoothstep(0.5, 0.0, trailLength) * 
                              smoothstep(0.0, 0.1, sin(trailAngle * 6.0 + time * 3.0));
                float trail2 = smoothstep(0.4, 0.0, trailLength) * 
                              smoothstep(0.0, 0.1, sin(trailAngle * 10.0 + time * 5.0));
                
                // Combine effects
                float totalInk = ink1 + ink2 * 0.7 + ink3 * 0.5 + trail1 * 0.3 + trail2 * 0.2;
                
                // Color variations
                vec3 inkColor1 = vec3(0.1, 0.2, 0.8);
                vec3 inkColor2 = vec3(0.0, 0.1, 0.6);
                vec3 inkColor3 = vec3(0.2, 0.3, 0.9);
                
                vec3 finalColor = mix(inkColor1, inkColor2, ink2) + inkColor3 * ink3 * 0.3;
                
                return finalColor * totalInk * u_inkIntensity;
            }
            
            float ripple(vec2 uv, vec2 center, float time) {
                float dist = distance(uv, center);
                float ripple = sin(dist * 15.0 - time * 8.0) * 0.5 + 0.5;
                ripple *= smoothstep(0.4, 0.0, dist);
                return ripple;
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 mouse = u_mouse;
                
                // Get previous frame for persistence
                vec4 prevColor = texture2D(u_texture, uv);
                
                // Create ink effect only when mouse is down or moving
                vec3 ink = vec3(0.0);
                if (u_mouseDown || length(mouse) > 0.0) {
                    ink = inkEffect(uv, mouse, u_time);
                    
                    // Add ripple effect
                    float rippleEffect = ripple(uv, mouse / u_resolution, u_time);
                    ink += vec3(0.3, 0.5, 1.0) * rippleEffect * 0.2;
                }
                
                // Fade previous frame
                vec3 currentColor = prevColor.rgb * 0.96;
                
                // Add new ink
                currentColor += ink;
                
                // Add sparkle effect
                float sparkle = random(uv + u_time) * 0.05;
                currentColor += vec3(sparkle) * smoothstep(0.0, 0.1, length(ink));
                
                // Ensure we don't exceed 1.0
                currentColor = min(currentColor, vec3(1.0));
                
                gl_FragColor = vec4(currentColor, 1.0);
            }
        `);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program linking failed:', this.gl.getProgramInfoLog(this.program));
        }
        
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createGeometry() {
        // Create a full-screen quad
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ]);
        
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
        
        // Create position buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        
        // Create texture coordinate buffer
        this.texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
    }
    
    createTexture() {
        // Create texture for persistence
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.canvas.width, this.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        
        // Create framebuffer
        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
            this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
        });
        
        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true;
            this.inkIntensity = 1.5;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.inkIntensity = 1.0;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.inkIntensity = 1.0;
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            this.inkIntensity = 1.5;
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (touch.clientX - rect.left) * window.devicePixelRatio;
            this.mouse.y = (touch.clientY - rect.top) * window.devicePixelRatio;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (touch.clientX - rect.left) * window.devicePixelRatio;
            this.mouse.y = (touch.clientY - rect.top) * window.devicePixelRatio;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isMouseDown = false;
            this.inkIntensity = 1.0;
        });
        
        // Resize event
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createTexture();
        });
    }
    
    render() {
        // Clear the canvas
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Use the shader program
        this.gl.useProgram(this.program);
        
        // Set up attributes
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        
        // Set position attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        // Set texture coordinate attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        // Set uniforms
        const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        const mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
        const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        const textureLocation = this.gl.getUniformLocation(this.program, 'u_texture');
        const inkIntensityLocation = this.gl.getUniformLocation(this.program, 'u_inkIntensity');
        const mouseDownLocation = this.gl.getUniformLocation(this.program, 'u_mouseDown');
        
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);
        this.gl.uniform1f(timeLocation, this.time);
        this.gl.uniform1f(inkIntensityLocation, this.inkIntensity);
        this.gl.uniform1i(mouseDownLocation, this.isMouseDown);
        
        // Bind texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(textureLocation, 0);
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        // Copy to texture for next frame
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        this.render();
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for external control
    setInkIntensity(intensity) {
        this.inkIntensity = Math.max(0, Math.min(2, intensity));
    }
    
    clear() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}

// Export for use in main.js
window.InkDragEffect = InkDragEffect;