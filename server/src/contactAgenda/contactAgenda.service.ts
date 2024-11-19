import { Contact } from './interfaces/Contact';
import { addContact, getContactByName, updateContact, deleteContact, getAllContacts } from './contactStorage';

export const contactService = {
  ContactAgendaService: {
    ContactAgendaPort: {
      async AddContact(args: { name: string; primaryPhone: string; mobilePhone: string; email: string }) {
        const newContact: Contact = {
          id: crypto.randomUUID(),
          name: args.name,
          primaryPhone: args.primaryPhone,
          email: args.email,
          createdAt: new Date(),
          mobilePhone: args.mobilePhone,
        };
        await addContact(newContact);
        return { success: true, message: `Contacto ${args.name} creado` };
      },

      async EditContact(args: { name: string; primaryPhone: string; mobilePhone: string; email: string }) {
        const contact = await getContactByName(args.name);
        if (!contact) {
          return { success: false, message: `Contacto ${args.name} no encontrado` };
        }
        const updatedContact: Partial<Contact> = {
          ...contact,
          primaryPhone: args.primaryPhone,
          mobilePhone: args.mobilePhone,
          email: args.email,
          updatedAt: new Date(),
        };
        await updateContact(updatedContact as Contact);
        return { success: true, message: `Contacto ${args.name} actualizado` };
      },

      async DeleteContact(args: { name: string }) {
        const contact = await getContactByName(args.name);
        if (!contact) {
          return { success: false, message: `Contacto ${args.name} no encontrado` };
        }
        await deleteContact(contact.id);
        return { success: true, message: `Contacto ${args.name} eliminado` };
      },

      async SearchContact(args: { name: string }) {
        const contact = await getContactByName(args.name);
        if (!contact) {
          return { found: false };
        }
        return {
          primaryPhone: contact.primaryPhone,
          mobilePhone: contact.mobilePhone,
          email: contact.email,
          found: true,
        };
      },

      async SortContacts(args: { criteria: keyof Contact }) {
        const contacts = await getAllContacts();
        // Ordena los contactos según el criterio indicado
        const sortedContacts = contacts.sort((a, b) => {
          if (a[args.criteria] < b[args.criteria]) return -1;
          if (a[args.criteria] > b[args.criteria]) return 1;
          return 0;
        });

        return { sortedContacts: sortedContacts };
      },
    },
  },
};
