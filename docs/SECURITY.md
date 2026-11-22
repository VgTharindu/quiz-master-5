# QUIZ MASTER 5 — Security

## කරන්න ඕනෙ දේවල් (එක පාරක් විතරයි)

1. Supabase → **SQL Editor** → `migrations/004_security.sql` එක open කරන්න.
2. `TEACHER_EMAIL` කියන තැනට සර් login වෙන email එක දාන්න → **Run**.
   - Email එක වැරදි නම් "Teacher account not found" කියලා නවතිනවා. කිසිම දෙයක් වෙනස් වෙන්නේ නැහැ.
3. Supabase → **Authentication → Sign In / Providers** → **Allow new users to sign up** → **OFF**.
4. Site එක deploy කරන්න (`vercel.json` එකේ security headers එනවා).

මේ පියවර දෙක (migration සහ deploy) ඕනෑම පිළිවෙළකට කරන්න පුළුවන්. App එක දෙකටම ගැලපෙනවා.

## Server එකේ ආරක්ෂාව (ඇත්තම ආරක්ෂාව)

| අවදානම | කලින් | දැන් |
|---|---|---|
| ඕනෑම කෙනෙක් sign up වෙලා tables කියවීම / මැකීම | ඕනෑම logged-in user කෙනෙක්ට හැමදේම | `teachers` table එකේ ඉන්න අයට විතරයි |
| වෙන ළමයෙක්ගේ නමින් ඇතුල් වෙලා උත්තර වෙනස් කිරීම | පුළුවන් වුණා | පටන් ගත්ත phone එකෙන් විතරයි (device key) |
| ප්‍රශ්න images upload කිරීම | ඕනෑම logged-in user කෙනෙක් | සර්ට විතරයි |
| දිග නම් / ලොකු data යැවීම | සීමාවක් නැහැ | නම අකුරු 2-60, උත්තර 20KB |
| Coin board (හැම ළමයාගේම නම්) | ඕනෑම logged-in user කෙනෙක් | සර්ට විතරයි |
| Test එක අතරතුර වෙනත් app එකකට යාම (AI) | දැනගන්න විදිහක් නැහැ | ගිය වාර ගණන සර්ගේ ප්‍රතිඵල ලැයිස්තුවේ (screen එකේ) සහ Excel එකේ පෙනෙනවා |

ප්‍රශ්න load කරද්දී (`get_questions`) නිවැරදි උත්තරය කවදාවත් browser එකට යවන්නේ නැහැ. ඒ නිසා
inspect කළත්, network tab එක බැලුවත් test එක අතරතුර උත්තර හොයාගන්න බැහැ. නිවැරදි උත්තර පෙන්වන්නේ
ළමයා submit කළාට පස්සේ විතරයි.

Test එක අතරතුර phone screen එක on කරලා තියාගන්නවා (Wake Lock). ඒ නිසා screen එක auto-lock වීම
"වෙනත් app එකකට ගියා" කියලා ගණන් වෙන්නේ නැහැ. Call එකක් ආවොත් ඒක ගණන් වෙන්න පුළුවන්, ඒ නිසා
මේ ගණන සැකයක් ඇති කරන සලකුණක් විතරයි, සාක්ෂියක් නෙවෙයි.

## Browser එකේ බාධක (deterrents)

ළමයි (සහ teacher නොවන හැමෝම) බලන pages වල:
- Text select කරන්න, copy / cut කරන්න, long-press menu, right-click, images drag කරන්න බැහැ
- F12, Ctrl+Shift+I / J / C, Ctrl+U (view source), Ctrl+S, Ctrl+P block කරලා තියෙනවා
- Print කළොත් හිස් පිටුවක් එනවා
- Production build එකේ source maps නැහැ, code එක minify කරලා

සර්ගේ dashboard එකේ මේවා නැහැ (copy, right-click සාමාන්‍ය විදිහට වැඩ කරනවා).

## සීමාවන් (අවංකව)

- Browser එකකට යවන ඕනෑම දෙයක් දන්න කෙනෙක්ට කියවන්න පුළුවන්. Browser menu එකෙන් DevTools open කරන්න
  හරි, JavaScript off කරන්න හරි පුළුවන්. ඒ නිසා browser බාධක **නවත්වන්නේ සාමාන්‍ය ළමයින්ව විතරයි**.
- **Phone එකෙන් screenshot එකක් අරන් AI එකකට දාන එක, නැත්නම් වෙන phone එකකින් photo එකක් ගන්න එක කිසිම
  website එකකට නවත්වන්න බැහැ.** App එකෙන් එළියට යන එක record වෙන එකයි, test එක ඉවර වෙනකම් උත්තර
  නොපෙන්වන එකයි තමයි ලොකුම ආරක්ෂාව.
- එක් එක් ප්‍රශ්නයේ කාල සීමාව තවම browser එකෙන් විතරයි පාලනය කරන්නේ.
- දැනට ළමයෙක්ට ඕනෑම නමකින් ඇතුල් වෙලා submit කරලා උත්තර බලාගන්න පුළුවන් (testing කාලය සඳහා).
  ඉස්සරහට සර් දෙන key එකකින් ඇතුල් වෙන විදිහට මාරු කළාම මේක නැවතෙනවා.
- ළමයින් අඳුනගන්නේ නමෙන් විතරයි (password නැහැ). Device key එකෙන් running test එකක් ආරක්ෂා වෙනවා.
  ඒත් ළමයෙක් phone එක මාරු කළොත් හරි browser data මැකුවොත් හරි, test එක ඉවර වෙනකම් ආයේ ඇතුල් වෙන්න බැහැ.
  එහෙම වුණොත් සර්ට SQL Editor එකේ මෙහෙම reset කරන්න පුළුවන්:
  `update attempts set device_key = null where lower(student) = lower('ළමයාගේ නම');`
