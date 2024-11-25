import express from 'express';
import  contactRouter  from './routers/contactRouter';
import path from 'path';
import { consoleMenu } from './console';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Rutas
app.use('/api', contactRouter);

// Servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Cliente disponible en: http://localhost:${port}`);
  consoleMenu();
});
