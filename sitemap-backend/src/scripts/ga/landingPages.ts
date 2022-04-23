import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const getLandingPages = async (user, viewId) => {
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
    filters: 'ga:medium==organic',
    metrics: 'ga:sessions , ga:bounceRate , ga:avgTimeOnPage',
    'max-results': 100,
  });

  var {
    data: { rows: lastMonthData },
  } = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '60daysAgo',
    'end-date': '30daysAgo',
    dimensions: 'ga:pagePath',
    sort: '-ga:sessions',
    filters: 'ga:medium==organic',
    metrics: 'ga:sessions , ga:bounceRate , ga:avgTimeOnPage',
    'max-results': 100,
  });

  rows.map((item) => {
    let temp = lastMonthData.find((e) => e[0] === item[0]);
    if (temp) {
      let compareSession = parseFloat(temp[1]);
      let actualSession = parseFloat(item[1]);
      let compareBounce = parseFloat(temp[2]);
      let actualBounce = parseFloat(item[2]);
      let compareTime = parseFloat(temp[3]);
      let actualTime = parseFloat(item[3]);

      let percSession =
        100 *
        Math.abs(
          (compareSession - actualSession) /
            ((compareSession + actualSession) / 2),
        );
      let percBounce =
        100 *
        Math.abs(
          (compareBounce - actualBounce) / ((compareBounce + actualBounce) / 2),
        );
      let percTime =
        100 *
        Math.abs((compareTime - actualTime) / ((compareTime + actualTime) / 2));
      let arrowSession = compareSession > actualSession ? false : true;

      let arrowBounce = compareBounce > actualBounce ? false : true;
      let arrowTime = compareTime > actualTime ? false : true;
      item.splice(2, 0, String(percSession));
      item.splice(3, 0, String(arrowSession));
      item.splice(5, 0, String(percBounce));
      item.splice(6, 0, String(arrowBounce));
      item.splice(8, 0, String(percTime));
      item.splice(9, 0, String(arrowTime));
    } else {
      item.splice(2, 0, '-');
      item.splice(3, 0, '-');
      item.splice(5, 0, '-');
      item.splice(6, 0, '-');
      item.splice(8, 0, '-');
      item.splice(9, 0, '-');
    }
  });

  return rows.map((row) => {
    const [
      pages,
      sessions,
      sessions_inc,
      sessions_arrow,
      pr,
      pr_inc,
      pr_arrow,
      atp,
      atp_inc,
      atp_arrow,
    ] = row;
    return {
      pages,
      sessions,
      sessions_arrow,
      sessions_inc,
      pr,
      pr_arrow,
      pr_inc,
      atp,
      atp_arrow,
      atp_inc,
    };
  });
};
