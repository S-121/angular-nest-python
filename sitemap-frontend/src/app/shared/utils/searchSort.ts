export const searchSort = function (state) {
  const output = { sort: {}, filters: { $and: [{}] } };
  const { sort, filters } = state;
  if (sort) {
    const { by, reverse } = sort;
    output.sort = { [by]: reverse ? -1 : 1 };
  }
  if (filters) {
    output.filters = { $and: [] };
    for (let filter of filters) {
      let { property, value } = <{ property: string; value: string }>filter;
      if (isNaN(Number(value))) {
        output.filters.$and.push({
          $or: [
            {
              [property]: {
                $regex: `.*${String(value).replace(
                  /[-[\]{}()*+?.,\\^$|#\s]/g,
                  '\\$&'
                )}.*`,
                $options: 'i',
              },
            },
          ],
        });
      } else {
        output.filters.$and.push({
          $or: [
            { [property]: Number(value) },
            { [property]: String(value) },
            { [property]: { $regex: `.*${String(value)}.*`, $options: 'i' } },
          ],
        });
      }
    }
  }
  return JSON.stringify(output);
};
