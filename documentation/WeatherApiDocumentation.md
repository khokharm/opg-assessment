# NOAA / National Weather Service (NWS) API Reference

This document explains what each NWS public API endpoint does in plain English.

## 📝 Document updates

**Last updated:** 2026-02-09

---

## 🔔 Alerts

### GET `/alerts`
Returns **all weather alerts**, active and inactive, nationwide.

### GET `/alerts/active`
Returns **only currently active alerts** (warnings, watches, advisories).

### GET `/alerts/active/count`
Returns a **count of active alerts**, broken down by type and severity.

### GET `/alerts/active/zone/{zoneId}`
Returns active alerts for a **specific forecast zone**.

### GET `/alerts/active/area/{area}`
Returns active alerts for a **state or area** (e.g., `CA`, `TX`).

### GET `/alerts/active/region/{region}`
Returns active alerts for a **larger geographic region**.

### GET `/alerts/types`
Lists **all possible alert types**.

### GET `/alerts/{id}`
Returns **detailed information for a single alert**.

---

## ✈️ Aviation Weather

### GET `/aviation/cwsus/{cwsuId}`
Returns information about a **Center Weather Service Unit (CWSU)**.

### GET `/aviation/cwsus/{cwsuId}/cwas`
Returns **Center Weather Advisories (CWAs)** issued by a CWSU.

### GET `/aviation/cwsus/{cwsuId}/cwas/{date}/{sequence}`
Returns a **specific CWA** by date and sequence number.

### GET `/aviation/sigmets`
Returns **all active SIGMETs**.

### GET `/aviation/sigmets/{atsu}`
Returns SIGMETs issued by a **specific ATSU**.

### GET `/aviation/sigmets/{atsu}/{date}`
Returns SIGMETs from a specific ATSU on a **specific date**.

### GET `/aviation/sigmets/{atsu}/{date}/{time}`
Returns a **specific SIGMET issuance**.

---

## 📘 Reference

### GET `/glossary`
Returns definitions for **weather and aviation terms** used by the API.

---

## 🧭 Gridpoints (Forecast Grids)

### GET `/gridpoints/{wfo}/{x},{y}`
Returns **raw forecast grid data** for a point.

### GET `/gridpoints/{wfo}/{x},{y}/forecast`
Returns the **7-day forecast** for the grid point.

### GET `/gridpoints/{wfo}/{x},{y}/forecast/hourly`
Returns the **hourly forecast**.

### GET `/gridpoints/{wfo}/{x},{y}/stations`
Returns **observation stations** associated with the grid point.

---

## 🌡️ Stations & Observations

### GET `/stations`
Returns **all weather observation stations**.

### GET `/stations/{stationId}`
Returns metadata for a **specific station**.

### GET `/stations/{stationId}/observations`
Returns **historical observations**.

### GET `/stations/{stationId}/observations/latest`
Returns the **latest observation**.

### GET `/stations/{stationId}/observations/{time}`
Returns an observation at a **specific timestamp**.

### GET `/stations/{stationId}/tafs`
Returns **Terminal Aerodrome Forecasts (TAFs)**.

### GET `/stations/{stationId}/tafs/{date}/{time}`
Returns a **specific TAF issuance**.

---

## 🏢 NWS Offices

### GET `/offices/{officeId}`
Returns information about a **Weather Forecast Office**.

### GET `/offices/{officeId}/headlines`
Returns **public headlines** issued by the office.

### GET `/offices/{officeId}/headlines/{headlineId}`
Returns a **specific office headline**.

---

## 📍 Points (Latitude / Longitude)

### GET `/points/{latitude},{longitude}`
Returns **metadata for a geographic point**, including forecast office and zones.

### GET `/points/{latitude},{longitude}/radio`
Returns **NOAA Weather Radio** information for the point.

### GET `/points/{latitude},{longitude}/stations`
Returns **nearby observation stations**.

---

## 📡 Radar

### GET `/radar/servers`
Lists **radar data servers**.

### GET `/radar/servers/{id}`
Returns details for a **specific radar server**.

### GET `/radar/stations`
Lists **all radar stations**.

### GET `/radar/stations/{stationId}`
Returns metadata for a **specific radar station**.

### GET `/radar/stations/{stationId}/alarms`
Returns **status and health alarms**.

### GET `/radar/queues/{host}`
Returns **radar processing queue status**.

### GET `/radar/profilers/{stationId}`
Returns **vertical wind profiler data**.

---

## 📻 Radio

### GET `/radio/{callSign}/broadcast`
Returns the **latest NOAA Weather Radio broadcast text**.

---

## 📦 Products (Text Products)

### GET `/products`
Returns **all available NWS text products**.

### GET `/products/{productId}`
Returns a **specific product**.

### GET `/products/types`
Lists **all product types**.

### GET `/products/types/{typeId}`
Returns details for a **specific product type**.

### GET `/products/locations`
Lists **locations that issue products**.

### GET `/products/locations/{locationId}/types`
Returns product types available for a location.

### GET `/products/types/{typeId}/locations`
Returns locations issuing a specific product type.

### GET `/products/types/{typeId}/locations/{locationId}`
Returns products for a **type + location**.

### GET `/products/types/{typeId}/locations/{locationId}/latest`
Returns the **latest product** for that type and location.

---

## 🗺️ Zones

### GET `/zones`
Returns **all forecast and warning zones**.

### GET `/zones/{type}`
Returns zones filtered by **zone type**.

### GET `/zones/{type}/{zoneId}`
Returns metadata for a **specific zone**.

### GET `/zones/{type}/{zoneId}/forecast`
Returns the **zone-level forecast**.

### GET `/zones/forecast/{zoneId}/observations`
Returns **observations affecting the zone**.

### GET `/zones/forecast/{zoneId}/stations`
Returns **stations associated with the zone**.
