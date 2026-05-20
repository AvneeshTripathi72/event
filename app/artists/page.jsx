"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShellWrapper } from '@/app/layouts/AppShellWrapper'
import ArtistCard from '@/app/components/artists/ArtistCard'
import { ARTISTS_CAT_FILTER, FEATURED_ARTISTS } from '@/app/constants'
import { supabase } from '@/app/lib/supabase'
import '@/app/styles/pages/Artists.css'

let cachedArtistsData = null;

export default function ArtistsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtists = async () => {
      if (cachedArtistsData) {
        setArtists(cachedArtistsData)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*, artist_images(image_url)')
          .eq('is_popular', false)
          .eq('is_artist_of_month', false)

        if (!data || data.length === 0) {
          console.warn('Database returned no standard artists, using fallback FEATURED_ARTISTS.');
          const fallbackArtists = FEATURED_ARTISTS.map((artist, idx) => ({
            id: idx + 1,
            name: artist.name,
            category: artist.genre.includes(' ') ? artist.genre.split(' ')[1] : artist.genre, 
            subCategory: artist.genre,
            city: artist.city || 'Mumbai',
            state: 'India',
            languages: 'Hindi, English',
            priceMin: 50000,
            priceMax: 70000,
            img: artist.image,
            quote: 'A top-tier artist providing premium entertainment.',
            galleryImages: [
              '/assets/lux-live-band-concert.webp',
              '/assets/lux-wedding-celebration.webp'
            ],
            videoUrls: ['https://www.youtube.com/watch?v=F4Gk0u0_U7Q'] // Dummy video
          }));
          cachedArtistsData = fallbackArtists;
          setArtists(fallbackArtists);
          return;
        }

        const formattedArtists = data.map(artist => ({
          id: artist.id,
          name: artist.name,
          category: artist.category,
          subCategory: artist.sub_category,
          city: artist.city,
          state: artist.state,
          languages: artist.performing_language,
          priceMin: artist.price_min,
          priceMax: artist.price_max,
          originalPrice: artist.original_price,
          exclusivePrice: artist.exclusive_price,
          img: artist.artist_images?.[0]?.image_url || null,
          galleryImages: artist.artist_images?.map(img => img.image_url).filter(Boolean) || [],
          videoUrls: artist.video_url ? artist.video_url.split(',').map(url => url.trim()).filter(Boolean) : [],
          quote: artist.bio || '',
        }))

        cachedArtistsData = formattedArtists
        setArtists(formattedArtists)
      } catch (err) {
        console.error('Error fetching artists, using fallback:', err)
        const fallbackArtists = FEATURED_ARTISTS.map((artist, idx) => ({
          id: idx + 1,
          name: artist.name,
          category: artist.genre.includes(' ') ? artist.genre.split(' ')[1] : artist.genre,
          subCategory: artist.genre,
          city: artist.city || 'Mumbai',
          state: 'India',
          languages: 'Hindi, English',
          priceMin: 50000,
          priceMax: 70000,
          img: artist.image,
          quote: 'A top-tier artist providing premium entertainment.',
          galleryImages: [
            '/assets/lux-live-band-concert.webp',
            '/assets/lux-wedding-celebration.webp'
          ],
          videoUrls: ['https://www.youtube.com/watch?v=F4Gk0u0_U7Q'] // Dummy video
        }));
        cachedArtistsData = fallbackArtists;
        setArtists(fallbackArtists);
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const catParam = params.get('category')
      if (catParam) {

        const match = ARTISTS_CAT_FILTER.find(
          c => c.toLowerCase() === catParam.toLowerCase() ||
               c.toLowerCase() === catParam.toLowerCase() + 's' ||
               c.toLowerCase().replace(/s$/, '') === catParam.toLowerCase()
        )
        if (match) setActiveCategory(match)
      }
    }
  }, [])

  const filteredArtists = activeCategory === 'All'
    ? artists
    : artists.filter(a => {
        const aCat = (a.category || '').toLowerCase()
        const filterCat = activeCategory.toLowerCase()
        return aCat === filterCat || aCat === filterCat.replace(/s$/, '') || aCat + 's' === filterCat
      })

  const handleBook = (name) => {
    router.push(`/book?artist=${encodeURIComponent(name)}`)
  }

  return (
    <main className="artists-page">
      <div className="lux-container">


        <div className="artists-filters">
          {ARTISTS_CAT_FILTER.map((cat, idx) => (
            <motion.button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="artists-grid">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="artist-card-skeleton" style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px', 
                  height: '460px', 
                  width: '100%', 
                  overflow: 'hidden'
                }}>
                   <div className="skeleton-pulse" style={{ height: '220px', background: 'rgba(255,255,255,0.04)', width: '100%' }}></div>
                   <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <div className="skeleton-pulse" style={{ height: '28px', width: '70%', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '12px' }}></div>
                     <div className="skeleton-pulse" style={{ height: '14px', width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '30px' }}></div>
                     
                     <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: '100%', justifyContent: 'center' }}>
                       <div className="skeleton-pulse" style={{ height: '36px', width: '60px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div>
                       <div className="skeleton-pulse" style={{ height: '36px', width: '60px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                       <div className="skeleton-pulse" style={{ height: '44px', flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '100px' }}></div>
                       <div className="skeleton-pulse" style={{ height: '44px', flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '100px' }}></div>
                     </div>
                   </div>
                </div>
              ))}
            </>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredArtists.length > 0 ? (
                filteredArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onBook={handleBook}
                  />
                ))
              ) : (
                <p style={{ textAlign: 'center', width: '100%', color: 'white' }}>No standard artists found.</p>
              )}
            </AnimatePresence>
          )}
        </div>

      </div>
    </main>
  )
}

