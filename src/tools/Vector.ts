class Vector {
  constructor(public len: number, public angle: number) {}

  static fromCoordinate(x: number, y: number) {
    const len = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    return new Vector(len, angle);
  }

  toCoordinate(): Coordinate {
    const x = Math.cos(this.angle) * this.len;
    const y = Math.sin(this.angle) * this.len;
    return { x, y };
  }

  plus(v: Vector): Vector {
    const { x, y } = this.toCoordinate();
    const { x: x1, y: y1 } = v.toCoordinate();
    return Vector.fromCoordinate(x + x1, y + y1);
  }

  normalize(): Vector {
    if (this.len === 0) {
      throw new Error('cannot normalize 0 vector');
    }
    return new Vector(1, this.angle);
  }

  perp(): Vector {
    return new Vector(this.len, this.angle + Math.PI / 2);
  }

  scale(factor: number): Vector {
    return new Vector(this.len * factor, this.angle);
  }

  minus(v: Vector): Vector {
    return this.plus(v.scale(-1));
  }
}

export interface Coordinate {
  x: number;
  y: number;
}

export default Vector;
