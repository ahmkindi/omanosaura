import 'server-only'
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'
import arabicWords from 'naughty-words/ar.json'

// English: the obscenity package (obfuscation-aware, word-boundary safe).
// Arabic: the LDNOOBW list from naughty-words, plus a few common insult
// phrases it lacks, matched as substrings after light normalization since
// Arabic attaches prefixes (ال/و/ف) directly to words. Server-only so the
// lists never ship to the browser. Admins can delete anything that slips
// through from the experience edit page.

const englishMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

const AR_EXTRA = [
  'كس امك',
  'كسمك',
  'ابن الكلب',
  'ابن العاهره',
  'شرموط',
  'عاهره',
  'قحبه',
  'منيوك',
  'يلعن ابوك',
  'ينعل ابوك',
]

function normalizeArabic(text: string): string {
  return (
    text
      // strip harakat/tanween (U+0610–061A, U+064B–065F, U+0670) and tatweel
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/[ىئ]/g, 'ي')
      .replace(/ؤ/g, 'و')
      // Written Arabic doubles letters with shadda, not repetition, so any
      // repeated letter is elongation ("طييييز") — collapse to one.
      .replace(/(.)\1+/g, '$1')
  )
}

const AR_WORDS = [...(arabicWords as string[]), ...AR_EXTRA].map(normalizeArabic)

/** True when the text contains profanity in English or Arabic. */
export function containsProfanity(text: string): boolean {
  if (!text) return false
  // Also check with spaced-out single letters rejoined ("f u c k").
  const rejoined = text.replace(/\b(?:[a-z][\s._-]+){2,}[a-z]\b/gi, (m) =>
    m.replace(/[\s._-]+/g, ''),
  )
  if (englishMatcher.hasMatch(text) || englishMatcher.hasMatch(rejoined)) {
    return true
  }
  const ar = normalizeArabic(text)
  return AR_WORDS.some((word) => ar.includes(word))
}
