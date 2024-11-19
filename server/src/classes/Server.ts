import express, { Application } from 'express';
import serverConfig from '../configs/server.config';
import * as soap from 'soap';
import * as fs from 'fs/promises';
import path from 'path';
import { contactService } from 'src/contactAgenda/contactAgenda.service';

export class Server {
  private app: Application;
  private port: number;
  private host: string;

  constructor() {
    const { port, host } = serverConfig();
    this.app = express();
    this.port = port as number;
    this.host = host;
    this.configureMiddlewares();
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
  }

  public async start(fileWsdl: string): Promise<void> {
    try {
      const wsdlContent = await fs.readFile(path.join(fileWsdl), 'utf-8');
      this.app.listen(this.port, () => {
        soap.listen(this.app, '/contactAgenda', contactService, wsdlContent);
        console.log(`Servidor escuchando en ${this.host}:${this.port}`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
    }
  }
}
