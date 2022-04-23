import { google } from 'googleapis';
import { authGoogle } from '../authGoogle';

export const getPerformance = async (user, viewId) => {
  const oauth2Client = await authGoogle(user);
  const defaults = {
    auth: oauth2Client,
    ids: `ga:${viewId}`,
  };

  const result = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '2daysAgo',
    'end-date': 'today',
    dimensions: 'ga:hostname , ga:pagePath, ga:medium',
    metrics: 'ga:sessions',
    'max-results': 200,
    filters: 'ga:medium==organic',
    sort: '-ga:sessions',
  });
  console.log(result.data.rows);
  const strategy = ['desktop', 'mobile'];
  const strategyData = {
    desktop: { breif: [], detailed: [] },
    mobile: { breif: [], detailed: [] },
  };
  for (let i = 0; i < strategy.length; i++) {
    const requests = result.data.rows.map(async (item) => {
      let result = null;
      let url = null;
      try {
        const path = item[1];
        url = `https://${item[0]}${path}`;
        if (path.indexOf('www') >= 0 || path.indexOf('.') >= 0) {
          url = `https://${path}`;
        }

        result = await google.pagespeedonline('v5').pagespeedapi.runpagespeed({
          key: 'AIzaSyDXXEBqAJwsaVTZaxJDt0IJYQ5n9kHcISQ',
          url,
          strategy: strategy[i],
        });
      } catch (error) {
        console.error(error, url);
      }
      return result;
    });

    let data = await Promise.all(requests);
    data = data.filter((a) => a);
    strategyData[strategy[i]] = {
      breif: data.map((item) => {
        return {
          url: item.data.lighthouseResult.requestedUrl,
          fcp: item.data.lighthouseResult.audits['first-contentful-paint']
            .displayValue,
          si: item.data.lighthouseResult.audits['speed-index'].displayValue,
          lcp: item.data.lighthouseResult.audits['largest-contentful-paint']
            .displayValue,
          tti: item.data.lighthouseResult.audits['interactive'].displayValue,
          tbt: item.data.lighthouseResult.audits['total-blocking-time']
            .displayValue,
          cls: item.data.lighthouseResult.audits['cumulative-layout-shift']
            .displayValue,
          ps: item.data.lighthouseResult.categories.performance.score * 100,
          device: strategy[i],
        };
      }),
      detailed: data.map((item) => {
        const loadingExperience = item.data.loadingExperience || {};
        const metrics = loadingExperience.metrics || {};
        return {
          url: item.data.lighthouseResult.requestedUrl,
          fcp: item.data.lighthouseResult.audits['first-contentful-paint']
            .displayValue,
          fcp_score: (metrics['FIRST_CONTENTFUL_PAINT_MS'] || {}).category,
          si: item.data.lighthouseResult.audits['speed-index'].displayValue,
          lcp: item.data.lighthouseResult.audits['largest-contentful-paint']
            .displayValue,
          lcp_score: (metrics['LARGEST_CONTENTFUL_PAINT_MS'] || {}).category,
          tti: item.data.lighthouseResult.audits['interactive'].displayValue,
          tbt: item.data.lighthouseResult.audits['total-blocking-time']
            .displayValue,
          cls: item.data.lighthouseResult.audits['cumulative-layout-shift']
            .displayValue,
          cls_score: (metrics['CUMULATIVE_LAYOUT_SHIFT_SCORE'] || {}).category,
          ps: item.data.lighthouseResult.categories.performance.score * 100,
          overall_score: loadingExperience.overall_category,
          record_date: new Date(),
          device: strategy[i],
        };
      }),
    };
  }
  return {
    breif: strategyData.desktop.breif.concat(...strategyData.mobile.breif),
    detailed: strategyData.desktop.detailed.concat(
      ...strategyData.mobile.detailed,
    ),
  };
};
