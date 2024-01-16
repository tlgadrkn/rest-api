import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, { ...options, algorithm: 'RS256' });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}

export function verifyRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}
