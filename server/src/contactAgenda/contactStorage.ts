import * as fs from 'fs/promises';
import path from 'path';
import { Contact } from './interfaces/Contact';

const dataDir = path.join(__dirname, '../../data');
const contactsFile = path.join(dataDir, 'contacts.txt');

async function initializeStorage(): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    if (!(await fileExists(contactsFile))) {
      await fs.writeFile(contactsFile, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error inicializando el almacenamiento:', error);
    throw error;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getAllContacts(): Promise<Contact[]> {
  await initializeStorage();
  const data = await fs.readFile(contactsFile, 'utf-8');
  return JSON.parse(data) as Contact[];
}

async function saveContacts(contacts: Contact[]): Promise<void> {
  await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2));
}

export async function addContact(contact: Contact): Promise<void> {
  const contacts = await getAllContacts();
  contacts.push(contact);
  await saveContacts(contacts);
}

export async function updateContact(updatedContact: Contact): Promise<void> {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((c) => c.id === updatedContact.id);
  if (index === -1) {
    throw new Error('Contacto no encontrado');
  }
  contacts[index] = { ...contacts[index], ...updatedContact, updatedAt: new Date() };
  await saveContacts(contacts);
}

export async function deleteContact(contactId: string): Promise<void> {
  const contacts = await getAllContacts();
  const filteredContacts = contacts.filter((c) => c.id !== contactId);
  await saveContacts(filteredContacts);
}

export async function getContactByName(name: string): Promise<Contact | undefined> {
  const contacts = await getAllContacts();
  return contacts.find((c) => c.name === name);
}
