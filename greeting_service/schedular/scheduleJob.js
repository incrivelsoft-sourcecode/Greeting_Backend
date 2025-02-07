import schedule from 'node-schedule';
import axios from "axios";
import { scheduleSchema } from '../model/Schedule.js';
import consoleResponse from "../utils/responseConsole.js";

const MAIL_SERVICE_URL = process.env.MAIL_SERVICE_URL;
const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL;


const scheduleJobs = (job) => {
    try {
        if (job.schedule === 'schedule_now') {
            console.log(`Executing schedule_now for job ID: ${job._id}`);
            handleJobExecution(job);
        }
        else if (job.schedule === "schedule_later") {
            const scheduledTime = new Date(job.time);

            if (isNaN(scheduledTime) || scheduledTime < new Date()) {
                console.log(`Invalid or past schedule for job ID: ${job._id}`);
                return; // Skip invalid or past dates
            }

            schedule.scheduleJob(job._id.toString(), scheduledTime, async () => {
                console.log(`Executing job for ID: ${job._id}`);
                await handleJobExecution(job);
            });
        }
        else if (job.schedule === 'pause') {
            const existingJob = schedule.scheduledJobs[job._id.toString()];
            if (existingJob) {
                console.log(`Pausing job with ID: ${job._id}`);
                existingJob.cancel();
            }
        }
        else {
            console.log(`Invalid schedule type for job ID: ${job._id}`);
        }
    } catch (error) {
        console.error(`Error handling job ID: ${job._id}`, error);
    }
};

const handleJobExecution = async (job) => {
    const fields = ["temple", "birthday", "event", "festival", "marriage"];
    const fieldToPopulate = fields.find((field) => job[field]);
    if (!fieldToPopulate) {
        console.log("Invalid request.");
        return;
    }

    try {
        switch (fieldToPopulate) {
            case "temple":
                if (job.mode === "email") {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/temple/${job.temple}`);
                    consoleResponse("Response at mail-service ", res, "temple");
                }
                else if (job.mode === "whatsapp") {
                    const res = await axios.post(`${WHATSAPP_SERVICE_URL}/temple/${job.temple}`);
                    consoleResponse("Response at whatsapp-service ", res, "temple");
                }
                else {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/temple/${job.temple}`);
                    consoleResponse("Response at mail-service ", res, "temple");
                    const response = await axios.post(`${WHATSAPP_SERVICE_URL}/temple/${job.temple}`);
                    consoleResponse("Response at whatsapp-service ", response, "temple");
                }

                break;
            case "birthday":
                if (job.mode === "email") {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/birthday/${job.birthday}`);
                    consoleResponse("Response at mail-service ", res, "birthaday");
                }
                else if (job.mode === "whatsapp") {
                    const res = await axios.post(`${WHATSAPP_SERVICE_URL}/birthday/${job.birthday}`);
                    consoleResponse("Response at whatsapp-service ", res, "birthaday");
                }
                else {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/birthday/${job.birthday}`);
                    consoleResponse("Response at mail-service ", res, "birthday");
                    const response = await axios.post(`${WHATSAPP_SERVICE_URL}/birthday/${job.birthday}`);
                    consoleResponse("Response at whatsapp-service ", response, "birthaday");
                }
                break;
            case "event":
                if (job.mode === "email") {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/event/${job.event}`);
                    consoleResponse("Response at mail-service ", res, "event");
                }
                else if (job.mode === "whatsapp") {
                    const res = await axios.post(`${WHATSAPP_SERVICE_URL}/event/${job.event}`);
                    consoleResponse("Response at whatsapp-service ", res, "event");
                }
                else {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/event/${job.event}`);
                    consoleResponse("Response at mail-service ", res, "event");
                    const response = await axios.post(`${WHATSAPP_SERVICE_URL}/event/${job.event}`);
                    consoleResponse("Response at whatsapp-service ", response, "event");
                }
                break;
            case "festival":
                if (job.mode === "email") {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/festival/${job.festival}`);
                    consoleResponse("Response at mail-service ", res, "festival");
                }
                else if (job.mode === "whatsapp") {
                    const res = await axios.post(`${WHATSAPP_SERVICE_URL}/festival/${job.festival}`);
                    consoleResponse("Response at whatsapp-service ", res, "festival");
                }
                else {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/festival/${job.festival}`);
                    consoleResponse("Response at mail-service ", res, "festival");
                    const response = await axios.post(`${WHATSAPP_SERVICE_URL}/festival/${job.festival}`);
                    consoleResponse("Response at whatsapp-service ", response, "festival");
                }
                break;
            case "marriage":
                if (job.mode === "email") {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/marriage/${job.marriage}`);
                    consoleResponse("Response at mail-service ", res, "marriage");
                }
                else if (job.mode === "whatsapp") {
                    const res = await axios.post(`${WHATSAPP_SERVICE_URL}/marriage/${job.marriage}`);
                    consoleResponse("Response at whatsapp-service ", res, "marriage");
                }
                else {
                    const res = await axios.post(`${MAIL_SERVICE_URL}/marriage/${job.marriage}`);
                    consoleResponse("Response at mail-service ", res, "marriage");
                    const response = await axios.post(`${WHATSAPP_SERVICE_URL}/marriage/${job.marriage}`);
                    consoleResponse("Response at whatsapp-service ", response, "marriage");
                }
                break;
            default:
                console.log("Invalid request.");
        }
        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' });
    } catch (error) {
        console.error(`Error executing job ID: ${job._id}`, error);
    }
};

/**
 * Watch the ScheduleDetails collection for changes.
 */
export const watchSchedules = async () => {
    try {
        const changeStream = scheduleSchema.watch();
        console.log('Watching ScheduleDetails collection for changes...');

        changeStream.on('change', async (change) => {
            // console.log('Change detected:', change);

            if (change.operationType === 'insert') {
                const newJob = change.fullDocument;
                console.log("Inserted: ", newJob);
                if (['schedule_now', 'schedule_later'].includes(newJob.schedule)) {
                    scheduleJobs(newJob);
                }
            }

            if (change.operationType === 'update') {
                const updatedJobId = change.documentKey._id;
                const updatedJob = await scheduleSchema.findById(updatedJobId);
                if (updatedJob && updatedJob.schedule !== "completed") {
                    if (updatedJob.schedule === 'pause') {
                        const existingJob = schedule.scheduledJobs[updatedJob._id.toString()];
                        if (existingJob) {
                            console.log(`Pausing job with ID: ${updatedJobId}`);
                            existingJob.cancel();
                        }
                    } else {
                        scheduleJobs(updatedJob);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error watching ScheduleDetails collection:', error);
    }
};


schedule.scheduleJob('26 19 * * *', async () => {
    try {
        console.log('Scheduled job triggered at:', new Date());
        const res1 = await axios.post(`${MAIL_SERVICE_URL}/automate-birthday`);
        consoleResponse("Response at mail-service ", res1, "automate-birthday-mail");
        const res2 = await axios.post(`${MAIL_SERVICE_URL}/automate-marriage`);
        consoleResponse("Response at mail-service ", res2, "automate-marriage-mail");
        const res3 = await axios.post(`${MAIL_SERVICE_URL}/automate-temple`);
        consoleResponse("Response at mail-service ", res3, "automate-temple-mail");
        const res4 = await axios.post(`${WHATSAPP_SERVICE_URL}/automate-birthday`);
        consoleResponse("Response at whatsapp-service ", res4, "automate-birthday-whatsapp");
        const res5 = await axios.post(`${WHATSAPP_SERVICE_URL}/automate-marriage`);
        consoleResponse("Response at whatsapp-service ", res5, "automate-marriage-whatsapp");
        const res6 = await axios.post(`${WHATSAPP_SERVICE_URL}/automate-temple`);
        consoleResponse("Response at whatsapp-service ", res6, "automate-temple-whatsapp");
    } catch (error) {
        console.log("Error", error);
    }
});
