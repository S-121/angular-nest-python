// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const baseurl = 'http://ec2-18-191-91-74.us-east-2.compute.amazonaws.com:3000/';
//const baseurl = 'http://localhost:3000/';
const baseurl = 'https://app.sitemap.io/';
export const environment = {
  production: true,

  //login
  login: `${baseurl}user/login`,
  googleanalytic: `${baseurl}data/get`,
  allgoogleanalytic: `${baseurl}data/realtime`,
  allprojects: `${baseurl}project/all`,
  dashboard: `${baseurl}data/top-performance`,
  _dashboard: `${baseurl}dashboard`,
  organicData: `${baseurl}ga/organic-data`,
  projects: `${baseurl}project`,
  users: `${baseurl}users`,
  auth: `${baseurl}auth`,
  keywordResearch: `${baseurl}keyword`,
  resetPasswordLink: `${baseurl}auth/reset-password-link`,
  doResetPassword: `${baseurl}auth/do-reset-password`,
  wqa: `${baseurl}wqa`,
  cwb: `${baseurl}cwb`,

  revenue: `${baseurl}data/revenue`,
  gaUser: `${baseurl}ga/user`,
  performance: `${baseurl}ga/performance`,
  performanceData: `${baseurl}ga/performance-data`,

  landingPages: `${baseurl}ga/landing-pages`,

  //projects

  createproject: `${baseurl}project/create`,
  allupdate: `${baseurl}project/update`,
  allproject: `${baseurl}project/all`,
  findproject: `${baseurl}project/find`,
  deleteproject: `${baseurl}project/delete`,

  //date
  getsearchconsole: `${baseurl}data/get`,
  getgoogleAnalytic: `${baseurl}data/dashboard`,
  usersgraph: `${baseurl}data/graph/users`,

  //graph

  graph: `${baseurl}data/graph`,
  clicks: `${baseurl}data/clicks`,

  //csv

  loadcsv: `${baseurl}data/csv`,
  keyword: `${baseurl}data/keyword-ranking`,
  csvkeywords: `${baseurl}data/csv/keywords`,

  targetpages: `${baseurl}data/csv/targetPages`,
  resultType: `${baseurl}data/csv/resultTypes`,
  linkanalysis: `${baseurl}data/csv/linkAnalysis`,
  maincsv: `${baseurl}data/csv/admin`,

  //keyword csv

  keywordcsvadd: `${baseurl}project/add/csv/keywords`,

  //graphrevenue

  graphrevenue: `${baseurl}data/graph/revenue`,
  queryserach: `${baseurl}data/keyword/urls`,

  //createUser
  addUser: `${baseurl}user/add`,
  allUser: `${baseurl}user/all`,
  findUser: `${baseurl}user/find`,
  editUser: `${baseurl}user/edit`,
  useracees: `${baseurl}user/access`,
  currentuser: `${baseurl}user/current`,
  deleteuser: `${baseurl}user/delete`,
  ///dataaccuranker

  addaccuranker: `${baseurl}data/accuranker`,

  //create project Dropdown
  properties: `${baseurl}user/ga/properties`,
  views: `${baseurl}user/ga/views`,
  sites: `${baseurl}user/gsc/sites`,
  accudomain: `${baseurl}user/accu/domains`,

  //ga pages
  gapages: `${baseurl}data/ga/pages`,

  //ga performance

  gaperformance: `${baseurl}data/ga/performance`,
  keyWordSearchURL: `${baseurl}python`,
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
