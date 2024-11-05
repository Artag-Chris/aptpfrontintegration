/*
// pages/api/ws.js
import { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);
    // Aquí puedes procesar el mensaje y enviar una respuesta
    ws.send(`Mensaje recibido: ${message}`);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // No se necesita hacer nada aquí, solo se necesita exportar la función
}
*/