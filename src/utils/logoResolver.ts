import { useEffect, useState } from 'react';

const logoMemoryCache = new Map<string, string | null>();
const pendingRequests = new Map<string, Promise<string | null>>();

async function resolveLogoUrl(wikidataId: string, clubName: string): Promise<string | null> {
  const cacheKey = `${wikidataId}:${clubName}`;
  if (logoMemoryCache.has(cacheKey)) {
    return logoMemoryCache.get(cacheKey)!;
  }

  try {
    const localCached = localStorage.getItem(`club_logo_v2_${cacheKey}`);
    if (localCached) {
      logoMemoryCache.set(cacheKey, localCached);
      return localCached;
    }
  } catch {
    // ignore storage restrictions
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const promise = (async (): Promise<string | null> => {
    try {
      // 1. Try Wikidata Entity P154 (logo image) or P18 (image) or P94 (coat of arms)
      if (wikidataId && wikidataId.startsWith('Q')) {
        const wdUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${encodeURIComponent(
          wikidataId
        )}&property=P154&format=json&origin=*`;
        const wdRes = await fetch(wdUrl);
        if (wdRes.ok) {
          const wdData = await wdRes.json();
          const p154Claims = wdData?.claims?.P154;
          if (Array.isArray(p154Claims) && p154Claims.length > 0) {
            const fileName = p154Claims[0]?.mainsnak?.datavalue?.value;
            if (typeof fileName === 'string' && fileName.length > 0) {
              const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
                fileName
              )}&prop=imageinfo&iiprop=url&iiurlwidth=160&format=json&origin=*`;
              const cRes = await fetch(commonsUrl);
              if (cRes.ok) {
                const cData = await cRes.json();
                const pages = cData?.query?.pages;
                if (pages) {
                  const firstPage = Object.values(pages)[0] as {
                    imageinfo?: Array<{ thumburl?: string; url?: string }>;
                  };
                  const imgUrl =
                    firstPage?.imageinfo?.[0]?.thumburl || firstPage?.imageinfo?.[0]?.url;
                  if (imgUrl) {
                    logoMemoryCache.set(cacheKey, imgUrl);
                    try {
                      localStorage.setItem(`club_logo_v2_${cacheKey}`, imgUrl);
                    } catch {
                      // ignore
                    }
                    return imgUrl;
                  }
                }
              }
            }
          }
        }
      }

      // 2. Fallback: Wikipedia PageImages API (official infobox crest thumbnail)
      const wpSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        clubName + ' football club'
      )}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=160&format=json&origin=*`;
      const wpRes = await fetch(wpSearchUrl);
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const pages = wpData?.query?.pages;
        if (pages) {
          const firstPage = Object.values(pages)[0] as {
            thumbnail?: { source?: string };
          };
          const thumbSource = firstPage?.thumbnail?.source;
          if (thumbSource) {
            logoMemoryCache.set(cacheKey, thumbSource);
            try {
              localStorage.setItem(`club_logo_v2_${cacheKey}`, thumbSource);
            } catch {
              // ignore
            }
            return thumbSource;
          }
        }
      }
    } catch {
      // network error or offline
    }

    logoMemoryCache.set(cacheKey, null);
    return null;
  })();

  pendingRequests.set(cacheKey, promise);
  const result = await promise;
  pendingRequests.delete(cacheKey);
  return result;
}

export function useOfficialClubLogo(wikidataId: string, clubName: string, directLogoUrl?: string) {
  const [logoUrl, setLogoUrl] = useState<string | null>(directLogoUrl || null);

  useEffect(() => {
    let isMounted = true;
    if (directLogoUrl) {
      setLogoUrl(directLogoUrl);
      return;
    }

    resolveLogoUrl(wikidataId, clubName).then((resolved) => {
      if (isMounted && resolved) {
        setLogoUrl(resolved);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [wikidataId, clubName, directLogoUrl]);

  return { logoUrl, clearLogoOnError: () => setLogoUrl(null) };
}
