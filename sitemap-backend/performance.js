const { lighthouseBatchParallel } = require('lighthouse-batch-parallel');

const targetWebsites = [
  {
    Device: 'mobile',
    URL: 'https://www.npmjs.com/package/lighthouse-batch-parallel',
  },
  {
    Device: 'desktop',
    URL: 'https://www.npmjs.com/package/lighthouse-batch-parallel',
  },
];

const customAuditsConfig = {
  'first-contentful-paint': 'First Contentful Paint',
  'first-meaningful-paint': 'First Meaningful Paint',
  'speed-index': 'Speed Index',
};

const lighthouseAuditing = lighthouseBatchParallel({
  input: {
    stream: targetWebsites,
  },
  customAudits: { stream: customAuditsConfig },
  throttling: 'applied3G',
  outputFormat: 'jsObject',
  workersNum: 2,
});

let reports = [];

lighthouseAuditing.on('data', ({ data }) => {
  reports.push(data);
});

lighthouseAuditing.on('error', ({ error }) => {
  console.log(error);
});

lighthouseAuditing.on('end', () => {
  console.log(reports);
  console.log(reports[0].audits);
});
