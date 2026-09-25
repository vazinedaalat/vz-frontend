# Blog API — handoff برای بک‌اند

> **مخاطب:** تیم NestJS / CMS  
> **فرانت:** مسیرهای `/blog` و `/blog/:slug` + بخش بلاگ صفحهٔ مارکتینگ `/` + کارت‌های بلاگ در `/app`  
> **وضعیت فرانت:** در `development` / `staging` (`VITE_APP_ENV !== 'production'`) از موک غنی استفاده می‌شود؛ در **production** فقط API.

فایل‌های مرتبط فرانت:

- `src/features/blog/types.ts`
- `src/features/blog/api/blog.ts`
- `src/features/app/api/home.ts` → `GET /home/blog` (کارت‌های هوم اپ)

---

## ۱. خلاصهٔ نیاز

| قابلیت UI | مسیر فرانت | API مورد نیاز |
|-----------|------------|----------------|
| پیش‌نمایش در هوم مارکتینگ | `/#blog` | `GET /home/blog` (موجود) یا `GET /blog` |
| فهرست مطالب | `/blog` | همان لیست |
| صفحهٔ مطلب | `/blog/:slug` | **`GET /blog/:slug`** (جدید — ضروری) |
| کارت‌های هوم اپ | `/app` | `GET /home/blog` |

بدون endpoint جزئیات، در production فرانت فعلاً با fallback سبک (فقط `excerpt` به‌عنوان بدنه) از لیست کار می‌کند؛ برای تجربهٔ کامل باید بدنهٔ غنی برگردد.

---

## ۲. مدل دادهٔ پیشنهادی (Prisma / CMS)

فیلدهای پیشنهادی روی `BlogPost` (علاوه بر آنچه امروز برای لیست دارید):

| فیلد | نوع | الزامی | توضیح |
|------|-----|--------|--------|
| `id` | string (cuid/uuid) | بله | شناسه پایدار |
| `slug` | string (unique) | بله | سگمنت URL؛ لاتین، kebab-case |
| `title` | string | بله | عنوان فارسی |
| `excerpt` | string | بله | چکیدهٔ کوتاه برای کارت‌ها |
| `category` | string | بله | برچسب موضوعی |
| `readMinutes` | int | بله | زمان مطالعهٔ تقریبی |
| `publishedAt` | ISO datetime | بله | تاریخ انتشار |
| `coverImage` | string \| null | خیر | URL کامل یا مسیر `/uploads/...` |
| `authorName` | string | بله برای جزئیات | نام نویسنده / تحریریه |
| `authorRole` | string \| null | خیر | نقش کوتاه |
| `body` | JSON / rich text | بله برای جزئیات | بدنهٔ مطلب (شکل زیر) |
| `published` | boolean | بله | فقط منتشرشده‌ها در API عمومی |
| `sortOrder` | int | خیر | ترتیب نمایش لیست |

### شکل `body` مورد انتظار فرانت

آرایه‌ای از بلوک‌ها (ساده و قابل نگاشت از Markdown/CMS):

```json
[
  { "type": "paragraph", "text": "..." },
  { "type": "heading", "text": "..." },
  { "type": "list", "items": ["...", "..."] }
]
```

اگر CMS HTML می‌دهد، بک‌اند می‌تواند قبل از پاسخ به همین ساختار تبدیل کند؛ فرانت فعلاً HTML خام رندر نمی‌کند.

---

## ۳. قرارداد HTTP

پایه: `VITE_API_URL` (مثلاً `https://api.example.com/api/v1`)  
Envelope موفقیت مطابق بقیهٔ پروژه:

```json
{ "success": true, "data": { ... } }
```

### ۳.۱ لیست — موجود / قابل گسترش

**`GET /home/blog`** (فعلی — هوم اپ و می‌تواند برای مارکتینگ هم استفاده شود)

پاسخ `data`: آرایهٔ خلاصه:

```ts
{
  id: string
  slug?: string          // قویاً توصیه می‌شود؛ در غیر این صورت فرانت از id استفاده می‌کند
  title: string
  excerpt: string
  category: string
  readMinutes: number
  publishedAt: string    // ISO ترجیحاً؛ برچسب جلالی هم پذیرفته می‌شود
  coverImage?: string | null
  authorName?: string | null
}[]
```

پیشنهاد جایگزین عمومی (اختیاری):

**`GET /blog?limit=&page=`** با همان آیتم‌ها + `meta` صفحه‌بندی استاندارد پروژه.

مرتب‌سازی پیشنهادی: `publishedAt DESC`، فقط `published = true`.

### ۳.۲ جزئیات مطلب — **باید پیاده شود**

**`GET /blog/:slug`**

- `:slug` می‌تواند `slug` یا در دورهٔ گذار `id` باشد (فرانت هر دو را امتحان‌پذیر نگه می‌دارد).
- `404` اگر منتشر نشده / وجود ندارد.

پاسخ `data`:

```ts
{
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  publishedAt: string            // ISO
  updatedAt?: string | null      // ISO — SEO dateModified
  coverImage?: string | null
  coverImageAlt?: string | null
  authorName: string
  authorRole?: string | null
  seoTitle?: string | null       // ≤ ~60 chars
  seoDescription?: string | null // 120–160 chars
  keywords?: string[] | null
  keyTakeaways?: string[] | null // GEO visible bullets
  faq?: { question: string; answer: string }[] | null
  bodyHtml?: string              // TipTap HTML (preferred)
  body?: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'list'; items: string[] }
  >
}
```

Auth: **عمومی** (بدون توکن) — محتوای مارکتینگ.

فرانت از این فیلدها `DocumentHead` + JSON-LD (`BlogPosting`, `BreadcrumbList`, `FAQPage`) می‌سازد. استاندارد: `skills/seo-geo.md`.

---

## ۴. نگاشت به UI فرانت

| فیلد API | UI / SEO |
|----------|----------|
| `slug` | مسیر `/blog/:slug` و لینک کارت‌های `/app` |
| `seoTitle` / `seoDescription` | `<title>` و meta description |
| `keywords` | meta keywords + schema |
| `coverImage` / `coverImageAlt` | کاور + `og:image` + alt |
| `updatedAt` | نمایش + `dateModified` |
| `keyTakeaways` | بلوک «جمع‌بندی سریع» (GEO) |
| `faq` | آکاردئون FAQ + `FAQPage` |
| `bodyHtml` / `body` | بدنهٔ صفحهٔ مطلب |
| `authorName` / `authorRole` | نویسنده + schema Person |

هوم مارکتینگ حداکثر ۳ کارت از لیست را نشان می‌دهد؛ صفحهٔ `/blog` همه را (فعلاً بدون صفحه‌بندی کلاینت).

فایل‌های بات: `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` — بک‌اند/CMS باید URLهای جدید بلاگ را در sitemap منعکس کند.

---

## ۵. محیط و موک

| شرط | رفتار فرانت بلاگ |
|------|------------------|
| `VITE_USE_MOCK=true` و غیر production | موک SEO-کامل (`MOCK_BLOG_POSTS`) |
| در غیر این صورت | API زنده: `GET /blog` و `GET /blog/:slug` |

`VITE_SITE_URL` برای canonical / Open Graph / JSON-LD الزامی در production است.

---

## ۶. چک‌لیست تحویل بک‌اند

- [ ] `slug` یکتا روی مدل + ایندکس
- [ ] `GET /blog` و `GET /blog/:slug` با فیلدهای SEO بالا
- [ ] `bodyHtml` یا `body` غنی (نه فقط excerpt)
- [ ] `faq` و `keyTakeaways` برای GEO
- [ ] فقط پست‌های `published`
- [ ] به‌روزرسانی sitemap هنگام publish
- [ ] تصاویر: URL مطلق یا `/uploads/...`
- [ ] CORS زیر prefix فعلی API (`/api/v1`)

---

## ۷. نمونهٔ پاسخ جزئیات

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "slug": "ezharnameh-vs-dadkhast",
    "title": "تفاوت اظهارنامه و دادخواست چیست؟",
    "seoTitle": "تفاوت اظهارنامه و دادخواست | راهنمای حقوقی",
    "seoDescription": "اظهارنامه اخطار رسمی پیش از دعواست و دادخواست شروع رسیدگی در دادگاه.",
    "excerpt": "اظهارنامه ابزار اخطار رسمی قبل از دعواست؛ دادخواست شروع رسیدگی در دادگاه.",
    "category": "آموزش حقوقی",
    "keywords": ["اظهارنامه", "دادخواست", "وزین عدالت"],
    "readMinutes": 6,
    "publishedAt": "2025-09-01T10:00:00.000Z",
    "updatedAt": "2026-03-01T09:00:00.000Z",
    "coverImage": "/uploads/blog/ezharnameh.jpg",
    "coverImageAlt": "مقایسه اظهارنامه و دادخواست",
    "authorName": "تیم محتوای وزین عدالت",
    "authorRole": "تحریریه حقوقی",
    "keyTakeaways": [
      "اظهارنامه معمولاً پیش از دعوا برای اخطار رسمی است.",
      "دادخواست شروع رسمی رسیدگی قضایی است."
    ],
    "faq": [
      {
        "question": "آیا اظهارنامه جایگزین دادخواست است؟",
        "answer": "خیر. اظهارنامه معمولاً اخطار رسمی است و رسیدگی را آغاز نمی‌کند."
      }
    ],
    "bodyHtml": "<p>تفاوت اظهارنامه و دادخواست این است که...</p>"
  }
}
```
