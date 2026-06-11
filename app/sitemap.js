export default function sitemap() {
  const baseUrl = 'https://prashikfulke.me';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
