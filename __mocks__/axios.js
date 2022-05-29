function axioMock(url) {
  return { data: { name: url } };
}

module.exports = { get: axioMock };
