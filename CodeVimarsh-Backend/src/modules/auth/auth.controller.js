import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  const renderHtml = (title, message, icon, color) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Code Vimarsh</title>
      <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: #0d0d0d; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
        .container { max-width: 400px; padding: 40px; background: #1a1a1a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #333; }
        .icon { font-size: 56px; margin-bottom: 20px; }
        h1 { color: ${color}; font-size: 24px; margin: 0 0 16px; }
        p { color: #ccc; font-size: 15px; line-height: 1.6; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send(renderHtml("Invalid Request", "The verification link is missing the secure token.", "❌", "#ff4d4f"));
    }
    
    await authService.verifyEmail(token);
    
    res.status(200).send(renderHtml(
      "Verified Successfully!", 
      "Your email has been securely verified. You can now safely close this window and go back to your original device to sign in.", 
      "✅", 
      "#fe8a16"
    ));
  } catch (err) {
    const errorMsg = err.message || "Something went wrong during verification. The link may have expired.";
    res.status(400).send(renderHtml("Verification Failed", errorMsg, "⚠️", "#ff4d4f"));
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const result = await authService.resendVerification(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
