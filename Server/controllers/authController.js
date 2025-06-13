import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from '../model/userModel.js';
import transporter from "../config/nodemailer.js";





export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }
    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'User Already Exixts' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });



        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Website',
            text: `Welcome to our  Website. Your Account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });



    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are Required' })
    }

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'Invalid Email' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.json({ success: true });



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged Out' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;


        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account Already Verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;


        await user.save();


        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333333;">Verify Your Account</h2>
        <p style="font-size: 16px; color: #555555;">
          Thank you for registering. Use the OTP below to verify your email address:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 24px; font-size: 24px; font-weight: bold; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #999999;">
          This OTP is valid for the next 10 minutes. Do not share it with anyone.
        </p>
        <p style="font-size: 14px; color: #999999; margin-top: 30px;">
          Regards,<br/>
          <strong>Your App Name Team</strong>
        </p>
      </div>
    </div>
  `
        };


        await transporter.sendMail(mailOption)

        res.json({ success: true, message: 'Verification OTP Sent on Email ' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        res.json({ success: false, message: 'Missing Details' });
    }
    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email Verification Successfully' });


    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


export const isAuthenticated = async (req, res) => {
    try {

        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is Required' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;

        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();


        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Password - OTP Inside',
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555555;">
          We received a request to reset your password. Please use the OTP below to proceed with resetting your password:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #dc3545; color: #ffffff; padding: 12px 24px; font-size: 24px; font-weight: bold; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #999999;">
          This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team.
        </p>
        <p style="font-size: 14px; color: #999999; margin-top: 30px;">
          Regards,<br/>
          <strong>Your App Name Team</strong>
        </p>
      </div>
    </div>
  `
        };


        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Otp Send To Your Email ' });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new Password are Required' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

         return res.json({ success: true, message: 'Password has been reset successfully' });


    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}