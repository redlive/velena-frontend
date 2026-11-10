# Velena Hairstyling House — сайт / website (velena.ca)

Статический сайт (HTML/CSS/JS), тёмный вариант 2: лесной зелёный, золото, немного пудрово-розового.
Страницы: `index.html` (главная), `services.html` (услуги и цены), `gallery.html` (Instagram), `contact.html` (адрес, часы, карта, форма), `404.html`.
Все пути относительные, шрифты и картинки лежат внутри папки. Логотип — оригинальный (`images/logo.jpg`), остальные фото сгенерированы ИИ.

---

## 🇷🇺 Русский

### 1. Посмотреть сайт у себя на компьютере
```bash
cd velena-site-v2
python3 -m http.server 8000
```
Откройте в браузере http://localhost:8000. Остановить: Ctrl+C.

### 2. Что и где менять
Всё основное — в одном файле **`js/config.js`**:
| Поле | Что это |
|---|---|
| `siteUrl` | адрес сайта, сейчас `https://velena.ca/` |
| `email`, `phoneDisplay`, `phoneTel` | почта и телефон (ссылки «позвонить / написать» берутся отсюда) |
| `addressLines`, `hoursText` | адрес и часы работы |
| `mapEmbedUrl`, `directionsUrl` | карта Google и ссылка «Get directions» |
| `instagram.handle` | `velenahouse` |
| `instagram.widget`, `feedId`, `snapwidgetId`, `postUrls` | лента Instagram на странице Gallery (см. п. 3) |
| `social.facebook` | ссылка на Facebook (пусто = скрыто) |
| `contactFormEndpoint`, `newsletterEndpoint` | куда отправлять формы. Пусто = у посетителя открывается почта с готовым письмом на velenahouse@gmail.com. Можно вставить бесплатный адрес Formspree (`https://formspree.io/f/XXXX`) |

Те же данные прописаны и прямо в HTML (сайт работает и без JavaScript). Цены и тексты меняются прямо в `services.html` / `index.html`.

### 3. Лента Instagram (страница Gallery)
**Выбран вариант: Behold (behold.so), бесплатный план.**
Почему: работает без сервера (подходит для GitHub Pages), сам показывает 6 последних постов, обновляется раз в сутки, без рекламы, а фото рисуются в стиле сайта (золотая рамка, сетка), клик ведёт прямо в Instagram. Лимит — 1 200 показов страницы Gallery в месяц; если лимит кончится, сайт сам покажет блок «See our work on Instagram @velenahouse» со ссылкой (ничего не ломается).
Пока лента не подключена, на Gallery показан именно этот блок, без фотографий.

Как подключить (делает владелец аккаунта @velenahouse):
1. В приложении Instagram: Настройки → Тип аккаунта → переключиться на **профессиональный** (Бизнес или Автор), если ещё не сделано. Это бесплатно. Сторонние ленты работают только с такими аккаунтами.
2. Зайти на https://behold.so → Sign up (бесплатно) → **Connect Instagram** → войти в @velenahouse и разрешить доступ.
3. **Create feed** → выбрать тип **JSON** (или любой). Скопировать **Feed ID** (строка вида `AbCdEf123456`, есть в адресе `https://feeds.behold.so/AbCdEf123456`).
4. В `js/config.js`: `instagram: { handle: "velenahouse", widget: "behold", feedId: "AbCdEf123456", ... }` → сохранить, закоммитить, запушить.
5. (По желанию) в Behold в настройках фида разрешить только домен `velena.ca`.

Запасные варианты (тоже бесплатно):
- **SnapWidget** (`widget: "snapwidget"`, `snapwidgetId: "123456"` — число из кода `snapwidget.com/embed/123456`): без лимита показов, обновление каждые 15 мин, но оформление их, а клик по фото в бесплатной версии ведёт на snapwidget.com.
- **Официальные embed Instagram** (`widget: "posts"`, в `postUrls` перечислить ссылки на посты): без сервисов, но новые посты надо добавлять руками.
- Не подходят: LightWidget бесплатный (не работает на HTTPS), Elfsight (200 показов/мес), Juicer (300 показов/мес, их логотип).

### 4. Бесплатный хостинг на GitHub Pages
Папка уже подготовлена: есть `.nojekyll`, `404.html`, `.gitignore`, git-репозиторий с коммитом на ветке `main`. Файла `CNAME` нет специально — GitHub создаст его сам на шаге 4.
1. Создать на GitHub пустой публичный репозиторий (например `velena-site`) и запушить:
   ```bash
   git remote add origin https://github.com/<user>/velena-site.git
   git push -u origin main
   ```
2. Репозиторий → **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, папка **/ (root)** → Save.
   Через 1–2 минуты сайт откроется по адресу `https://<user>.github.io/velena-site/` — проверить.
3. **Подтвердить домен** (защита от захвата): аватар → **Settings** (профиля) → **Pages** → **Add a domain** → `velena.ca`. GitHub покажет TXT-запись вида `_github-pages-challenge-<user>.velena.ca` = `код`. Добавить её в DNS (п. 5), затем нажать **Verify**. TXT-запись не удалять.
4. Репозиторий → Settings → Pages → **Custom domain**: `velena.ca` → Save.
5. Поменять DNS (п. 5). Когда GitHub напишет «DNS check successful» и выпустит сертификат (до 24 ч) — включить **Enforce HTTPS**.

### 5. DNS для velena.ca (Google Cloud DNS)
Домен зарегистрирован в Tucows, DNS-серверы — Google Cloud DNS. Сейчас `velena.ca` указывает на Square (A `199.34.228.186`).
Google Cloud Console → **Network services → Cloud DNS** → зона velena.ca:
| Имя | Тип | Значение |
|---|---|---|
| `velena.ca.` | **A** | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (заменить старую `199.34.228.186`) |
| `velena.ca.` | **AAAA** | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www.velena.ca.` | **CNAME** | `<user>.github.io.` (заменить текущую запись www) |
| `_github-pages-challenge-<user>.velena.ca.` | **TXT** | код из шага 4.3 |

Не трогать остальные записи (MX, другие TXT и т.п.). Не использовать wildcard `*.velena.ca`.
Совет: за день до переключения уменьшить TTL записей A/www до 300 сек.
Проверка: `dig velena.ca +short` → четыре адреса 185.199.x.153.

### 6. Порядок переезда с Square Online (важно)
1. Сайт выложен и проверен на `<user>.github.io/velena-site/`.
2. Домен подтверждён (TXT), в Pages указан `velena.ca`.
3. **Сначала** переключить DNS (п. 5) и дождаться, что velena.ca открывает новый сайт по HTTPS (Enforce HTTPS включён).
4. Подождать пару дней, проверить с телефона и компьютера.
5. **Только после этого** отменить платный план Square Online. Сам аккаунт Square, терминал и бесплатные функции остаются — отменяется только подписка на сайт.
Если отменить Square Online раньше, velena.ca будет недоступен, пока DNS не переключён.

---

## 🇬🇧 English (short)

**Preview:** `cd velena-site-v2 && python3 -m http.server 8000` → http://localhost:8000

**Edit:** contact details, hours, map, Instagram and form endpoints live in `js/config.js`. Prices and copy are plain HTML in `services.html` / `index.html`.

**Instagram (gallery.html):** chosen provider is **Behold free** (no backend, latest 6 posts, daily refresh, rendered in the site's own style, links to Instagram, 1,200 gallery views/month). Steps: make @velenahouse a Professional (Business/Creator) account → behold.so → Connect Instagram → Create feed → copy Feed ID → set `instagram.feedId` in `js/config.js`. Until then (or if the feed fails/pauses) the page shows a "See our work on Instagram @velenahouse" block with a follow link, no photos. Alternatives: `widget: "snapwidget"` + `snapwidgetId` (unlimited views, their styling), or `widget: "posts"` + `postUrls` (official Instagram embeds, manual).

**GitHub Pages:** push this repo (branch `main`, has `.nojekyll` and `404.html`, no `CNAME` on purpose) → Settings → Pages → Deploy from branch `main` / root → verify domain under profile Settings → Pages → Add a domain (TXT `_github-pages-challenge-<user>.velena.ca`) → repo Pages → Custom domain `velena.ca` → after DNS check passes, tick **Enforce HTTPS**.

**DNS (Google Cloud DNS):** apex `velena.ca` A → 185.199.108.153 / 109.153 / 110.153 / 111.153; AAAA → 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153; `www` CNAME → `<user>.github.io.`; plus the verification TXT. Replace the old Square A record 199.34.228.186; leave other records alone; no wildcards.

**Order:** publish and test on github.io → verify domain → switch DNS → confirm https://velena.ca works → only then cancel the paid Square Online plan.

**Note:** `404.html` uses `<base href="/">` so it works at any depth on velena.ca; on the temporary `github.io/velena-site/` address the 404 page itself will look unstyled (normal pages are fine).

Fonts: Cormorant Garamond and Inter (SIL Open Font License), self-hosted in `fonts/`.
