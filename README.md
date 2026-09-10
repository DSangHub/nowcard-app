# NowCard — nowcard.app

A shopping helper for **Now Shopping**.

Shoppers drop a pin, write a list, and see nearby member merchants posting a single timed discount for the day: **2% / 3% / 5%** after **$25 / $35 / $50**. Pay with NowCard on file. Merchants flash a glimpse of Now on Sale items. Both sides keep more of the afternoon.

## Product rules

- One rate per merchant per day. The clock kills it at close.
- Thresholds stay memorable on purpose.
- NowCard tokenizes onto the everyday card via API, or the shopper one-click applies at a member Fintec.
- NowCard does not see or store PAN, CVV, track data, or ID images.
- Backend is a Stripe + Fintec bridge: membership, daily rate, threshold, token reference, settlement.

## Files

- `index.html` — shopper site and list helper
- `merchant.html` — daily-rate console, Now on Sale glimpses, mock settlement
- `styles.css` / `merchant.css` — shared and console styles
- `js/app.js` / `js/merchant.js` — helper demo and rate setter

## Preview

Open `index.html` or `merchant.html`, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

The helper demo uses a mock Midtown merchant set. Geolocation, if allowed, only labels the pin — it does not leave the page in this preview.

GitHub Pages: enable Pages on `main` / root to serve nowcard.app from this repo.

## Who this file set is for

This is a concept site you can put on nowcard.app while the live rails are built. It is not a licensed financial product.
