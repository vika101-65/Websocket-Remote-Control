import Jimp from 'jimp';
import { httpServer } from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { createCircle } from './src/createCircle.js';
import { createRectangle } from './src/createRectangle.js'
import { createPrintScreen } from './src/createPrintScreen.js'

const HTTP_PORT = 3000;
const clients = new Map();

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  const id = uuidv4();
  clients.set({ [id]: ws });
  console.log('Set connection');

  ws.on('message', function message(data) {
    console.log('++++', data.toString().split(' ').length);


    const message = data.toString().split(' ');
    const command = message[0]; console.log('command', command);
    let cord = 0;

    if (message.length >= 2) {
      cord = +message[1]; console.log('px', cord);
    }

    let mouse = robot.getMousePos();

    switch (command) {
      case 'mouse_up':
        // robot.moveMouse(mouse.x, mouse.y - cord);
        robot.moveMouse(100, 100);
        ws.send(`${command}_${mouse.y - cord}px`);
        break;

      case 'mouse_down':
        robot.moveMouse(mouse.x, mouse.y + cord);
        ws.send(`${command}_${mouse.y + cord}px`);
        break;

      case 'mouse_left':
        robot.moveMouse(mouse.x - cord, mouse.y);
        ws.send(`${command}_${mouse.x - cord}px`);
        break;

      case 'mouse_right':
        robot.moveMouse(mouse.x + cord, mouse.y);
        ws.send(`${command}_${mouse.x + cord}px`);
        break;

      case 'mouse_position':
        robot.moveMouse(mouse.x, mouse.y);
        ws.send(`mouse_position ${mouse.x}px,${mouse.y}px`)
        break;

      case 'draw_circle':
        createCircle(cord);
        ws.send(command);
        break;

      case 'draw_rectangle':
        const cord2 = message[2];
        createRectangle(cord, cord2);
        ws.send(command);
        break;

      case 'draw_square':
        createRectangle(cord);
        ws.send(command);
        break;

      case 'prnt_scrn':
        const image = createPrintScreen();
        ws.send(`prnt_scrn ${image}`);
        break;

      default:
        ws.on('close', () => {
          clients.delete(id);
          console.log(`Client is closed with id ${id}`);
        })
        break;
    }
  });
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

httpServer.listen(HTTP_PORT, () => console.log(`Start static http server on the ${HTTP_PORT} port!`));
