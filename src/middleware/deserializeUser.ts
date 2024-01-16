import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get the access token from the request headers
  const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  // if no access token found, skip this step
  if (!accessToken) return next();

  // verify if the access token is valid
  const { decoded, expired } = await verifyJwt(accessToken);

  // if valid, attach the decoded JWT payload to the request object
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  // get the refresh token from the header
  const refreshToken = get(req, 'headers.x-refresh') as string;
  if (expired && refreshToken) {
    // if access token is expired, but refresh token is present, issue a new access token if the refresh token is valid
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      // if a new access token is successfully issued, attach it to the response header
      res.setHeader('x-access-token', newAccessToken);
    }
    // decode the new access token and attach it to the request object
    const { decoded } = await verifyJwt(newAccessToken as string);
    res.locals.user = decoded;

    return next();
  }
  return next();
};
