export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  siteName?: string;
  favicon?: string;
  tags: string[];
}

export const fetchLinkMetadata = async (rawUrl: string): Promise<LinkMetadata> => {
  let formattedUrl = rawUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let domain = '';
  try {
    const parsed = new URL(formattedUrl);
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = formattedUrl;
  }

  const defaultResult: LinkMetadata = {
    url: formattedUrl,
    title: domain ? `Kept from ${domain}` : formattedUrl,
    description: `Saved link reference from ${domain || formattedUrl}. Click to visit source.`,
    tags: domain ? [domain.split('.')[0]] : ['Link'],
  };

  try {
    // Primary: Microlink API (handles any URL on the web with rich OG meta, title, description, image)
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(formattedUrl)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.status === 'success' && json.data) {
        const data = json.data;
        const pageTitle = data.title || defaultResult.title;
        const pageDesc = data.description || defaultResult.description;
        const imageUrl = data.image?.url || data.logo?.url;
        const publisher = data.publisher || domain.split('.')[0];

        const generatedTags = [publisher];
        if (domain && !generatedTags.includes(domain.split('.')[0])) {
          generatedTags.push(domain.split('.')[0]);
        }

        return {
          url: formattedUrl,
          title: pageTitle,
          description: pageDesc,
          imageUrl,
          siteName: publisher,
          favicon: data.logo?.url,
          tags: generatedTags.slice(0, 3),
        };
      }
    }
  } catch (err) {
    console.warn('Microlink API failed, attempting fallback...', err);
  }

  try {
    // Fallback: NoEmbed API for media links (YouTube, Twitter, GitHub, etc.)
    const noembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(formattedUrl)}`);
    if (noembedRes.ok) {
      const noembedJson = await noembedRes.json();
      if (noembedJson && noembedJson.title) {
        return {
          url: formattedUrl,
          title: noembedJson.title,
          description: noembedJson.author_name ? `By ${noembedJson.author_name} via ${noembedJson.provider_name || domain}` : `Resource from ${domain}`,
          imageUrl: noembedJson.thumbnail_url,
          siteName: noembedJson.provider_name || domain,
          tags: [noembedJson.provider_name || domain.split('.')[0]],
        };
      }
    }
  } catch (err) {
    console.warn('NoEmbed API fallback failed', err);
  }

  return defaultResult;
};
