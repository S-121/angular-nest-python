export const dateUtil = function (timestamp) {
  let date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}/${date.getFullYear()}`;
};
