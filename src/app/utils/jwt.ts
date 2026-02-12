import jwt, { SignOptions, JwtPayload} from 'jsonwebtoken';

const createToken = (payload: JwtPayload, secret: string, {expiresIn}: SignOptions) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret);    
    return decoded;
}


const decodeToken = (token: string) => {
  const decoded = jwt.decode(token);
  return decoded;
}

export { createToken, verifyToken, decodeToken };