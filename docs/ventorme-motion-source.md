Motion adapted from the user's VentorMe repository, main commit 243578f956197af5211276aa667eecaffaf8c620.

- src/components/ui/data-rain.tsx: unchanged physics and rendering groups, adapted lifecycle from React to DOM. Color compositing changed for cream background; particle cap reduced. DataRain uses depth-dependent forces and velocity, cursor vortices, visibility pause, adaptive quality and reduced motion.
- src/components/ui/coverflow-carousel.tsx: same coverflow offset model: rotateY=-offset*38deg, z=-abs(offset)*180px, scale=max(1-abs(offset)*0.14,0.4). Compact spacing adapted to the photo-wish layout, GSAP replaces motion/react.
- .agents/skills/motion-design/SKILL.md: LottieFiles motion principles, MIT.

Original URLs: https://github.com/Netfli14/Ventorme/blob/243578f956197af5211276aa667eecaffaf8c620/src/components/ui/data-rain.tsx and https://github.com/Netfli14/Ventorme/blob/243578f956197af5211276aa667eecaffaf8c620/src/components/ui/coverflow-carousel.tsx
