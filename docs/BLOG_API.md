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
  publishedAt: string
  coverImage?: string | null
  authorName: string
  authorRole?: string | null
  body: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'list'; items: string[] }
  >
}
```

Auth: **عمومی** (بدون توکن) — محتوای مارکتینگ.

---

## ۴. نگاشت به UI فرانت

| فیلد API | UI |
|----------|-----|
| `slug` | مسیر `/blog/:slug` و لینک کارت‌های `/app` |
| `coverImage` | کاور کارت و هیرو مطلب |
| `category` | بج طلایی |
| `readMinutes` | «X دقیقه مطالعه» |
| `publishedAt` | تاریخ جلالی با `formatFaDate` |
| `body` | بدنهٔ صفحهٔ مطلب |
| `authorName` / `authorRole` | بلوک نویسنده |

هوم مارکتینگ حداکثر ۳ کارت از لیست را نشان می‌دهد؛ صفحهٔ `/blog` همه را (فعلاً بدون صفحه‌بندی کلاینت).

---

## ۵. محیط و موک

| `VITE_APP_ENV` | رفتار فرانت بلاگ |
|----------------|------------------|
| `development` / `staging` | موک داخلی (`MOCK_BLOG_POSTS`) — بدون وابستگی به Nest |
| `production` | فقط API؛ لیست از `/home/blog`؛ جزئیات از `/blog/:slug` |

پرچم جدا از `VITE_USE_MOCK` اپ: `isBlogMockEnabled = VITE_APP_ENV !== 'production'`.

---

## ۶. چک‌لیست تحویل بک‌اند

- [ ] `slug` یکتا روی مدل + ایندکس
- [ ] `GET /home/blog` شامل `slug` و در صورت امکان `coverImage` / `authorName`
- [ ] `GET /blog/:slug` با `body` بلوکی
- [ ] فقط پست‌های `published`
- [ ] CORS و مسیر زیر همان prefix فعلی API (`/api/v1`)
- [ ] تصاویر: URL مطلق یا مسیر قابل resolve با `assetUrl` فرانت (`/uploads/...`)

---

## ۷. نمونهٔ پاسخ جزئیات

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "slug": "ezharnameh-vs-dadkhast",
    "title": "تفاوت اظهارنامه و دادخواست چیست؟",
    "excerpt": "اظهارنامه ابزار اخطار رسمی قبل از دعواست؛ دادخواست شروع رسیدگی در دادگاه.",
    "category": "آموزش حقوقی",
    "readMinutes": 5,
    "publishedAt": "2025-09-01T10:00:00.000Z",
    "coverImage": "/uploads/blog/ezharnameh.jpg",
    "authorName": "تیم محتوای وزین عدالت",
    "authorRole": "تحریریه حقوقی",
    "body": [
      { "type": "paragraph", "text": "بسیاری از موکلان..." },
      { "type": "heading", "text": "اظهارنامه چه می‌کند؟" },
      { "type": "list", "items": ["ثبت رسمی مطالبه", "ایجاد سابقه"] }
    ]
  }
}
```
