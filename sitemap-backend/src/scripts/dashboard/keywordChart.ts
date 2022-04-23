import { google } from 'googleapis';

import { authGoogle } from '../authGoogle';

export const getKeywordChart = async (
  user,
  viewId,
  url,
  filter,
  searchAnalyticsEndPoint = 'Web',
) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };

  // let dimensions = [];
  // if (searchAnalyticsEndPoint === 'Web' && checkUrlExistance(filter[0].query)) {
  //   dimensions = ['DATE'];
  // } else {
  //   dimensions = ['date'];
  // }

  const params = {
    ...defaults,
    siteUrl: url,
    requestBody: {
      type: searchAnalyticsEndPoint,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toJSON()
        .split('T')[0],
      endDate: new Date().toJSON().split('T')[0],
      dimensions: ['date'],
      rowLimit: 1000,
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
      for (const property in _filter) {
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
          // console.log(_filter.query)
          console.log({
            dimension: checkUrlExistance(_filter.query) ? 'PAGE' : 'QUERY',
            operator: 'equals',
            expression: _filter[property],
          });
          params.requestBody.dimensionFilterGroups[0].filters.push({
            dimension: checkUrlExistance(_filter.query) ? 'PAGE' : 'QUERY',
            operator: 'equals',
            expression: _filter[property],
          });
        }
      }
      requests.push(getData(params));
    });
  } else {
    requests.push(getData(params));
  }
  return (await Promise.all(requests)).filter((a) => a);
};

const getData = async (params) => {
  try {
    const {
      data: { rows },
    } = await google.webmasters('v3').searchanalytics.query(params);

    return rows
      .map((row) => {
        const date = new Date(row.keys[0]);
        delete row.keys;
        return {
          ...row,
          date,
        };
      })
      .sort((a: any, b: any) => a.date - b.date);
  } catch (e) {
    //if there is no discover data returned by an API
    console.error(e);
    return null;
  }
};

const checkUrlExistance = (url) => {
  try {
    url = new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
