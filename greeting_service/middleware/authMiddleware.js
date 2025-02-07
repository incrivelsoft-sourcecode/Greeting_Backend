import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach user info to request object
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

export const adminMiddleware = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		
		if (decoded.role !== "admin") {
			return res.status(403).json({ message: "Access denied. Admins only." });
		}
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ message: "Token is not valid" });
	}
};