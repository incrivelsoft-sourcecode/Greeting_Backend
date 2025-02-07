import { getTempleData, updateTempleResponse, saveResponse, fetchSchedules } from "./commonController.js";
import getTodayDate from "../utils/getTodayDate.js"
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
            "value": templateDetails?.templeName || "Incrivelsoft team",
        },
        {
            "name": "address",
            "value": templateDetails?.address,
        },
        {
            "name": "phone",
            "value": templateDetails?.phone,
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

const sendAutoMessagesFromTemple = async (req, res) => {
    try {
        const schedules = await fetchSchedules("automate", "temple");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return res.status(200).send({ message: "Found no automate schedules..." });
        }
        for (const schedule of schedules) {
            const templeData = await getTempleData(schedule.temple, todayDate);
            console.log("fetched auto schedule data...", templeData);
            if (templeData) {
                if (templeData.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated temple Id:${templeData._id} `);
                    return res.status(200).send({ message: `No users are found with birthday match with today associated temple Id:${templeData._id} ` });
                }
                else {
                    const responseArray = [];
                    for (const user of templeData.csvData) {
                        console.log(`found user with  birthday, today, ${user.email} `);
                        const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(templeData, user));
                        response.ref = id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateTempleResponse(id, ids);
                    console.log("Messages are sent for ", responseArray);
                    return res.status(200).send({message: `Messages are sent : ${responseArray}`})
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.temple}`);
                return res.status(200).send({ message: `No Templa details found with Id: ${schedule.temple}` });
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const sendScheduledMessagesFromTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTempleData(id);
        console.log("temple data: ", data);
        if (data) {
            const responseArray = [];
            for (const user of data.csvData) {
                const response = await sendToSingleUser(template_name, broadcast_name, user.contact, parameters(data, user));
                response.ref = id;
                responseArray.push(response);
                await delay(1000);
            }
            const ids = await saveResponse(responseArray);
            await updateTempleResponse(id, ids);
            return res.status(200).send({ message: `Mails are sent for : ${responseArray}` });
        }
        else {
            console.log(`No Templa details found with Id: ${temple}`);
            return res.status(200).send({ message: `No Templa details found with Id: ${temple}` });
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

export { sendAutoMessagesFromTemple, sendScheduledMessagesFromTemple };