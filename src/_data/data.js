const { DateTime } = require("luxon");

module.exports = {
  builtAt: DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyy / LL / dd"),
};