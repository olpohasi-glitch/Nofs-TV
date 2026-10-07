import { useState, useEffect } from 'react';
import { toBengaliNumber } from './bengali';

export interface SylhetWeather {
  temperatureText: string;
  conditionText: string;
  tempValue: number | null;
  loading: boolean;
}

export function useSylhetWeather(): SylhetWeather {
  const [weather, setWeather] = useState<SylhetWeather>({
    temperatureText: '২৮°C',
    conditionText: 'রৌদ্রোজ্জ্বল',
    tempValue: 28,
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      try {
        // Sylhet, Bangladesh coordinates: 24.8949 N, 91.8687 E
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=24.8949&longitude=91.8687&current_weather=true'
        );
        if (!res.ok) throw new Error('Weather API response not ok');
        const data = await res.json();

        if (isMounted && data?.current_weather) {
          const rawTemp = Math.round(data.current_weather.temperature);
          const wCode = data.current_weather.weathercode;

          let condition = 'পরিষ্কার';
          if (wCode === 0) condition = 'রৌদ্রোজ্জ্বল';
          else if (wCode >= 1 && wCode <= 3) condition = 'আংশিক মেঘলা';
          else if (wCode >= 51 && wCode <= 67) condition = 'বৃষ্টি';
          else if (wCode >= 80 && wCode <= 82) condition = 'ঝরনা বৃষ্টি';
          else if (wCode >= 95) condition = 'বজ্রবৃষ্টি';

          setWeather({
            temperatureText: `${toBengaliNumber(rawTemp)}°C`,
            conditionText: condition,
            tempValue: rawTemp,
            loading: false
          });
        }
      } catch (err) {
        // Graceful fallback to seasonal average without breaking UI
        if (isMounted) {
          setWeather({
            temperatureText: `${toBengaliNumber(28)}°C`,
            conditionText: 'আংশিক মেঘলা',
            tempValue: 28,
            loading: false
          });
        }
      }
    }

    fetchWeather();

    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return weather;
}
