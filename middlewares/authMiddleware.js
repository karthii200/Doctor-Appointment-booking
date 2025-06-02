import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      console.log("Auth Middleware: No token found after split."); // Added for clarity
      return res.status(401).send({
        message: "No token provided, Authorization failed",
        success: false,
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        // --- ADDED LOG ---
        console.error("Auth Middleware: JWT Verification FAILED:", err);
        // --- END ADDED LOG ---
        return res.status(401).send({
          message: "Invalid token, Authorization failed",
          success: false,
        });
      } else {
        // --- ADDED LOG ---
        console.log("Auth Middleware: JWT Verified SUCCESSFULLY. Decoded Payload:", decode);
        // --- END ADDED LOG ---
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error("Auth Middleware: Unexpected Error in try/catch block:", error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

export default authMiddleware;