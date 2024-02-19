const { format, subDays } = require('date-fns');

const getDate = (sub = 0) => {
  const dateXDaysAgo = subDays(new Date(), sub);
  return format(dateXDaysAgo, 'dd/MM/yyyy');
};

module.exports = { getDate };
0