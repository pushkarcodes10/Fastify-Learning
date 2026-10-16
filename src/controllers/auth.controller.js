import User from "../models/user.models.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const register = async (request, reply) => {
  try {
    const { name, email, password, country } = request.body || {};

    if (!name || !email || !password) {
      return reply.code(400).send({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.code(409).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, country });
    await user.save();

    return reply.code(201).send({ message: "User Registered Successfully" });
  } catch (err) {
    return reply.send(err);
  }
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return reply.code(400).send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(400).send({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }

    const token = request.server.jwt.sign({ id: user._id });
    user.refreshToken = token;
    await user.save();

    return reply.code(200).send({ token });
  } catch (err) {
    return reply.send(err);
  }
};

export const forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body || {};
    const user = await User.findOne({ email });

    if (!user) {
      return reply.code(403).send({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;
    return reply.send({ resetUrl });
  } catch (err) {
    return reply.send(err);
  }
};

export const resetPassword = async (request, reply) => {
  try {
    const resetToken = request.params.token;
    const { newPassword, confirmNewPassword } = request.body || {};

    if (!newPassword || !confirmNewPassword) {
      return reply.code(400).send({ message: "Password is required" });
    }

    if (newPassword !== confirmNewPassword) {
      return reply.code(400).send({ message: "Passwords do not match" });
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return reply.code(400).send({ message: "Invalid or expired password reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return reply.code(200).send({ message: "Password reset successful" });
  } catch (err) {
    return reply.send(err);
  }
};

export const logout = async (request, reply) => {
  try {
    const userId = request.user?._id || request.user?.id;

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(userId, { refreshToken: null });

    return reply.code(200).send({ message: "Logged out successfully" });
  } catch (err) {
    return reply.send(err);
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout
};