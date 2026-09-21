// "use client";

// import dynamic from "next/dynamic";
// import { useEffect, useRef, useState } from "react";
// import { useMedia, useSaveData } from "@/lib/use-media";

// // three.js loads only in the browser, and only when the hero is on screen
// const GridScan = dynamic(() => import("./GridScan").then((m) => m.GridScan), {
//     ssr: false,
// });

// export function HeroGrid() {
//     const ref = useRef<HTMLDivElement>(null);
//     const [inView, setInView] = useState(false);

//     const reduceMotion = useMedia("(prefers-reduced-motion: reduce)");
//     const hasMouse = useMedia("(pointer: fine)");
//     const saveData = useSaveData();

//     // Run the WebGL loop only while the hero is visible
//     useEffect(() => {
//         const el = ref.current;
//         if (!el) return;
//         const io = new IntersectionObserver(
//             ([entry]) => setInView(entry.isIntersecting),
//             { threshold: 0.05 },
//         );
//         io.observe(el);
//         return () => io.disconnect();
//     }, []);

//     const enabled = inView && !reduceMotion && !saveData;

//     return (
//         <div
//             ref={ref}
//             aria-hidden="true"
//             className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
//         >
//             {enabled && (
//                 <GridScan
//                     sensitivity={0.55}
//                     lineThickness={1}
//                     linesColor="#2F293A"
//                     gridScale={0.1}
//                     scanColor="#FF9FFC"
//                     scanOpacity={0.4}
//                     enablePost={hasMouse}
//                     bloomIntensity={0.6}
//                     chromaticAberration={0.002}
//                     noiseIntensity={0.01}
//                     lineJitter={0.1}
//                     scanGlow={0.5}
//                     scanSoftness={2}
//                 />
//             )}
//         </div>
//     );
// }