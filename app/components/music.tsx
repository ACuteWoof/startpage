import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authenticate, clearCookies, getAuthenticationStatus, getSpotifyToken } from "../actions/spotify";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { WebPlayback } from "./spotifyPlayer";
import { ContextMenu, ContextMenuItem, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";

export default function Music() {

    const [authenticated, setAuthenticated] = useState<number>(0) // 0 = loading, 1 = authenticated, 2 = not authenticated
    const [userInfo, setUserInfo] = useState<any>(null)

    useEffect(() => {
        getAuthenticationStatus().then((res) => {
            if (res.status !== 200) { setAuthenticated(2); return; }
            setUserInfo(res.data)
            setAuthenticated(1)
        })
    }, [])

    return <Card className="h-full w-full flex flex-col">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
                Music
            </CardTitle>
            <div className="flex flex-row gap-2">
                {authenticated === 1 &&
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={userInfo?.images[0]?.url} alt={userInfo?.display_name} />
                                <AvatarFallback>
                                    {userInfo?.display_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem>
                                <a href={userInfo?.external_urls?.spotify} target="_blank" rel="noreferrer">
                                    Open Spotify
                                </a>
                            </ContextMenuItem>
                            <ContextMenuItem
                                onClick={() => {
                                    clearCookies()
                                    setAuthenticated(2)
                                }}
                            >
                                Clear Cookies
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                }{authenticated === 2 &&
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            authenticate()
                        }}
                    >
                        Connect Spotify
                    </Button>
                }
            </div>
        </CardHeader>
        <CardContent className="h-full">{
            authenticated === 0 ? <div>Loading...</div> :
                authenticated === 2 ? <div className="h-full w-full flex flex-col justify-center items-center gap-4">
                    <div className="text-muted-foreground text-center max-w-[50%]">
                        Connect your Spotify account to control your currently playing song.
                    </div>
                </div> :
                    <SpotifyClient />
        }</CardContent>
    </Card>
}

function SpotifyClient() {

    const [token, setToken] = useState<string>("")

    useEffect(() => {
        getSpotifyToken().then((res) => {
            if (typeof res !== "string") return;
            setToken(res)
        })
    }, [])

    return (
        <div className="h-full ">
            {token && <WebPlayback token={token} />}
        </div>
    );
}