import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Adjust as necessary
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Setup Serial Port (adjust COM port as needed)
const port = new SerialPort({
  path: 'COM3', // Change this if needed
  baudRate: 9600,
});

// ✅ Log when serial port is open
port.on('open', () => {
  console.log('✅ Serial port opened successfully!');
});

// ❌ Log if it ever closes
port.on('close', () => {
  console.log('❌ Serial port closed.');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial port error:', err);
  io.emit('dispense-error', 'Arduino connection error');
});

// Handle incoming serial data
parser.on('data', (data) => {
  data = data.trim();
  console.log('Arduino:', data);
  
  if (data === 'READY') {
    console.log('Arduino is ready');
  } else if (data === 'COMPLETE') {
    io.emit('dispense-complete');
  } else if (data.startsWith('ERROR:')) {
    io.emit('dispense-error', data.substring(6));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle dispense requests from web client
  socket.on('dispense', async (data, callback) => {
    console.log('Dispense request:', data);
  
    if (!port.isOpen) {
      callback({ success: false, error: 'Arduino not connected' });
      return;
    }
  
    try {
      // Send command to Arduino
      const command = `DISPENSE,${data.item},${data.quantity}\n`;
      port.write(command, (err) => {
        if (err) {
          console.error('Write error:', err);
          callback({ success: false, error: 'Failed to send command to Arduino' });
          return;
        }
        callback({ success: true });
      });
    } catch (error) {
      console.error('Dispensing error:', error);
      callback({ success: false, error: 'Dispensing failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
