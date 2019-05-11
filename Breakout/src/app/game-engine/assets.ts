import {Sound} from './sound';
import {BrickType} from './brick';
// import {Sound} from "./sound.js";

export const Images = Object.freeze({
  background: loadImage('assets/background.jpg'),
  fireball: loadImage('assets/fireball.png'),
  ball: loadImage('assets/ball.png'),
  paddle: loadImage('assets/paddle1.png'),
  longPaddle: loadImage('assets/paddle2.png'),
  bricks: loadBricks()
});

export const Sounds = {
  // Sound effects
  metal: loadSound('assets/metal.wav'),
  brickBurnt: loadSound('assets/explode.wav'),
  brickNormal: loadSound('assets/brick.wav'),
  fire: loadSound('assets/fire.mp3'),
  fireVoice: loadSound('assets/fireball-voice.wav'),
  large: loadSound('assets/large.wav'),
  largeVoice: loadSound('assets/large-voice.wav'),
  long: loadSound('assets/long.wav'),
  longVoice: loadSound('assets/long-voice.wav'),
  liveLost: loadSound('assets/livelost.wav'),
  downgrade: loadSound('assets/downgrade.wav'),
  // Music
  music: loadSound('assets/music.wav'),
  win: loadSound('assets/win.mp3'),
  lose: loadSound('assets/lose.mp3')
};

function loadImage(path): HTMLImageElement {
  const image = new Image();
  image.src = path;
  return image;
}


// Images.bricks[BrickType.GREEN].cracked
// Images.bricks[BrickType.GREEN].normal
function loadBricks() {
  const images = {};
  Object.values(BrickType).forEach(type => {
    if (typeof type !== 'number') {
      return;
    }
    console.log('brick type', type);
    Object.assign(images, {
      [type]: {
        normal: loadImage(`assets/type${type}.png`),
        cracked: loadImage(`assets/type${type}cracked.png`)
      }
    });
  });
  console.log('images', images);
  return images;
}

function loadSound(path) {
  return new Sound(path);
}
