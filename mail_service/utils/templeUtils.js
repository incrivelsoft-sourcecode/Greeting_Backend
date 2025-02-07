import { getTempleData, updateTempleResponse, saveResponse, fetchSchedules } from "../controller/controller.js";
import sendGreetings from "../mailService/mailServiceForTempleBirthdays.js";
import { getUserEmailConfig } from "../controller/emailConfigController.js";
import { getTransportConfig } from "../utils/transporterUtil.js";
import delay from 'delay';


const getTodayDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    return `${day}-${month}`;
}

const todayDate = getTodayDate();

const createTemplate = (templeDetails) => {

    const templateJSON = JSON.stringify({
        templeBanner: `${templeDetails.postDetails.mediaURL.replace(/\\/g, '/')}`,
        templeDescription: templeDetails.postDetails.postDescription,
        address: templeDetails.address,
        taxId: templeDetails.taxId,
        phone: templeDetails.phone,
        websiteUrl: templeDetails.websiteUrl,
        facebookUrl: templeDetails.facebookUrl,
        twitterUrl: templeDetails.twitterUrl,
        instagramUrl: templeDetails.instagramUrl,
        paypalQrCode: `${templeDetails.paypalQrCodeURL.replace(/\\/g, '/')}`,
        zelleQrCode: `${templeDetails.zelleQrCodeURL.replace(/\\/g, '/')}`
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const sendAutoMailsFromTemple = async (req, res) => {
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
                const template = await createTempleDetailsTemplate(templeData);
                if (templeData.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated temple Id:${templeData._id} `);
                    return res.status(200).send({ message: `No users are found with birthday match with today associated temple Id:${templeData._id} ` });
                }
                else {
                    const responseArray = [];
                    const emailConfig = getUserEmailConfig(data.user);
                    if (emailConfig.status === "pause") {
                        return res.status(200).send({ message: "Please change status of EmailConfig to active to send the mails." });
                    }
                    const transporter = getTransportConfig(emailConfig.emailType, emailConfig.email, emailConfig.passkey)
                    for (const user of templeData.csvData) {
                        console.log(`found user with  birthday, today, ${user.email} `);
                        const response = await sendGreetings(template, user, transporter, emailConfig.email, emailConfig.displayName);
                        response.ref = id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateTempleResponse(id, ids);
                    return res.status(200).send({ message: `Mails are sent for : ${responseArray}` });
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

const sendScheduledMailsFromTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTempleData(id);
        console.log("temple data: ", data);
        if (data) {
            const template = await createTemplate(data);
            const responseArray = [];
            const emailConfig = getUserEmailConfig(data.user);
            if(emailConfig.status === "pause")
            {
                return res.status(200).send({message: "Please change status of EmailConfig to active to send the mails."});
            }
            const transporter = getTransportConfig(emailConfig.emailType, emailConfig.email, emailConfig.passkey)
            for (const user of data.csvData) {
                const response = await sendGreetings(template, user, transporter, emailConfig.email, emailConfig.displayName);
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

export { sendScheduledMailsFromTemple, sendAutoMailsFromTemple };