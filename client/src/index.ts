import express from 'express';
import { contactApi } from './api/contactApi';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Rutas
app.use('/api', contactApi);

// Servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Cliente disponible en: http://localhost:${port}`);
});
