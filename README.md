# Toronto Snow Help

Snow removal site deployed as the Cloudflare Worker `quant-snow1`
(https://quant-snow1.unknwn-creation.workers.dev/). Cloudflare builds it from `main` with `npm run build`.

- `src/config.mjs`: phone, partner links, services, cities.
- `src/pages.mjs` / `src/layout.mjs`: page markup; `build.mjs` renders them into `dist/`.
- `functions/api/lead.js`: the estimate form. Each lead goes to Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
  and to Toronto CRM through the `CRM` service binding; the first line of every notification is `Site: <domain>`.
- Call buttons: after the visitor returns from the phone app, the tab opens `/interested/` (see `public/assets/js/main.js`).
