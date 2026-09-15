# گزارش اتصال فرانت به بک‌اند NestJS

> تاریخ: ۲۰۲۶-۰۹-۱۵  
> فرانت: `frontend-vz`  
> بک‌اند: `nestjs-vz` (`docs/BACKEND_DELIVERY.md`)  
> Base API: `http://localhost:3000/api/v1`

---

## ۱. خلاصه

فرانت پنل موکل به API واقعی Nest وصل شد. موک به‌صورت پیش‌فرض **خاموش** است (`VITE_USE_MOCK=false`). محیط development و production با فایل‌های env جدا تعریف شده‌اند.

---

## ۲. انجام‌شده ✅

| حوزه | کار |
|------|-----|
| Env جدا | `.env.development` / `.env.production` / به‌روزرسانی `.env.example` |
| کلاینت HTTP | Unwrap envelope Nest، Bearer، refresh روی ۴۰۱، FormData بدون Content-Type اشتباه |
| توکن | `access_token` + `refresh_token` در localStorage |
| Auth | OTP request/verify از API؛ hydrate با `/auth/me`؛ logout با API |
| Home | banners / offers / blog / cases / bookings / notifications |
| Cases | list, detail, create, upload files, prepayment, pay |
| Chats | list, by case, send message (+files), mark read |
| Consultation | plans, availability, book, list, pay stub |
| Documents | create multipart + list |
| Notifications | list, mark read, read-all |
| Discounts | mine |
| Support | tickets list/create/message |
| Catalog | case-intake برای گزینه‌های فرم ایجاد پرونده |
| فایل محلی | `CaseFileMeta.file` برای آپلود واقعی |
| کیفیت | `typecheck` / `lint` / `test` (۳۲) / `build` سبز |
| Smoke زنده | OTP + JWT + home/cases/plans/notifications/discounts/chats/support/catalog روی `:3000` |

### مسیرهای کلیدی فرانت

```
src/config/env.ts
src/services/api/client.ts | token.ts | types.ts
src/features/app/api/*          ← لایه فراخوانی API
src/features/app/store/auth-store.ts
src/features/app/pages/*        ← React Query
docs/FRONTEND_API_INTEGRATION.md  ← این فایل
```

### نحوه اجرا

```bash
# بک‌اند
cd nestjs-vz && npm run start:dev

# فرانت (development → localhost API)
cd frontend-vz && npm run dev
```

ورود دمو: موبایل `09121234567` · OTP `12345`

موک آفلاین (اختیاری):

```env
VITE_USE_MOCK=true
```

---

## ۳. ناقص / خارج از محدوده فرانت ⚠️

| مورد | وضعیت | توضیح |
|------|--------|--------|
| SMS واقعی | Stub سمت Nest | در non-prod همان `demoCode` برمی‌گردد |
| درگاه پرداخت | Stub سمت Nest | `.../pay` فقط وضعیت را `paid` می‌کند |
| URL فایل در چت/سند | ناقص API | فقط case upload فیلد `url` دارد؛ چت/سند متادیتا بدون URL |
| `VITE_API_URL` پروداکشن | Placeholder | `https://api.vazinedalat.ir/api/v1` — باید با دامنه واقعی عوض شود |
| E2E مرورگر خودکار | انجام نشد | تست دستی/اسکریپت curl + unit/gate فرانت |
| WebSocket چت زنده | ندارد | polling/refetch پس از ارسال |

---

## ۴. تفاوت Development / Production

| | Development | Production |
|--|-------------|------------|
| Env file | `.env.development` | `.env.production` |
| `VITE_APP_ENV` | `development` | `production` |
| API | `http://localhost:3000/api/v1` | `https://api.vazinedalat.ir/api/v1` (قابل تغییر) |
| Assets | `http://localhost:3000` | همان host API |
| Mock | فقط اگر `VITE_USE_MOCK=true` | همیشه off |

---

## ۵. نگاشت endpoint ↔ صفحه

| صفحه | Endpointهای اصلی |
|------|-------------------|
| Login | `POST /auth/otp/request`, `POST /auth/otp/verify` |
| Home | `/home/*`, `/cases`, `/consultation/bookings`, `/notifications` |
| Cases | `GET /cases` |
| Create case | `POST /cases`, `POST /cases/:id/files`, prepayment + pay، `GET /catalog/case-intake` |
| Case detail/chat | `GET /cases/:id`, chat GET/POST/read، notifications |
| Consultation | plans / availability / bookings / pay |
| Documents | `POST/GET /documents` |
| Notifications | GET / PATCH read / read-all |
| Discounts | `GET /discounts/mine` |
| Chat hub | `GET /chats`, support tickets CRUD پیام |

---

## ۶. تست‌های انجام‌شده

1. **Unit/Lint/Build فرانت:** همه سبز  
2. **Live Nest smoke (curl + JWT):**  
   - banners: ۳  
   - cases: ≥۳  
   - plans: ۴  
   - notifications: ۳  
   - discounts: ۳  
   - chats / support / catalog: OK  
3. **باگ رفع‌شده حین کار:**  
   - تست `mock-gate` با منطق جدید `VITE_USE_MOCK` هم‌تراز شد  
   - import نوع `CreateCaseValues` در `api/cases.ts` اصلاح شد  
   - auth login به async تبدیل شد  

---

## ۷. جمع‌بندی یک‌خطی

اتصال فرانت به Nest برای کل دامنه پنل موکل انجام و gate سبز شد؛ SMS و پرداخت واقعی همچنان stub بک‌اند هستند و باید قبل از production واقعی شوند.
