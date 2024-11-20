import * as soap from 'soap';
import express from 'express';
import { AddContactResponse, Contact } from 'src/interfaces/Contact';

const host_api = process.env.HOST_API || 'http://localhost:4000';
const wsdlUrl = `${host_api}/contactAgenda?wsdl`;

export const contactApi = express.Router();

/** Añadir un contacto */
contactApi.post('/contact/add', (req, res) => {
  const { name, primaryPhone, mobilePhone, email } = req.body;

  const args = { name, primaryPhone, mobilePhone, email };

  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.AddContact(args, (err: Error, result: AddContactResponse) => {
      if (err) {
        return res.status(500).json({ message: 'Error al ejecutar AddContact', error: err.message });
      }

      res.json({ message: 'Contacto añadido exitosamente', data: result });
    });
  });
});

/** Obtener todos los contactos */
contactApi.get('/contact/list', (req, res) => {
  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.GetAllContacts({}, (err: Error, result: { contacts: Contact[] }) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener contactos', error: err.message });
      }

      res.json(result.contacts);
    });
  });
});

/** Eliminar un contacto */
contactApi.post('/contact/delete', (req, res) => {
  const { name } = req.body;

  const args = { name };

  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.DeleteContact(args, (err: Error, result: { success: boolean; message: string }) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar contacto', error: err.message });
      }

      res.json(result);
    });
  });
});

/** Editar un contacto */
contactApi.post('/contact/edit', (req, res) => {
  const { name, primaryPhone, mobilePhone, email } = req.body;

  const args = { name, primaryPhone, mobilePhone, email };

  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.EditContact(args, (err: Error, result: { success: boolean; message: string }) => {
      if (err) {
        return res.status(500).json({ message: 'Error al editar contacto', error: err.message });
      }

      res.json(result);
    });
  });
});

/** Buscar un contacto por nombre */
contactApi.get('/contact/search', (req, res) => {
  const { name } = req.query;

  const args = { name };

  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.SearchContact(args, (err: Error, result: Contact | null) => {
      if (err) {
        return res.status(500).json({ message: 'Error al buscar contacto', error: err.message });
      }

      res.json(result);
    });
  });
});

/** Obtener y ordenar contactos */
contactApi.post('/contact/sort', (req, res) => {
  const { criteria } = req.body;

  soap.createClient(wsdlUrl, (err, client) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el cliente SOAP', error: err.message });
    }

    client.SortContacts({ criteria }, (err: Error, result: { contacts: { contact: Contact[] } }) => {
      if (err) {
        return res.status(500).json({ message: 'Error al ordenar contactos', error: err.message });
      }

      const contacts = result.contacts.contact || []; // Asegura que sea un arreglo
      res.json(contacts);
    });
  });
});

