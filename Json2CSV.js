const { Parser } = require("json2csv");

module.exports = function jsonToCSV(data) {
  const fields = ["url", "screenshot"];

  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    return csv;
  } catch (err) {
    console.error(err);
  }
};
