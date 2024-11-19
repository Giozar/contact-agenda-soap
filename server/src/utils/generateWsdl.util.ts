import path from 'node:path';
import * as fs from 'node:fs/promises';
import serverConfig from 'src/configs/server.config';

/**
 * Genera un archivo WSDL dinámico reemplazando los marcadores en una plantilla.
 * @param templateWsdlPath - Ruta relativa al archivo WSDL de plantilla.
 * @param outputWsdlPath - Ruta relativa donde se almacenará el archivo WSDL generado.
 * @returns La ruta absoluta del archivo WSDL generado.
 */

export async function generateWsdl({
	templateWsdlPath,
	outputWsdlPath,
}: {
	templateWsdlPath: string;
	outputWsdlPath: string;
}): Promise<string> {
	const { port, host } = serverConfig();
	const absoluteTemplatePath = path.join(__dirname, templateWsdlPath);
	const absoluteOutputPath = path.join(__dirname, outputWsdlPath);
	const hostPort = `${host}:${port}`;

	try {
		const templateContent = await fs.readFile(absoluteTemplatePath, 'utf-8');

		// Reemplazar {{HOST_PORT}} en la plantilla con el valor real
		const updatedContent = templateContent.replace('{{HOST_PORT}}', hostPort);

		// Escribir el contenido actualizado en la ruta de salida
		await fs.writeFile(absoluteOutputPath, updatedContent, 'utf-8');
		// console.log('WSDL generado correctamente en', absoluteOutputPath);

		return absoluteOutputPath;
	} catch (error) {
		console.error('Error al generar el WSDL:', error);
		throw error;
	}
}
