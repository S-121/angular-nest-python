import { google } from 'googleapis';

import { authGoogle } from '../authGoogle';
var startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toJSON();
startDate = startDate.split('T')[0];
var endDate = new Date(Date.now()).toJSON();
endDate = endDate.split('T')[0];

export const getImpressions = async (user, viewId, url, pages = []) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  const params = {
    ...defaults,
    siteUrl: url,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
    },
  };
  var {
    data: { rows },
  } = await google.webmasters('v3').searchanalytics.query(params);
  return rows.map((row) => {
    return {
      ...row,
      url: row.keys[0],
    };
  });
};
