import { FilterQuery } from 'mongoose';
import logger from '../utils/logger';
import SessionModel, { SchemaDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './user.service';

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SchemaDocument>) {
  return SessionModel.find(query).lean(); // lean() returns a plain JS object instead of a mongoose document
}

export async function invalidateSession(sessionId: string) {
  logger.info('Invalidating session: ', sessionId);
  return SessionModel.updateOne({ _id: sessionId }, { valid: false });
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  // Decode the refresh token
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, 'session')) return false;

  const session = await SessionModel.findById(get(decoded, 'session'));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt({ ...user, session: session._id }, { expiresIn: '15m' });

  return accessToken;
}
