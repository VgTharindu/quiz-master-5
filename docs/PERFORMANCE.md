# QUIZ MASTER 5: වේගය සහ Slow Internet Update

**Branch:** `perf/fast-loading` (`refactor/folder-structure` මත)
**දිනය:** 2026 නොවැම්බර් 15

මේ app එක භාවිත කරන්නේ ගොඩක් වෙලාවට පොඩි ළමයි, phone වලින්, සමහර වෙලාවට දුර්වල internet එකකින්. පරීක්ෂණයට කාල සීමාවක් තියෙන නිසා load වෙන්න බලාගෙන ඉන්න කාලය සහ network නැවතීම් නිසා උත්තර නැති වීම වැළැක්විය යුතුයි. මේ update එකේ අරමුණ ඒකයි.

---

## 1. ප්‍රතිඵල (මැනපු අගයන්)

Chrome DevTools network throttling එකෙන්, 390px phone screen එකක, cache නැතුව මැන්නා.

| මැනපු දේ | Network | පරණ | අලුත් |
|---|---|---|---|
| Home page එක පෙනෙන්න | Slow 3G | 8.4s | **5.4s** |
| Home page එක පෙනෙන්න | Fast 3G | 2.5s | **1.9s** |
| කලින් login වුණ ළමයාට test list එක පෙනෙන්න | Slow 3G | 8.4s | **7.9s** |
| කලින් login වුණ ළමයාට test list එක පෙනෙන්න | Fast 3G | 2.9s | **2.4s** |
| "පරීක්ෂණයට යන්න" ඔබපුවාම ඊළඟ පිටුව | දෙකම | ~0.02s | ~0.02s |

Download වෙන JavaScript ප්‍රමාණය (gzip):

| | පරණ | අලුත් |
|---|---|---|
| Home page එකට | 212 KB (එක file එකක්) | **~50 KB** (`index` 5 KB + `react` 45 KB) |
| ළමයාගේ පිටු | ඒ 212 KB එකේම | + `StudentApp` 3 KB + `supabase` 59 KB |
| සර්ගේ පිටු | ඒ 212 KB එකේම | + `TeacherApp` 5 KB |
| Excel library එක | ඒ 212 KB එකේම | 143 KB, **සර් Excel බොත්තම ඔබපුවාම විතරයි** |

> දෙවැනි පාර ඉඳන් ගොඩක් වේගවත්: `vercel.json` නිසා JS/CSS files phone එකේ cache එකේ තියෙනවා, test list එකත් phone එකේ cache එකේ තියෙන නිසා එවෙලේම පෙනෙනවා.

---

## 2. කළ වෙනස්කම්

### A. පළමු load එක කුඩා කිරීම (Code splitting)

| වෙනස | File | ඇයි |
|---|---|---|
| `StudentApp` සහ `TeacherApp` lazy load කිරීම | `src/App.jsx` | Home page එක පෙන්වන්න ඒවා ඕන නැහැ. ඕන වෙලාවට විතරක් download වෙනවා |
| Excel library එක on-demand (`await import("xlsx")`) | `src/utils/excel.js` | 143 KB library එකක්, සර්ට විතරයි ඕන |
| `react` සහ `supabase` වෙනම chunks (`manualChunks`) | `vite.config.js` | App code එක වෙනස් කරලා deploy කළාට මේවා වෙනස් වෙන්නේ නැහැ, phone එකේ cache එකේ තියෙන ඒවාම පාවිච්චි වෙනවා |
| Home page එක පෙන්වපු ගමන් ළමයාගේ කොටස කලින්ම download කිරීම (`requestIdleCallback`) | `src/App.jsx` | "පරීක්ෂණයට යන්න" ඔබපුවාම එවෙලේම පිටුව පෙනෙනවා |
| කලින් login වුණ ළමයාට ළමයාගේ chunks එකවර download කරන plugin එක (`preloadStudentChunks`) | `vite.config.js` | Round trip එකක් ඉතුරු වෙනවා (slow 3G එකේ ~0.5-2s) |
| `build.target: "es2020"` | `vite.config.js` | අලුත් browsers වලට කුඩා code |

### B. Slow / නැවතෙන internet එකට ඔරොත්තු දීම

| වෙනස | File | ඇයි |
|---|---|---|
| **පිළිතුරු save queue එක** (`useAnswerSaver`) | `src/features/student/useAnswerSaver.js` | පහළ විස්තරය බලන්න |
| Save තත්ත්වය පෙන්වීම ("✓ සුරැකිණි" / "සුරැකෙමින්…" / "⚠ ...") | `src/features/student/SaveStatus.jsx` | ළමයාට (සහ දෙමාපියන්ට) උත්තර save වුණාද කියලා පේනවා |
| `rpc()` wrapper: timeout (15s) + network දෝෂ වලට නැවත උත්සාහ (1s, 2s, 4s…) | `src/lib/rpc.js` | Slow network එකේ request එකක් සදාකාලිකව එල්ලිලා තියෙන්නේ නැහැ, තාවකාලික දෝෂ ස්වයංක්‍රීයව හැදෙනවා |
| ඉදිරිපත් කිරීම: හැම උත්තරයක්ම save වෙනකම් බලාගෙන ඉඳලා `finish_attempt` යවනවා, බැරි වුණොත් "නැවත උත්සාහ කරන්න" බොත්තම | `src/features/student/TestRunner.jsx` | කලින් network නැති වුණොත් ඉදිරිපත් වුණේ නැතුව නිශ්ශබ්දව home එකට ගියා |
| ප්‍රශ්න / ප්‍රතිඵල load වෙන්න බැරි වුණොත් "නැවත උත්සාහ කරන්න" | `TestRunner.jsx`, `ResultView.jsx`, `src/components/RetryMessage.jsx` | කලින් `get_questions` fail වුණොත් "රැඳී සිටින්න…" එකේ සදාකාලිකව හිරවුණා |
| Internet නැති විට තැඹිලි තීරුව | `src/components/NetworkBanner.jsx`, `src/hooks/useOnline.js` | ළමයාට ගැටලුව මොකක්ද කියලා තේරෙනවා |
| JS chunk එකක් download වෙන්න බැරි වුණොත් 3 වතාවක් නැවත උත්සාහ, ඊටත් බැරි නම් පණිවිඩයක් | `src/lib/lazyWithRetry.js`, `src/components/ErrorBoundary.jsx` | හිස් සුදු තිරයක් වෙනුවට "නැවත උත්සාහ කරන්න" බොත්තම |
| `start_attempt` network දෝෂයකට "ඔබ සහභාගී වී නැත" වෙනුවට "සම්බන්ධතාවය දුර්වලයි" | `src/features/student/StudentHome.jsx` | වැරදි පණිවිඩය නිවැරදි කළා |

#### පිළිතුරු save queue එක වැඩ කරන හැටි

```
ළමයා උත්තරයක් තෝරනවා
      │
      ▼
save(ans) ──► phone එකේ localStorage "pend_<aid>" එකේ තියනවා (refresh කළත් නැති වෙන්නේ නැහැ)
      │
      ▼
දැනටමත් යවමින්ද? ── ඔව් ──► "latest" එක update කරනවා විතරයි (යවලා ඉවර වුණාම අලුත්ම එක යවනවා)
      │ නැහැ
      ▼
save_answers යවනවා ── සාර්ථකයි ──► localStorage එකෙන් ඉවත් කරනවා, "✓ සුරැකිණි"
      │ අසාර්ථකයි
      ▼
"⚠" පෙන්වලා 1s, 2s, 4s … (උපරිම 15s) රැඳී සිට නැවත යවනවා.
Internet ආපු ගමන් ("online" event එක) එවෙලේම නැවත යවනවා.
```

- **එකවර යවන්නේ එක request එකක් විතරයි.** කලින් requests කීපයක් එකවර ගියොත්, පරණ එක පස්සේ server එකට ගිහින් අලුත් උත්තර overwrite කරන්න පුළුවන්කම තිබුණා. දැන් ඒක වෙන්න බැහැ.
- Offline වෙලා page එක refresh කළොත්, `get_questions` එකෙන් පස්සේ phone එකේ තියෙන (අලුත්) උත්තර පෙන්වලා server එකට යවනවා.
- යවන්න තියෙද්දී tab එක වහන්න ගියොත් browser එක අනතුරු ඇඟවීමක් පෙන්වනවා.

### C. වේගවත් navigation සහ caching

| වෙනස | File | ඇයි |
|---|---|---|
| Splash animation එක tab එකකට **එක පාරක් විතරයි** (`sessionStorage`) | `src/App.jsx` | පරීක්ෂණය අතරතුර refresh කළොත් ආයෙත් තත්පර 5ක් බලාගෙන ඉන්න ඕන නැහැ |
| Test list එක phone එකේ cache කරලා එවෙලේම පෙන්වීම, යටින් අලුත් කිරීම | `src/features/student/StudentHome.jsx` | Slow network එකේ "රැඳී සිටින්න" වෙනුවට එවෙලේම ලැයිස්තුව |
| App එක පසුබිමේ තියෙද්දී තත්පර 30 polling නවත්වීම, ආපහු ආපු ගමන් / internet ආපු ගමන් අලුත් කිරීම | `StudentHome.jsx` | Mobile data ඉතුරු වෙනවා |
| Supabase සහ Google Fonts වලට `preconnect` | `index.html` | DNS + TLS කලින්ම වෙනවා |
| Google Fonts non-blocking (`rel="preload"` + `onload`) | `index.html` | කලින් fonts download වෙනකම් පිටුව පෙන්වුණේ නැහැ. දැන් phone එකේ font එකෙන් පෙන්වලා, font එක ආවම මාරු වෙනවා |
| `vercel.json`: `/assets/*` වසරකට cache (`immutable`) | `vercel.json` | Vite file names වල hash එකක් තියෙන නිසා (`index-B9sVLlJu.js`) file එක වෙනස් වුණාම නමත් වෙනස් වෙනවා. ඒ නිසා ආරක්ෂිතව cache කරන්න පුළුවන් |

---

## 3. Test කළ දේවල්

- **Slow 3G / Fast 3G** throttling එකෙන් පරණ සහ අලුත් builds සසඳලා (ඉහළ වගුව).
- **Offline test:** පරීක්ෂණය අතරතුර internet කපලා උත්තරයක් තේරුවා → "⚠" සහ තැඹිලි තීරුව පෙනුණා, උත්තරය phone එකේ සුරැකුණා → internet ආපු ගමන් ස්වයංක්‍රීයව save වුණා. Offline වෙලා "ඉදිරිපත් කරන්න" ඔබපුවාම "ඉදිරිපත් කරමින්…" පෙන්වමින් රැඳී හිටියා → online වුණාම ඉදිරිපත් වෙලා ප්‍රතිඵල පෙනුණා. **එකම උත්තරයක්වත් නැති වුණේ නැහැ.**
- **Regression test:** ළමයාගේ flow එක (login → list → පරීක්ෂණය → ප්‍රතිඵල → පසුගිය පරීක්ෂණ) සහ සර්ගේ flow එක (login → නව test → ප්‍රශ්න edit → ප්‍රතිඵල → විශ්ලේෂණය → මාසික → Excel download), කිසිම error එකක් නැහැ.

ඔබටත් test කරන්න: Chrome → `F12` → **Network** tab → **No throttling** dropdown එක → **Slow 3G**. Offline test එකට ඒ dropdown එකෙන්ම **Offline** තෝරන්න.

---

## 4. තාම ඉතුරු සීමා (ඊළඟ updates වලට)

1. **පරීක්ෂණය ඉවර වුණාට පස්සේ server එක උත්තර බාරගන්නේ නැහැ.** `supabase.sql` එකේ `save_answers` එකේ `now() < end_at` කොන්දේසිය තියෙනවා. ඒ නිසා ළමයා පරීක්ෂණයේ අන්තිම මිනිත්තු කීපයේ offline වෙලා, ඉවර වෙලාවට පස්සේ online වුණොත් ඒ උත්තර save වෙන්නේ නැහැ. විසඳුමක් ලෙස server එකේ මිනිත්තු 2-3ක grace period එකක් දෙන්න පුළුවන් (SQL migration එකක්).
2. **පළමු පාර splash එක තාමත් තත්පර 5යි.** ඒක ඔබ ඉල්ලපු design එකක් නිසා තියාගත්තා. ඒ අතරතුර යටින් page එක load වෙන නිසා කාලය නාස්ති වෙන්නේ නැහැ. ඕන නම් කෙටි කරන්න පුළුවන්.
3. **සම්පූර්ණ offline mode (PWA / Service Worker) නැහැ.** Internet නැතුව app එක open කරන්න බැහැ. ඊළඟ පියවරක් ලෙස `vite-plugin-pwa` එකතු කරන්න පුළුවන්.
4. **Sinhala fonts (Noto Sans Sinhala) තාමත් Google එකෙන් එනවා.** Self-host කරලා subset කළොත් තවත් ටිකක් වේගවත් කරන්න පුළුවන්.
