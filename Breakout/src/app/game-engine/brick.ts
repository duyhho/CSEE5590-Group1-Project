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
  const enumValues = Object.keys(BrickType)
    .map(n => Number.parseInt(n, 10))
    .filter(n => !Number.isNaN(n));

  const min = 0;
  const max = enumValues.length - 1;

  const index = Math.floor(Math.random() * (max - min + 1)) + min;
  return enumValues[index];
}
