import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IBM_Plex_Serif } from "next/font/google"
import { useState, useEffect } from "react";

const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: "400" })

export default function Notes({ className }: { className?: string }) {
    const [notes, setNotes] = useState<string>("")
    const [notesLoadedFromStorage, setNotesLoadedFromStorage] = useState<boolean>(false)

    useEffect(() => {
        const localNotes = localStorage.getItem("notes")
        if (localNotes) {
            setNotes(JSON.parse(localNotes))
        }
        setNotesLoadedFromStorage(true)
    }, [])

    useEffect(() => {
        if (!notesLoadedFromStorage) return;
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes, notesLoadedFromStorage])

    return <Card className={`h-full w-full p-4 flex flex-col ${className} ${ibmPlexSerif.className}`}>
        <CardHeader> <div className="flex flex-row justify-between items-center">
            <CardTitle>
                Notes
            </CardTitle>
            <Button variant="destructive" size="sm" onClick={() => setNotes("")}>
                Clear
            </Button>
        </div>
            <hr />
        </CardHeader>

        <CardContent className="overflow-y-scroll h-full">
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write something here."
                className={
                    "flex h-full w-full rounded-md border-none bg-transparent text-sm shadow-sm resize-none                    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none disabled:cursor-not-allowed"
                }></textarea>
        </CardContent>
    </Card>
}
