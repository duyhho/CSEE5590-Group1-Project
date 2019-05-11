// Create a new audio context to work around Safari lag issue.
const audioContext = new AudioContext();

export class Sound {
  audio = new Audio();
  track: AudioNode;

  constructor(path) {
    this.audio = new Audio();
    this.audio.src = path;
    this.track = audioContext.createMediaElementSource(this.audio);
    this.track.connect(audioContext.destination);
  }

  play() {
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        this.play();
      });
    } else {
      this.audio.play();
    }
  }

  loop() {
    this.audio.loop = true;
    this.play();
  }

  stop() {
    this.audio.pause();
  }
}
