import { getMarriageData, updateMarriageResponse, saveResponse, fetchSchedules } from "./commonController.js";
import getTodayDate from "../utils/getTodayDate.js";
import delay from 'delay';

const todayDate = getTodayDate();

const template_name = "republic_day";
const broadcast_name = "republic_day_broadcast";

const parameters = (templateDetails, userDetails) => {
    return [
        {
            "name": "wife_name",
            "value": userDetails?.wife_name,
        },
        {
            "name": "husband_name",
            "value": userDetails?.husband_name,
        },
        {
            "name": "marriage_date",
            "value": userDetails?.marriagedate,
        },
        {
            "name": "from",
            "value": templateDetails?.from || "Incrivelsoft team",
        },
        {
            "name": "years",
            "value": calculateAge(userDetails?.marriagedate),
        },
        {
            "name": "product_image_url",
            "value": templateDetails?.postDetails?.mediaURL
        }
    ]
}
const sendAutoMessagesFromMarriage = async (req, res) => {
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
                if (data.csvData === 0) {
                    console.log(`No users are found with marriage match with today associated marriageDetails schema Id:${data._id} `);
                    return res.status(200).send({message: `No users are found with marriage match with today associated marriageDetails schema Id:${data._id} `});
                }
                else {
                    const responseArray = [];
                    for (const user of data.csvData) {
                        console.log(`found user with  marriageDay, today, ${user.email} `);
                        const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(data, user));
                        response.ref = id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateMarriageResponse(id, ids);
                    console.log("Messages are sent for ", responseArray);
                    return res.status(200).send({message: `Messages are sent : ${responseArray}`})
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

const sendScheduledMessagesFromMarriageDay = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await getMarriageData(id);
        if (data) {
            console.log("Marriage data: ", data);
            const responseArray = [];
            for (const user of data.csvData) {
                const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(data, user));
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

export { sendScheduledMessagesFromMarriageDay, sendAutoMessagesFromMarriage };