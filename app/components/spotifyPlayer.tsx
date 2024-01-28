import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DesktopIcon, GlobeIcon, MobileIcon, PauseIcon, PlayIcon, TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { actionOnSong, getCurrentSong, getDevices, getQueue, transferPlayback } from "../actions/spotify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem } from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const WebPlayback = ({ token }: { token: string }) => {
    const [is_paused, setPaused] = useState<boolean>(false);
    const [is_active, setActive] = useState<boolean>(false);
    const [_player, setPlayer] = useState(null);
    const [current_track, setTrack] = useState(null);

    const [queue, setQueue] = useState([])
    const [devices, setDevices] = useState([])

    // get devices
    useEffect(() => {
        updateDevices()
    }, [])

    const updateDevices = () => {
        getDevices().then((res) => {
            setDevices(res.devices)
        })
    }

    // get queue
    useEffect(() => {
        updateQueue()
    }, [current_track])

    const updateQueue = () => {
        getQueue().then((res) => {
            setQueue(res.queue)
        })
    }

    // web playback sdk
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(token);
                },
                volume: 0.5,
            });

            setPlayer(player);

            player.addListener("initialization_error", ({ message }: { message: string }) => {
                console.error(message);
            })

            player.addListener("player_state_changed", (state: { track_window: { current_track: any; }; paused: boolean | ((prevState: boolean) => boolean); }) => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then((state: any) => {
                    if (!state) {
                        setActive(false);
                    } else {
                        setActive(true);
                    }
                });
            });

            player.connect();
        };
    }, [token]);

    // connect update track
    useEffect(() => {
        if (is_active || current_track) return
        updateCurrentTrack()
    }, [is_active, current_track])

    // 5 second polling
    useEffect(() => {
        if (is_active) return;
        const interval = setInterval(() => {
            updateCurrentTrack();
        }, 5000);
        return () => clearInterval(interval);
    }, [is_active]);

    const updateCurrentTrack = () => {
        getCurrentSong().then((res) => {
            setTrack(res.item);
            setPaused(!res.is_playing);
        })
    }

    return (
        <Tabs className="container main-wrapper !p-0 h-[calc(100%-86px)]" defaultValue="now-playing">
            <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
                {/* <TabsTrigger value="lyrics">Lyrics</TabsTrigger> */}
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="devices" onClick={
                    () => {
                        updateDevices()
                    }
                }>Devices</TabsTrigger>
            </TabsList>
            <TabsContent value="now-playing" className="h-[calc(100%-36px)]">
                <Card className="w-full flex flex-col items-center p-4 ">
                    <div className="p-0 flex flex-row gap-4">

                        <Image
                            src={current_track && current_track.album.images[0].url ? current_track.album.images[0].url : "https://picsum.photos/200/200"}
                            className="now-playing__cover rounded-lg "
                            alt=""
                            height={200}
                            width={200}
                        />

                        <div className="now-playing__side flex flex-col w-full items-center gap-4 justify-around">
                            <div className="w-[200px] flex flex-col gap-2">
                                <div
                                    className="now-playing__name w-full font-semibold leading-none tracking-tight">
                                    {current_track?.name ? current_track.name : "Play a track to see details."}
                                </div>
                                <div className="now-playing__artist w-full text-sm text-muted-foreground">
                                    {current_track?.artists ?
                                        current_track.artists.map((artist: Spotify.Artist, i: number) => {
                                            return <span key={i}>{artist.name}{i !== current_track.artists.length - 1 ? ", " : ""}</span>
                                        })
                                        : "Play a track to see details."}
                                </div>
                            </div>

                            <div className="flex justify-around gap-2">
                                <Button
                                    variant="ghost"
                                    className="btn-spotify"
                                    onClick={() => {
                                        actionOnSong("previous", "POST")
                                        updateCurrentTrack();
                                    }}
                                    size="icon"
                                >
                                    <TrackPreviousIcon />
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="btn-spotify"
                                    onClick={() => {
                                        if (is_paused) {
                                            actionOnSong("play", "PUT")
                                        } else {
                                            actionOnSong("pause", "PUT")
                                        }
                                        updateCurrentTrack();
                                    }}
                                    size="icon"
                                >
                                    {is_paused ? <PlayIcon /> : <PauseIcon />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="btn-spotify"
                                    onClick={() => {
                                        actionOnSong("next", "POST")
                                        updateCurrentTrack();
                                    }}
                                    size="icon"
                                >
                                    <TrackNextIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </TabsContent>
            <TabsContent value="lyrics" className="h-[calc(100%-36px)]">
            </TabsContent>
            <TabsContent value="queue" className="h-[calc(100%-36px)] overflow-y-scroll">
                <div className="flex flex-col h-full">
                    {queue?.map((track, i) => <QueueItem key={i} track={track} />)}
                </div>
            </TabsContent>
            <TabsContent value="devices" className="h-[calc(100%-36px)] overflow-y-scroll">
                <div className="flex flex-col h-full">
                    {devices?.map((device, i) => <DeviceItem key={i} device={device} updateFunction={updateDevices} />)}
                </div>
            </TabsContent>
        </Tabs >
    );
};

function QueueItem({ track }: { track: Spotify.Track }) {
    return (
        <div className="flex gap-2 items-center hover:bg-muted/20 border-b-[1px] px-4 py-2 ">
            <Image
                src={track.album.images[0].url}
                className="rounded-lg"
                alt=""
                height={50}
                width={50}
            />
            <div className="flex flex-col">
                <div className="text-sm font-semibold">{track.name}</div>
                <div className="text-xs text-muted-foreground">{track.artists[0].name}</div>
            </div>
        </div>
    )
}

function DeviceItem({ device, updateFunction }: { device: Spotify.Device, updateFunction: () => void }) {
    const { type, name, id, is_active } = device;

    let icon;
    switch (type) {
        case "Computer":
            icon = <DesktopIcon />
            break;
        case "Smartphone":
            icon = <MobileIcon />
            break;
        default:
            icon = <GlobeIcon />
            break;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <div className={"flex gap-4 items-center hover:bg-muted/20 border-b-[1px] px-4 py-2 " + (is_active && "text-green-500")}>
                                {icon}
                                <div className="flex flex-col">
                                    {name}
                                </div>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem disabled={is_active} onClick={
                                () => {
                                    transferPlayback(id).then(() => {
                                        updateFunction()
                                    })
                                }
                            }>
                                Transfer Playback
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu></TooltipTrigger>{is_active &&
                        <TooltipContent>Currently Active</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    )
}
