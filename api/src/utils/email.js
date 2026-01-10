const nodemailer = require("nodemailer");

// Create a transporter using Ethereal (fake SMTP) or environment variables
// For production, USER must provide SMTP_HOST, SMTP_USER, SMTP_PASS
const createTransporter = async () => {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Fallback to Ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    console.log("-----------------------------------------");
    console.log("⚠️ USING TEST EMAIL ACCOUNT (ETHEREAL) ⚠️");
    console.log("User:", testAccount.user);
    console.log("Pass:", testAccount.pass);
    console.log("-----------------------------------------");

    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

let transporter = null;

const getTransporter = async () => {
    if (!transporter) {
        transporter = await createTransporter();
    }
    return transporter;
}

const sendOTP = async (email, otp, type = "Verification") => {
    const transport = await getTransporter();
    const info = await transport.sendMail({
        from: '"Voting System" <noreply@voting.com>',
        to: email,
        subject: `${type} Code: ${otp}`,
        text: `Your ${type} code is: ${otp}. It expires in 10 minutes.`,
        html: `<b>Your ${type} code is: ${otp}</b><br>It expires in 10 minutes.`,
    });

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    // Also log OTP to console for easy testing without opening email
    console.log(`>>> OTP for ${email}: ${otp} <<<`);
};

module.exports = { sendOTP };
