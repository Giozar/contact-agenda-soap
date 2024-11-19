import * as soap from 'soap';
import express from 'express';
import { AddContactResponse } from 'src/interfaces/Contact';

const host_api = process.env.HOST_API || 'http://localhost:4000';
const wsdlUrl = `${host_api}/contactAgenda?wsdl`;

export const contactApi = express.Router();

contactApi.post('/contact/add', (req, res) => {
  const { name, primaryPhone, mobilePhone, email } = req.body;

  const args = {
    name,
    primaryPhone,
    mobilePhone,
    email,
  };

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
