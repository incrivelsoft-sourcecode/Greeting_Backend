import { saveContact, getContacts, updateStatus } from "../controller/contactDetailsController.js";
import express from 'express';

const contactRoute = express.Router();

contactRoute.post("/", saveContact);
contactRoute.put("/", updateStatus);
contactRoute.get("/", getContacts);

export default contactRoute;