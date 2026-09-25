# مستند تحویل به بک‌اند — پنل موکل وزین عدالت

> **مخاطب:** تیم بک‌اند / API  
> **ریپوی فرانت:** `frontend-vz`  
> **دامنه:** ورود با پیامک + کل پنل `/app/*`  
> **هدف:** جایگزینی کامل داده‌های موک/ثابت با API تا تمام اطلاعات اپ داینامیک شود.

---

## ۱. وضعیت فعلی فرانت (خلاصه اجرایی)

| وضعیت | توضیح |
|--------|--------|
| UI پنل | آماده و قابل استفاده در `development` / `staging` با **موک دیتا** |
| اتصال API | کلاینت Axios آماده‌سازی شده؛ **هیچ فیچری هنوز به API واقعی وصل نیست** |
| پروداکشن (`VITE_APP_ENV=production`) | موک خاموش است → لیست‌ها خالی، OTP کار نمی‌کند |
| احراز هویت | فقط موک محلی (OTP ثابت `12345`)؛ **توکن JWT در استور ست نمی‌شود** |
| React Query | نصب است ولی برای fetch دیتا استفاده نشده |

**نتیجه برای بک‌اند:** باید APIهای زیر را پیاده کنید؛ فرانت بعداً getterهای موک را با `apiRequest` جایگزین می‌کند.

---

## ۲. قرارداد محیطی و کلاینت HTTP

### ۲.۱ متغیرهای محیطی فرانت

| متغیر | پیش‌فرض | نقش |
|--------|---------|-----|
| `VITE_API_URL` | `http://localhost:3000/api` | Base URL بک‌اند |
| `VITE_APP_ENV` | `development` | `development` \| `staging` \| `production` |
| `VITE_APP_NAME` | `وزین عدالت` | نام نمایشی |

- موک فعال است وقتی: `VITE_APP_ENV !== 'production'`  
  فایل: `src/config/env.ts` ، دروازه موک: `src/lib/mock.ts`
- نمونه: `.env.example`

### ۲.۲ شکل پاسخ پیشنهادی (از قبل در فرانت تعریف شده)

فایل: `src/services/api/types.ts`

```ts
// موفقیت
{ success: true, data: T, message?: string }

// لیست صفحه‌بندی‌شده
{
  data: T[],
  meta: { page: number, limit: number, total: number, totalPages: number }
}

// خطا
{ message: string, code?: string, details?: unknown }
```

کلاینت (`src/services/api/client.ts`):

- Header: `Authorization: Bearer <access_token>` از `localStorage.access_token` (فرانت هنوز ست نمی‌کند — بک‌اند باید توکن بدهد، فرانت بعداً ذخیره می‌کند)
- Header: `X-Request-Id`
- Timeout: ۳۰ ثانیه
- نگاشت خطا: `400` Validation، `401` Auth، `403` Authz، `404` NotFound

> **نکته دیپلوی:** `BASE_PATH=/vz-frontend/` فقط برای GitHub Pages است و به طراحی API ربطی ندارد.

---

## ۳. نقشهٔ صفحات و مسیرهای اپ (فرانت کجاست؟)

روتر: `src/app/router/routes.tsx`  
شِل: `src/features/app/components/app-shell.tsx`  
گارد: `src/app/router/protected-route.tsx` → بدون لاگین → `/login`

| مسیر UI | فایل صفحه فرانت | دادهٔ فعلی | مالکیت بک‌اند |
|---------|------------------|------------|----------------|
| `/login` | `src/features/home/pages/login-page.tsx` | OTP موک در auth-store | **Auth SMS** |
| `/app` | `src/features/app/pages/app-home-page.tsx` | بنر، پیشنهاد، پرونده، مشاوره، بلاگ، اعلان | **Home feed + CMS** |
| `/app/consultation` | `.../consultation-page.tsx` | پلن ثابت + موجودی موک | **Plans + Availability + Booking + Payment** |
| `/app/cases` | `.../cases-page.tsx` | `getCases()` | **Cases list** |
| `/app/cases/new` | `.../create-case-page.tsx` | فرم محلی + فاکتور موک | **Create case + Upload + Prepayment** |
| `/app/cases/:caseId` | `.../case-detail-page.tsx` | پرونده + اعلان + چت موک | **Case detail + stages + chat** |
| `/app/cases/:caseId/chat` | `.../case-chat-page.tsx` | ترد موک + ارسال محلی | **Case chat** |
| `/app/documents` | `.../document-request-page.tsx` | فقط validation محلی (بدون موک لیست) | **Document requests + Upload** |
| `/app/notifications` | `.../notifications-page.tsx` | `getNotifications()` | **Notifications** |
| `/app/discounts` | `.../discounts-page.tsx` | `getDiscountCodes()` | **Discount codes** |
| `/app/chat` | `.../chat-page.tsx` | چت پرونده‌ها + تیکت پشتیبانی موک | **Case chats index + Support tickets** |

### تایپ‌ها و قراردادها (مرجع واحد فرانت)

| لایه | مسیر |
|------|------|
| تایپ‌های دامنه | `src/features/app/types/index.ts` |
| Zod (قرارداد درخواست) | `src/features/app/schemas/index.ts` |
| موک دیتا | `src/features/app/mocks/data.ts` |
| پلن مشاوره (ثابت UI) | `src/features/app/constants/consultation-plans.ts` |
| بنر هوم | `src/features/app/constants/home-banner.ts` |
| گزینه‌ها / قوانین فایل / فاکتور موک | `src/features/app/constants/case-intake.ts` |
| ناوبری UI | `src/features/app/constants/nav.ts` |
| احراز هویت | `src/features/app/store/auth-store.ts` |

---

## ۴. چه چیزی موک است؟ چه چیزی موک نیست؟

### ۴.۱ موک (فقط خارج از production)

همه از `src/features/app/mocks/data.ts` با `withMockData(...)`:

| Getter | در production |
|--------|----------------|
| `getMockUser()` | `null` |
| `getHomeHeroBanners()` | `[]` |
| `getSpecialOffers()` | `[]` |
| `getDiscountCodes()` | `[]` |
| `getCases()` / `getCaseById` | `[]` / `undefined` |
| `getCaseChats()` / by case/id | `[]` / `undefined` |
| `getConsultations()` | `[]` |
| `getConsultationAvailability()` | `{ bookedDates:[], bookedSlots:[], timeSlots:[] }` |
| `getBlogCards()` | `[]` |
| `getNotifications()` | `[]` |
| `getTickets()` / by id | `[]` / `undefined` |
| `getCasePrepaymentInvoice()` | `null` |

### ۴.۲ ثابت فرانت (فعلاً hard-code — بهتر است از بک‌اند/CMS بیاید)

| محتوا | فایل | پیشنهاد بک‌اند |
|--------|------|----------------|
| ۴ پلن مشاوره + قیمت | `constants/consultation-plans.ts` | **بله — API کاتالوگ پلن** |
| ۳ اسلاید بنر هوم | `constants/home-banner.ts` (+ موک wrapper) | **بله — CMS کمپین** |
| گزینه‌های نقش / خواسته / رسیدگی / دسته | `case-intake.ts` + `nav.ts` | ترجیحاً کاتالوگ قابل مدیریت |
| قوانین متنی آپلود | `CASE_FILE_RULE_SECTIONS` | اختیاری CMS؛ محدودیت حجم/فرمت **حتماً سمت سرور** |
| روش‌های تحویل فایل (UX) | `CASE_DELIVERY_METHODS` | فرانت کافی است |
| منوی سایدبار | `nav.ts` | فقط فرانت (مسیر UI) |
| OTP دمو `12345` | `auth-store.ts` | جایگزین با SMS واقعی |

### ۴.۳ فقط فرانت / بدون persistence

- تقویم جلالی نمایشی (`src/lib/jalali.ts`) — کلید تاریخ ذخیره‌شونده **Gregorian `YYYY-MM-DD`**
- قوانین انتخاب اسلات (`src/features/app/lib/consultation-availability.ts`)
- ارسال پیام چت / تیکت فقط در `useState` محلی
- ویزارد ایجاد پرونده بعد از «پرداخت» فقط با `setTimeout` جلو می‌رود — **درگاه پرداخت ندارد**
- درخواست سند: submit فقط UI موفقیت نشان می‌دهد

---

## ۵. احراز هویت (اولویت ۱)

### رفتار فعلی فرانت

فایل: `src/features/app/store/auth-store.ts`

1. `requestOtp(phone)` → موک: `{ ok: true, demoCode: '12345' }`  
2. `verifyOtp(phone, code)` → فقط اگر `code === '12345'` → کاربر موک  
3. Persist در `localStorage` با کلید `vazinedalat-auth` فیلدهای `user` و `isAuthenticated`  
4. **هیچ refresh/access token ذخیره نمی‌شود**

### مدل کاربر (فرانت)

```ts
interface AppUser {
  id: string
  fullName: string
  phone: string          // 09XXXXXXXXX
  nationalIdMasked: string
}
```

### اعتبارسنجی

- موبایل: `/^09\d{9}$/`
- OTP: دقیقاً ۵ رقم  
اسکیما: `smsLoginPhoneSchema` / `smsLoginOtpSchema`

### API پیشنهادی

| متد | مسیر پیشنهادی | بدنه | پاسخ |
|-----|----------------|------|------|
| `POST` | `/auth/otp/request` | `{ phone }` | `{ success, data: { expiresIn } }` |
| `POST` | `/auth/otp/verify` | `{ phone, code }` | `{ success, data: { accessToken, refreshToken?, user: AppUser } }` |
| `POST` | `/auth/logout` | — | `{ success }` |
| `GET` | `/auth/me` | Bearer | `{ success, data: AppUser }` |

موک کاربر نمونه: `usr-1001` / علی رضایی / `09121234567` / `۰۰۱******۴۵`

---

## ۶. دامنه به دامنه — قرارداد داده + محل فرانت + نیاز بک‌اند

---

### ۶.۱ خانه اپ (`/app`)

**فرانت:** `app-home-page.tsx`  
**موک:** بنر، پیشنهاد ویژه، پرونده‌ها، مشاوره‌های فعال، بلاگ، تعداد خوانده‌نشده اعلان

#### بنر داینامیک (`HomeHeroBannerSlide`)

```ts
{
  id, eyebrow, title, description,
  ctaLabel, ctaTo,      // مسیر داخلی مثل /app/consultation
  imageSrc, imageAlt   // URL کامل یا path زیر BASE_URL
}
```

- ثابت فعلی: `constants/home-banner.ts` (۳ اسلاید: مشاوره / اسناد / پرونده)  
- Getter: `getHomeHeroBanners()`  
- کامپوننت: `components/home-hero-banner.tsx`

**API پیشنهادی:** `GET /home/banners`

#### پیشنهاد ویژه (`SpecialOffer`)

```ts
{
  id, title, subtitle, discountPercent, badge,
  expiresAt,   // لیبل فارسی نمایشی یا ISO + فرمت سمت کلاینت
  ctaLabel, href
}
```

**API:** `GET /home/offers`

#### کارت بلاگ (`BlogCard`)

```ts
{ id, slug?, title, excerpt, category, readMinutes, publishedAt }
```

**API:** `GET /home/blog` — جزئیات کامل مارکتینگ در [`docs/BLOG_API.md`](./BLOG_API.md) (`GET /blog/:slug`).
کارت‌های `/app` به `/blog/:slug` (یا `id`) لینک می‌شوند.

#### خلاصه پرونده / مشاوره روی هوم

از همان APIهای Cases و Consultations (لیست کوتاه یا `?limit=`).

---

### ۶.۲ پرونده‌ها

**فرانت:**  
- لیست: `cases-page.tsx` + `components/case-card.tsx`  
- جزئیات: `case-detail-page.tsx`  
- ایجاد: `create-case-page.tsx` (ویزارد ۴ مرحله‌ای)

#### مدل `LegalCase`

```ts
{
  id, title, caseNumber, category,
  status: 'intake'|'consultation'|'formed'|'in-review'|'follow-up'|'notified'|'closed',
  statusLabel,      // متن فارسی برای UI
  progress,         // 0..100
  updatedAt, nextAction,
  stages: [{ id, title, description, completed, at? }],
  chatId            // هر پرونده الزاماً یک چت پیگیری دارد
}
```

موک نمونه: `case-901`, `case-874`, `case-812`

#### ایجاد پرونده — بدنهٔ مورد انتظار (Zod)

اسکیما: `createCaseIntakeSchema` / `createCaseSchema`  
فایل: `schemas/index.ts`

| فیلد | قانون |
|------|--------|
| `clientRole` | enum فارسی (خواهان، خوانده، …) |
| `clientFullName` | min 3 |
| `clientFatherName` | min 2 |
| `clientNationalId` | ۱۰ رقم |
| `clientPhone` | موبایل ایران |
| `clientAddress` | min 15 |
| `title` | min 5 |
| `claimType` | enum ۸تایی |
| `category` | ملکی/خانواده/تجاری/کیفری/سایر |
| `proceedingType` | حقوقی/کیفری/... |
| `summary` | min 40 |
| `legalBasis` | min 15 |
| `opponentName` | min 2 |
| `opponentAddress` | اختیاری |
| `city` | min 2 |
| `courtHint` | اختیاری |
| `urgency` | عادی/فوری/خیلی فوری |
| `hasThanaAccount` | بله/خیر/نامشخص |
| `priorCaseNumber` | اختیاری |
| `acceptFileRules` | باید `true` |
| + فایل‌ها | multipart |

#### محدودیت فایل (اجباری سمت سرور)

از `constants/case-intake.ts` / `lib/case-files.ts`:

| محدودیت | مقدار |
|---------|--------|
| فرمت | PDF, JPG, JPEG, PNG, WEBP, ZIP |
| حجم هر فایل | حداکثر ۱۰MB |
| تعداد در آپلود پرونده/سند | حداکثر ۱۰ |
| تعداد پیوست هر پیام چت | حداکثر ۵ |

#### پیش‌پرداخت پرونده (`CasePrepaymentInvoice`)

موک: `MOCK_CASE_PREPAYMENT` در `case-intake.ts` — مبلغ نمونه `2_500_000` تومان، id: `inv-pre-1001`

```ts
{
  id, title, description, amount, currencyLabel,
  issuedAtLabel, dueLabel,
  items: [{ label, amount }]
}
```

**API پیشنهادی**

| متد | مسیر | توضیح |
|-----|------|--------|
| `GET` | `/cases` | لیست موکل |
| `GET` | `/cases/:id` | جزئیات + stages |
| `POST` | `/cases` | ایجاد (JSON یا multipart) |
| `POST` | `/cases/:id/files` | آپلود مدارک |
| `GET` | `/cases/:id/prepayment` | فاکتور پیش‌پرداخت |
| `POST` | `/cases/:id/prepayment/pay` | شروع/تأیید پرداخت |

مراحل ویزارد فرانت (فقط UX): `intake` → `upload` → `prepayment` → `completed`

---

### ۶.۳ چت پیگیری پرونده

**فرانت:**  
- `case-chat-page.tsx`  
- چت توکار در `case-detail-page.tsx`  
- لیست در تب «چت پرونده‌ها» در `chat-page.tsx`  
- کامپوننت: `components/chat-composer.tsx` ، `chat-thread-panel.tsx`

#### مدل‌ها

```ts
CaseChatThread {
  id, caseId, caseTitle, caseNumber,
  updatedAt, unreadCount, messages: ChatMessage[]
}

ChatMessage {
  id,
  sender: 'user' | 'admin' | 'system',
  body,              // حداکثر 2000 نویسه
  createdAt,
  attachments?: CaseFileMeta[]  // فعلاً فقط متادیتا؛ آپلود واقعی لازم است
}

CaseFileMeta { id, name, size, type }
```

ارسال فعلی: فقط append به state — **بدون API**.

**API پیشنهادی**

| متد | مسیر |
|-----|------|
| `GET` | `/chats` یا `/cases/:id/chat` |
| `POST` | `/cases/:id/chat/messages` (body + multipart attachments) |
| `POST` | `/chats/:id/read` |

---

### ۶.۴ مشاوره

**فرانت:** `consultation-page.tsx` + `components/consultation-*` + `BookingCalendar` / `TimeSlotPicker`

#### پلن‌ها (الان ثابت فرانت — باید داینامیک شود)

فایل: `constants/consultation-plans.ts`

| id | کانال | روز | ساعت | رایگان | قیمت نمونه (تومان) | مدت |
|----|--------|-----|------|--------|---------------------|------|
| `free-online` | online | ✓ | ✗ | ✓ | 0 | ۱۵ |
| `specialist-online` | online | ✓ | ✗ | ✗ | ۸۹۰٬۰۰۰ | ۳۰ |
| `in-person` | in-person | ✓ | ✓ | ✗ | ۱٬۴۵۰٬۰۰۰ | ۴۵ |
| `dargahi-premium` | in-person | ✓ | ✓ | ✗ | ۳٬۵۰۰٬۰۰۰ | ۶۰ |

فیلدهای پلن: ببینید `ConsultationPlan` در `types/index.ts`.

#### موجودی (`ConsultationAvailability`)

```ts
{
  bookedDates: string[]   // 'YYYY-MM-DD' روز کاملاً بسته
  bookedSlots: string[]   // 'YYYY-MM-DDTHH:mm' اسلات رزرو شده
  timeSlots: string[]     // 'HH:mm' ساعت‌های قابل رزرو برای حضوری
}
```

منطق کلاینت (`lib/consultation-availability.ts`):

1. روزهای گذشته غیرقابل انتخاب  
2. `bookedDates` بسته  
3. پلن‌های آنلاین: فقط روز  
4. پلن‌های حضوری: روز + ساعت از `timeSlots` منهای `bookedSlots`  
5. اگر همهٔ ساعت‌های یک روز پر باشد → آن روز برای حضوری بسته  

> کلید تاریخ همیشه **میلادی** است؛ نمایش جلالی فقط UI است.

#### درخواست رزرو (Zod: `consultationRequestSchema`)

```ts
{
  planId: 'free-online' | 'specialist-online' | 'in-person' | 'dargahi-premium',
  topic: string,          // min 3
  description: string,    // min 20
  dateKey: 'YYYY-MM-DD',
  time?: string,          // الزامی برای in-person و dargahi-premium
  discountCode?: string
}
```

لیست رزروهای من (`ConsultationSlot`): فیلدهای `id, topic, planId?, mode, modeLabel, startsAt, durationMinutes, price, discountedPrice?, status`.

**API پیشنهادی**

| متد | مسیر |
|-----|------|
| `GET` | `/consultation/plans` |
| `GET` | `/consultation/availability?planId=&from=&to=` |
| `POST` | `/consultation/bookings` |
| `GET` | `/consultation/bookings` |
| `POST` | `/consultation/bookings/:id/pay` |

---

### ۶.۵ درخواست سند

**فرانت:** `document-request-page.tsx`  
**موک لیست:** ندارد (فرم یک‌بارمصرف)  
**اسکیما:** `documentRequestSchema`

| فیلد | توضیح |
|------|--------|
| `documentType` | `petition` \| `declaration` \| `complaint` \| `brief` \| `power-of-attorney` |
| مشخصات خواهان | نام، پدر، کدملی، اقامتگاه |
| مشخصات خوانده | نام، اقامتگاه، موبایل اختیاری |
| `claimTitle`, `claimAmount?`, `claimBasis`, `courtRequest`, `evidenceSummary`, `notes?` |
| `acceptFileRules` | true |
| فایل‌ها | همان محدودیت پرونده |

لیبل انواع سند در UI: `DOCUMENT_TYPE_OPTIONS` در `constants/nav.ts`

**API:** `POST /documents` (multipart) + اختیاری `GET /documents` برای تاریخچه

---

### ۶.۶ اعلان‌ها

**فرانت:** `notifications-page.tsx` (+ بج هوم)

```ts
CaseNotification {
  id, caseId, caseTitle, title, body, createdAt, read,
  kind: 'status' | 'document' | 'hearing' | 'message'
}
```

**API:** `GET /notifications` ، `PATCH /notifications/:id/read` ، `POST /notifications/read-all`

---

### ۶.۷ تخفیف‌ها

**فرانت:** `discounts-page.tsx`  
**موک نمونه:** `VAZIN40`, `DADKHAST15`, `EZHAR20`

```ts
DiscountCode {
  id, code, title, description, percent,
  maxUsage, usedCount, expiresAt, applicableTo, isActive
}
```

**API:** `GET /discounts/mine` ، `POST /discounts/validate` `{ code, context }`

---

### ۶.۸ پشتیبانی عمومی (تیکت)

**فرانت:** تب دوم `chat-page.tsx`  
**اسکیما ایجاد:** `ticketSchema` → `{ subject, category: عمومی|مالی|فنی|پرونده, message }`

```ts
SupportTicket {
  id, subject, category, status, statusLabel, updatedAt, messages: ChatMessage[]
}
status: 'open' | 'pending' | 'answered' | 'closed'
```

**API:** `GET/POST /support/tickets` ، `POST /support/tickets/:id/messages`

---

## ۷. جدول اولویت پیاده‌سازی پیشنهادی برای بک‌اند

| اولویت | دامنه | دلیل |
|--------|--------|------|
| P0 | Auth OTP + JWT | بدون آن پنل در production قفل است |
| P0 | Cases CRUD + مراحل + آپلود | هسته محصول |
| P0 | Case chat | کارت پرونده و جزئیات وابسته است |
| P1 | Consultation plans + availability + booking | صفحه کامل آماده UI است |
| P1 | Prepayment / payment gateway | ویزارد پرونده در مرحله ۳ می‌ماند |
| P1 | Document requests | فرم آماده است |
| P2 | Notifications | هوم و صفحه اعلان |
| P2 | Discounts | صفحه و اعمال روی مشاوره |
| P2 | Support tickets | چت عمومی |
| P2 | Home banners / offers / blog | CMS یا ادمین |

---

## ۸. نمونه payloadهای موک (مرجع رفتار UI)

برای دیدن مقادیر واقعی فارسی و ساختار کامل آرایه‌ها، منبع حقیقت همین فایل است:

**`src/features/app/mocks/data.ts`**

شامل:

- کاربر دمو  
- ۳ پیشنهاد ویژه با درصد و `href`  
- ۳ کد تخفیف  
- ۳ پرونده با `stages` و `chatId`  
- ۳ ترد چت با پیام `user`/`admin`/`system`  
- ۳ اسلات مشاوره  
- موجودی نسبی به «امروز» (`bookedDates` با offset روز، `timeSlots` از ۰۹:۰۰ تا ۱۸:۰۰)  
- ۳ کارت بلاگ  
- ۳ اعلان  
- ۲ تیکت پشتیبانی  

فاکتور پیش‌پرداخت موک:

**`src/features/app/constants/case-intake.ts` → `MOCK_CASE_PREPAYMENT`**

---

## ۹. چک‌لیست تکمیل برای بک‌اند (Definition of Done)

- [ ] OTP واقعی + توکن؛ فرانت بتواند `localStorage.access_token` را ست کند  
- [ ] همه getterهای موک جایگزین‌پذیر با endpoint متناظر باشند  
- [ ] کاتالوگ پلن مشاوره از API بیاید (نه hard-code)  
- [ ] Availability منبع حقیقت سرور باشد (نه محاسبه فقط کلاینت)  
- [ ] آپلود فایل واقعی با همان MIME/حجم/تعداد  
- [ ] هر پرونده با ایجاد، `chatId` و ترد خالی/سیستمی بسازد  
- [ ] فاکتور و پرداخت پیش‌پرونده و مشاوره  
- [ ] بنر/پیشنهاد/بلاگ قابل مدیریت بدون دیپلوی فرانت  
- [ ] Envelope پاسخ با `success` / `data` / خطاهای استاندارد هم‌خوان با `src/services/api`

---

## ۱۰. مرز مسئولیت فرانت در برابر بک‌اند

| فقط فرانت بماند | باید بک‌اند تکمیل کند |
|------------------|------------------------|
| Layout، RTL، تقویم نمایشی جلالی، انیمیشن بنر | همه entityهای دامنه و persistence |
| مسیرهای React Router و منوی UI | Auth، پرداخت، SMS، ذخیره‌سازی فایل |
| کپی UX ثابت (مثل متن خالی‌حالت‌ها) مگر CMS بخواهید | قوانین بیزنس، ظرفیت رزرو، وضعیت پرونده |
| `BASE_PATH` GitHub Pages | CORS، rate-limit OTP، امنیت فایل |

---

## ۱۱. تماس سریع با فایل‌های کلیدی

```
src/features/app/types/index.ts          ← مدل‌ها
src/features/app/schemas/index.ts        ← قرارداد درخواست (Zod)
src/features/app/mocks/data.ts           ← نمونه موک کامل
src/features/app/store/auth-store.ts     ← جریان لاگین فعلی
src/services/api/client.ts               ← کلاینت آماده
src/services/api/types.ts                ← شکل پاسخ
src/features/app/pages/*                 ← مصرف‌کننده UI هر دامنه
src/features/app/constants/*             ← ثابت‌هایی که باید داینامیک شوند
```

---

*این سند بر اساس وضعیت فعلی ریپوی فرانت نوشته شده است. پس از اتصال هر endpoint، فرانت getter موک متناظر را حذف/سوییچ می‌کند و `VITE_APP_ENV=production` دیگر صفحه خالی نشان نخواهد داد.*
