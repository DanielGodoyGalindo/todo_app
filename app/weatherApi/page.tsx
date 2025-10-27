"use client"

import { useState } from "react";

interface ForecastDay {
    day: string;
    temperature: string;
    wind: string;
}

interface WeatherData {
    description: string;
    temperature: string;
    wind: string;
    forecast: ForecastDay[];
}

export default function WeatherApi() {

    const [cityName, setCityName] = useState<string>("");
    const [fetchedCity, setFetchedCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleClick() {
        if (!cityName)
            return;
        setLoading(true);
        setError("");
        setWeatherData(null);
        setFetchedCity(cityName);
        try {
            // https://github.com/robertoduessmann/weather-api
            const res = await fetch(`https://goweather.xyz/weather/${cityName}`);
            if (!res.ok)
                throw new Error("Error when getting data.");
            const data = await res.json();
            setWeatherData(data);
        } catch (err) {
            setError("Failed to fetch weather data. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="p-6">
            <h1 className="text-center mb-6 text-emerald-600 text-4xl">Weather App</h1>
            <div id="input_button" className="flex gap-2 mb-6 justify-center">
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 w-60"
                    type="text" placeholder="Escribe una ciudad..." value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                />
                <button
                    className="border bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer"
                    onClick={handleClick}
                >Get Weather!
                </button>
            </div>

            {/* Loading and error messages */}
            {loading && (
                <p className="text-center text-gray-800 animate-pulse">Loading weather...</p>
            )}
            {error && (
                <p className="text-center text-red-500 font-medium">{error}</p>
            )}

            {/* Weather data */}
            {weatherData && !loading && !error && (
                <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-md">
                    {/* Description */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                            Weather in {fetchedCity}
                        </h2>
                        <p className="text-gray-600 capitalize">
                            {weatherData.description}
                        </p>
                        {/* Temperature and wind */}
                        <div className="flex justify-center items-center gap-4 mt-3">
                            <span className="text-4xl font-bold text-blue-700">
                                {weatherData.temperature}
                            </span>
                            <span className="text-gray-600">💨 {weatherData.wind}</span>
                        </div>
                    </div>

                    {/* Forecast */}
                    {Array.isArray(weatherData.forecast) && weatherData.forecast.length > 0 && (
                        <div className="bg-white rounded-xl p-4 shadow-inner mt-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Next days</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-center border-collapse">
                                    <thead>
                                        <tr className="bg-blue-600">
                                            <th className="py-2 px-4 text-white font-bold border-b">Day</th>
                                            <th className="py-2 px-4 text-white font-bold border-b">Temperature</th>
                                            <th className="py-2 px-4 text-white font-bold border-b">Wind</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weatherData.forecast.map((day, index) => (
                                            <tr key={index} className="hover:bg-blue-100 transition-colors">
                                                <td className="py-2 px-4 font-medium text-gray-700 border-b">
                                                    {day.day === "1" ? "Tomorrow" : day.day === "2" ? "Tomorrow +1" : "Tomorrow +2"}
                                                </td>
                                                <td className="py-2 px-4 text-blue-700 font-semibold border-b">{day.temperature}</td>
                                                <td className="py-2 px-4 text-gray-600 border-b">💨 {day.wind}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <p className="text-center mt-6">Made thanks to <a href="https://github.com/robertoduessmann/weather-api" className="underline">weather-api</a> by robertoduessmann</p>
        </div>
    );
}