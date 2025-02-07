import { getMarriageData, updateMarriageResponse, saveResponse, fetchSchedules } from "../controller/controller.js";
import sendGreetings from "../mailService/mailServiceForMarriage.js";
import getTodayDate from "./getTodayDate.js";
import delay from 'delay';

const todayDate = getTodayDate();

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details?.postDetails?.mediaURL.replace(/\\/g, '/')}`,
        description: details?.postDetails?.postDescription,
        from: details.from,
        title: details.title
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const sendAutoMailsFromMarriage = async (req, res) => {
    try {
        const schedules = await fetchSchedules("automate", "marriage");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return res.status(200).send({message: "Found no automate schedules..."});
        }
        for (const schedule of schedules) {
            const data = await getMarriageData(schedule.marriage, todayDate);
            console.log("fetched auto schedule data...", data);
            if (data) {
                const template = await createTemplate(data);
                if (data.csvData === 0) {
                    console.log(`No users are found with marriage match with today associated marriageDetails schema Id:${data._id} `);
                    return res.status(200).send({message: `No users are found with marriage match with today associated marriageDetails schema Id:${data._id} `});
                }
                else {
                    const responseArray = [];
                    for (const user of data.csvData) {
                        console.log(`found user with  marriageDay, today, ${user.email} `);
                        const response = await sendGreetings(template, user);
                        response.ref = id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateMarriageResponse(id, ids);
                    return res.status(200).send({message: `Mails are sent for : ${responseArray}`});
                }
            }
            else {
                console.log(`No Marriage details found with Id: ${schedule.marriage}`);
                return res.status(200).send({message: `No Marriage details found with Id: ${schedule.marriage}`});
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({error: "Internal server error.."});
    }
}

const sendScheduledMailsFromMarriageDay = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await getMarriageData(id);
        if (data) {
            const template = await createTemplate(data);
            console.log("Marriage data: ", data);
            const responseArray = [];
            for (const user of data.csvData) {
                const response = await sendGreetings(template, user);
                response.ref = id;
                responseArray.push(response);
                await delay(1000);
            }
            const ids = await saveResponse(responseArray);
            await updateMarriageResponse(id, ids);
            return res.status(200).send({message: `Mails are sent for : ${responseArray}`});
        }
        else {
            console.log(`No Marriage details found with Id: ${id}`);
            return res.status(200).send({message: `No Marriage details found with Id: ${id}`});
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({error: "Internal server error."});
    }
}

export { sendScheduledMailsFromMarriageDay, sendAutoMailsFromMarriage };