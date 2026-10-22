"use client";
import { musicReleases } from "./musicReleases";
import { useExperience } from "../src/components/Experience";

export default function MusicCatalog() {
  const {playPreview} = useExperience();
  return <div className="song-list" aria-label="Max Starr release catalog">
    {musicReleases.map((release, index) => (
      <article className={`song-card catalog-release${release.id === "sharks-starrs" ? " featured-ep" : ""}`} key={release.id}>
        <a className="song-cover" href={release.streamUrl} target="_blank" rel="noopener noreferrer" aria-label={`Stream ${release.title}`}>
          <img src={release.coverArt} alt={`${release.title} cover art`} width={450} height={450} loading="lazy" decoding="async" />
          <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
        </a>
        <div className="song-copy">
          <p>{release.artist}</p>
          <h3>{release.title}</h3>
          <a className="stream-now" href={release.streamUrl} target="_blank" rel="noopener noreferrer">
            {release.id === "sharks-starrs" ? "Stream the EP" : "Stream Now"} <span>↗</span>
          </a>
          {release.releaseNote && <small>{release.releaseNote}</small>}
        </div>
        {release.previewUrl && <button className="st-secondary" onClick={()=>playPreview(release.previewUrl!,release.title)}>Play 30-second preview ↗</button>}
      </article>
    ))}
  </div>;
}
