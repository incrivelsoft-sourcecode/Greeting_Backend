import UserTicketing from '../model/UserTicketing.js';

export const createTicket = async (req, res) => {
    try {
        const { sub, phoneNumber, complement } = req.body;

        const userId = req.user?.userId;

        if (!phoneNumber || !sub || !complement) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const newTicket = new UserTicketing({
            userId,
            sub,
            phoneNumber,
            complement
        });

        await newTicket.save();

        res.status(201).json({ message: "Ticket created successfully", data: newTicket });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTicket = await UserTicketing.findByIdAndDelete(id);

        if (!deletedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const getTicket = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const ticket = await UserTicketing.find({userId}).populate('userId', 'first_name last_name email');

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ data: ticket });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await UserTicketing.find().populate('userId', 'first_name last_name email');

        res.status(200).json({ data: tickets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTicket = await UserTicketing.findByIdAndUpdate(id, updates, {
            new: true, 
            runValidators: true,
        });

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket updated successfully", data: updatedTicket });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
