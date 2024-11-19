import express, { type Application } from 'express';
import serverConfig from '../configs/server.config';
import * as soap from 'soap';
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

	/**
	 * Configura los middlewares básicos de Express.
	 */
	private configureMiddlewares(): void {
		this.app.use(express.json());
	}

	/**
	 * Inicia el servidor Express utilizando la configuración del archivo `server.config.ts`.
	 */
	public start(fileWsdl: string): void {
		this.app.listen(this.port, () => {
			soap.listen(this.app, '/contact', contactService, fileWsdl);
			console.log(`Servidor escuchando en ${this.host}:${this.port}`);
		});
	}
}
