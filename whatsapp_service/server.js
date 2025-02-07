import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendScheduledMessageFromBirthDay, sendAutoMessagesFromBirthDay } from "./controller/birthDayController.js";
import { sendScheduledMessagesFromEvent } from "./controller/eventController.js";
import { sendScheduledMessagesFromFestival } from "./controller/festivalController.js";
import { sendScheduledMessagesFromMarriageDay, sendAutoMessagesFromMarriage } from "./controller/marriageController.js";
import { sendAutoMessagesFromTemple, sendScheduledMessagesFromTemple } from "./controller/templeController.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send(`Server runing upon the port ${PORT}`);
});

app.post("/automate-birthday", sendAutoMessagesFromBirthDay);
app.post("/birthday/:id", sendScheduledMessageFromBirthDay);

app.post("/event/:id", sendScheduledMessagesFromEvent);

app.post("/festival/:id", sendScheduledMessagesFromFestival);

app.post("/automate-marriage", sendAutoMessagesFromMarriage);
app.post("/marriage/:id", sendScheduledMessagesFromMarriageDay);

app.post("/automate-temple", sendAutoMessagesFromTemple);
app.post("/temple/:id", sendScheduledMessagesFromTemple);

app.listen(PORT, () => {
    console.log(`Server running upon the port: ${PORT}`);
});

//
