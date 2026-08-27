// AUTO-GENERATED from the legacy database, now static. To add a post,
// drop a JSON file in this folder (see the shape below) and import it here.
// No database involved.
import b0 from './exploring-nizwas-timeless-charms.json'
import b1 from './salalah-omans-unmissable-gem.json'
import b2 from './omans-top-5-wadis.json'
import b3 from './a-trip-to-wadi-shab.json'
import b4 from './omans-hiking-hotspots.json'
import b5 from './the-gold-ocean-of-bidiya.json'
import b6 from './omans-best-beaches.json'
import b7 from './try-snorkeling-in-oman.json'
import b8 from './experience-musandam.json'
import b9 from './can-you-explore-oman-in-just-10-days.json'
import b10 from './5-places-to-visit-in-salalah.json'
import b11 from './omans-hidden-gems.json'

export type BlogPost = {
  slug: string
  legacySlug: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  photo: string
  createdAt: string
  page: string
  pageAr: string
}

export const blogPosts: BlogPost[] = [
  b0 as BlogPost,
  b1 as BlogPost,
  b2 as BlogPost,
  b3 as BlogPost,
  b4 as BlogPost,
  b5 as BlogPost,
  b6 as BlogPost,
  b7 as BlogPost,
  b8 as BlogPost,
  b9 as BlogPost,
  b10 as BlogPost,
  b11 as BlogPost,
].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const blogBySlug = new Map(blogPosts.map((p) => [p.slug, p]))
