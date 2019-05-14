export enum BrickType {
  GREEN = 1,
  YELLOW = 2,
  RED = 3,
  SILVER = 4,
  BLUE = 5
}

export class Brick {
  isCracked = false;
  toughness: number;
  type: BrickType;
  glowVal = 0;
  powerUp: any = null;
  status = 1;

  constructor(public x: number, public y: number, public width: number, public height: number) {
    this.type = randomType();
    this.toughness = toughness(this.type);
  }
}

function toughness(type: BrickType): number {
  switch (type) {
    case BrickType.GREEN:
      return 1;
    case BrickType.YELLOW:
      return 2;
    case BrickType.RED:
      return 3;
    case BrickType.SILVER:
      return 100000;
    case BrickType.BLUE:
      return 3;
  }
}

export function randomType() {
  const types = Object.keys(BrickType)
    .map(n => Number.parseInt(n, 10))
    .filter(n => !Number.isNaN(n));

  const level = parseInt(localStorage.getItem('level'), 10) || 1;
  if (level === 1) {
    return types[getRandomInt2(0, types.length - 5)];
  }
  if (level === 2) {
    return types[getRandomInt2(0, types.length - 3)];
  }

  return types[getRandomInt2(0, types.length - 1)];
}

function getRandomInt2(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
