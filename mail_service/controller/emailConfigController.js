import EmailConfigModel from "../model/emailConfig.js";


export const getUserEmailConfig = async( user ) => {
    try {
        const emailConfig = await EmailConfigModel.findOne({user});
        return emailConfig;
    } catch (error) {
        console.log("Error in the getUserEmailConfig, ", error);
        return null;
    }
}

export const createEmailConfig = async (req, res) => {
    try {
        const { email, passkey, displayName, emailType, status } = req.body;
        const user = req.user.userId;
        
        if (!email || !passkey || !displayName || !emailType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already has an email configuration
        const existingConfig = await EmailConfigModel.findOne({ user });
        if (existingConfig) {
            return res.status(400).json({ message: "Email configuration for this user already exists" });
        }

        // Create a new email configuration
        const newEmailConfig = new EmailConfigModel({
            email,
            passkey,
            displayName,
            emailType,
            user,
            status,
        });

        await newEmailConfig.save();
        res.status(201).json({ message: "Email configuration created successfully", emailConfig: newEmailConfig });
    } catch (error) {
        console.log("Error in the createEmailConfig, ", error);
        res.status(500).json({ message: "Error creating email configuration", error: error.message });
    }
};

export const updateEmailConfig = async (req, res) => {
    try {
        const user = req.user.userId; // Get user from the request params
        const updateFields = req.body; // Fields to update from request body

        // Check if the email configuration for the user exists
        const existingConfig = await EmailConfigModel.findOne({ user });
        if (!existingConfig) {
            return res.status(404).json({ message: "Email configuration for this user does not exist" });
        }

        // Update only the fields provided in the request body
        const updatedConfig = await EmailConfigModel.findOneAndUpdate(
            { user },
            { $set: updateFields }, // Use $set to update specified fields
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Email configuration updated successfully", emailConfig: updatedConfig });
    } catch (error) {
        console.log("Error in the updateEmailConfig, ", error);
        res.status(500).json({ message: "Error updating email configuration", error: error.message });
    }
};

// Fetch Email Configuration
export const getEmailConfig = async (req, res) => {
    try {
        const user = req.user.userId;

        const emailConfig = await EmailConfigModel.findOne({ user });

        if (!emailConfig) {
            return res.status(204).json({ message: "Email configuration not found" });
        }

        res.status(200).json({ emailConfig });
    } catch (error) {
        console.log("Error in the getEmailConfig, ", error);
        res.status(500).json({ message: "Error fetching email configuration", error: error.message });
    }
};

// Delete Email Configuration
export const deleteEmailConfig = async (req, res) => {
    try {
        const user = req.user.userId;
        const emailConfig = await EmailConfigModel.findOneAndDelete({ user });

        if (!emailConfig) {
            return res.status(404).json({ message: "Email configuration not found" });
        }

        res.status(200).json({ message: "Email configuration deleted successfully" });
    } catch (error) {
        console.log("Error in the deleteEmailConfig, ", error);
        res.status(500).json({ message: "Error deleting email configuration", error: error.message });
    }
};

// Fetch All Email Configurations (Optional for admin or debugging)
export const getAllEmailConfigs = async (req, res) => {
    try {
        const emailConfigs = await EmailConfigModel.find();

        res.status(200).json({ emailConfigs });
    } catch (error) {
        console.log("Error in the getAllEmailConfigs, ", error);
        res.status(500).json({ message: "Error fetching email configurations", error: error.message });
    }
};