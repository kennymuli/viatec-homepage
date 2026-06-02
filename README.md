# Viatec Homepage

A modern, clean-energy editorial redesign of the [Viatec](https://www.viatec.us/) homepage —
bright canvas, big confident type, hairline rules, and an electric-blue accent system sampled
from the brand's hero render.

Viatec sells **WorkForce™ / SmartPTO fleet electrification**: battery ePTO systems that power
utility work trucks with the diesel engine off — clean, quiet, and a ~2.5-year payback.

## Stack

Plain static site — no build step, no dependencies.

- `index.html` — the full homepage, top to bottom
- `styles.css` — design system + all section styles (color/type tokens in `:root`)
- `app.js` — lightweight interactions (scroll reveals, count-ups, marquee, FAQ accordion, audience tabs, mobile drawer)
- `assets/` — product renders, hero truck, fuel-gauge frames, powertrain diagram, Fleet Intelligence dashboard

## Run it

It's static — open `index.html` directly, or serve the folder with the bundled
zero-dependency Node server:

```sh
node server.js            # http://localhost:4178  (set PORT to override)
```

Any static file server works too (e.g. `python3 -m http.server`).

## Signature interactions

- **Hero count-up:** the four KPI stats start grey and count up, then crossfade into the accent
  gradient as they finish — and the truck render blooms from greyscale into full color in lock-step
  with the numbers turning blue. The sequence is earned by a scroll gesture, not first paint.
- **"Save your engines" gauge:** holds on the empty/yellow instrument cluster, then charges up to
  the full/blue cluster (blue bloom + light sweep) when scrolled into view.
- Site-wide accent gradient drives accent text, numbers, buttons, and the logo mark.

## Still to drop in

- Real **Viatec logo** SVG (currently a clean wordmark stand-in)
- Three **role photos** for the audience tabs (Technicians / Managers / Operators, 4:3)
- Case-study / news article imagery (16:10)

These slots are labeled placeholders in the markup.
