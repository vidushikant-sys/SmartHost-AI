import { useEffect, useState } from "react";

// ==========================================================
// DateWeatherCard
// Replaces the plain "header-date" pill with a richer widget:
//   - Live day / date / time (updates every 30s, no API needed)
//   - Real temperature + condition for the admin's current
//     location, using the browser's Geolocation API
//   - Open-Meteo for weather (free, keyless, CORS-enabled)
//   - BigDataCloud for reverse geocoding city name (free, keyless)
//
// Fails gracefully: if location is denied/unavailable or a
// request fails, we simply fall back to showing date/time only
// (matches "header-date" old behaviour) instead of breaking.
// ==========================================================

const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mostly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Foggy", icon: "fog" },
  48: { label: "Foggy", icon: "fog" },
  51: { label: "Light drizzle", icon: "rain" },
  53: { label: "Drizzle", icon: "rain" },
  55: { label: "Heavy drizzle", icon: "rain" },
  61: { label: "Light rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  71: { label: "Light snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy snow", icon: "snow" },
  80: { label: "Rain showers", icon: "rain" },
  81: { label: "Rain showers", icon: "rain" },
  82: { label: "Violent showers", icon: "rain" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm", icon: "storm" },
  99: { label: "Thunderstorm", icon: "storm" },
};

function WeatherIcon({ type }) {
  const common = { viewBox: "0 0 24 24", width: 30, height: 30, fill: "none" };
  switch (type) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 1.5v2.5M12 20v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M1.5 12h2.5M20 12h2.5M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
          </g>
        </svg>
      );
    case "cloud-sun":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3.6" fill="currentColor" opacity="0.9" />
          <path d="M4.5 20a4.3 4.3 0 0 1-.6-8.55A5.5 5.5 0 0 1 14.3 9.9 4.7 4.7 0 0 1 19 14.5 4.7 4.7 0 0 1 14.3 20H4.5z"
            fill="currentColor" opacity="0.55" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M6 19a4.5 4.5 0 0 1-.7-8.94A5.75 5.75 0 0 1 16.3 8.3 4.9 4.9 0 0 1 21 13.1 4.9 4.9 0 0 1 16.1 19H6z"
            fill="currentColor" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M6 15a4.5 4.5 0 0 1-.7-8.94A5.75 5.75 0 0 1 16.3 4.3 4.9 4.9 0 0 1 21 9.1 4.9 4.9 0 0 1 16.1 15H6z"
            fill="currentColor" opacity="0.75" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 19h16M6 22h12" />
          </g>
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M6 13a4.5 4.5 0 0 1-.7-8.94A5.75 5.75 0 0 1 16.3 2.3 4.9 4.9 0 0 1 21 7.1 4.9 4.9 0 0 1 16.1 13H6z"
            fill="currentColor" opacity="0.85" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M8 16.5 6.5 20M13 16.5 11.5 20M18 16.5 16.5 20" />
          </g>
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M6 13a4.5 4.5 0 0 1-.7-8.94A5.75 5.75 0 0 1 16.3 2.3 4.9 4.9 0 0 1 21 7.1 4.9 4.9 0 0 1 16.1 13H6z"
            fill="currentColor" opacity="0.85" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M8 17v4M6 19h4M16 17v4M14 19h4" />
          </g>
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M6 12a4.5 4.5 0 0 1-.7-8.94A5.75 5.75 0 0 1 16.3 1.3 4.9 4.9 0 0 1 21 6.1 4.9 4.9 0 0 1 16.1 12H6z"
            fill="currentColor" opacity="0.85" />
          <path d="M13 13l-3.5 5H12l-1.5 4L15 17h-2.5L13 13z" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="5" fill="currentColor" />
        </svg>
      );
  }
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function DateWeatherCard() {
  const now = useClock();
  const [weather, setWeather] = useState(null); // { temp, code, city }
  const [status, setStatus] = useState("loading"); // loading | ready | denied | error

  useEffect(() => {
    let cancelled = false;

    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            ),
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            ),
          ]);

          const weatherData = await weatherRes.json();
          const geoData = await geoRes.json().catch(() => null);

          if (cancelled) return;

          const cw = weatherData?.current_weather;
          const city =
            geoData?.city ||
            geoData?.locality ||
            geoData?.principalSubdivision ||
            geoData?.countryName ||
            null;

          if (!cw) {
            setStatus("error");
            return;
          }

          setWeather({
            temp: Math.round(cw.temperature),
            code: cw.weathercode,
            city,
          });
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
        }
      },
      () => {
        if (!cancelled) setStatus("denied");
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const dayName = now.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const condition = weather ? WEATHER_CODES[weather.code] || WEATHER_CODES[0] : null;

  return (
    <div className="date-weather-card">
      <div className="dwc-weather">
        {status === "ready" && weather ? (
          <>
            <div className="dwc-icon">
              <WeatherIcon type={condition.icon} />
            </div>
            <div className="dwc-temp-block">
              <div className="dwc-temp">{weather.temp}°C</div>
              <div className="dwc-condition">{condition.label}</div>
            </div>
          </>
        ) : status === "loading" ? (
          <div className="dwc-icon dwc-icon--pulse">
            <WeatherIcon type="sun" />
          </div>
        ) : (
          <div className="dwc-icon dwc-icon--muted">
            <WeatherIcon type="cloud" />
          </div>
        )}
      </div>

      <div className="dwc-divider" />

      <div className="dwc-info">
        <div className="dwc-day">{dayName}</div>
        <div className="dwc-date-row">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {dateStr} &middot; {timeStr}
        </div>
        {status === "ready" && weather?.city && (
          <div className="dwc-location">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
              <path
                d="M12 22s7-6.1 7-12A7 7 0 0 0 5 10c0 5.9 7 12 7 12z"
                stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {weather.city}
          </div>
        )}
        {status === "denied" && (
          <div className="dwc-location dwc-location--muted">
            Enable location for local weather
          </div>
        )}
      </div>
    </div>
  );
}

export default DateWeatherCard;