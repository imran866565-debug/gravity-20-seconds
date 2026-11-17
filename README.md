# What If Gravity Switched Off for 20 Seconds?

A 20-second 3D explainer short in the 3D Kaz style: low-poly flat-shaded
Three.js scenes filmed frame by frame in headless Chromium, with a male
voiceover, HUD counters and captions, encoded with FFmpeg.

**Watch it:** see the `v1.0` release — `gravity-20-seconds.mp4`
(1280x720, ~22 s).

## The video

1. What if gravity switched off for twenty seconds?
2. Everything not tied down would start to float — chairs, books, and cars.
3. The air itself would drift away, and rivers would rise into the sky.
4. Then gravity snaps back, and everything falls at once.
5. Twenty seconds of weightlessness. A very long way down.

No people appear anywhere in the video — street, house, car, chairs,
books and water only. Voiceover is a male voice (edge-tts, en-US-GuyNeural), generated in CI. Timing of the
cuts was estimated from pauses in the voiceover.

## How it is made

- `gravity-20-seconds/` — the project: `shots.js` (the five shots),
  `beats.txt` (the script), `gen_voice.py` (generates the voiceover in CI with edge-tts).
- `studio/` — the 3D Kaz renderer, **unmodified**, included under its own
  licence (`LICENSE`, 3D Kaz Free Use License v1.0, Copyright 2026 GrowKaz).
  It is shared here for free, as the licence allows, so the video can be
  re-rendered from this repo alone.
- `.github/workflows/render.yml` — renders the video on GitHub Actions and
  attaches the MP4 to a release. Push a change to the project or the studio
  and a new render runs; or trigger it by hand from the Actions tab.

Re-render locally (Node 18+, FFmpeg, Playwright + Chromium):

```bash
cd studio && npm install && npm install playwright && npx playwright install chromium
node render.js ../gravity-20-seconds --audio ../gravity-20-seconds/voice.mp3 --out gravity-20-seconds.mp4
```

## Licence

- The video (`gravity-20-seconds.mp4`, the script, the shots) is the
  author's own work.
- `studio/` is Copyright (c) 2026 GrowKaz under the 3D Kaz Free Use License
  v1.0 — see `LICENSE`. Third-party software it downloads at install time
  (three.js, Playwright, Chromium, FFmpeg) stays under its own terms.
