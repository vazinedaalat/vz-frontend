import { apiRequest } from '@/services/api'
import type { BlogCard, HomeHeroBannerSlide } from '../types'

export function fetchHomeBanners() {
  return apiRequest<HomeHeroBannerSlide[]>({ method: 'GET', url: '/home/banners' })
}

export function fetchHomeBlog() {
  return apiRequest<BlogCard[]>({ method: 'GET', url: '/home/blog' })
}
