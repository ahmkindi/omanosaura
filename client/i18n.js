module.exports = {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'],
    '/about': ['about'],
    '/experiences': ['experiences'],
    '/experiences/[slug]': ['experiences'],
    '/contact': ['contact'],
    '/blog': ['blog'],
  },
}
