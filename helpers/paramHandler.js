module.exports = {
  filterParams(params, whileList) {
  const filtered = {};
  for (const key in params) {
    if (whileList.indexOf(key) > -1) {
      filtered[key] = params[key];
    }
  }
  return filtered;
  }
};