// GLSL Shader definitions for ink drag effect

export const vertexShaderSource = `
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
`;

export const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform sampler2D u_texture;
    
    varying vec2 v_texCoord;
    varying float v_time;
    
    // Noise function for organic ink effect
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
    
    // Fractal noise for more complex patterns
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    
    // Ink dispersion effect
    vec3 inkEffect(vec2 uv, vec2 mouse, float time) {
        vec2 center = mouse / u_resolution;
        float dist = distance(uv, center);
        
        // Create multiple ink drops with different properties
        float ink1 = smoothstep(0.3, 0.0, dist);
        float ink2 = smoothstep(0.2, 0.0, dist - 0.1 * sin(time * 2.0));
        float ink3 = smoothstep(0.15, 0.0, dist - 0.05 * cos(time * 3.0));
        
        // Add noise for organic feel
        float noiseValue = fbm(uv * 10.0 + time * 0.5);
        ink1 *= (0.8 + 0.2 * noiseValue);
        ink2 *= (0.7 + 0.3 * noiseValue);
        ink3 *= (0.6 + 0.4 * noiseValue);
        
        // Create ink trails
        vec2 trail = uv - center;
        float trailLength = length(trail);
        float trailAngle = atan(trail.y, trail.x);
        
        // Multiple trail layers
        float trail1 = smoothstep(0.4, 0.0, trailLength) * 
                      smoothstep(0.0, 0.1, sin(trailAngle * 8.0 + time * 4.0));
        float trail2 = smoothstep(0.3, 0.0, trailLength) * 
                      smoothstep(0.0, 0.1, sin(trailAngle * 12.0 + time * 6.0));
        
        // Combine all effects
        float totalInk = ink1 + ink2 * 0.7 + ink3 * 0.5 + trail1 * 0.3 + trail2 * 0.2;
        
        // Create color variations
        vec3 inkColor1 = vec3(0.1, 0.2, 0.8); // Deep blue
        vec3 inkColor2 = vec3(0.0, 0.1, 0.6); // Darker blue
        vec3 inkColor3 = vec3(0.2, 0.3, 0.9); // Lighter blue
        
        vec3 finalColor = mix(inkColor1, inkColor2, ink2) + inkColor3 * ink3 * 0.3;
        
        return finalColor * totalInk;
    }
    
    // Water ripple effect
    float ripple(vec2 uv, vec2 center, float time) {
        float dist = distance(uv, center);
        float ripple = sin(dist * 20.0 - time * 10.0) * 0.5 + 0.5;
        ripple *= smoothstep(0.3, 0.0, dist);
        return ripple;
    }
    
    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse;
        
        // Get previous frame for persistence
        vec4 prevColor = texture2D(u_texture, uv);
        
        // Create ink effect
        vec3 ink = inkEffect(uv, mouse, u_time);
        
        // Add ripple effect
        float rippleEffect = ripple(uv, mouse / u_resolution, u_time);
        ink += vec3(0.3, 0.5, 1.0) * rippleEffect * 0.3;
        
        // Fade previous frame
        vec3 currentColor = prevColor.rgb * 0.95;
        
        // Add new ink
        currentColor += ink * 0.8;
        
        // Add some sparkle effect
        float sparkle = random(uv + u_time) * 0.1;
        currentColor += vec3(sparkle) * smoothstep(0.0, 0.1, length(ink));
        
        // Ensure we don't exceed 1.0
        currentColor = min(currentColor, vec3(1.0));
        
        gl_FragColor = vec4(currentColor, 1.0);
    }
`;

// Alternative fragment shader for more complex ink effects
export const advancedFragmentShaderSource = `
    precision mediump float;
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform sampler2D u_texture;
    uniform float u_inkIntensity;
    
    varying vec2 v_texCoord;
    varying float v_time;
    
    // Advanced noise functions
    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    // Complex ink dispersion with multiple layers
    vec3 advancedInkEffect(vec2 uv, vec2 mouse, float time) {
        vec2 center = mouse / u_resolution;
        vec2 offset = uv - center;
        float dist = length(offset);
        
        // Create multiple ink layers with different properties
        float layer1 = exp(-dist * 8.0) * (1.0 + 0.3 * snoise(vec3(offset * 20.0, time * 2.0)));
        float layer2 = exp(-dist * 12.0) * (1.0 + 0.2 * snoise(vec3(offset * 30.0, time * 3.0)));
        float layer3 = exp(-dist * 16.0) * (1.0 + 0.1 * snoise(vec3(offset * 40.0, time * 4.0)));
        
        // Create swirling motion
        float angle = atan(offset.y, offset.x);
        float swirl = sin(angle * 6.0 + time * 4.0) * 0.1;
        vec2 swirlOffset = offset + vec2(cos(angle), sin(angle)) * swirl;
        
        // Add turbulence
        float turbulence = snoise(vec3(swirlOffset * 15.0, time * 1.5)) * 0.1;
        layer1 *= (1.0 + turbulence);
        layer2 *= (1.0 + turbulence * 0.7);
        layer3 *= (1.0 + turbulence * 0.5);
        
        // Color mixing
        vec3 color1 = vec3(0.1, 0.3, 0.9);
        vec3 color2 = vec3(0.0, 0.1, 0.7);
        vec3 color3 = vec3(0.2, 0.4, 1.0);
        
        vec3 finalColor = color1 * layer1 + color2 * layer2 + color3 * layer3;
        
        return finalColor * u_inkIntensity;
    }
    
    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Get previous frame
        vec4 prevColor = texture2D(u_texture, uv);
        
        // Create advanced ink effect
        vec3 ink = advancedInkEffect(uv, u_mouse, u_time);
        
        // Fade previous frame
        vec3 currentColor = prevColor.rgb * 0.92;
        
        // Add new ink
        currentColor += ink;
        
        // Add subtle glow
        float glow = length(ink) * 0.3;
        currentColor += vec3(0.2, 0.4, 0.8) * glow;
        
        // Clamp values
        currentColor = min(currentColor, vec3(1.0));
        
        gl_FragColor = vec4(currentColor, 1.0);
    }
`;