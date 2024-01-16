import { Request, Response } from 'express';
import { validatePassword } from '../services/user.service';
import {
  createSession,
  findSessions,
  invalidateSession,
} from '../services/session.service';
import { signJwt } from '../utils/jwt.utils';
import config from 'config';

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate User Password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // Create a Session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // Create Access Token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTtl') }, // 15 minutes
  );
  // Create Refresh Token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('refreshTokenTtl') },
  );

  // Send Refresh & Access Token back
  res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  // Fetch User Sessions from Database
  // Return Sessions
  const user = res.locals.user._id;
  const sessions = await findSessions({ user, valid: true });
  return res.send(sessions);
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
  // Fetch User Sessions from Database
  // Return Sessions
  const sessionId = res.locals.user.session;
  await invalidateSession(sessionId);
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
