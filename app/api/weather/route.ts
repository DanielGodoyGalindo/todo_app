import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url); // Get url
    const city = searchParams.get("city"); // Get city from url
    if (!city) {
        return NextResponse.json({ error: "Parameter 'city' is mandatory." }, { status: 400 });
    }
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `
    Tell me what the weather will be like today in the city of ${city}.
    Return only valid JSON (do not use markdown) with the following fields:
    {
        "summary": "concise text describing the weather",
        "current_temp": number in degrees Celsius,
        "temp_max": number in degrees Celsius,
        "temp_min": number in degrees Celsius,
        "wind_kmh": number in km/h,
        "icon": "sun" | "rain" | "clouds" | "snow"
    }`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    if (typeof (response.text) === "string") {
        return NextResponse.json(JSON.parse(response.text));
    } else {
        return NextResponse.json({ error: "Invalid response from server", status: 500 });
    }

}