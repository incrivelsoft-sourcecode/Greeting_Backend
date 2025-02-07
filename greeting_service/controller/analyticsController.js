import { ObjectId } from 'mongodb';
import PostModel from '../model/PostModel.js';
import { scheduleSchema } from "../model/Schedule.js";

export const getAnalyticsData = async (req, res) => {
	try {
		const userId = req.user.userId;

		// Templates Created
		const templatesCreated = await PostModel.aggregate([
			{ $match: { userId: new ObjectId(userId) } },
			{ $group: { _id: '$type', count: { $sum: 1 } } },
		]).then((results) => {
			const templateCounts = {
				birthday: 0,
				festival: 0,
				anniversary: 0,
				event: 0,
				occasion: 0,
				temple: 0,
			};

			results.forEach((item) => {
				templateCounts[item._id] = item.count;
			});
			return templateCounts;
		});

		// Schedules
		const scheduleStatuses = ["schedule_now", "schedule_later", "pause", "completed", "automate"];
		const scheduleTypes = ["birthday", "festival", "marriage", "event", "occasion", "temple"];
		const schedules = {};

		for (const type of scheduleTypes) {
			schedules[type] = {};
			for (const status of scheduleStatuses) {
				const count = await scheduleSchema.countDocuments({
					schedule: status,
					[type]: { $exists: true },
					user: userId, // Filter by userId
				});
				schedules[type][status] = count;
			}
		}

		// Media
		const mediaStatuses = ["success", "failed", "pending"];
		const mediaModes = ["whatsapp", "email", "both"];
		const media = {};

		for (const type of scheduleTypes) {
			media[type] = {};
			for (const mode of mediaModes) {
				media[type][mode] = {};
				for (const status of mediaStatuses) {
					const count = await scheduleSchema.countDocuments({
						mode,
						[`${type}`]: { $exists: true },
						[`mediaStatus.${status}`]: true,
						user: userId, // Filter by userId
					});
					media[type][mode][status] = count;
				}
			}
		}

		// Combine Data
		const analyticsData = {
			templatesCreated,
			schedules,
			media,
		};

		res.status(200).json(analyticsData);
	} catch (error) {
		console.error('Error generating analytics:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
