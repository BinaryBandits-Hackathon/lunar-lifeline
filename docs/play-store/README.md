# Google Play release guide

Everything needed to put the game on Google Play, in order. Items marked **(you)** need the account owner; everything else is ready in this folder or the repo.

## 0. Before anything: check the account type (you)

In Play Console, open **Settings → Developer account → Account details**.

- **Organization account:** you can release to everyone once the app is approved.
- **Personal account created after 13 November 2023:** Google requires a **closed test with at least 12 testers for 14 days in a row** before you can apply for production. Start the closed test as early as possible.

## 1. Create the app (you)

| Field | Value |
|---|---|
| App name | **Lunar Life** |
| Default language | English (United States) |
| App or game | Game |
| Free or paid | Free (a free app can never become paid) |
| Declarations | Read and tick all three yourself: Developer Program Policies, Play App Signing terms, US export laws |

**Package name** (set when the first build is uploaded, and **it can never be changed**): `com.binarybandits.lunarlife`

## 2. Store listing

**Short description** (80 characters max):

> Run a base on Mars and learn the real choices astronauts make. Ages 7-12.

**Full description:**

> Land on Mars and keep your crew alive!
>
> Lunar Life is a learning game for kids aged 7 to 12, made for the NASA Space Apps Challenge 2026. Every choice has a cost, just like on a real mission.
>
> • Split solar power between heaters, air machines, the greenhouse and the fuel plant
> • Grow lettuce and potatoes in a glass greenhouse
> • Plan spacewalks with a real pre-spacewalk checklist, and always take a buddy
> • Drive the rover to layered cliffs, a meteorite field and an old lander
> • Shelter from solar storms based on real storms recorded by NASA
> • Earn badges and rise from Trainee to Commander in the Astronaut Academy
>
> New systems unlock one day at a time, so young players learn step by step. Older players can choose Commander mode with every system open from the start.
>
> No ads. No accounts. No data collected. Progress is saved only on your device.

**Graphics** (all in this folder):

| Asset | File | Status |
|---|---|---|
| App icon 512 × 512 | `icon-512.png` | Ready |
| Feature graphic 1024 × 500 | `feature-graphic-1024x500.png` | Ready |
| Phone screenshots (2-8, landscape OK) | `screenshots/` | To do: take from the live game |
| Tablet screenshots (7" and 10") | `screenshots/` | To do, needed to appear on tablets |

**Category:** Education (or Games → Educational). **Tags:** Space, Science, Kids.

**Privacy policy URL:** `https://nasa-hack-26.pages.dev/privacy`

## 3. App content forms (you)

| Form | Answer |
|---|---|
| Privacy policy | The URL above. Replace `[team contact email]` in `public/privacy.html` first. |
| App access | All functionality is available without special access |
| Ads | No ads |
| Content rating | Fill in the questionnaire honestly: no violence, no user interaction, no sharing of location, no purchases. Expect "Everyone" / PEGI 3 |
| Target audience | Ages 6-8 and 9-12 (this puts the app under Google's **Families policy**) |
| Data safety | Data collected: **none**. Data shared: **none**. (Name and progress stay on the device and are never sent, so they don't count as collected.) Encrypted in transit: not applicable |
| Government / news / health / financial apps | No |

**Families policy checks already met in the code:** no ads, no analytics, no accounts, no outside requests (fonts and NASA data are built in), read-aloud uses on-device voices only.

## 4. Build the Android app (needs your OK to download tools)

The game is a website, so it is wrapped as a **Trusted Web Activity (TWA)**: a small Android app that opens the live game full screen. The web build already has what a TWA needs: the app manifest, icons, landscape orientation and offline support.

1. Install Google's TWA tool and let it fetch Java and the Android SDK (about 1-2 GB):
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://nasa-hack-26.pages.dev/manifest.webmanifest
   ```
   Use package name `com.binarybandits.lunarlife`, landscape, and keep the generated signing key.
2. **Store the signing key and its passwords somewhere safe and private** (not in the repo). If it is lost, the app can never be updated.
3. Build: `bubblewrap build` → produces `app-release-bundle.aab`.
4. Upload the `.aab` to **Testing → Internal testing** first, then the closed test.
5. Prove the site belongs to the app: copy the **SHA-256 fingerprint** from Play Console (**Setup → App signing**) into `public/.well-known/assetlinks.json`, deploy, then check that the app opens without a browser bar.

## 4b. Built so far

The first build is done (version 1.0.0, code 1, minimum Android 7.0):

- `C:Users	ijul.lunar-life-buildandroidapp-release-bundle.aab`: upload this to Play Console
- `C:Users	ijul.lunar-life-buildandroidapp-release-signed.apk`: install directly on a phone to test
- Signing key and passwords: `C:Users	ijul.lunar-life-buildandroidSIGNING-KEY-README.txt` (back it up, never commit it)
- `public/.well-known/assetlinks.json` holds the upload key fingerprint. After the first upload, **also add** the app signing key fingerprint from Play Console (Setup → App signing), or the app will show a browser bar.

To rebuild: raise `appVersionCode` in `twa-manifest.json`, then run `bubblewrap update` and `bubblewrap build` in that folder.

## 5. Release order

1. Internal testing: the team installs and plays it.
2. Closed testing: 12+ testers for 14 days (personal accounts).
3. Apply for production, then review by Google (can take several days for apps for children).
