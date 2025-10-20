"use client";

import { useRouter } from 'next/navigation';

// Receives the task ID and a callback from the parent component to handle post-deletion updates
export default function DeleteTaskButton({ taskIdToDelete, onDeleted }: { taskIdToDelete: string, onDeleted: (id: string) => void }) {

    const router = useRouter();

    async function handleClick() {
        try {
            const res = await fetch(`/api/todo?id=${taskIdToDelete}`, { method: 'DELETE' }); // Pass task ID in the URL query for retrieval in the API route
            if (!res.ok) {
                throw new Error("Error deleting task");
            }
            onDeleted(taskIdToDelete); // Trigger the parent's callback with the deleted task ID so the list can be updated accordingly
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className="flex-1 rounded-md px-4 py-2 hover:bg-red-100
                         hover:text-white transition-all duration-300 cursor-pointer h-10">
                ❌
            </button>
        </div>
    );
}
