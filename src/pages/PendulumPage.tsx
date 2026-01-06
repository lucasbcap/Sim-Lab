import { useEffect, useRef } from "react";

type Vec2 = { x: number; y: number };

export default function PendulumPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        const g = 9.81;
        const l1 = 160;
        const l2 = 160;
        const m1 = 1;
        const m2 = 1;
        const damping = 0.001;
        const trace: Vec2[] = [];
        const maxTrace = 1500;

        let a1 = Math.PI / 2;
        let a2 = Math.PI / 2 + 0.4;
        let a1v = 0;
        let a2v = 0;

        const step = (dt: number) => {
            const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
            const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
            const num3 = -2 * Math.sin(a1 - a2) * m2;
            const num4 =
                a2v * a2v * l2 + a1v * a1v * l1 * Math.cos(a1 - a2);
            const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
            const a1a = (num1 + num2 + num3 * num4) / den;

            const num5 = 2 * Math.sin(a1 - a2);
            const num6 = a1v * a1v * l1 * (m1 + m2);
            const num7 = g * (m1 + m2) * Math.cos(a1);
            const num8 = a2v * a2v * l2 * m2 * Math.cos(a1 - a2);
            const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
            const a2a = (num5 * (num6 + num7 + num8)) / den2;

            a1v += a1a * dt;
            a2v += a2a * dt;
            a1v *= 1 - damping;
            a2v *= 1 - damping;
            a1 += a1v * dt;
            a2 += a2v * dt;
        };

        let last = performance.now();

        const loop = (time: number) => {
            const dt = Math.min((time - last) / 1000, 1 / 30);
            last = time;

            const subSteps = 6;
            for (let i = 0; i < subSteps; i += 1) {
                step(dt / subSteps);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const origin = { x: canvas.width / 2, y: canvas.height / 3 };
            const p1 = {
                x: origin.x + l1 * Math.sin(a1),
                y: origin.y + l1 * Math.cos(a1),
            };
            const p2 = {
                x: p1.x + l2 * Math.sin(a2),
                y: p1.y + l2 * Math.cos(a2),
            };

            trace.push({ x: p2.x, y: p2.y });
            if (trace.length > maxTrace) {
                trace.shift();
            }

            // trace
            ctx.strokeStyle = "rgba(31, 27, 22, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i < trace.length; i += 1) {
                const p = trace[i];
                if (i === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();

            // rods
            ctx.strokeStyle = "#1f1b16";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(origin.x, origin.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // bobs
            ctx.fillStyle = "#1f1b16";
            ctx.beginPath();
            ctx.arc(origin.x, origin.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 12, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
