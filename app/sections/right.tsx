import { Card } from "@/components/ui/card"
import Pins from "../components/pins"
import Notes from "../components/notes"
import { getCurrentSong } from "../actions/spotify"
import Music from "../components/music"

export default function Right({ className }: { className?: string }) {
    return <div className={"px-12 py-24 flex gap-4 " + className}>
        <div className="w-[50%] flex flex-col gap-4">
            <Pins />
            <Notes />
        </div>
        <div className="w-[50%] flex flex-col gap-4">
            <Music />
        </div>
    </div>
}