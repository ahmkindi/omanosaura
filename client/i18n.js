module.exports = {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'],
    '/about': ['about'],
    'rgx:/experiences+': ['experiences'],
    '/contact': ['contact'],
    'rgx:/blog+': ['blog'],
    'rgx:/purchases+': ['purchases'],
    'rgx:/profile+': ['profile'],
  },
}
