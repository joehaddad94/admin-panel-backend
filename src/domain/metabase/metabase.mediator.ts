import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MetabaseMediator {
  constructor() {}

  generateEmbedUrl(questionId: number) {
    const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
    const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

    if (!METABASE_SITE_URL || !METABASE_SECRET_KEY) {
      throw new Error('Metabase configuration is missing');
    }

    const payload = {
      resource: { question: Number(questionId) },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiry
    };

    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    const iframeUrl = `${METABASE_SITE_URL}/embed/question/${token}#bordered=true&titled=true`;

    return { iframeUrl };
  }
} 