import { getPlaylistTracks } from "../handlers/spotifyHandler";

export default function Playlist_Card({
  name,
  tracks,
}: {
  name: string;
  tracks: string;
}) {
  async function fetchTrack() {
    const result = await getPlaylistTracks(
      tracks,
      localStorage.getItem("token")!
    );
    console.log(result);
  }

  return (
    <div onClick={fetchTrack}>
      <h1>{name}</h1>
    </div>
  );
}
