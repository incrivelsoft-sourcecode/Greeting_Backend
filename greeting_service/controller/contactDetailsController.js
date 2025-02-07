import { stat } from "fs";
import { ContactDetails } from "../model/Contact.js";

const saveContact = async( req, res ) => {
    try {
        const { fullName, email, message, phoneNumber, whatsappNumber } = req.body;
        const emailSet = [];
        const mobileSet = [];

        if (!fullName) emailSet.push("fullName");
        if (!email) emailSet.push("email");
        if (!message) emailSet.push("message");

        if (!phoneNumber) mobileSet.push("phoneNumber");
        if (!whatsappNumber) mobileSet.push("whatsappNumber");

        if (emailSet.length > 0 && phoneNumber && whatsappNumber) {
            return res.status(400).send({
                error: `The following fields are missing: ${emailSet.join(", ")}`
            });
        }

        if (mobileSet.length > 0 && fullName && email && message) {
            return res.status(400).send({
                error: `The following fields are missing: ${mobileSet.join(", ")}`
            });
        }

        const detailsToSave = { fullName, email, message, phoneNumber, whatsappNumber };
        Object.keys(detailsToSave).forEach((key) => {
            if(key === undefined)
            {
                delete detailsToSave[key];
            }
        });
        const saveContact = new ContactDetails(detailsToSave);
        await saveContact.save();
        res.status(201).send({message: "Contact saved.", saveContact});
    } catch (error) {
        console.log("Error in the saveContact, ", error);
        res.status(500).send({error: "Internal server error."});
    }
}

const getContacts = async( req, res ) => {
    try {
        const {page=1, limit=10, status} = req.query;
        const skip = (page - 1) * limit;
        let contacts = [];
        let totalContacts = 0;
        if(status)
        {
            contacts = await ContactDetails.find({status}).sort(-1).skip(skip).limit(limit).lean();
            totalContacts = await ContactDetails.countDocuments({status});
        }
        else{
            contacts = await ContactDetails.find().sort(-1).skip(skip).limit(limit).lean();
            totalContacts = await ContactDetails.countDocuments();
        }
        req.status(200).send({contacts, totalContacts});
    } catch (error) {
        console.log("Error in the getContacts, ", error);
        res.status(500).send({error: "Internal server error."});
    }
}

const updateStatus = async( req, res ) => {
    try {
        const {status, id} = req.query;
        const updateContact = await ContactDetails.findByIdAndUpdate(id, {status}, {new: true, runValidators: true});
        if(!updateContact)
        {
            return res.status(404).send({error: `contact with id: ${id} was not found.`});
        }
        res.status(200).send({updateContact});
    } catch (error) {
        console.log("Error in the updateStatus, ", error);
        res.status(500).send({error: "Internal server error."});
    }
}

export { saveContact, getContacts, updateStatus };