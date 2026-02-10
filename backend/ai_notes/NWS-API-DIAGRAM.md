# NWS API Relationship Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: You Have Coordinates                   │
│                    lat = 47.6062, lon = -122.3321                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: GET /points/{lat},{lon}                                │
│  GET https://api.weather.gov/points/47.6062,-122.3321           │
│                                                                  │
│  Purpose: Convert coordinates to NWS grid system                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Returns 3 Important URLs:
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
│  forecast     │   │ forecastHourly │   │ observationStations│
│  URL          │   │ URL            │   │ URL              │
└───────┬───────┘   └────────┬───────┘   └────────┬─────────┘
        │                    │                     │
        │                    │                     │
        ▼                    ▼                     ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
│  STEP 2A:     │   │  STEP 2B:      │   │  STEP 3A:        │
│  GET forecast │   │  GET hourly    │   │  GET stations    │
│               │   │  forecast      │   │  list            │
│  7-day        │   │                │   │                  │
│  forecast     │   │  Hour by hour  │   │  Get station IDs │
│  (14 periods) │   │  (156 hours)   │   │                  │
└───────────────┘   └────────────────┘   └────────┬─────────┘
                                                   │
                                                   │ Returns station ID
                                                   │ (e.g., "KSEA")
                                                   ▼
                                          ┌──────────────────┐
                                          │  STEP 3B:        │
                                          │  GET latest      │
                                          │  observation     │
                                          │                  │
                                          │  Current weather │
                                          │  Temperature     │
                                          │  Humidity, etc.  │
                                          └──────────────────┘
```

---

## Step-by-Step Breakdown

### STEP 1: Points Endpoint (The Starting Point)
**Input:** Latitude and Longitude
**Endpoint:** `GET /points/{lat},{lon}`
**Example:** `GET https://api.weather.gov/points/47.6062,-122.3321`

**What it returns:**
```json
{
  "properties": {
    "gridId": "SEW",
    "gridX": 124,
    "gridY": 67,
    "forecast": "https://api.weather.gov/gridpoints/SEW/124,67/forecast",
    "forecastHourly": "https://api.weather.gov/gridpoints/SEW/124,67/forecast/hourly",
    "observationStations": "https://api.weather.gov/gridpoints/SEW/124,67/stations"
  }
}
```

**Purpose:** Converts your coordinates into the NWS grid system and provides URLs for all other data

---

### STEP 2A: Forecast Endpoint (7-Day Forecast)
**Input:** Forecast URL from Step 1
**Endpoint:** `GET /gridpoints/{office}/{gridX},{gridY}/forecast`
**Example:** `GET https://api.weather.gov/gridpoints/SEW/124,67/forecast`

**What it returns:**
- 14 periods (7 days × 2 periods per day)
- Day and night forecasts
- Temperature in Fahrenheit
- Short and detailed forecasts
- Weather icons

**Example Period:**
```json
{
  "name": "This Afternoon",
  "temperature": 52,
  "temperatureUnit": "F",
  "windSpeed": "5 to 10 mph",
  "shortForecast": "Mostly Sunny",
  "detailedForecast": "Mostly sunny, with a high near 52."
}
```

---

### STEP 2B: Hourly Forecast (Optional)
**Input:** Hourly forecast URL from Step 1
**Endpoint:** `GET /gridpoints/{office}/{gridX},{gridY}/forecast/hourly`
**Example:** `GET https://api.weather.gov/gridpoints/SEW/124,67/forecast/hourly`

**What it returns:**
- 156+ hours of hourly forecasts
- Hour-by-hour predictions
- Same format as regular forecast but more granular

---

### STEP 3A: Observation Stations
**Input:** Observation stations URL from Step 1
**Endpoint:** `GET /gridpoints/{office}/{gridX},{gridY}/stations`
**Example:** `GET https://api.weather.gov/gridpoints/SEW/124,67/stations`

**What it returns:**
```json
{
  "features": [
    {
      "properties": {
        "stationIdentifier": "KSEA",
        "name": "Seattle-Tacoma International Airport"
      }
    },
    {
      "properties": {
        "stationIdentifier": "KBFI",
        "name": "Boeing Field"
      }
    }
  ]
}
```

**Purpose:** Lists nearby weather stations that provide current observations

---

### STEP 3B: Current Observations
**Input:** Station ID from Step 3A
**Endpoint:** `GET /stations/{stationId}/observations/latest`
**Example:** `GET https://api.weather.gov/stations/KSEA/observations/latest`

**What it returns:**
```json
{
  "properties": {
    "timestamp": "2024-02-09T14:53:00+00:00",
    "textDescription": "Partly Cloudy",
    "temperature": { "value": 11.1, "unitCode": "wmoUnit:degC" },
    "relativeHumidity": { "value": 75.5 },
    "windSpeed": { "value": 16.2, "unitCode": "wmoUnit:km_h" },
    "windDirection": { "value": 180 },
    "barometricPressure": { "value": 101800 },
    "visibility": { "value": 16000 }
  }
}
```

**Note:** Current observations use metric units (Celsius, km/h, meters)

---

## Key Relationships

### Parent-Child Hierarchy
```
Points (/points/{lat},{lon})
  ├─→ Forecast (/gridpoints/SEW/124,67/forecast)
  ├─→ Hourly Forecast (/gridpoints/SEW/124,67/forecast/hourly)
  └─→ Stations (/gridpoints/SEW/124,67/stations)
      └─→ Latest Observation (/stations/KSEA/observations/latest)
```

### Dependency Chain
```
Coordinates → Points → Grid Info → Forecast URLs
                                 → Station URLs → Station IDs → Observations
```

### Data Flow
```
YOU PROVIDE:
  lat, lon

STEP 1 GIVES YOU:
  gridId, gridX, gridY
  3 URLs (forecast, hourly, stations)

STEP 2 GIVES YOU:
  Future weather predictions

STEP 3 GIVES YOU:
  Current weather measurements
```

---

## Important Notes

### You Cannot Skip Steps
- ❌ **Cannot** get forecast without grid coordinates
- ❌ **Cannot** get observations without station ID
- ✅ **Must** start with Points endpoint

### URLs are Dynamic
The Points endpoint returns full URLs - don't hardcode them!

```javascript
// ❌ Bad - hardcoded
const forecast = await fetch('https://api.weather.gov/gridpoints/SEW/124,67/forecast');

// ✅ Good - use URL from Points response
const pointsData = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
const forecastUrl = pointsData.properties.forecast;
const forecast = await fetch(forecastUrl);
```

### Grid Coordinates are Stable
Once you know coordinates map to a grid, it doesn't change:
- `47.6062,-122.3321` will always be `SEW/124,67`
- You can cache this mapping

### Multiple Data Types, Same Grid
All data types use the same grid:
- Forecast: `SEW/124,67`
- Hourly: `SEW/124,67`
- Stations: `SEW/124,67`

---

## Real World Example

### For Seattle (47.6062, -122.3321):

**Call 1:** Points
```
GET https://api.weather.gov/points/47.6062,-122.3321
```

**Call 2:** Forecast (using URL from Call 1)
```
GET https://api.weather.gov/gridpoints/SEW/124,67/forecast
```

**Call 3:** Stations (using URL from Call 1)
```
GET https://api.weather.gov/gridpoints/SEW/124,67/stations
```

**Call 4:** Latest Observation (using station ID from Call 3)
```
GET https://api.weather.gov/stations/KSEA/observations/latest
```

**Result:** You now have complete weather data!
- ✅ 7-day forecast
- ✅ Current conditions
- ✅ All from 4 API calls

---

## How Our Backend Handles This

In `src/services/nws.service.ts`, all these steps are automated:

```typescript
async getWeatherData(location: Location) {
  // STEP 1: Get grid and URLs
  const pointsData = await this.getPoints(lat, lon);
  
  // STEP 2: Get forecast using URL from Step 1
  const forecast = await this.getForecast(pointsData.properties.forecast);
  
  // STEP 3A: Get stations using URL from Step 1
  const stations = await this.getObservationStations(
    pointsData.properties.observationStations
  );
  
  // STEP 3B: Get observation using station ID from Step 3A
  const stationId = stations.features[0].properties.stationIdentifier;
  const current = await this.getCurrentObservation(stationId);
  
  // Combine and return
  return { location, current, forecast };
}
```

You just call:
```typescript
const weather = await nwsService.getWeatherData(location);
```

And it handles all the steps automatically! 🎉

---

## Summary

The NWS API uses a **hierarchical relationship model**:

1. **Points** is the master endpoint
2. It returns URLs for specific data types
3. Each data type endpoint provides specialized information
4. All endpoints reference the same grid system

This design allows:
- ✅ Efficient data organization
- ✅ Consistent grid-based forecasts
- ✅ Separation of forecast vs observation data
- ✅ Scalability across the entire US

**Remember:** Always start with `/points/{lat},{lon}` - it's your gateway to everything else!
