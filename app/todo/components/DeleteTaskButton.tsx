"use client";

import { useRouter } from 'next/navigation';

export default function DeleteTaskButton({ taskIdToDelete }: { taskIdToDelete: string }) {

    const router = useRouter();

    async function handleClick() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todo`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: taskIdToDelete })
                }
            );
            if (!res.ok) {
                throw new Error("Error deleting task");
            }
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className="border p-1">
                Delete 🗑️
            </button>
        </div>
    );
}
