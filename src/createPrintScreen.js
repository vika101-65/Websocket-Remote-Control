import robot from 'robotjs';
import Jimp from 'jimp';

export function createPrintScreen() {
  const mousePos = robot.getMousePos();
  const x = mousePos.x - 100;
  const y = mousePos.y - 100;
  let data;

  if (x > 0 && y > 0) {
    const image = robot.screen.capture(x, y, 200, 200);

    for (let i = 0; i < image.image.length; i++) {
      if (i % 4 == 0) {
        [image.image[i], image.image[i + 2]] = [image.image[i + 2], image.image[i]];
      }
    };

    const jimg = new Jimp(image.width, image.height);
    jimg.bitmap.data = image.image;

    jimg.getBuffer(Jimp.MIME_PNG, (err, result) => {
      if (err) {
        console.error(err);
      }
      data = result;
    });

    return data.toString('base64');
  }
}