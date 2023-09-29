import express from 'express';

export default class Module {
	private static verifyName(name: string) {
		if (!name || name.length < 4) {
			throw { message: 'Por favor, forneça um nome válido' };
		}

		name = name.trim();
	}

	private static verifyEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email || !emailRegex.test(email)) {
			throw { message: 'Por favor, forneça um email válido' };
		}
	}

	private static verifyPhone(phone: string) {
		if (!phone || phone.replace(/\D/g, '').length !== 13) {
			throw { message: 'Por favor, forneça um número de telefone válido' };
		}
	}

	static verifyPostBodyForEmailMiddleware(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) {
		const { name, email, phone } = req.body;

		try {
			Module.verifyName(name);
			Module.verifyEmail(email);
			Module.verifyPhone(phone);
		} catch (err: any) {
			return res.status(400).json({
				message: err.message,
			});
		}

		return next();
	}
}
