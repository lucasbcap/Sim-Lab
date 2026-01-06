import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { World } from "../sim/world";

export default function CanvasView() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const worldRef = useRef<World | null>(null);
    const [ballCount, setBallCount] = useState("150");
    const [gravity, setGravity] = useState(1200);
    const [restitution, setRestitution] = useState(0.7);
    const [friction, setFriction] = useState(0.2);
    const [radius, setRadius] = useState(6);
    const [spawnSpeed, setSpawnSpeed] = useState(800);
    const [spawnVerticalSpeed, setSpawnVerticalSpeed] = useState(200);
    const [boxAngleDeg, setBoxAngleDeg] = useState(0);
    const [autoRotate, setAutoRotate] = useState(false);
    const autoRotateRef = useRef(false);
    const [boxScale, setBoxScale] = useState(0.6);
    const [solverIterations, setSolverIterations] = useState(6);
    const [obstacleRadius, setObstacleRadius] = useState(18);
    const [placeObstacles, setPlaceObstacles] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (worldRef.current) {
                worldRef.current.resize(canvas.width, canvas.height);
            } else {
                worldRef.current = new World(canvas.width, canvas.height);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        let lastTime = performance.now();

        const loop = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            const world = worldRef.current!;
            if (autoRotateRef.current) {
                const angle = Math.sin(time * 0.0002) * 30;
                world.setBoxAngle((angle * Math.PI) / 180);
                if (Math.abs(angle - boxAngleDeg) > 0.5) {
                    setBoxAngleDeg(Math.round(angle));
                }
            }
            world.step(dt);

            // draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // box
            const box = world.box;
            ctx.save();
            ctx.translate(box.center.x, box.center.y);
            ctx.rotate(box.angle);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(-box.width / 2, -box.height / 2, box.width, box.height);
            ctx.restore();

            // obstacles
            ctx.fillStyle = "#333";
            for (const o of world.obstacles) {
                const pos = world.getObstacleWorldPosition(o);
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, o.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // balls
            for (const b of world.balls) {
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.arc(b.pos.x, b.pos.y, b.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const world = worldRef.current;
        if (!world) {
            return;
        }
        world.gravity = gravity;
        world.restitution = restitution;
        world.friction = friction;
        world.spawnSpeed = spawnSpeed;
        world.spawnVerticalSpeed = spawnVerticalSpeed;
        world.setRadius(radius);
        if (!autoRotate) {
            world.setBoxAngle((boxAngleDeg * Math.PI) / 180);
        }
        world.setBoxScale(boxScale);
        world.solverIterations = solverIterations;
    }, [
        gravity,
        restitution,
        friction,
        radius,
        spawnSpeed,
        spawnVerticalSpeed,
        boxAngleDeg,
        boxScale,
        solverIterations,
        autoRotate,
    ]);

    const handleAddBalls = () => {
        const count = Number(ballCount);
        if (!Number.isFinite(count) || count <= 0) {
            return;
        }
        worldRef.current?.addBalls(count);
    };

    const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!placeObstacles) {
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        worldRef.current?.addObstacle({ x, y }, obstacleRadius);
    };

    return (
        <div style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                    display: "block",
                    cursor: placeObstacles ? "crosshair" : "default",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 72,
                    left: 16,
                    display: "grid",
                    gap: 8,
                    padding: 8,
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontFamily: "sans-serif",
                }}
            >
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Ajouter</span>
                    <input
                        type="number"
                        min={1}
                        step={1}
                        value={ballCount}
                        onChange={(event) => setBallCount(event.target.value)}
                        style={{ width: 80 }}
                    />
                    <span>balles</span>
                </label>
                <button type="button" onClick={handleAddBalls}>
                    Ajouter
                </button>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Gravite</span>
                    <input
                        type="number"
                        step={50}
                        value={gravity}
                        onChange={(event) =>
                            setGravity(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Rebond</span>
                    <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={restitution}
                        onChange={(event) =>
                            setRestitution(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Frottement</span>
                    <input
                        type="number"
                        min={0}
                        step={0.05}
                        value={friction}
                        onChange={(event) =>
                            setFriction(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Rayon</span>
                    <input
                        type="number"
                        min={2}
                        step={1}
                        value={radius}
                        onChange={(event) =>
                            setRadius(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Vitesse X</span>
                    <input
                        type="number"
                        min={0}
                        step={50}
                        value={spawnSpeed}
                        onChange={(event) =>
                            setSpawnSpeed(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Vitesse Y</span>
                    <input
                        type="number"
                        min={0}
                        step={20}
                        value={spawnVerticalSpeed}
                        onChange={(event) =>
                            setSpawnVerticalSpeed(Number(event.target.value))
                        }
                        style={{ width: 90 }}
                    />
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Rotation</span>
                    <input
                        type="range"
                        min={-180}
                        max={180}
                        step={1}
                        value={boxAngleDeg}
                        onChange={(event) =>
                            setBoxAngleDeg(Number(event.target.value))
                        }
                        style={{ width: 140 }}
                        disabled={autoRotate}
                    />
                    <span>{boxAngleDeg} deg</span>
                </label>
                <button
                    type="button"
                    onClick={() => {
                        const next = !autoRotate;
                        setAutoRotate(next);
                        autoRotateRef.current = next;
                    }}
                >
                    {autoRotate ? "Stop rotation" : "Rotation auto"}
                </button>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Taille boite</span>
                    <input
                        type="range"
                        min={0.3}
                        max={0.9}
                        step={0.05}
                        value={boxScale}
                        onChange={(event) =>
                            setBoxScale(Number(event.target.value))
                        }
                        style={{ width: 140 }}
                    />
                    <span>{Math.round(boxScale * 100)}%</span>
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Iterations</span>
                    <input
                        type="range"
                        min={1}
                        max={8}
                        step={1}
                        value={solverIterations}
                        onChange={(event) =>
                            setSolverIterations(Number(event.target.value))
                        }
                        style={{ width: 140 }}
                    />
                    <span>{solverIterations}</span>
                </label>
                <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Obstacle</span>
                    <input
                        type="range"
                        min={6}
                        max={60}
                        step={2}
                        value={obstacleRadius}
                        onChange={(event) =>
                            setObstacleRadius(Number(event.target.value))
                        }
                        style={{ width: 140 }}
                    />
                    <span>{obstacleRadius}px</span>
                </label>
                <button
                    type="button"
                    onClick={() => worldRef.current?.clearObstacles()}
                >
                    Effacer obstacles
                </button>
                <button
                    type="button"
                    onClick={() => setPlaceObstacles((value) => !value)}
                >
                    {placeObstacles ? "Mode obstacles: ON" : "Mode obstacles: OFF"}
                </button>
            </div>
        </div>
    );
}
