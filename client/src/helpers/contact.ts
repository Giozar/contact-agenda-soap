import readline from 'readline';
import { getAllContacts } from "src/controllers/contactController";
import { Contact } from "src/interfaces/Contact";


// Crear interfaz de lectura
const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
});


// Preguntar al usuario
const askQuestion = (query: string): Promise<string> => {
 return new Promise((resolve) => rl.question(query, (answer) => resolve(answer.trim())));
};


// Opciones del menú principal
const menuOpts = [
 { value: '1', name: '1. Agregar contacto' },
 { value: '2', name: '2. Editar contacto' },
 { value: '3', name: '3. Borrar contacto' },
 { value: '4', name: '4. Buscar contacto' },
 { value: '5', name: '5. Ordenar contactos' },
 { value: '0', name: '0. Salir' },
];


// Mostrar menú principal
export const inquirerMenu = async (): Promise<string> => {
 console.clear();
 console.log('========================');
 console.log(' Seleccione una opción ');
 console.log('========================\n');


 menuOpts.forEach((opt) => console.log(opt.name));
 console.log('');


 const option = await askQuestion('Seleccione una opción: ');
 return option;
};


// Pausa
export const pause = async (): Promise<void> => {
 await askQuestion('\nPresiona ENTER para continuar\n');
};


// Mostrar lista de contactos para seleccionar
export const showContactList = async (contacts: Contact[]): Promise<Contact | null> => {
 console.log('\nLista de contactos:\n');
 contacts.forEach((contact, index) => {
   console.log(`${index + 1}. ${contact.name}`);
 });
 console.log('');


 const selectedIndex = await askQuestion('Selecciona el número del contacto: ');
 const index = parseInt(selectedIndex, 10) - 1;


 if (index >= 0 && index < contacts.length) {
   return contacts[index];
 }


 console.log('Selección inválida.');
 return null;
};


// Seleccionar contacto
export const selectContact = async (): Promise<Contact | null> => {
 console.clear();
 console.log('========================');
 console.log(' Lista de contactos ');
 console.log('========================\n');


 const contacts = await getAllContacts();


 if (contacts.length > 0) {
   const selectedContact = await showContactList(contacts);
   return selectedContact;
 } else {
   console.log('No hay contactos disponibles.');
   return null;
 }
};


// Leer entrada del usuario
export const readInput = async (message: string, required = true): Promise<string> => {
 let value: string;
 do {
   value = await askQuestion(`${message}: `);
   if (required && value.length === 0) {
     console.log('Por favor ingresa un valor válido.');
   }
 } while (required && value.length === 0);


 return value;
};


// Confirmar acción
export const confirm = async (message: string): Promise<boolean> => {
 const response = await askQuestion(`${message} (s/n): `);
 return response.toLowerCase() === 's';
};


// Elegir criterio de ordenamiento
export const chooseSortCriteria = async (): Promise<string> => {
 const sortOptions = [
   { value: 'name', name: '1. Nombre' },
   { value: 'primaryPhone', name: '2. Teléfono Principal' },
   { value: 'mobilePhone', name: '3. Teléfono Móvil' },
   { value: 'email', name: '4. Correo Electrónico' },
 ];


 console.log('\nSelecciona el criterio de ordenamiento:\n');
 sortOptions.forEach((opt, index) => {
   console.log(`${index + 1}. ${opt.name}`);
 });


 const selectedIndex = await askQuestion('Selecciona una opción: ');
 const index = parseInt(selectedIndex, 10) - 1;


 if (index >= 0 && index < sortOptions.length) {
   return sortOptions[index].value;
 }


 console.log('Selección inválida.');
 return 'name'; // Valor predeterminado
};
