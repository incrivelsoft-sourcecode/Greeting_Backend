import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendScheduledMailsFromBirthDay, sendAutoMailsFromBirthDay } from "./utils/birthDayUtils.js"
import { sendScheduledMailsFromEvent } from "./utils/eventUtils.js";
import { sendScheduledMailsFromFestival } from "./utils/festivalUtils.js";
import { sendScheduledMailsFromMarriageDay, sendAutoMailsFromMarriage } from "./utils/marriageUtils.js";
import { sendScheduledMailsFromTemple, sendAutoMailsFromTemple } from "./utils/templeUtils.js";
import router from "./route/emailConfigRouter.js";
import { connectMongoose } from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send(`Server runing upon the port ${PORT}`);
});

app.post("/automate-birthday", sendAutoMailsFromBirthDay);
app.post("/birthday/:id", sendScheduledMailsFromBirthDay);

app.post("/event/:id", sendScheduledMailsFromEvent);

app.post("/festival/:id", sendScheduledMailsFromFestival);

app.post("/automate-marriage", sendAutoMailsFromMarriage);
app.post("/marriage/:id", sendScheduledMailsFromMarriageDay);

app.post("/automate-temple", sendAutoMailsFromTemple);
app.post("/temple/:id", sendScheduledMailsFromTemple);

app.use("/email-config", router);

app.listen(PORT, async() => {
    console.log(`Server running upon the port: ${PORT}`);
    await connectMongoose();
});
