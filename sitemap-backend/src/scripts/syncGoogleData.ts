import { google } from 'googleapis';

import { authGoogle } from './authGoogle';

var startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toJSON();
startDate = startDate.split('T')[0];
var endDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toJSON();
endDate = endDate.split('T')[0];

export const syncSiteData = async (
  user,
  viewId,
  url,
  startDateTS,
  endDateTS,
) => {
  const startDate = new Date(+endDateTS).toJSON().split('T')[0];
  const endDate = new Date(+startDateTS).toJSON().split('T')[0];
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  var result = await google.webmasters('v3').searchanalytics.query({
    ...defaults,
    siteUrl: url,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      aggregationType: 'byPage',
      dimensions: ['page', 'query'],
    },
  });
  return result.data.rows.map((row) => {
    return {
      ...row,
      url: row.keys[0],
      query: row.keys[1],
    };
  });
};

export const syncClicksData = async (
  user,
  viewId,
  url,
  startDateTS,
  endDateTS,
  keyword,
) => {
  const startDate = new Date(+endDateTS).toJSON().split('T')[0];
  const endDate = new Date(+startDateTS).toJSON().split('T')[0];
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };

  const params = {
    ...defaults,
    siteUrl: url,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      //aggregationType: 'byProperty',
      dimensions: ['date'],
    },
  };

  if (keyword !== 'all') {
    params.requestBody['dimensionFilterGroups'] = [
      {
        groupType: 'and',
        filters: [
          {
            dimension: 'query',
            operator: 'equals',
            expression: keyword,
          },
        ],
      },
    ];
    params.requestBody.dimensions.push('query');
  }
  const {
    data: { rows },
  } = await google.webmasters('v3').searchanalytics.query(params);

  return rows
    .map((row) => {
      console.log({ keys: JSON.stringify(row.keys) });

      const date = new Date(row.keys[0]);
      delete row.keys;
      return {
        ...row,
        date,
      };
    })
    .sort((a: any, b: any) => a.date - b.date);
};
