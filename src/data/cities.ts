import type { City } from "../types/skyViewer";

export const CITIES: City[] = [
  { id: "delhi", name: "New Delhi", country: "India", lat: 28.6139, lon: 77.209, group: "India" },
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, group: "India" },
  { id: "bengaluru", name: "Bengaluru", country: "India", lat: 12.9716, lon: 77.5946, group: "India" },
  { id: "chennai", name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, group: "India" },
  { id: "kolkata", name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, group: "India" },
  { id: "varanasi", name: "Varanasi", country: "India", lat: 25.3176, lon: 82.9739, group: "India" },
  { id: "new-york", name: "New York", country: "USA", lat: 40.7128, lon: -74.006, group: "US" },
  { id: "san-francisco", name: "San Francisco", country: "USA", lat: 37.7749, lon: -122.4194, group: "US" },
  { id: "chicago", name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298, group: "US" },
  { id: "london", name: "London", country: "UK", lat: 51.5074, lon: -0.1278, group: "Europe" },
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, group: "Europe" },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, group: "Australia" },
  { id: "melbourne", name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, group: "Australia" },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, group: "Asia" },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, group: "Asia" },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, group: "Asia" },
];

export const DEFAULT_CITY_ID = "delhi";
