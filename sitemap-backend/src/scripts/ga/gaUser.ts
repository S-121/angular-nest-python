import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

const months = new Map()
  .set('01', 'Jan')
  .set('02', 'Feb')
  .set('03', 'Mar')
  .set('04', 'Apr')
  .set('05', 'May')
  .set('06', 'Jun')
  .set('07', 'Jul')
  .set('08', 'Aug')
  .set('09', 'Sep')
  .set('10', 'Oct')
  .set('11', 'Nov')
  .set('12', 'Dec');

export const getGaUser = async (user, viewId) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };
  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '275daysAgo',
    'end-date': 'today',
    dimensions: 'ga:month,ga:year',
    metrics: 'ga:users , ga:sessions, ga:pageviews',
    filters: 'ga:medium==organic',
  });

  console.log({ rowsrows: rows });

  const yearData = rows.filter(
    (row) => row[1] === String(new Date().getFullYear()),
  );
  const previousYearData = rows.filter(
    (row) => row[1] !== String(new Date().getFullYear()),
  );

  rows = previousYearData.concat(yearData);
  return rows.map((row) => {
    const [month, _, users, sessions, views] = row;
    return {
      month: months.get(month),
      users,
      sessions,
      views,
    };
  });
};
