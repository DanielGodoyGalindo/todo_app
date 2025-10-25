"use client"

import { useState } from "react";

type WeatherData = {
    summary: string;
    current_temp: number;
    temp_max: number;
    temp_min: number;
    wind_kmh: number;
    icon: "sun" | "rain" | "clouds" | "snow";
    country_code: string;
};

export default function About() {

    const [cityName, setCityName] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<Boolean>(false);

    const handleClick = async () => {
        setLoading(true);
        const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`, { cache: "no-store" });
        const data = await res.json();
        console.log(data);
        setWeather(data);
        setLoading(false);
    }

    const icons: Record<string, string> = {
        sun: "☀️",
        rain: "🌧️",
        clouds: "☁️",
        snow: "❄️",
    };

    return (
        <div>
            <div id="header_input_button" className="flex flex-col max-w-xl mx-auto text-center mt-6">
                <h1 className="text-blue-500 text-5xl mb-6 font-mono">Weather App</h1>
                <p className="mb-6">Enter the city to check today's weather:</p>
                <div id="input_button" className="flex justify-center items-center gap-2">
                    {weather?.country_code && !loading ? (
                    <img
                        src={`https://flagcdn.com/24x18/${weather?.country_code.toLowerCase()}.png`}
                        alt={weather?.country_code}
                        className="inline-block w-6 h-4 rounded-sm"
                    /> ) : ("")}
                    <input type="text" placeholder="Enter city's name..." className="border-2 rounded-md p-1" onChange={e => { setCityName(e.target.value) }} minLength={2} />
                    <button className="bg-blue-500 text-white p-1 w-12 border-blue-800 border-2 rounded-md cursor-pointer" onClick={handleClick}>Go!</button>
                </div>
            </div>
            {
                loading ? (<p className="text-center mt-6">Wait...</p>)
                    : weather ? (
                        <div>
                            <div id="card" className="flex flex-col items-center justify-center">
                                <div className="h-70 w-140 border-blue-500 border-2 bg-fuchsia-50 rounded-xl shadow-xl shadow-blue-200 mt-6 p-2 flex flex-col items-center justify-center">
                                    <div id="icon_currentTemp_temps" className="flex w-auto gap-10 justify-evenly">
                                        <div id="icon_currentTemp" className="flex items-center">
                                            <span className="text-9xl">{icons[weather.icon]}</span>
                                            <span className="text-4xl">{weather.current_temp}°C</span>
                                        </div>
                                        <div id="temps" className="flex flex-col items-center justify-center m-auto text-xl">
                                            <span>🌡️</span>
                                            <span>Max: {weather.temp_max}°C</span>
                                            <span>Min: {weather.temp_min}°C</span>
                                        </div>
                                    </div>
                                    <p id="summary" className="mt-6 ps-6">{weather.summary}</p>
                                </div>
                            </div>
                        </div>
                    ) : (<p className="text-center mt-6">Weather info will appear here!</p>)
            }
        </div >
    )
}
