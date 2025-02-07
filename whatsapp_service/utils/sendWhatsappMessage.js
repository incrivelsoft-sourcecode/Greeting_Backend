import axios from "axios";

const WHATSAPP_API = process.env.WHATSAPP_API;
const TOKEN = process.env.TOKEN;


const sendToSingleUser = async(template_name, broadcast_name, whatsappNumber, parameters) => {
    try {
        const body = {
            template_name,
            broadcast_name,
            parameters,
        };
        const config = {
            params:{
                whatsappNumber,
            },
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        };
        const res = await axios.post(WHATSAPP_API, body, config);
        if(res.status !== 200)
        {
            throw new Error(res.data);
        }
        if(!res.data.result)
        {
            console.log("Failed to sent the message to : ", res.data);
            return { success: false, contact: whatsappNumber };
        }

        console.log("Message sent to ", res.data);
        return { success: true, contact: whatsappNumber };
    } catch (error) {
        console.log("Error in the sendTemplateMessage, ", error);
        return { success: false, contact: whatsappNumber };
    }
}

const sendToMultipleUser = async(template_name, broadcast_name, receivers) => {
    try {
        const body = {
            template_name,
            broadcast_name,
            receivers,
        };
        const config = {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        };
        const res = await axios.post(WHATSAPP_API, body, config);
        if(res.status !== 200)
        {
            throw new Error(res.data);
        }

        return res.data.receivers.map(receiver => ({
            contact: receiver.waId,
            success: true,
        }));
    } catch (error) {
        console.log("Error in the sendTemplateMessage, ", error);
        return receivers.map(receiver => ({
            contact: receiver.whatsappNumber,
            success: false,
        }));
    }
}


export {sendToMultipleUser, sendToSingleUser};
