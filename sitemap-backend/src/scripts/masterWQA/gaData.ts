import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const getGAData = async (user, viewId) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'today',
    dimensions: 'ga:pagePath',
    sort: '-ga:sessions',
    metrics:
      'ga:sessions , ga:bounceRate , ga:avgTimeOnPage, ga:goalCompletionsAll, ga:goalConversionRateAll',
  });

  const rs = rows.map((row) => {
    return {
      sessions: row[1],
      page: row[0],
      bounceRate: row[2],
      avgTimeOnPage: row[3],
      goalCompletions: row[4],
      goalConversionRate: row[5],
    };
  });
  return rs;
};
