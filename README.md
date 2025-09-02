# Enhanced Portfolio Website

A modern, interactive portfolio website inspired by the design of [dala.craftedbygc.com](https://dala.craftedbygc.com/), featuring GLSL ink drag animations, Three.js 3D elements, and responsive design.

## Features

### 🎨 Visual Design
- **Clean, Modern Layout**: Minimalist design with focus on typography and white space
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Animations**: CSS and JavaScript animations for enhanced user experience
- **Interactive Elements**: Hover effects, particle systems, and dynamic interactions

### 🌊 GLSL Ink Drag Effect
- **WebGL-based Ink Animation**: Fluid ink drag effect that follows mouse movement
- **Real-time Rendering**: Smooth 60fps animations using WebGL shaders
- **Interactive Particles**: Ink particles that respond to mouse clicks and movement
- **Performance Optimized**: Efficient rendering with proper resource management

### 🎯 Three.js 3D Elements
- **Floating Geometric Shapes**: Animated 3D objects that respond to mouse movement
- **Particle Systems**: Dynamic particle effects throughout the page
- **Wireframe Objects**: Subtle 3D wireframe elements for depth
- **Scroll-based Animation**: 3D camera movement based on scroll position

### 🧠 Interactive Brain Visualization
- **SVG-based Brain Model**: Scalable vector brain with interactive regions
- **Hover Effects**: Brain regions expand and highlight on hover
- **Neural Connections**: Animated connections between brain regions
- **Educational Tooltips**: Information about different brain functions

### 📱 Responsive Features
- **Mobile-first Design**: Optimized for mobile devices
- **Touch Interactions**: Full touch support for mobile users
- **Adaptive Layout**: Content adapts to different screen sizes
- **Performance Monitoring**: Built-in performance tracking

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and animations
├── main.js            # Main application logic
├── webgl-ink.js       # WebGL ink drag effect
├── three-scene.js     # Three.js 3D scene
├── glsl-shaders.js    # GLSL shader definitions
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Modern JavaScript features and modules
- **WebGL**: Hardware-accelerated graphics rendering
- **GLSL**: OpenGL Shading Language for custom shaders
- **Three.js**: 3D graphics library for WebGL
- **Inter Font**: Modern typography from Google Fonts

## Browser Support

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Full support with touch interactions

## Performance Features

- **Hardware Acceleration**: WebGL and CSS transforms for smooth animations
- **Efficient Rendering**: Optimized draw calls and resource management
- **Lazy Loading**: Components load as needed
- **Memory Management**: Proper cleanup of resources
- **FPS Monitoring**: Built-in performance tracking

## Getting Started

1. **Clone or Download**: Get the project files
2. **Open in Browser**: Simply open `index.html` in a modern web browser
3. **Local Server** (recommended): Use a local server for best performance:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## Customization

### Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #000000;
    --secondary-color: #ffffff;
    --accent-color: #ff6b35;
    /* ... other variables */
}
```

### Content
- Update personal information in `index.html`
- Modify project details in the work section
- Change contact information and links

### Animations
- Adjust animation timing in CSS
- Modify GLSL shaders for different ink effects
- Customize Three.js scene objects

## Performance Tips

1. **Use a Local Server**: File:// protocol may have limitations
2. **Enable Hardware Acceleration**: Ensure GPU acceleration is enabled
3. **Close Other Tabs**: Reduce system load for smoother animations
4. **Update Browser**: Use the latest browser version for best performance

## Browser Developer Tools

The website includes built-in performance monitoring accessible via:
```javascript
// Access performance metrics
console.log(window.performanceMonitor.getMetrics());

// Access main app instance
console.log(window.portfolioApp);
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Compatible**: Proper semantic markup
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Good color contrast ratios
- **Focus Indicators**: Clear focus states for interactive elements

## License

This project is open source and available under the MIT License.

## Credits

- **Design Inspiration**: [dala.craftedbygc.com](https://dala.craftedbygc.com/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- **3D Library**: [Three.js](https://threejs.org/)
- **Icons**: Custom SVG icons and symbols

## Support

For questions or issues, please check the browser console for error messages and ensure you're using a modern browser with WebGL support.