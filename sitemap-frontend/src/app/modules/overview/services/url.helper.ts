interface FiltersObject {
  [key: string]: Array<{ name: string; value: string }>;
}

export class UrlHelper {
  static buildQuery(filters: FiltersObject) {
    let query = [];
    let index = 0;
    for (let key in filters) {
      filters[key].forEach((item) => {
        if (item.value) {
          query.push(`filter[${index}][${item.name}]=${item.value}`);
        }
      });
      index++;
    }
    return query.join('&');
  }
}
