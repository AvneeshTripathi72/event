import dynamic from 'next/dynamic'
import HeroSection from '@/app/components/home/HeroSection'
import TopPerformerSection from '@/app/components/home/TopPerformerSection'
import CategoriesSection from '@/app/components/home/CategoriesSection'
import FeaturedArtistsSection from '@/app/components/home/FeaturedArtistsSection'
import WhyChooseSection from '@/app/components/home/WhyChooseSection'
import HowToBookSection from '@/app/components/home/HowToBookSection'
import LazyScrollSection from '@/app/components/common/LazyScrollSection'
import '@/app/styles/pages/HomePage.css'

const TestimonialsSection = dynamic(() => import('@/app/components/home/TestimonialsSection'), { ssr: false })
const FaqSection = dynamic(() => import('@/app/components/home/FaqSection'), { ssr: false })
const InfoCards = dynamic(() => import('@/app/components/home/InfoCards'), { ssr: false })
const ContactSection = dynamic(() => import('@/app/components/home/ContactSection'), { ssr: false })

export default function HomePage() {
  return (
    <div className="hp">
      <HeroSection />
      <TopPerformerSection />
      
      <LazyScrollSection placeholderHeight="200px">
        <CategoriesSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="400px">
        <FeaturedArtistsSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="300px">
        <WhyChooseSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="400px">
        <TestimonialsSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="300px">
        <HowToBookSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="350px">
        <FaqSection />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="200px">
        <InfoCards />
      </LazyScrollSection>
      
      <LazyScrollSection placeholderHeight="450px">
        <ContactSection />
      </LazyScrollSection>
    </div>
  )
}
