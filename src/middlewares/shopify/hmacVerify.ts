import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import shopify from '@/config/shopify';

export const hmacVerify = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const generateHash = crypto
      .createHmac('SHA256', process.env.SHOPIFY_API_SECRET as string)
      .update(JSON.stringify(req.body), 'utf8')
      .digest('base64');

    const hmac = req.headers['x-shopify-hmac-sha256'] as string;

    if (shopify.auth.safeCompare(generateHash, hmac)) {
      next();
    } else {
      res.status(401).send();
    }
  } catch (e) {
    console.error(e);
    res.status(401).send();
  }
};
