import inquirer, { Answers } from 'inquirer';
import 'colors';
import { Contact } from './interfaces/Contact';

const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'http://localhost';
  const hostPort = `${host}:${port}`;

const menuOpts: Answers = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué quieres hacer?',
    choices: [
      {
        value: '1',
        name: `${'1.'.green}Agregar contacto`,
      },
      {
        value: '2',
        name: `${'2.'.green}Editar contacto`,
      },
      {
        value: '3',
        name: `${'3.'.green}Borrar contacto`,
      },
      {
        value: '4',
        name: `${'4.'.green}Buscar contacto`,
      },
      {
        value: '5',
        name: `${'5.'.green}Ordenar contacto`,
      },
      {
        value: '0',
        name: `${'0.'.green}Salir`,
      },
    ],
  },
];

const selectContact = (contacts: Contact[]) => {
    return [
        {
          type: 'list',
          name: 'option',
          message: '¿Qué quieres hacer?',
          choices: contacts.map( (contact, i) => {
            return {
                value: `${contact}`,
                name: `${i}`.yellow + `.${contact.name}`,
            }
          })
        },
      ];
}


const inquirerMenu = async () => {
  console.clear();
  console.log('========================'.green);
  console.log(' Seleccione una opción '.white);
  console.log('========================'.green);

  const { option } = await inquirer.prompt(menuOpts);

  return option;
};

const pause = async () => {
  const quiestion: Answers = [
    {
      type: 'input',
      name: 'enter',
      message: `\n Presiona ${'Enter'.green} para continuar \n`,
    },
  ];

  await inquirer.prompt(quiestion);
};

const showContactsAndSelect = async () => {
    console.clear();
    console.log('========================'.green);
    console.log(' Lista de contactos'.white);
    console.log('========================'.green);

    const contacts = await getAllContacts();

    if( contacts && contacts.length > 0) {
        const contactOpts: Answers = selectContact(contacts);
        const { option } = await inquirer.prompt(contactOpts);
        return option;

    }
  
  };

const readInput = async (message: string) => {
  const question: Answers = [
    {
      type: 'inuput',
      name: 'name',
      message,
      validate(value: string) {
        if (value.length === 0) {
          return 'Por favor ingresa un valor';
        }
        return true;
      },
    },
  ];

  const { name } = await inquirer.prompt(question);
  return name;
};

const confirm = async (message: string) => {
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

const createContact = async ({ contact}: {contact: Contact}) => {
    try {
        const response = await fetch(`${hostPort}/api/contact/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const result = await response.json();

        console.log(result.message);
    } catch (error) {
        console.error('Error al guardar contacto:', error);   
    }
}


const getAllContacts = async (sortBy = 'name') => {
    let contacts: Contact[] = [];
        try {
            const response = await fetch(`${hostPort}/api/contact/sort`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ criteria: sortBy }),
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            contacts = await response.json();
            
            if (!Array.isArray(contacts)) {
                throw new Error('La respuesta no es un arreglo de contactos.');
            }

            return contacts
        } catch (error) {
            console.error('Error al obtener contactos:', error);
        }
}

export const consoleMenu = async () => {
  let opt = '';

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case '1':
        console.log('Elegiste agregar contacto');
        const contact: Contact = {
            name: '',
            primaryPhone: '',
            mobilePhone: '',
            email: '',

        }
        contact.name = await readInput('Ingresa el nombre');
        contact.primaryPhone = await readInput('Ingresa el teléfono principal');
        contact.mobilePhone = await readInput('Ingresa el teléfono móvil');
        contact.email = await readInput('Ingresa el email');

        await createContact({ contact })

        
        break;
      case '2':
        console.log('Editar contacto');

        const contactEdit = await showContactsAndSelect();

        console.log('contacto a editar', contactEdit);
        break;

      case '3':
        console.log('Borrar el contacto');
        const ok = await confirm('Estás seguro que quiere borrar');
        if (ok) {
          console.log('Borramos');
        }

        break;

      case '4':
        console.log('Buscar contacto');
        break;

      case '5':
        console.log('Ordenar contacto');
        break;

      case '0':
        console.log('AH me salgo');
        break;
    }

    await pause();
  } while (opt !== '0');
};
