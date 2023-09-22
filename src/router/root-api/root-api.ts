import express from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Module, Mailer } from './module';
import FastLog from 'ks-fastlog';

const rootDirectory = execSync('pwd', { encoding: 'utf-8' }).trim();

const saaEmailContent = fs.readFileSync(
	path.join(rootDirectory, 'views/saa-email/index.html'),
	'utf8',
);

const clientEmailContent = fs.readFileSync(
	path.join(rootDirectory, 'views/client-email/index.html'),
	'utf8',
);

const rootApi = express.Router();

rootApi.post(
	'/mail',
	Module.verifyPostBodyForEmailMiddleware,
	async (req, res) => {
		const { name, phone, email, message } = req.body;

		try {
			await Mailer.sendEmail(
				process.env.AWS_SES_SOURCE_EMAIL!,
				[email],
				'Trail Life: Vimos que você está interessado em nossos serviços.',
				clientEmailContent,
			);

			await Mailer.sendEmail(
				process.env.AWS_SES_SOURCE_EMAIL!,
				[process.env.AWS_SES_SAA_EMAIL!],
				'Trail Life: Um novo cliente em potencial está solicitando informações.',
				saaEmailContent
					.replace('!name!', name)
					.replace('!phone!', phone)
					.replace('!email!', email)
					.replace('!message!', message || 'Não Especificadas'),
			);
		} catch (err: any) {
			FastLog.log(err.message, 'error');

			res.status(500).json({
				message:
					'Oops, algo deu errado. Por favor, tente novamente mais tarde.',
			});

			return;
		}

		res.sendStatus(200);
	},
);

export default rootApi;
