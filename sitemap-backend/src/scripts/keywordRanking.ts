import axios from 'axios';

const opts = { q: '', key: 'IqlMzi0K4uEN30Q8hNGLmMcjtgPXlAQ9', gl: 'us' };

export const fetchKeywordRankings = async (
  keywords,
  project_url,
  project_id,
) => {
  console.log('fetchKeywordRankings()');
  console.log(project_url);
  const keyword_rankings = [];
  if (keywords.length > 0) {
    for (let i = 0; i < keywords.length; i++) {
      opts.q = keywords[i];
      if (i % 5) {
        delay(1000);
      }
      const rankings = await getKeywordRankingZutrix(
        opts,
        project_url,
        project_id,
      );
      keyword_rankings.push(rankings);
    }

    console.log(keyword_rankings);

    return keyword_rankings;
  }
};

const getKeywordRankingZutrix = async (opts, url, project_id) => {
  const res = await axios.get('https://zutrix.com/api/serp', {
    params: opts,
  });

  const rankings = (res.data.organic_results || [])
    .filter((ranking) => {
      const link = ranking.link;
      return link.includes(url);
    })
    .map((data) => {
      const { position, link } = data;
      return {
        rank: position,
        keyword: opts.q,
        url: url,
        region: opts.gl,
        projectId: project_id.toString(),
        device: res.data.search_parameters.device,
      };
    });

  if (rankings.length === 0) {
    return {
      rank: 0,
      keyword: opts.q,
      url: url,
      region: opts.gl,
      projectId: project_id.toString(),
      device: 'desktop',
    };
  }

  return rankings[0];
};

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Deprecated code
export const getKeywordRanking = async (accuDomain, startDateTS, endDateTS) => {
  // let url = 'http://app.accuranker.com/api/v4/domains';
  // const date = new Date();
  // const endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  //   2,
  //   '0',
  // )}-${String(date.getDate()).padStart(2, '0')}`; //new Date(+startDateTS).toJSON().split('T')[0];
  // date.setDate(date.getDate() - 2);
  // const startDate = `${date.getFullYear()}-${String(
  //   date.getMonth() + 1,
  // ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; //new Date(+endDateTS).toJSON().split('T')[0];
  // let params = {
  //   fields:
  //     'id,search_type,keyword,ranks.rank,ranks.landing_page.path,search_locale.conutry_code,search_location,search_locale.region,search_locale.locale,search_locale.locale_short,starred,search_engine.name,search_volume.search_volume,search_volume.avg_cost_per_click,search_volume.competition',
  //   period_from: startDate,
  //   period_to: endDate,
  // };
  // const bodySignParams = Object.entries(params)
  //   .map(([key, val]) => key + '=' + val)
  //   .join('&');
  // const { data } = await axios.get(
  //   url + `/${accuDomain}/keywords?` + bodySignParams,
  //   {
  //     headers: {
  //       Authorization: 'Token ' + '0322dbaf8537a8a9855c38cc47756c4be4b533cd',
  //     },
  //   },
  // );
  // return data.map((row) => {
  //   const firstRank = row.ranks.shift();
  //   const lastRank = row.ranks.shift();
  //   let diff = 0;
  //   if (firstRank && lastRank) {
  //     diff = Number(lastRank.rank) - Number(firstRank.rank);
  //   }
  //   return {
  //     keyword: row.keyword,
  //     rank: firstRank.rank,
  //     diff: diff > 0 ? `${diff}` : `${diff}`,
  //     url: firstRank.landing_page?.path,
  //     region: row?.search_locale.region,
  //     device:
  //       row.search_type == 2 ? 'Mobile' : row.search_type == 1 ? 'Desktop' : '',
  //     search_volume: row?.search_volume.search_volume,
  //   };
  // });
};
