import inquirer, { Answers } from "inquirer";
import { getAllContacts } from "src/controllers/contactController";
import { Contact } from "src/interfaces/Contact";



// Menú principal
const menuOpts: Answers = [
    {
      type: 'list',
      name: 'option',
      message: '¿Qué quieres hacer?',
      choices: [
        {
          value: '1',
          name: `${'1.'.green} Agregar contacto`,
        },
        {
          value: '2',
          name: `${'2.'.green} Editar contacto`,
        },
        {
          value: '3',
          name: `${'3.'.green} Borrar contacto`,
        },
        {
          value: '4',
          name: `${'4.'.green} Buscar contacto`,
        },
        {
          value: '5',
          name: `${'5.'.green} Ordenar contactos`,
        },
        {
          value: '0',
          name: `${'0.'.green} Salir`,
        },
      ],
    },
  ];

// Mostrar lista de contactos para seleccionar
const showContactList = (contacts: Contact[]): Answers => {
    return [
      {
        type: 'list',
        name: 'selectedContact',
        message: 'Selecciona el contacto',
        choices: contacts.map((contact, i) => {
          return {
            value: contact, // Devuelve el objeto contacto
            name: `${(i + 1).toString().yellow}. ${contact.name}`,
          };
        }),
      },
    ];
  };
  
  // Menú principal
export const inquirerMenu = async () => {
    console.clear();
    console.log('========================'.green);
    console.log(' Seleccione una opción '.white);
    console.log('========================'.green);
  
    const { option } = await inquirer.prompt(menuOpts);
  
    return option;
  };
  
  // Pausa
export const pause = async () => {
    const question: Answers = [
      {
        type: 'input',
        name: 'enter',
        message: `\nPresiona ${'Enter'.green} para continuar\n`,
      },
    ];
  
    await inquirer.prompt(question);
  };
  
  // Seleccionar contacto
export const selectContact = async () => {
    console.clear();
    console.log('========================'.green);
    console.log(' Lista de contactos '.white);
    console.log('========================'.green);
  
    const contacts = await getAllContacts();
  
    if (contacts && contacts.length > 0) {
      const contactOpts = showContactList(contacts);
      const { selectedContact } = await inquirer.prompt(contactOpts);
      return selectedContact;
    } else {
      console.log('No hay contactos disponibles.');
      return null;
    }
  };
  
  // Leer entrada del usuario
export const readInput = async (message: string, required = true) => {
    const question: Answers = [
      {
        type: 'input',
        name: 'value',
        message,
        validate(value: string) {
          if (required && value.length === 0) {
            return 'Por favor ingresa un valor';
          }
          return true;
        },
      },
    ];
  
    const { value } = await inquirer.prompt(question);
    return value;
  };
  
  // Confirmar acción
export const confirm = async (message: string) => {
    const question: Answers = [
      {
        type: 'confirm',
        name: 'ok',
        message,
      },
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
  };
  
  // Elegir criterio de ordenamiento
export const chooseSortCriteria = async () => {
    const sortOptions: Answers = [
      {
        type: 'list',
        name: 'sortBy',
        message: 'Selecciona el criterio de ordenamiento',
        choices: [
          { value: 'name', name: 'Nombre' },
          { value: 'primaryPhone', name: 'Teléfono Principal' },
          { value: 'mobilePhone', name: 'Teléfono Móvil' },
          { value: 'email', name: 'Correo Electrónico' },
        ],
      },
    ];
  
    const { sortBy } = await inquirer.prompt(sortOptions);
    return sortBy;
  };