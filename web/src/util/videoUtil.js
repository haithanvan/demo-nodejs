

export const normalizeList = (rawItems) => {
  /* format = {
    id,
    title,
    description,
    publishedAt,
    thumbnailDefaultUrl
  }; */
  return rawItems.map(item => {
    const video = {};
    video.id = item.id.videoId;
    video.title = item.snippet.title;
    video.description = item.snippet.description;
    video.publishedAt = item.snippet.publishedAt;
    video.thumbnailDefaultUrl = item.snippet.thumbnails.default.url;
    return video;
  });
};