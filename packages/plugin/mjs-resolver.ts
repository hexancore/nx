
const mjsResolver = (path, options) => {
  const resolver = options.defaultResolver;
  const mjsExtRegex = /\.mjs$/i;
  if (mjsExtRegex.test(path)) {
    try {
      return resolver(path.replace(mjsExtRegex, '.mts'), options);
    } catch {
      // use default resolver
    }
  }

  return resolver(path, options);
};

module.exports = mjsResolver;