import jwt, { SignOptions, JwtPayload} from 'jsonwebtoken';

const createToken = (payload: JwtPayload, secret: string, {expiresIn}: SignOptions) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

