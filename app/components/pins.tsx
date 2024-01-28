import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
    Dialog,
    DialogHeader,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { GlobeIcon, PlusIcon } from "@radix-ui/react-icons"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Pins() {
    const [pins, setPins] = useState<{ name: string, site: string }[]>([])
    const [input, setInput] = useState<{ name: string, site: string }>({ name: "", site: "" })
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const localStoragePins = localStorage.getItem("pins")
        const parsedPins = localStoragePins ? JSON.parse(localStoragePins) : []
        setPins(parsedPins)
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (!loaded) return;
        const localStoragePins = localStorage.getItem("pins")
        const parsedPins = localStoragePins ? JSON.parse(localStoragePins) : []
        if (parsedPins === pins) return
        localStorage.setItem("pins", JSON.stringify(pins))
    }, [pins, loaded])

    return (<Card className="min-h-[250px] h-max w-full p-4 card-deck gap-4">
        {
            pins.map((pin, i) => {
                return <Pin key={i} id={i} name={pin.name} site={pin.site} setPins={setPins} pins={pins} />
            })
        }
        {
            pins && pins.length < 8 &&
            <Dialog>
                <DialogTrigger>
                    <Card className="w-[100px] h-[100px] p-6 hover:bg-muted cursor-pointer transition-all duration-150 ease-in-out" >
                        <PlusIcon className="h-full w-full text-muted-foreground" />
                    </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Pin a webpage</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input id="name" value={input.name}
                                className="col-span-3" onChange={
                                    (e) => setInput({ ...input, name: e.target.value })
                                } />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link
                            </Label>
                            <Input id="link" value={input.site} className="col-span-3"
                                onChange={
                                    (e) => setInput({ ...input, site: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit"
                                onClick={
                                    () => {
                                        if (input.name.length === 0 || input.site.length === 0) return;
                                        setPins([...pins, input])
                                        setInput({ name: "", site: "" })
                                    }
                                }
                            >Pin</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        }
    </Card>)
}

function Pin({ className, name, site, id, setPins, pins }: {
    className?: string,
    name: string,
    site: string,
    id: number,
    setPins: Dispatch<SetStateAction<{ name: string, site: string }[]>>
    pins: { name: string, site: string }[]
}) {
    const [err, setErr] = useState<boolean>(false);

    if (!name || !site) return null
    if (!site.startsWith("https://")) { site = "https://" + site }
    const domain = new URL(site).hostname

    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger><ContextMenu>
                <ContextMenuTrigger>
                    <Card className={"w-[100px] h-[100px] p-2 hover:bg-muted cursor-pointer transition-all duration-150 ease-in-out flex flex-col " + className} onClick={
                        () => {
                            window.open(site, "_blank")
                        }
                    }>
                        <div className="flex-grow h-[75px] flex justify-center items-center">
                            {err ? <GlobeIcon className="h-[50px] w-[50px] text-muted-foreground"
                            /> : <Image src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt={name} width={50} height={50}
                                onError={
                                    () => setErr(true)
                                }
                            />
                            }</div>
                        <div>
                            <div className="text-muted-foreground text-center text-sm">{name}</div>
                        </div>
                    </Card></ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem className="text-muted-foreground"
                        onClick={
                            () => {
                                const newPins = [...pins]
                                newPins.splice(id, 1)
                                setPins(newPins)
                            }
                        }
                    >
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu></TooltipTrigger>
            <TooltipContent>
                {site.replaceAll("https://", "").replaceAll("http://", "")}
            </TooltipContent></Tooltip></TooltipProvider>
}