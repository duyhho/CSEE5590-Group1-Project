// Create a new audio context to work around Safari lag issue.
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
if (audioContext.state === 'suspended') {
  const unlock = () => {
    audioContext.resume().then(() => {
      document.body.removeEventListener('mousedown', unlock);
      document.body.removeEventListener('touchstart', unlock);
      document.body.removeEventListener('touchend', unlock);
    });
  };

  document.body.addEventListener('mousedown', unlock, false);
  document.body.addEventListener('touchstart', unlock, false);
  document.body.addEventListener('touchend', unlock, false);

}

export class Sound {
  audioData: AudioBuffer;
  sourceNode: AudioBufferSourceNode;

  constructor(path) {
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      audioContext.decodeAudioData(request.response, buffer => {
        this.audioData = buffer;
      });
    };
    request.send();
  }

  play(loop = false) {
    if (this.sourceNode) {
      this.sourceNode.stop(0);
    }
    this.sourceNode = audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioData;
    this.sourceNode.connect(audioContext.destination);
    this.sourceNode.start(0);
    this.sourceNode.loop = loop;
  }

  loop() {
    this.play(true);
  }

  stop() {
    this.sourceNode.stop(0);
  }

}
