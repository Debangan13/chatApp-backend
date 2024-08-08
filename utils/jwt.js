import jwt from "jsonwebtoken";

export const createJWT = ({ payload }) => {0.
  
  const token = jwt.sign(payload, process.env.JWT_SCERET, {
    expiresIn:"30d",
  });
  return token;
};

export const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
            secure: true,
            sameSite:"None"
  });
};
