// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// export interface GridScanProps {
//     sensitivity?: number;
//     lineThickness?: number;
//     linesColor?: string;
//     gridScale?: number;
//     scanColor?: string;
//     scanOpacity?: number;
//     enablePost?: boolean;
//     bloomIntensity?: number;
//     chromaticAberration?: number;
//     noiseIntensity?: number;
//     lineJitter?: number;
//     scanGlow?: number;
//     scanSoftness?: number;
// }

// export function GridScan({
//     sensitivity = 0.55,
//     lineThickness = 1,
//     linesColor = "#2F293A",
//     gridScale = 0.1,
//     scanColor = "#FF9FFC",
//     scanOpacity = 0.4,
//     enablePost = true,
//     bloomIntensity = 0.6,
//     chromaticAberration = 0.002,
//     noiseIntensity = 0.01,
//     lineJitter = 0.1,
//     scanGlow = 0.5,
//     scanSoftness = 2,
// }: GridScanProps) {
//     const containerRef = useRef<HTMLDivElement>(null);

//     ```
// useEffect(() => {
//     const container = containerRef.current;

//     if (!container) return;

//     let animationFrame = 0;
//     let renderer: THREE.WebGLRenderer | null = null;

//     try {
//         renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             alpha: true,
//             powerPreference: "high-performance",
//         });

//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         renderer.setSize(container.clientWidth, container.clientHeight);
//         renderer.setClearColor(0x000000, 0);

//         container.appendChild(renderer.domElement);

//         const scene = new THREE.Scene();

//         const camera = new THREE.OrthographicCamera(
//             -1,
//             1,
//             1,
//             -1,
//             0.1,
//             10,
//         );

//         camera.position.z = 1;

//         const geometry = new THREE.PlaneGeometry(2, 2);

//         const uniforms = {
//             uTime: { value: 0 },
//             uResolution: {
//                 value: new THREE.Vector2(
//                     container.clientWidth,
//                     container.clientHeight,
//                 ),
//             },
//             uGridScale: { value: gridScale },
//             uLineThickness: { value: lineThickness },
//             uLinesColor: {
//                 value: new THREE.Color(linesColor),
//             },
//             uScanColor: {
//                 value: new THREE.Color(scanColor),
//             },
//             uScanOpacity: { value: scanOpacity },
//             uSensitivity: { value: sensitivity },
//             uLineJitter: { value: lineJitter },
//             uScanGlow: { value: scanGlow },
//             uScanSoftness: { value: scanSoftness },
//             uNoiseIntensity: { value: noiseIntensity },
//             uBloomIntensity: {
//                 value: enablePost ? bloomIntensity : 0,
//             },
//             uChromaticAberration: {
//                 value: enablePost ? chromaticAberration : 0,
//             },
//         };

//         const material = new THREE.ShaderMaterial({
//             transparent: true,
//             depthWrite: false,
//             uniforms,

//             vertexShader: `
//                 varying vec2 vUv;

//     void main() {
//         vUv = uv;

//         gl_Position = vec4(
//             position.xy,
//             0.0,
//             1.0
//         );
//     }
//     `,

//             fragmentShader: `
//                 precision highp float;

//                 varying vec2 vUv;

//                 uniform float uTime;
//                 uniform vec2 uResolution;

//                 uniform float uGridScale;
//                 uniform float uLineThickness;

//                 uniform vec3 uLinesColor;
//                 uniform vec3 uScanColor;

//                 uniform float uScanOpacity;
//                 uniform float uSensitivity;

//                 uniform float uLineJitter;
//                 uniform float uScanGlow;
//                 uniform float uScanSoftness;

//                 uniform float uNoiseIntensity;
//                 uniform float uBloomIntensity;
//                 uniform float uChromaticAberration;

//                 float hash(vec2 p) {
//         return fract(
//             sin(
//                 dot(
//                     p,
//                     vec2(
//                         127.1,
//                         311.7
//                     )
//                 )
//             ) * 43758.5453123
//         );
//     }

//                 float noise(vec2 p) {
//                     vec2 i = floor(p);
//                     vec2 f = fract(p);

//         f = f * f * (3.0 - 2.0 * f);

//                     float a = hash(i);
//                     float b = hash(i + vec2(1.0, 0.0));
//                     float c = hash(i + vec2(0.0, 1.0));
//                     float d = hash(i + vec2(1.0, 1.0));

//         return mix(
//             mix(a, b, f.x),
//             mix(c, d, f.x),
//             f.y
//         );
//     }

//     void main() {
//                     vec2 uv = vUv;

//                     float aspect =
//             uResolution.x /
//             max(uResolution.y, 1.0);

//                     vec2 gridUv = uv;

//         gridUv.x *= aspect;

//                     /*
//                      * Perspective-like grid
//                      */
//                     float scale = max(
//             uGridScale,
//             0.01
//         );

//         gridUv /= scale;

//                     /*
//                      * Small animated distortion
//                      */
//                     float distortion =
//             noise(
//                 gridUv * 0.35 +
//                 uTime * 0.025
//             );

//         gridUv.x +=
//             (distortion - 0.5) *
//             uLineJitter *
//             0.08;

//                     /*
//                      * Grid lines
//                      */
//                     vec2 cell = fract(gridUv);

//                     float lineWidth =
//             clamp(
//                 uLineThickness *
//                 0.012,
//                 0.001,
//                 0.08
//             );

//                     float verticalLine =
//             1.0 -
//             smoothstep(
//                 lineWidth,
//                 lineWidth * 2.0,
//                 min(
//                     cell.x,
//                     1.0 - cell.x
//                 )
//             );

//                     float horizontalLine =
//             1.0 -
//             smoothstep(
//                 lineWidth,
//                 lineWidth * 2.0,
//                 min(
//                     cell.y,
//                     1.0 - cell.y
//                 )
//             );

//                     float grid =
//             max(
//                 verticalLine,
//                 horizontalLine
//             );

//                     /*
//                      * Scan wave travelling upward
//                      */
//                     float scanPosition =
//             fract(
//                 uTime *
//                 (0.055 +
//                     uSensitivity *
//                     0.045)
//             );

//                     float distanceFromScan =
//             abs(
//                 uv.y -
//                 scanPosition
//             );

//         distanceFromScan =
//             min(
//                 distanceFromScan,
//                 1.0 -
//                 distanceFromScan
//             );

//                     float softness =
//             max(
//                 uScanSoftness,
//                 0.1
//             );

//                     float scan =
//             1.0 -
//             smoothstep(
//                 0.0,
//                 0.18 *
//                 softness,
//                 distanceFromScan
//             );

//                     /*
//                      * Scan glow
//                      */
//                     float glow =
//             pow(
//                 scan,
//                 max(
//                     0.5,
//                     2.5 -
//                     uScanGlow
//                 )
//             );

//                     /*
//                      * Subtle animated noise
//                      */
//                     float n =
//             noise(
//                 uv *
//                 uResolution.xy *
//                 0.015 +
//                 uTime *
//                 0.15
//             );

//                     float noiseAmount =
//             (
//                 n -
//                 0.5
//             ) *
//             uNoiseIntensity;

//                     /*
//                      * Fade toward the bottom and edges
//                      */
//                     float edgeFade =
//             smoothstep(
//                 0.0,
//                 0.12,
//                 uv.y
//             ) *
//             smoothstep(
//                 1.0,
//                 0.72,
//                 uv.y
//             );

//                     /*
//                      * Base grid
//                      */
//                     vec3 color =
//             uLinesColor *
//             grid;

//         /*
//          * Scan highlight
//          */
//         color +=
//             uScanColor *
//             glow *
//             uScanOpacity *
//             (
//                 0.65 +
//                 grid *
//                 0.75
//             );

//         /*
//          * Slight bloom-like enhancement
//          */
//         color +=
//             uScanColor *
//             glow *
//             uBloomIntensity *
//             0.08;

//                     /*
//                      * Very subtle RGB separation
//                      * when post-processing is enabled
//                      */
//                     float aberration =
//             uChromaticAberration *
//             scan;

//         color.r +=
//             aberration *
//             0.35;

//         color.b +=
//             aberration *
//             0.25;

//         color +=
//             noiseAmount;

//                     float alpha =
//             (
//                 grid *
//                 0.85 +
//                 glow *
//                 uScanOpacity *
//                 0.7
//             ) *
//             edgeFade;

//         alpha = clamp(
//             alpha,
//             0.0,
//             0.9
//         );

//         gl_FragColor =
//             vec4(
//                 color,
//                 alpha
//             );
//     }
//     `,
//         });

//         const mesh = new THREE.Mesh(
//             geometry,
//             material,
//         );

//         scene.add(mesh);

//         const clock = new THREE.Clock();

//         const animate = () => {
//             if (!renderer) return;

//             uniforms.uTime.value =
//                 clock.getElapsedTime();

//             renderer.render(
//                 scene,
//                 camera
//             );

//             animationFrame =
//                 requestAnimationFrame(
//                     animate
//                 );
//         };

//         const resize = () => {
//             if (!renderer || !container) return;

//             const width =
//                 container.clientWidth;

//             const height =
//                 container.clientHeight;

//             if (
//                 width <= 0 ||
//                 height <= 0
//             ) {
//                 return;
//             }

//             renderer.setSize(
//                 width,
//                 height
//             );

//             renderer.setPixelRatio(
//                 Math.min(
//                     window.devicePixelRatio,
//                     2
//                 )
//             );

//             uniforms.uResolution.value.set(
//                 width,
//                 height
//             );
//         };

//         const resizeObserver =
//             new ResizeObserver(resize);

//         resizeObserver.observe(
//             container
//         );

//         resize();

//         animate();

//         return () => {
//             cancelAnimationFrame(
//                 animationFrame
//             );

//             resizeObserver.disconnect();

//             geometry.dispose();
//             material.dispose();

//             renderer?.dispose();

//             if (
//                 renderer?.domElement &&
//                 container.contains(
//                     renderer.domElement
//                 )
//             ) {
//                 container.removeChild(
//                     renderer.domElement
//                 );
//             }
//         };
//     } catch (error) {
//         console.error(
//             "GridScan initialization failed:",
//             error
//         );

//         return () => {
//             cancelAnimationFrame(
//                 animationFrame
//             );

//             renderer?.dispose();
//         };
//     }
// }, [
//     sensitivity,
//     lineThickness,
//     linesColor,
//     gridScale,
//     scanColor,
//     scanOpacity,
//     enablePost,
//     bloomIntensity,
//     chromaticAberration,
//     noiseIntensity,
//     lineJitter,
//     scanGlow,
//     scanSoftness,
// ]);

// return (
//     <div
//         ref={containerRef}
//         aria-hidden="true"
//         style={{
//             position: "absolute",
//             inset: 0,
//             width: "100%",
//             height: "100%",
//             overflow: "hidden",
//             pointerEvents: "none",
//         }}
//     />
// );
// ```

// }
