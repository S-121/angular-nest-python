import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

const keyMapper = new Map()
  .set('device', 'ga:deviceCategory')
  .set('country', 'ga:country')
  .set('browser', 'ga:browser')
  .set('USA', 'United States')
  .set('CAN', 'Canada');

export const getRevenue = async (user, viewId, filter, projectConversions) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  let startDate = new Date(lastMonth).toJSON().split('T')[0];
  let endDate = new Date().toJSON().split('T')[0];
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  const requests = [];

  if (filter && filter.length) {
    filter.forEach((_filter) => {
      startDate = new Date(lastMonth).toJSON().split('T')[0];
      endDate = new Date().toJSON().split('T')[0];
      const params = [];
      for (let property in _filter) {
        if (property === 'dateRange') {
          const parts = _filter[property].split('-');
          if (parts.length == 2) {
            startDate = new Date(parts[0]).toJSON().split('T')[0];
            endDate = new Date(parts[1]).toJSON().split('T')[0];
          }
        } else if (property === 'device') {
          params.push(`${keyMapper.get(property)}==${_filter[property]}`);
        }
      }
      requests.push(getData(defaults, params.join(';'), startDate, endDate, projectConversions));
    });
  } else {
    requests.push(getData(defaults, undefined, startDate, endDate, projectConversions));
  }
  return Promise.all(requests);
};

const getData = async (defaults, params, startDate, endDate, projectConversions) => {

  if (typeof projectConversions !== 'undefined' && projectConversions === 'goal') {
    return await retrieveGoalConversions(defaults, params, startDate, endDate);
  } else {
    return await retrieveEcommerceConversions(defaults, params, startDate, endDate);
  }
};

const retrieveGoalConversions = async (defaults, params, startDate, endDate) => {
  
  console.log('retrieveGoalConversions()');
  
  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:goalCompletionsAll',
    filters: ['ga:medium==organic', params].filter((item) => item).join(';'),
    sort: 'ga:date',
    //samplingLevel: 'FASTER',
  });

  let {
    data: { rows: all },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:goalCompletionsAll',
    sort: 'ga:date',
    filters: [params].filter((item) => item).join(';') || undefined,
    //samplingLevel: 'FASTER',
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
      date,
      revenue,
    };
  });
  console.log({ rows: JSON.stringify(rows) });
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
      date,
      revenue,
    };
  });
  _rows[0]['conversion_type'] = 'goal';
  return _rows.concat(_all);
};

const retrieveEcommerceConversions = async (defaults, params, startDate, endDate) => {
  
  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:transactionRevenue',
    filters: ['ga:medium==organic', params].filter((item) => item).join(';'),
    sort: 'ga:date',
    //samplingLevel: 'FASTER',
  });

  let {
    data: { rows: all },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': startDate,
    'end-date': endDate,
    dimensions: 'ga:date',
    metrics: 'ga:transactionRevenue',
    sort: 'ga:date',
    filters: [params].filter((item) => item).join(';') || undefined,
    //samplingLevel: 'FASTER',
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
      date,
      revenue,
    };
  });
  console.log({ rows: JSON.stringify(rows) });
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
      date,
      revenue,
    };
  });

  _rows[0]['conversion_type'] = 'ecommerce';
  
  return _rows.concat(_all);
};

