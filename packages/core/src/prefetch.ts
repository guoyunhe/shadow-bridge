export function prefetch(urls: string[]) {
  for (const url of urls) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.body.append(link);
  }
}
