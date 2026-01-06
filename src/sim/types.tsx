export type Vec2 = {
    x: number;
    y: number;
};

export type Ball = {
    pos: Vec2;
    vel: Vec2;
    radius: number;
    color: string;
};

export type Obstacle = {
    pos: Vec2;
    radius: number;
};

export type Box = {
    center: Vec2;
    width: number;
    height: number;
    angle: number;
};
