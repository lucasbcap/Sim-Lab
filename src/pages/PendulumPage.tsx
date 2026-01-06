import { useEffect, useRef, useState } from "react";

type Vec2 = { x: number; y: number };

export default function PendulumPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const paramsRef = useRef({
        g: 9.81,
        pixelsPerMeter: 1200 / 9.81,
        l1: 160,
        l2: 160,
        m1: 1,
        m2: 1,
        damping: 0.001,
        traceOn: true,
    });
    const stateRef = useRef({
        a1: Math.PI / 2,
        a2: Math.PI / 2 + 0.4,
        a1v: 0.6,
        a2v: -0.2,
    });

    const [gravity, setGravity] = useState(9.81);
    const [length1, setLength1] = useState(160);
    const [length2, setLength2] = useState(160);
    const [mass1, setMass1] = useState(1);
    const [mass2, setMass2] = useState(1);
    const [damping, setDamping] = useState(0.001);
    const [angle1, setAngle1] = useState(90);
    const [angle2, setAngle2] = useState(115);
    const [vel1, setVel1] = useState(0.6);
    const [vel2, setVel2] = useState(-0.2);
    const [traceOn, setTraceOn] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        const trace: Vec2[] = [];
        const maxTrace = 1500;

        const step = (dt: number) => {
            const { g, pixelsPerMeter, l1, l2, m1, m2, damping: damp } =
                paramsRef.current;
            const gPx = g * pixelsPerMeter;
            const { a1, a2, a1v, a2v } = stateRef.current;
            const num1 = -gPx * (2 * m1 + m2) * Math.sin(a1);
            const num2 = -m2 * gPx * Math.sin(a1 - 2 * a2);
            const num3 = -2 * Math.sin(a1 - a2) * m2;
            const num4 =
                a2v * a2v * l2 + a1v * a1v * l1 * Math.cos(a1 - a2);
            const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
            const a1a = (num1 + num2 + num3 * num4) / den;

            const num5 = 2 * Math.sin(a1 - a2);
            const num6 = a1v * a1v * l1 * (m1 + m2);
            const num7 = gPx * (m1 + m2) * Math.cos(a1);
            const num8 = a2v * a2v * l2 * m2 * Math.cos(a1 - a2);
            const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
            const a2a = (num5 * (num6 + num7 + num8)) / den2;

            const nextA1v = (a1v + a1a * dt) * (1 - damp);
            const nextA2v = (a2v + a2a * dt) * (1 - damp);
            stateRef.current = {
                a1: a1 + nextA1v * dt,
                a2: a2 + nextA2v * dt,
                a1v: nextA1v,
                a2v: nextA2v,
            };
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

            const { l1, l2, traceOn: traceEnabled } = paramsRef.current;
            const { a1, a2 } = stateRef.current;
            const origin = { x: canvas.width / 2, y: canvas.height / 3 };
            const p1 = {
                x: origin.x + l1 * Math.sin(a1),
                y: origin.y + l1 * Math.cos(a1),
            };
            const p2 = {
                x: p1.x + l2 * Math.sin(a2),
                y: p1.y + l2 * Math.cos(a2),
            };

            if (traceEnabled) {
                trace.push({ x: p2.x, y: p2.y });
                if (trace.length > maxTrace) {
                    trace.shift();
                }
            } else if (trace.length > 0) {
                trace.length = 0;
            }

            // trace
            if (trace.length > 1) {
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
            }

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

    useEffect(() => {
        paramsRef.current = {
            g: gravity,
            pixelsPerMeter: 1200 / 9.81,
            l1: length1,
            l2: length2,
            m1: mass1,
            m2: mass2,
            damping,
            traceOn,
        };
    }, [gravity, length1, length2, mass1, mass2, damping, traceOn]);

    const reset = () => {
        stateRef.current = {
            a1: (angle1 * Math.PI) / 180,
            a2: (angle2 * Math.PI) / 180,
            a1v: vel1,
            a2v: vel2,
        };
    };

    return (
        <div style={{ position: "relative" }}>
            <canvas ref={canvasRef} style={{ display: "block" }} />
            <div
                style={{
                    position: "absolute",
                    top: 72,
                    left: 16,
                    display: "grid",
                    gap: 8,
                    padding: 10,
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontFamily: "sans-serif",
                }}
            >
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Gravite</span>
                    <input
                        type="number"
                        step={0.1}
                        value={gravity}
                        onChange={(event) =>
                            setGravity(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Longueur 1</span>
                    <input
                        type="number"
                        min={40}
                        step={5}
                        value={length1}
                        onChange={(event) =>
                            setLength1(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Longueur 2</span>
                    <input
                        type="number"
                        min={40}
                        step={5}
                        value={length2}
                        onChange={(event) =>
                            setLength2(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Masse 1</span>
                    <input
                        type="number"
                        min={0.2}
                        step={0.1}
                        value={mass1}
                        onChange={(event) =>
                            setMass1(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Masse 2</span>
                    <input
                        type="number"
                        min={0.2}
                        step={0.1}
                        value={mass2}
                        onChange={(event) =>
                            setMass2(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Amort.</span>
                    <input
                        type="number"
                        min={0}
                        step={0.0005}
                        value={damping}
                        onChange={(event) =>
                            setDamping(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Angle 1</span>
                    <input
                        type="number"
                        step={1}
                        value={angle1}
                        onChange={(event) =>
                            setAngle1(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Angle 2</span>
                    <input
                        type="number"
                        step={1}
                        value={angle2}
                        onChange={(event) =>
                            setAngle2(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Vit. 1</span>
                    <input
                        type="number"
                        step={0.05}
                        value={vel1}
                        onChange={(event) =>
                            setVel1(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Vit. 2</span>
                    <input
                        type="number"
                        step={0.05}
                        value={vel2}
                        onChange={(event) =>
                            setVel2(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Trace</span>
                    <input
                        type="checkbox"
                        checked={traceOn}
                        onChange={(event) => setTraceOn(event.target.checked)}
                    />
                </label>
                <button type="button" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
}
