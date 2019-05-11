declare interface Document {
  pointerLockElement: HTMLElement;
  exitPointerLock(): void;
}

declare interface HTMLElement {
  requestPointerLock(): void;
}
