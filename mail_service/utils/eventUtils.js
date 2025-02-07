import { getEventData, updateEventResponse, saveResponse } from "../controller/controller.js";
import sendGreetings from "../mailService/mailServiceForEvent.js";
import { getUserEmailConfig } from "../controller/emailConfigController.js";
import { getTransportConfig } from "../utils/transporterUtil.js";
import delay from 'delay';

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details?.postDetails?.mediaURL.replace(/\\/g, '/')}`,
        description: details?.postDetails?.postDescription,
        address: details.address,
        title: details.eventName,
        date: details.eventDate
    });
    const template = JSON.parse(templateJSON);
    return template;

}


const sendScheduledMailsFromEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await getEventData(id);
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
            await updateEventResponse(id, ids);
            return res.status(200).send({message: `Mail are sent for : ${responseArray}`});
        }
        else {
            console.log(`No Festival details found with Id: ${id}`);
            return res.status(200).send({message: `No Festival details found with Id: ${id}`});
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
        res.status(500).send({error: "Internal server error.."});
    }
}

export { sendScheduledMailsFromEvent };