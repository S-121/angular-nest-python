import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const gaViewsOfProperty = async (user, accountId, webPropertyId) => {
  const oauth2Client = await authGoogle(user);
  const {
    data: { items },
  } = await google.analytics('v3').management.profiles.list({
    auth: oauth2Client,
    accountId,
    webPropertyId,
  });

  return items;
};
