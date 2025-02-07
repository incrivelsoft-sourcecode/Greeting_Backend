import { getBirthDayData, updateBirthDayResponse, saveResponse, fetchSchedules } from "./commonController.js";
import getTodayDate from "../utils/getTodayDate.js"
import {sendToMultipleUser, sendToSingleUser} from "../utils/sendWhatsappMessage.js";
import calculateAge from "../utils/ageCalculator.js";
import delay from 'delay';

const todayDate = getTodayDate();
const template_name = "republic_day";
const broadcast_name = "republic_day_broadcast";

const parameters = (templateDetails, userDetails) => {
    return [
        {
            "name": "full_name",
            "value": `${userDetails?.first_name} ${userDetails?.last_name}`,
        },
        {
            "name": "from",
            "value": templateDetails?.from || "Incrivelsoft team",
        },
        {
            "name": "age",
            "value": calculateAge(userDetails?.birthdate),
        },
        {
            "name": "product_image_url",
            "value": templateDetails?.postDetails?.mediaURL
        }
    ]
}

const sendAutoMessagesFromBirthDay = async (req, res) => {
    try {
        const schedules = await fetchSchedules("automate", "birthday");
        console.log("today", todayDate);
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return res.status(200).send({message: "Found no automate schedules..."});
        }
        for (const schedule of schedules) {
            console.log("today", todayDate);
            const data = await getBirthDayData(schedule.birthday, todayDate);
            console.log("fetched auto schedule data...", data);
            if (data) {
                if (data.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated birthdayDetails schema Id:${data._id} `);
                    return res.status(200).send({message: `No users are found with birthday match with today associated birthdayDetails schema Id:${data._id} `})
                }
                else {
                    const responseArray = [];
                    for (const user of data.csvData) {
                        console.log(`found user with  birthday, today, ${user.contact} `);
                        const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(data, user));
                        response.ref = data._id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateBirthDayResponse(data._id, ids);
                    console.log("Messages are sent for ", responseArray);
                    return res.status(200).send({message: `Messages are sent : ${responseArray}`});
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.birthday}`);
                return res.status(200).send({message: `No Templa details found with Id: ${schedule.birthday}`})
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const sendScheduledMessageFromBirthDay = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await getBirthDayData(id);
        if (data) {
            const responseArray = [];
            for (const user of data.csvData) {
                const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(data, user));
                response.ref = id;
                responseArray.push(response);
                await delay(1000);
            }
            const ids = await saveResponse(responseArray);
            await updateBirthDayResponse(id, ids);
            console.log("Messages are sent for ", responseArray);
            return res.status(200).send({message: `Messages are sent : ${responseArray}`});
        }
        else {
            console.log(`No BirthDay details found with Id: ${id}`);
            return res.status(200).send({message: `No BirthDay details found with Id: ${id}`});
        }
    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({error: "Internal server error."});
    }
}

export { sendScheduledMessageFromBirthDay, sendAutoMessagesFromBirthDay };