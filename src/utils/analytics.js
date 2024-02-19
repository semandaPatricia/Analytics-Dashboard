const { redis } = require('@/lib/redis');
const { getDate } = require('@/utils');
const { parse } = require('date-fns');

//The Analytics class is defined with a constructor that optionally takes an object opts as an argument. 
class Analytics {
  constructor(opts) {
    this.retention = 60 * 60 * 24 * 7;
    if (opts && opts.retention) this.retention = opts.retention;
  }
/* METHOD1:track(namespace, event = {}, opts) */
  async track(namespace, event = {}, opts) {
    let key = `analytics::${namespace}`;

    if (!opts || !opts.persist) {
      key += `::${getDate()}`;
    }

    // db call to persist this event
    await redis.hincrby(key, JSON.stringify(event), 1);
    if (!opts || !opts.persist) await redis.expire(key, this.retention);
  }
/* METHOD2:retrieveDays(namespace, nDays) */
  async retrieveDays(namespace, nDays) {
    const promises = [];

    for (let i = 0; i < nDays; i++) {
      const formattedDate = getDate(i);
      const promise = this.retrieve(namespace, formattedDate);
      promises.push(promise);
    }

    const fetched = await Promise.all(promises);

    const data = fetched.sort((a, b) => {
      if (parse(a.date, 'dd/MM/yyyy', new Date()) > parse(b.date, 'dd/MM/yyyy', new Date())) {
        return 1;
      } else {
        return -1;
      }
    });

    return data;
  }
/* METHOD3: retrieve(namespace, date)*/
  async retrieve(namespace, date) {
    const res = await redis.hgetall(`analytics::${namespace}::${date}`);

    return {
      date,
      events: Object.entries(res || {}).map(([key, value]) => ({
        [key]: Number(value),
      })),
    };
  }
}

const analytics = new Analytics();

module.exports = { Analytics, analytics };
