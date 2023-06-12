import React, { useEffect, useRef } from 'react';

const BubbleCanvas = ({skills}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const bubbles = [];
        const sparks = [];

        function Bubble(x, y, dx, dy, radius, skillImagePath) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
        
            // Load the image
            this.image = new Image();
            this.image.src = skillImagePath;
        
            this.draw = function() {
                ctx.drawImage(this.image, this.x, this.y, this.radius * 2, this.radius * 2);
            };
        
            this.update = function() {
                if (this.x + this.radius * 2 > canvas.width || this.x < 0) {
                    this.dx = -this.dx;
                    sparks.push(new Spark(this.x, this.y));
                }
        
                if (this.y + this.radius * 2 > canvas.height || this.y < 0) {
                    this.dy = -this.dy;
                    sparks.push(new Spark(this.x, this.y));
                }
        
                this.x += this.dx;
                this.y += this.dy;
        
                this.draw();
            };
        }

        function Spark(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];

            // Create particles
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: x,
                    y: y,
                    dx: (Math.random() - 0.5) * 5,
                    dy: (Math.random() - 0.5) * 5,
                    alpha: 1,
                    radius: Math.random() * 5,
                });
            }

            this.draw = function() {
                ctx.save(); // Save the current state

                this.particles.forEach(particle => {
                    ctx.globalAlpha = particle.alpha; // Apply opacity
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                    ctx.fillStyle = 'var(--theme-ui-colors-orange)';
                    ctx.fill();
                });

                ctx.restore(); // Restore to previous state
            };
        
            this.update = function() {
                this.particles.forEach(particle => {
                    particle.x += particle.dx;
                    particle.y += particle.dy;
                    particle.alpha -= 0.01; // Reduce opacity over time
                });

                this.particles = this.particles.filter(particle => particle.alpha > 0);

                this.draw();
            };
        }

        const radius = 100; // Constant radius for all bubbles
        for (let i = 0; i < skills.length; i++) {
            let x = Math.random() * (canvas.width - radius * 2);
            let y = Math.random() * (canvas.height - radius * 2);
            let dx = (Math.random() - 0.5) * 4;
            let dy = (Math.random() - 0.5) * 4;
            bubbles.push(new Bubble(x, y, dx, dy, radius, skills[i]));
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bubbles.length; i++) {
                bubbles[i].update();
            }

            for (let i = sparks.length - 1; i >= 0; i--) {
                sparks[i].update();
                if (sparks[i].particles.length === 0) { // If all particles are gone
                    sparks.splice(i, 1); // Remove spark
                }
            }
        }

        animate();
    }, []);

    return (
        <canvas ref={canvasRef} style={{width: '100%'}} />
    );
};

export default BubbleCanvas;
