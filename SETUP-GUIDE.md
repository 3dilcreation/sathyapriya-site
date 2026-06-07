# Sathyapriya Website — Setup & Deploy Guide

Everything is built. This guide takes you from these files to a fully live site with
working AI tools, a working booking form, and shop buttons ready for payments.

Total time: ~20 minutes. Cost: free hosting + a small Anthropic credit (~Rs.400 lasts long).

---

## WHAT'S IN THIS FOLDER

```
sathyapriya-site/
├── index.html                    <- the website
├── netlify.toml                  <- Netlify config (don't edit)
└── netlify/
    └── functions/
        └── ai.js                 <- secret server code that hides your API key
```

Keep this exact folder structure. Don't rename or move files.

---

## PART 1 — GET YOUR ANTHROPIC API KEY (for the AI tools)

1. Go to **console.anthropic.com** and sign in (same account as Claude is fine).
2. Click **Billing** -> add a small amount of credit (Rs.400-800 is plenty for this usage).
3. Click **API Keys** -> **Create Key** -> name it "sathyapriya-site".
4. **Copy the key** (starts with `sk-ant-...`). You'll paste it into Netlify in Part 3.
   Keep it private — treat it like a password.

---

## PART 2 — DEPLOY TO NETLIFY

The drag-and-drop method does NOT support functions, so we use the free Git method.
Easiest path: GitHub + Netlify (one-time setup, then updates are automatic).

### 2A. Put the folder on GitHub
1. Create a free account at **github.com**.
2. Click **New repository** -> name it `sathyapriya-site` -> **Create**.
3. On the repo page click **uploading an existing file**.
4. Drag in ALL the contents of the `sathyapriya-site` folder
   (index.html, netlify.toml, AND the netlify folder). Commit.

### 2B. Connect Netlify
1. Create a free account at **netlify.com** (sign in with GitHub — simplest).
2. Click **Add new site** -> **Import an existing project** -> **GitHub**.
3. Pick your `sathyapriya-site` repo.
4. Leave build settings as detected (the netlify.toml handles it) -> **Deploy**.
5. In ~1 minute you get a live URL like `something-random.netlify.app`.
6. **Site configuration -> Change site name** to make it nicer, e.g. `sathyapriya.netlify.app`.

---

## PART 3 — ACTIVATE THE AI TOOLS (add your key safely)

1. In Netlify: **Site configuration -> Environment variables -> Add a variable**.
2. Key (name):  `ANTHROPIC_API_KEY`
3. Value:  paste your `sk-ant-...` key from Part 1.
4. Save, then go to **Deploys -> Trigger deploy -> Deploy site** (so it picks up the key).

Done — the three visitor tools and her private Blog Assistant now work live.
The key lives only on Netlify's server. It is NEVER in the website code, so no one can steal it.

---

## PART 4 — ACTIVATE THE BOOKING FORM (Formspree)

1. Create a free account at **formspree.io**.
2. **New form** -> name it "Bookings" -> set the email where she wants to RECEIVE messages.
3. Formspree gives you a form endpoint like `https://formspree.io/f/abcdwxyz`.
4. Copy the ID part (`abcdwxyz`).
5. In `index.html`, find this line (search for "YOUR_FORM_ID"):
   `<form id="bookingForm" class="reveal" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`
   Replace `YOUR_FORM_ID` with your real ID.
6. Re-upload index.html to GitHub (or edit it directly on GitHub -> commit).
   Netlify redeploys automatically. The first test submission asks her to confirm her email once.

Free plan = 50 submissions/month, which is plenty to start.

---

## PART 5 — ACTIVATE THE SHOP (Razorpay — best for India/UPI)

When she's ready to actually sell:
1. Sign up at **razorpay.com** and complete KYC (needs PAN + bank account).
2. Dashboard -> **Settings -> API Keys -> Generate Key**. Copy the **Key ID**
   (the public one, starts with `rzp_`). Do NOT use the Key Secret in the website.
3. In `index.html`, find:  `const RAZORPAY_KEY_ID = "RAZORPAY_KEY_ID";`
   Replace with your real Key ID, e.g. `const RAZORPAY_KEY_ID = "rzp_live_xxxxx";`
4. Re-upload / commit. Buy buttons now open real UPI/card checkout.

Note: this collects payment. To auto-deliver the digital file afterward, the simplest
route is to email the download link manually at first, or upgrade later.

### Easier alternative — Gumroad (zero coding, zero KYC hassle)
If Razorpay's KYC feels heavy for digital products: create products on **gumroad.com**,
and I can swap the Buy buttons to simply link to the Gumroad product pages. Gumroad
handles payment AND automatic file delivery. Tell me if you'd prefer this.

---

## PART 6 — PERSONAL TOUCHES (do anytime)

In `index.html`, search for these and replace:
- **Her photo:** find the `<div class="portrait">` block. Replace the big "S" with a real
  image — I can wire this for you if you send a photo, or use:
  `<img src="her-photo.jpg" style="width:100%;height:100%;object-fit:cover">` (upload the photo to the repo too).
- **Social links:** in the footer, the `<a href="#">7 Cups</a>` etc. — paste her real URLs.
- **Contact email:** footer "Email" link — change `href="#"` to `href="mailto:her@email.com"`.
- **Blog posts:** the 6 cards under "Writings" are samples. Replace titles/text with real posts
  (she can draft them using her private Blog Assistant button, bottom-right).

---

## A NOTE ON THE AI TOOLS & SAFETY

The tools are deliberately designed to help visitors *reflect and reach out to her* —
never to act as a therapist or give a diagnosis. Each carries a gentle disclaimer.
This protects both the people who visit (no one in real distress is left leaning on a bot)
and her, professionally. Please keep that framing if you edit the prompts in `ai.js`.

---

## QUICK CHECKLIST

[ ] Anthropic credit added + key copied
[ ] Folder on GitHub (with the netlify/ folder!)
[ ] Netlify connected + deployed
[ ] ANTHROPIC_API_KEY added in Netlify -> redeployed
[ ] Formspree ID pasted into index.html
[ ] (Later) Razorpay Key ID or Gumroad links added
[ ] Photo, socials, email, real blog posts added

That's it. Send her the netlify.app link and she's live. 🤍
