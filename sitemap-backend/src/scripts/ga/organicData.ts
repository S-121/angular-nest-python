import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const getOrganicData = async (user, viewId) => {
  const dateTimestamp = new Date();
  dateTimestamp.setHours(0);
  dateTimestamp.setMinutes(0);
  dateTimestamp.setSeconds(0);
  const timestamp = +dateTimestamp;

  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };

  // This Month...
  const this_month_start = new Date();
  this_month_start.setDate(1);
  const this_startDate = new Date(+this_month_start).toJSON().split('T')[0];

  // Last Month...
  const last_month_end = new Date();
  last_month_end.setMonth(last_month_end.getMonth() - 1);
  const last_month_start = new Date();
  last_month_start.setMonth(last_month_start.getMonth() - 1);
  last_month_start.setDate(1);
  const last_startDate = new Date(+last_month_start).toJSON().split('T')[0];
  const last_endDate = new Date(
    last_month_end.getFullYear(),
    last_month_end.getMonth() + 1,
    0,
  )
    .toJSON()
    .split('T')[0];

  const last_current_date = new Date(
    new Date().setMonth(new Date().getMonth() - 1),
  )
    .toJSON()
    .split('T')[0];

  let {
    data: { rows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '365daysAgo',
    'end-date': 'today',
    dimensions: 'ga:month,ga:year',
    filters: 'ga:medium==organic',
    metrics:
      'ga:sessions , ga:bounceRate , ga:pageviews, ga:pageviewsPerSession , ga:timeOnPage',
  });

  const {
    data: { rows: thisRows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': this_startDate,
    'end-date': 'today',
    dimensions: 'ga:month,ga:year',
    filters: 'ga:medium==organic',
    metrics:
      'ga:sessions , ga:bounceRate , ga:pageviews, ga:pageviewsPerSession , ga:timeOnPage',
  });

  const {
    data: { rows: lastRows },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': last_startDate,
    'end-date': last_endDate,
    dimensions: 'ga:month,ga:year',
    filters: 'ga:medium==organic',
    metrics:
      'ga:sessions , ga:bounceRate , ga:pageviews, ga:pageviewsPerSession , ga:timeOnPage',
  });

  const {
    data: { rows: lastMonthDate },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': last_startDate,
    'end-date': last_current_date,
    dimensions: 'ga:month,ga:year',
    filters: 'ga:medium==organic',
    metrics:
      'ga:sessions , ga:bounceRate , ga:pageviews, ga:pageviewsPerSession , ga:timeOnPage',
  });

  const yearData = rows.filter(
    (row) => row[1] === String(new Date().getFullYear()),
  );
  const previousYearData = rows.filter(
    (row) => row[1] !== String(new Date().getFullYear()),
  );
  rows = previousYearData.concat(yearData).reverse();

  //const [_currentMonth, _lastMonth] = rows;
  const [_currentMonth] = thisRows;
  const [_lastMonth] = lastRows;

  const perYearInfo = rows.reduce(
    function (acc, cur) {
      const [
        ,
        ,
        sessions,
        bounceRate,
        pageviews,
        pageviewsPerSession,
        timeOnPage,
      ] = cur;
      acc.sessions += Number(sessions);
      acc.bounceRate += Number(bounceRate);
      acc.pageviews += Number(pageviews);
      acc.pageviewsPerSession += Number(pageviewsPerSession);
      acc.timeOnPage += Number(timeOnPage);
      return acc;
    },
    {
      sessions: 0,
      bounceRate: 0,
      pageviews: 0,
      pageviewsPerSession: 0,
      timeOnPage: 0,
    },
  );
  const {
    sessions: lastYearSessions,
    bounceRate: lastYearBoounceRate,
    pageviews: lastYearPageViews,
    pageviewsPerSession: lastYearPageviewsPerSession,
    timeOnPage: lastYearTimeOnPage,
  } = perYearInfo;

  const [
    currentMonth,
    ,
    currentMonthSessions,
    currentMonthBounceRate,
    currentMonthPageviews,
    currentMonthPageviewsPerSession,
    currentMonthTimeOnPage,
  ] = _currentMonth;

  const [
    lastMonth,
    ,
    lastMonthSessions,
    lastMonthBounceRate,
    lastMonthPageviews,
    lastMonthPageviewsPerSession,
    lastMonthTimeOnPage,
  ] = _lastMonth;

  const [
    ,
    ,
    lastCurrentSessions,
    lastCurrentBounceRate,
    lastCurrentPageviews,
    lastCurrentPageviewsPerSession,
    lastCurrentTimeOnPage,
  ] = lastMonthDate[0];

  return {
    lastMonth,
    currentMonth,
    currentMonthSessions,
    currentMonthBounceRate,
    currentMonthPageviews,
    currentMonthPageviewsPerSession,
    currentMonthTimeOnPage:
      (Number(currentMonthTimeOnPage) / Number(currentMonthPageviews)) * 1000 +
      timestamp,
    lastMonthSessions,
    lastMonthBounceRate,
    lastMonthPageviews,
    lastMonthPageviewsPerSession,
    lastMonthTimeOnPage:
      (Number(lastMonthTimeOnPage) / Number(lastMonthPageviews)) * 1000 +
      timestamp,
    lastCurrentSessions,
    lastCurrentBounceRate,
    lastCurrentPageviews,
    lastCurrentPageviewsPerSession,
    lastCurrentTimeOnPage:
      (Number(lastCurrentTimeOnPage) / Number(lastCurrentPageviews)) * 1000 +
      timestamp,
    lastYearSessions,
    lastYearBoounceRate: lastYearBoounceRate / 12,
    lastYearPageViews,
    lastYearPageviewsPerSession,
    lastYearTimeOnPage:
      (Number(lastYearTimeOnPage) / Number(lastYearPageViews)) * 1000 +
      timestamp,
  };
};
