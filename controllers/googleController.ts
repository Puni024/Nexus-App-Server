import { Request, Response } from "express";
import { googleLoginOrSignup } from "../services/authService";
import { COOKIE_OPTIONS } from "../services/cookies";

export const googleLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const googleToken = req.body.token;

    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const { token } = await googleLoginOrSignup(
      googleToken
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

