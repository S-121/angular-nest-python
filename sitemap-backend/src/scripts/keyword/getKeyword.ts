const axios = require('axios');

export const getKeyword = async (index = 0, sheetId) => {
  const {
    data: {
      feed: { entry },
    },
  } = await axios.get(
    `https://spreadsheets.google.com/feeds/worksheets/${sheetId}/public/basic?alt=json`,
  );

  const rs = entry.map((e) => ({
    id: e.id['$t'].split('/').pop(),
    title: e.title['$t'],
  }));
  const keywordId = rs[index].id;

  const {
    data: {
      feed: { entry: _entry },
    },
  } = await axios.get(
    `https://spreadsheets.google.com/feeds/list/${sheetId}/${keywordId}/public/values?alt=json`,
  );

  const all: any[] = _entry.map((e) => {
    return Object.keys(e)
      .slice(6)
      .map((ex) => ({ [ex]: e[ex]['$t'] }))
      .reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});
  });

  //let header = all.shift();
  const final_output = all.map((current) => {
    let out = {};
    for (let i in current) {
      out[String(i).replace('.', '').replace('gsx$', '')] =
        String(current[i]) || null;
    }
    return out;
  });
  final_output.unshift(Object.keys(final_output[0]));

  return final_output;
};
