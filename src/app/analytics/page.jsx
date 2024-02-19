import React, { useEffect, useState } from 'react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { getDate } from '@/utils';
import { analytics } from '@/utils/analytics';

const AnalyticsPage = () => {
  const [pageviews, setPageviews] = useState([]);
  const [averageVisitorsperDay, setaverageVisitorsperDay] = useState(0);
  const [amtVisitorsToday, setAmtVisitorsToday] = useState(0);
  const [topCountries, setTopCountries] = useState([]);

  const TRACKING_DAYS = 7;

  useEffect(() => {
    const fetchData = async () => {
      const pageviewsData = await analytics.retrieveDays('pageview', TRACKING_DAYS);
      setPageviews(pageviewsData);

      const totalPageviews = pageviewsData.reduce((acc, curr) => {
        return (
          acc +
          curr.events.reduce((acc, curr) => {
            return acc + Object.values(curr)[0];
          }, 0)
        );
      }, 0);
      setaverageVisitorsperDay((totalPageviews / TRACKING_DAYS).toFixed(1));

      const todayPageviews = pageviewsData
        .filter((ev) => ev.date === getDate())
        .reduce((acc, curr) => {
          return (
            acc +
            curr.events.reduce((acc, curr) => acc + Object.values(curr)[0], 0)
          );
        }, 0);
      setAmtVisitorsToday(todayPageviews);

      const topCountriesMap = new Map();
      for (let i = 0; i < pageviewsData.length; i++) {
        const day = pageviewsData[i];
        if (!day) continue;
        for (let j = 0; j < day.events.length; j++) {
          const event = day.events[j];
          if (!event) continue;
          const key = Object.keys(event)[0];
          const value = Object.values(event)[0];
          const parsedKey = JSON.parse(key);
          const country = parsedKey?.country;
          if (country) {
            if (topCountriesMap.has(country)) {
              const prevValue = topCountriesMap.get(country);
              topCountriesMap.set(country, prevValue + value);
            } else {
              topCountriesMap.set(country, value);
            }
          }
        }
      }
      const sortedTopCountries = [...topCountriesMap.entries()].sort(
        (a, b) => b[1] - a[1]
      );
      setTopCountries(sortedTopCountries.slice(0, 5));
    };

    fetchData();
  }, []);

  return (
    <div className='min-h-screen w-full py-12 flex justify-center items-center'>
      <div className='relative w-full max-w-6xl mx-auto text-white'>
        <AnalyticsDashboard
          averageVisitorsperDay={averageVisitorsperDay}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageviews={pageviews}
          topCountries={topCountries}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
