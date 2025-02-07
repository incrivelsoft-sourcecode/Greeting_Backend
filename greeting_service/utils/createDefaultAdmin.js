import User from '../model/User.js';
import bcrypt from 'bcryptjs';

export const createDefaultAdmin = async () => {
	try {
		// Check if an admin already exists
		const existingAdmin = await User.findOne({ role: "admin" });
		if (existingAdmin) {
			console.log('Default admin already exists.');
			return;
		}

		// Create the admin
		const newAdmin = new User({
			first_name: "Admin",
			last_name: "User",
			email: 'dev@incrivelsoft.com',
			password: 'dev@123',
			role: "admin",
		});

		await newAdmin.save();
		console.log('Default admin created successfully.');
	} catch (error) {
		console.error('Error creating default admin:', error.message);
	}
};
