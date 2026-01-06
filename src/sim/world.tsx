import type { Ball, Box, Obstacle, Vec2 } from "./types";

export class World {
    balls: Ball[] = [];
    obstacles: Obstacle[] = [];
    box: Box;
    gravity = 1200; // px/s
    restitution = 0.7; // rebond
    friction = 0.2; // per second
    radius = 6;
    spawnSpeed = 800;
    spawnVerticalSpeed = 200;
    boxScale = 0.6;
    solverIterations = 6;
    subSteps = 2;
    maxDt = 1 / 30;
    private viewWidth: number;
    private viewHeight: number;

    constructor(width: number, height: number) {
        this.viewWidth = width;
        this.viewHeight = height;
        this.box = this.createBox(width, height);
        this.addBalls(1);
    }

    resize(width: number, height: number) {
        this.viewWidth = width;
        this.viewHeight = height;
        this.box = this.createBox(width, height, this.box.angle);
    }

    setRadius(radius: number) {
        const nextRadius = Math.max(1, radius);
        this.radius = nextRadius;
        for (const ball of this.balls) {
            ball.radius = nextRadius;
        }
    }

    setBoxAngle(angle: number) {
        this.box = this.createBox(this.viewWidth, this.viewHeight, angle);
    }

    setBoxScale(scale: number) {
        const nextScale = Math.min(1, Math.max(0.1, scale));
        this.boxScale = nextScale;
        this.box = this.createBox(this.viewWidth, this.viewHeight, this.box.angle);
    }

    addObstacle(worldPos: Vec2, radius: number) {
        const local = this.toLocal(worldPos);
        const halfW = this.box.width / 2 - radius;
        const halfH = this.box.height / 2 - radius;
        if (Math.abs(local.x) > halfW || Math.abs(local.y) > halfH) {
            return false;
        }
        this.obstacles.push({
            pos: local,
            radius: Math.max(1, radius),
        });
        return true;
    }

    clearObstacles() {
        this.obstacles = [];
    }

    getObstacleWorldPosition(obstacle: Obstacle) {
        return this.toWorld(obstacle.pos);
    }

    addBalls(count: number) {
        const total = Math.max(0, Math.floor(count));
        this.balls = [];
        for (let i = 0; i < total; i += 1) {
            const spawnPos = this.randomPointInBox(this.radius);
            this.balls.push(this.createBall(spawnPos.x, spawnPos.y));
        }
    }

    step(dt: number) {
        const clampedDt = Math.min(dt, this.maxDt);
        const steps = Math.max(1, Math.floor(this.subSteps));
        const stepDt = clampedDt / steps;

        for (let s = 0; s < steps; s += 1) {
            const damping = Math.max(0, 1 - this.friction * stepDt);

            for (const b of this.balls) {
                // gravity
                b.vel.y += this.gravity * stepDt;

                // friction
                b.vel.x *= damping;
                b.vel.y *= damping;

                // integration
                b.pos.x += b.vel.x * stepDt;
                b.pos.y += b.vel.y * stepDt;
            }

            for (let i = 0; i < this.solverIterations; i += 1) {
                this.resolveBallCollisions();
                this.resolveObstacleCollisions();
                for (const b of this.balls) {
                    this.resolveBoxCollision(b);
                }
            }
        }
    }

    private resolveBallCollisions() {
        const slop = 0.01;
        const percent = 0.8;
        for (let i = 0; i < this.balls.length; i += 1) {
            const a = this.balls[i];
            for (let j = i + 1; j < this.balls.length; j += 1) {
                const b = this.balls[j];
                let dx = b.pos.x - a.pos.x;
                let dy = b.pos.y - a.pos.y;
                let dist = Math.hypot(dx, dy);
                const minDist = a.radius + b.radius;

                if (dist === 0) {
                    dx = 1;
                    dy = 0;
                    dist = 1;
                }

                if (dist < minDist) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = Math.max(0, minDist - dist - slop);
                    const correction = (overlap / 2) * percent;

                    a.pos.x -= nx * correction;
                    a.pos.y -= ny * correction;
                    b.pos.x += nx * correction;
                    b.pos.y += ny * correction;

                    const rvx = b.vel.x - a.vel.x;
                    const rvy = b.vel.y - a.vel.y;
                    const velAlongNormal = rvx * nx + rvy * ny;

                    if (velAlongNormal > 0) {
                        continue;
                    }

                    const impulse = (-(1 + this.restitution) * velAlongNormal) / 2;
                    const ix = impulse * nx;
                    const iy = impulse * ny;

                    a.vel.x -= ix;
                    a.vel.y -= iy;
                    b.vel.x += ix;
                    b.vel.y += iy;
                }
            }
        }
    }

    private resolveObstacleCollisions() {
        const slop = 0.01;
        const percent = 0.9;
        for (const b of this.balls) {
            for (const o of this.obstacles) {
                const obsWorld = this.toWorld(o.pos);
                let dx = b.pos.x - obsWorld.x;
                let dy = b.pos.y - obsWorld.y;
                let dist = Math.hypot(dx, dy);
                const minDist = b.radius + o.radius;

                if (dist === 0) {
                    dx = 1;
                    dy = 0;
                    dist = 1;
                }

                if (dist < minDist) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = Math.max(0, minDist - dist - slop);
                    const correction = overlap * percent;

                    b.pos.x += nx * correction;
                    b.pos.y += ny * correction;

                    const velAlongNormal = b.vel.x * nx + b.vel.y * ny;
                    if (velAlongNormal < 0) {
                        const impulse = -(1 + this.restitution) * velAlongNormal;
                        b.vel.x += impulse * nx;
                        b.vel.y += impulse * ny;
                    }
                }
            }
        }
    }

    private resolveBoxCollision(ball: Ball) {
        const { center, width, height, angle } = this.box;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = ball.pos.x - center.x;
        const dy = ball.pos.y - center.y;

        const localPos = {
            x: cos * dx + sin * dy,
            y: -sin * dx + cos * dy,
        };
        const localVel = {
            x: cos * ball.vel.x + sin * ball.vel.y,
            y: -sin * ball.vel.x + cos * ball.vel.y,
        };

        const halfW = width / 2;
        const halfH = height / 2;

        if (localPos.x - ball.radius < -halfW) {
            localPos.x = -halfW + ball.radius;
            localVel.x *= -this.restitution;
        }

        if (localPos.x + ball.radius > halfW) {
            localPos.x = halfW - ball.radius;
            localVel.x *= -this.restitution;
        }

        if (localPos.y - ball.radius < -halfH) {
            localPos.y = -halfH + ball.radius;
            localVel.y *= -this.restitution;
        }

        if (localPos.y + ball.radius > halfH) {
            localPos.y = halfH - ball.radius;
            localVel.y *= -this.restitution;
        }

        ball.pos.x = center.x + cos * localPos.x - sin * localPos.y;
        ball.pos.y = center.y + sin * localPos.x + cos * localPos.y;
        ball.vel.x = cos * localVel.x - sin * localVel.y;
        ball.vel.y = sin * localVel.x + cos * localVel.y;
    }

    private randomPointInBox(radius: number): Vec2 {
        const halfW = Math.max(1, this.box.width / 2 - radius);
        const halfH = Math.max(1, this.box.height / 2 - radius);
        const local = {
            x: (Math.random() * 2 - 1) * halfW,
            y: (Math.random() * 2 - 1) * halfH,
        };
        return this.toWorld(local);
    }

    private toWorld(local: Vec2): Vec2 {
        const { center, angle } = this.box;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: center.x + cos * local.x - sin * local.y,
            y: center.y + sin * local.x + cos * local.y,
        };
    }

    private toLocal(worldPos: Vec2): Vec2 {
        const { center, angle } = this.box;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = worldPos.x - center.x;
        const dy = worldPos.y - center.y;
        return {
            x: cos * dx + sin * dy,
            y: -sin * dx + cos * dy,
        };
    }

    private createBox(width: number, height: number, angle = 0): Box {
        const margin = 50;
        const availableWidth = Math.max(0, width - margin * 2);
        const availableHeight = Math.max(0, height - margin * 2);
        let boxWidth = availableWidth * this.boxScale;
        let boxHeight = availableHeight * this.boxScale;
        const cos = Math.abs(Math.cos(angle));
        const sin = Math.abs(Math.sin(angle));
        const boundWidth = boxWidth * cos + boxHeight * sin || 1;
        const boundHeight = boxWidth * sin + boxHeight * cos || 1;
        const scale = Math.min(
            1,
            availableWidth / boundWidth,
            availableHeight / boundHeight
        );
        boxWidth *= scale;
        boxHeight *= scale;
        return {
            center: { x: width / 2, y: height / 2 },
            width: boxWidth,
            height: boxHeight,
            angle,
        };
    }

    private createBall(x: number, y: number): Ball {
        return {
            pos: { x, y },
            vel: {
                x: (Math.random() - 0.5) * this.spawnSpeed,
                y: (Math.random() - 0.5) * this.spawnVerticalSpeed,
            },
            radius: this.radius,
            color: this.randomColor(),
        };
    }

    private randomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 55%)`;
    }
}
