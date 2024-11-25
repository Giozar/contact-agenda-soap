import { Contact } from "src/interfaces/Contact";

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost';
const hostPort = `${host}:${port}`;


// Crear contacto
export const createContact = async ({ contact }: { contact: Contact }) => {
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
  };
  
  // Editar contacto
export const editContact = async ({ contact, originalName }: { contact: Contact; originalName: string }) => {
    try {
      const requestBody = { ...contact, originalName };
  
      const response = await fetch(`${hostPort}/api/contact/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      console.log(result.message);
    } catch (error) {
      console.error('Error al editar contacto:', error);
    }
  };
  
  // Eliminar contacto
export const deleteContact = async (name: string) => {
    try {
      const response = await fetch(`${hostPort}/api/contact/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
    }
  };
  
  // Obtener todos los contactos
export const getAllContacts = async (sortBy = 'name') => {
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
  
      return contacts;
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      return [];
    }
  };
  
  // Buscar contactos
export  const searchContacts = async (query: string) => {
    try {
      console.log(query);
      const response = await fetch(`${hostPort}/api/contact/search?name=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const contact = await response.json();
  
      return contact;
    } catch (error) {
      console.error('Error al buscar contactos:', error);
      return [];
    }
  };