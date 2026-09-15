import { apiRequest } from '@/services/api'
import type { BlogCard, HomeHeroBannerSlide, SpecialOffer } from '../types'

export function fetchHomeBanners() {
  return apiRequest<HomeHeroBannerSlide[]>({ method: 'GET', url: '/home/banners' })
}

export function fetchHomeOffers() {
  return apiRequest<SpecialOffer[]>({ method: 'GET', url: '/home/offers' })
}

export function fetchHomeBlog() {
  return apiRequest<BlogCard[]>({ method: 'GET', url: '/home/blog' })
}
