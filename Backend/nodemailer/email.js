import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./emailtemplets.js";


export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"RentMate" <6996.ashokkumar@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
export const sendWelcomeEmail=async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"RentMate" <6996.ashokkumar@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}


export const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `https://yourdomain.com/reset-password/${token}`;

  const mailOptions = {
    from: '"Your App" <yourapp@example.com>',
    to,
    subject: "Reset Your Password",
    html: `
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
