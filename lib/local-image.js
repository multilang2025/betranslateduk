const OLD_HOSTS = ['www.betranslated.co.uk', 'betranslated.co.uk'];

export function toLocalImagePath(imgUrl) {
  if (!imgUrl) return imgUrl;
  try {
    const u = new URL(imgUrl, 'https://www.betranslated.co.uk');
    if (OLD_HOSTS.includes(u.hostname)) return '/images' + u.pathname;
    return imgUrl;
  } catch (e) {
    return imgUrl;
  }
}
