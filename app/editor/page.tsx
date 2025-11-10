'use client'

// use {} for named exports and don't use {} for default exports
import { useEffect, useState } from "react"
import BackButton from "../components/backButton";
import AuthButton from "../components/AuthButton";
import Editor from "./components/editor";

export default function editorMain() {

    const [serverError, setServerError] = useState<string | null>(null); // Errors from backend

    return (
        <div>
            <Editor />
        </div>
    );
}