declare interface Document {
  pointerLockElement: HTMLElement;
  exitPointerLock(): void;
}

declare interface HTMLElement {
  requestPointerLock(): void;
}

declare interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}
