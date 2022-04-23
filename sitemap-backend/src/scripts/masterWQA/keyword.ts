import { authGoogle } from '../authGoogle';
import { google } from 'googleapis';

const axios = require('axios');

var startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toJSON();
startDate = startDate.split('T')[0];
var endDate = new Date(Date.now()).toJSON();
endDate = endDate.split('T')[0];

export const getKeywords = async (user, viewId, url) => {
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
      dimensions: ['query', 'page'],
    },
  };

  const {
    data: { rows },
  } = await google.webmasters('v3').searchanalytics.query(params);
  return rows.map((row) => {
    return {
      ...row,
      keyword: row.keys[0],
      page: row.keys[1],
      best: Math.round(row.clicks / row.impressions),
    };
  });
};

export const getVolume = async (keywords) => {
  const keywordParam = keywords.map((k) => `kw[]=${k}`);
  const url = 'https://api.keywordseverywhere.com/v1/get_keyword_data';
  const {
    data: { data },
  } = await axios.post(url, keywordParam.join('&'), {
    headers: {
      Authorization: 'Token ' + 'fd7d5ee55e3f6fee6f55',
    },
  });
  return data;
};
