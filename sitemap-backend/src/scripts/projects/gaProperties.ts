import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const gaProperties = async (user) => {
  const oauth2Client = await authGoogle(user);
  const {
    data: { items },
  } = await google.analytics('v3').management.webproperties.list({
    auth: oauth2Client,
    accountId: '~all',
  });
  return items;
};
