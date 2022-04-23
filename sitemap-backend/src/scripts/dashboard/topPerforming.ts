import { google } from 'googleapis';

import { authGoogle } from '../authGoogle';

export const getTopPerforming = async (user, viewId, url, filter, offset) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };


  const params = {
    ...defaults,
    siteUrl: url,
    requestBody: {
      rowLimit: 50,
      startRow: offset,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toJSON()
        .split('T')[0],
      endDate: new Date().toJSON().split('T')[0],
      aggregationType: 'byPage',
      dimensions: ['page', 'query'],
      dimensionFilterGroups: [
        {
          groupType: 'and',
          filters: [],
        },
      ],
    },
  };

  const requests = [];

  if (filter && filter.length) {
    filter.forEach((_filter) => {
      params.requestBody.startDate = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      )
        .toJSON()
        .split('T')[0];
      params.requestBody.endDate = new Date().toJSON().split('T')[0];
      params.requestBody.dimensionFilterGroups[0].filters = [];
      for (let property in _filter) {
        if (property === 'dateRange') {
          const parts = _filter[property].split('-');
          if (parts.length == 2) {
            params.requestBody.startDate = new Date(parts[0])
              .toJSON()
              .split('T')[0];
            params.requestBody.endDate = new Date(parts[1])
              .toJSON()
              .split('T')[0];
          }
        } else {  
          
          console.log(checkUrlExistance(_filter.query) ? 'PAGE' : 'query');

          params.requestBody.dimensionFilterGroups[0].filters.push({
            dimension: checkUrlExistance(_filter.query) ? 'PAGE' : 'query',
            operator: 'equals',
            expression: _filter['query'],
          });
        }
      }
      requests.push(getData(params));
    });
  } else {
    requests.push(getData(params));
  }
  return Promise.all(requests);
};

const getData = async (params) => {
  const {
    data: { rows },
  } = await google.webmasters('v3').searchanalytics.query(params);

  return rows.map((row) => {
    return {
      ...row,
      url: row.keys[0],
      query: row.keys[1],
    };
  });
};

const checkUrlExistance = (url) => {
  try {
    url = new URL(url);
    return true;
  } catch (_) {
    return false;  
  }
}
