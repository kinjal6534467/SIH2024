import express, { Request, Response } from 'express';
const bodyParser = require('body-parser'); // CommonJS require syntax
const nodemailer = require('nodemailer'); // CommonJS require syntax
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

const users: { [email: string]: { password: string; verificationToken: string; verified: boolean } } = {};

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-email-password',   // Your email password (use environment variables for security)
    },
});

// Step 1: Register User and Send Verification Email
app.post('/register', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (users[email]) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    users[email] = { password, verificationToken, verified: false };

    // Send verification email
    sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'Registration successful, please check your email to verify your account' });
});

// Step 2: Verify Email
app.get('/verify', (req: Request, res: Response) => {
    const { email, token } = req.query;

    const user = users[email as string];
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or token' });
    }

    if (user.verified) {
        return res.status(400).json({ message: 'Email already verified' });
    }

    if (user.verificationToken === token) {
        user.verified = true;
        res.status(200).json({ message: 'Email verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid token' });
    }
});

// Step 3: Send Verification Email
function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `http://localhost:3000/verify?email=${email}&token=${token}`;
    const mailOptions = {
        from: 'no-reply@yourdomain.com', // Sender address
        to: email,                       // List of recipients
        subject: 'Email Verification',   // Subject line
        text: `Please verify your email by clicking on the following link: ${verificationUrl}`, // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            if (error.responseCode) {
                console.error('SMTP response code:', error.responseCode);
            }
            if (error.response) {
                console.error('SMTP response:', error.response);
            }
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
