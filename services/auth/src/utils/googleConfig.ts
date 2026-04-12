import { google } from 'googleapis';
import { ENV } from './ENV.js';

export const oauth2Client = new google.auth.OAuth2(
    ENV.GOOGLE_CLIENT_ID,
    ENV.GOOGLE_CLIENT_SECRET,
);