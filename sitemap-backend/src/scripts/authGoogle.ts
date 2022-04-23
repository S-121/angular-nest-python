import { google } from 'googleapis';
const oauth2Client = new google.auth.OAuth2(
  '6994770623-10828epq0b7nm5l8oo0uobv91bpdj7pv.apps.googleusercontent.com',
  'IehDLrluss8bibGb4QLm0JAx',
  'http://localhost:3000/data/token',
);

export const authGoogle = async ({ access_token, refresh_token }) => {
  await oauth2Client.setCredentials({
    access_token,
    refresh_token,
  });
  return oauth2Client;
};
