import { Server } from './classes/Server';
import { generateWsdl } from './utils/generateWsdl.util';
async function main() {
	const server = new Server();

	// Generar el archivo WSDL dinámico
	const contactWsdl = await generateWsdl({
		templateWsdlPath: '../contactAgenda/resources/template.wsdl',
		outputWsdlPath: '../contactAgenda/resources/requirements.wsdl',
	});

	// Iniciar el servidor
	await server.start(contactWsdl);
}

main().catch((error) => {
	console.error('Error al iniciar la aplicación:', error);
});
