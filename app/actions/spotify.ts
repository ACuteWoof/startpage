"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export async function getSpotifyToken() {
  const accessToken = cookies().get("spotify_token");
  if (!accessToken) {
    return {
      error: {
        message: "No access token",
        status: 401,
      },
    };
  }

  return accessToken.value;
}

export async function authenticate() {
  const scopes: string[] = [
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-read-playback-state",
    "streaming",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-library-modify",
    "user-library-read",
  ];
  const scopesString: string = scopes.join("%20");
  redirect(
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopesString}`
  );
}

export async function getAuthenticationStatus() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.error) {
    if (data.error.status === 401) {
      await refreshAccessToken();
    }
    return data;
  }
  return {
    data,
    status: 200,
  };
}

export async function getAllPlaylists() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getPlaylist(playlistId: string) {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function getPlaylistTracks(playlistId: string) {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function getTrack(trackId: string) {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getCurrentSong() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    return {
      error: {
        message: "No song playing",
        status: 404,
      },
    };
  }
}

export async function clearCookies() {
  cookies().set("spotify_token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(0),
  });
}

export async function actionOnSong(action: string, method: string) {
  if (!["PUT", "POST"].includes(method)) {
    return {
      error: {
        message: "Invalid method",
        status: 400,
      },
    };
  }
  if (!["play", "pause", "next", "previous"].includes(action)) {
    return {
      error: {
        message: "Invalid action",
        status: 400,
      },
    };
  }
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/${action}`,
    {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.status;
}

export async function getQueue() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getDevices() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function transferPlayback(deviceId: string) {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_ids: [deviceId],
    }),
  });
  return await response.status;
}

export async function getPlaybackState() {
  const token = await getSpotifyToken();
  if (typeof token !== "string") return token;
  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function refreshAccessToken() {
  const refreshToken = cookies().get("spotify_refresh_token");
  const response = await fetch(
    `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      },
    }
  );
  const data = await response.json();
  cookies().set("spotify_token", data.access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
  });
  return data;
}
