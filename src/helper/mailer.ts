import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bycrpt from "bcrypt"
interface UserEmail {
    email: string;
    emailType: string;
    userId: string;
}

export const sendMail = async ({ email, emailType, userId }: UserEmail) => {
    try {
        console.log("checking the inputs: ", { email, emailType, userId });

        const hashedToken = await bycrpt.hash(userId, 10)

        if (emailType === "VERIFY") {
            console.log("checking the hashed token and emailtype: ", hashedToken , emailType);
            
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpeiry: Date.now() + 3600000
                }
            })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpeiryDate: Date.now() + 3600000
                }
            })
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "37223b32b62bc6",
                pass: "e89bdce4b84aab"
            }
        });

        const mailoption = {
            from: 'queryjson@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailtoken = await transport.sendMail(mailoption);
        console.log(mailtoken.messageId);
        return mailtoken;
    } catch (error: any) {
        throw new Error("error in sending mail" + error);

    }

};  