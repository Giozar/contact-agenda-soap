import inquirer, { Answers } from 'inquirer';
import 'colors';
import { Contact } from './interfaces/Contact';
import { createContact, deleteContact, editContact, getAllContacts, searchContacts } from './controllers/contactController';
import { chooseSortCriteria, confirm, inquirerMenu, pause, readInput, selectContact } from './helpers/contactInquirer';

// Menú de consola principal
export const consoleMenu = async () => {
  let opt = '';

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case '1':
        // Agregar contacto
        console.log('Elegiste agregar contacto');
        const contact: Contact = {
          name: '',
          primaryPhone: '',
          mobilePhone: '',
          email: '',
        };
        contact.name = await readInput('Ingresa el nombre:');
        contact.primaryPhone = await readInput('Ingresa el teléfono principal:');
        contact.mobilePhone = await readInput('Ingresa el teléfono móvil:');
        contact.email = await readInput('Ingresa el email:');

        await createContact({ contact });
        break;

      case '2':
        // Editar contacto
        console.log('Editar contacto');

        const contactToEdit = await selectContact();

        if (contactToEdit) {
          console.log('Contacto a editar:', contactToEdit);

          const updatedContact: Contact = { ...contactToEdit };

          // const name = await readInput(`Nuevo nombre (${contactToEdit.name}):`, false);
          const primaryPhone = await readInput(`Nuevo teléfono principal (${contactToEdit.primaryPhone}):`, false);
          const mobilePhone = await readInput(`Nuevo teléfono móvil (${contactToEdit.mobilePhone}):`, false);
          const email = await readInput(`Nuevo email (${contactToEdit.email}):`, false);

          // if (name) updatedContact.name = name;
          if (primaryPhone) updatedContact.primaryPhone = primaryPhone;
          if (mobilePhone) updatedContact.mobilePhone = mobilePhone;
          if (email) updatedContact.email = email;

          await editContact({ contact: updatedContact, originalName: contactToEdit.name });
        } else {
          console.log('No se seleccionó ningún contacto.');
        }
        break;

      case '3':
        // Borrar contacto
        console.log('Borrar contacto');

        const contactToDelete = await selectContact();

        if (contactToDelete) {
          console.log('Contacto a borrar:', contactToDelete);

          const ok = await confirm(`¿Estás seguro que quieres borrar el contacto "${contactToDelete.name}"?`);
          if (ok) {
            await deleteContact(contactToDelete.name);
          } else {
            console.log('Operación cancelada.');
          }
        } else {
          console.log('No se seleccionó ningún contacto.');
        }
        break;

      case '4':
        // Buscar contacto
        console.log('Buscar contacto');

        const searchQuery = await readInput('Ingresa el nombre del contacto a buscar:');

        const matchingContact = await searchContacts(searchQuery);

        if (matchingContact.name !== undefined) {
            console.log(
                ` Nombre: ${matchingContact.name} \n Teléfono principal: ${matchingContact.primaryPhone}\n Teléfono móvil: ${matchingContact.mobilePhone}\n Email: ${matchingContact.email}`
              );
        } else {
          console.log('No se encontraron contactos que coincidan con la búsqueda.');
        }
        break;

      case '5':
        // Ordenar contactos
        console.log('Ordenar contactos');

        const sortCriteria = await chooseSortCriteria();

        if (sortCriteria) {
          const sortedContacts = await getAllContacts(sortCriteria);

          if (sortedContacts && sortedContacts.length > 0) {
            console.log('\nContactos ordenados:\n');
            sortedContacts.forEach((contact, index) => {
              console.log(
                `${(index + 1).toString().yellow}. ${contact.name} - ${contact.primaryPhone} - ${contact.email}`
              );
            });
          } else {
            console.log('No hay contactos para mostrar.');
          }
        } else {
          console.log('No se seleccionó ningún criterio de ordenamiento.');
        }
        break;

      case '0':
        console.log('Saliendo del programa...'.green);
        break;

      default:
        console.log('Opción no válida. Por favor, selecciona una opción del menú.');
        break;
    }

    if (opt !== '0') await pause();
  } while (opt !== '0');
};
