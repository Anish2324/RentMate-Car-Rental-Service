import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	if (!email || !verificationToken) {
		throw new Error("Email and verification token are required");
	}

	const recipient = [{ email }];

	try {
		console.log(`Sending verification email to ${email}`);

		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Email sent successfully:", response);
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
};
