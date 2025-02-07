import { getBirthDayData, updateBirthDayResponse, saveResponse, fetchSchedules } from "../controller/controller.js";
import sendGreetings from "../mailService/mailServiceForBirthDay.js";
import getTodayDate from "./getTodayDate.js";
import { getUserEmailConfig } from "../controller/emailConfigController.js";
import { getTransportConfig } from "../utils/transporterUtil.js";
import delay from 'delay';

const todayDate = getTodayDate();

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details.postDetails.mediaURL.replace(/\\/g, '/')}`,
        description: details.postDetails.postDescription,
        from: details.from,
        title: details.title
    });
    const template = JSON.parse(templateJSON);
    return template;
}


const sendAutoMailsFromBirthDay = async (req, res) => {
    try {
        const schedules = await fetchSchedules("automate", "birthday");
        console.log("today", todayDate);
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return res.status(200).send({ message: "Found no automate schedules..." });
        }
        for (const schedule of schedules) {
            console.log("today", todayDate);
            const data = await getBirthDayData(schedule.birthday, todayDate);
            console.log("fetched auto schedule data...", data);
            if (data) {
                const template = await createTemplate(data);
                if (data.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated birthdayDetails schema Id:${data._id} `);
                    return res.status(200).send({ message: `No users are found with birthday match with today associated birthdayDetails schema Id:${data._id} ` })
                }
                else {
                    const responseArray = [];
                    const emailConfig = getUserEmailConfig(data.user);
                    if (emailConfig.status === "pause") {
                        return res.status(200).send({ message: "Please change status of EmailConfig to active to send the mails." });
                    }
                    const transporter = getTransportConfig(emailConfig.emailType, emailConfig.email, emailConfig.passkey)
                    for (const user of data.csvData) {
                        console.log(`found user with  birthday, today, ${user.email} `);
                        const response = await sendGreetings(template, user, transporter, emailConfig.email, emailConfig.displayName);
                        response.ref = data._id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateBirthDayResponse(data._id, ids);
                    return res.status(200).send({ message: `Mails are sent : ${responseArray}` })
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.birthday}`);
                return res.status(200).send({ message: `No Templa details found with Id: ${schedule.birthday}` })
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const sendScheduledMailsFromBirthDay = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getBirthDayData(id);
        if (data) {
            const template = await createTemplate(data);
            const responseArray = [];
            const emailConfig = getUserEmailConfig(data.user);
            if (emailConfig.status === "pause") {
                return res.status(200).send({ message: "Please change status of EmailConfig to active to send the mails." });
            }
            console.log("emailConfig", emailConfig);
            const transporter = getTransportConfig(emailConfig.emailType, emailConfig.email, emailConfig.passkey);
            console.log("transporter", transporter);
            for (const user of data.csvData) {
                const response = await sendGreetings(template, user, transporter, emailConfig.email, emailConfig.displayName);
                response.ref = id;
                responseArray.push(response);
                await delay(1000);
            }
            const ids = await saveResponse(responseArray);
            await updateBirthDayResponse(id, ids);
            return res.status(200).send({ message: `Mails are sent : ${responseArray}` });
        }
        else {
            console.log(`No BirthDay details found with Id: ${id}`);
            return res.status(200).send({ message: `No BirthDay details found with Id: ${id}` });
        }
    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({ error: "Internal server error." });
    }
}

export { sendScheduledMailsFromBirthDay, sendAutoMailsFromBirthDay };