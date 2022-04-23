import { google } from 'googleapis';
import { authGoogle } from './authGoogle';

export const getRevenueGraph = async (user, viewId, startDateTS, endDateTS) => {
  const startDate = new Date(+endDateTS).toJSON().split('T')[0];
  const endDate = new Date(+startDateTS).toJSON().split('T')[0];

  const oauth2Client = await authGoogle(user);

  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:transactionRevenue',
    filters: 'ga:medium==organic',
    sort: 'ga:date',
    samplingLevel: 'FASTER',
  });

  let {
    data: { rows: all },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:transactionRevenue',
    //filters: 'ga:medium==organic',
    sort: 'ga:date',
    samplingLevel: 'FASTER',
  });

  const _all = all.map((row) => {
    const [_date, revenue] = row;
    const date = new Date(
      `${_date.substring(0, 4)}-${_date.substring(4, 6)}-${_date.substring(
        6,
        8,
      )}`,
    );
    return {
      type: 'all',
      //medium,
      date,
      revenue,
    };
  });
  const _rows = rows.map((row) => {
    const [_date, revenue] = row;
    const date = new Date(
      `${_date.substring(0, 4)}-${_date.substring(4, 6)}-${_date.substring(
        6,
        8,
      )}`,
    );
    return {
      type: 'organic',
      // medium,
      date,
      revenue,
    };
  });
  return _rows.concat(_all);
};
