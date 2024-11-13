export async function pagination(sortKey, sortValue) {
  let sortQuery = {};

  if (sortKey && sortValue) {
    if (sortValue == 'asc' || sortValue == 'desc') {
      sortQuery[sortKey] = sortValue == 'desc' ? 'DESC' : 'ASC';
      return sortQuery;
    }
  } else {
    sortQuery = { createdAt: 'DESC' };
    return sortKey;
  }
}
