export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.redirect("/", 302);
  }
  const token = await getSpotifyToken(code);
  // save token data to cookie
  const cookie = `spotify_token=${token.access_token}; path=/; HttpOnly; SameSite=Strict, spotify_refresh_token=${token.refresh_token};`;
  return new Response("OK", {
    headers: {
      "Set-Cookie": cookie,
      Location: "/",
    },
    status: 302,
  });
}

async function getSpotifyToken(code: string) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
  });
  const data = await response.json();
  return data;
}
