const axios = require('axios');
export const accurankerDomains = async () => {
  let url = 'http://app.accuranker.com/api/v4/domains';
  let params = {
    fields: 'id,domain.group.account.name',
  };
  let bodySignParams = Object.entries(params)
    .map(([key, val]) => key + '=' + val)
    .join('&');
  let { data } = await axios.get(url + '?' + bodySignParams, {
    headers: {
      Authorization: 'Token ' + '0322dbaf8537a8a9855c38cc47756c4be4b533cd',
    },
  });
  return data ? data : [];
};
