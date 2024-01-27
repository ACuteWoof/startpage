import { Card } from "@/components/ui/card"
import Pins from "../components/pins"

export default function Right({ className }: { className?: string }) {
    return <div className={"px-12 py-24 flex gap-4 " + className}>
        <div className="w-[50%] flex flex-col gap-4">
            <Pins />
            <Card className="h-full w-full p-4 card-deck gap-4" />
        </div>
        <div className="w-[50%] flex flex-col gap-4">
            <Card className="h-full w-full p-4 card-deck gap-4" />
        </div>
    </div>
}