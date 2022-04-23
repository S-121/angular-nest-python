import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const gscSites = async (user) => {
  const oauth2Client = await authGoogle(user);
  const {
    data: { siteEntry },
  } = await google.webmasters('v3').sites.list({
    auth: oauth2Client,
  });

  return siteEntry;
};
