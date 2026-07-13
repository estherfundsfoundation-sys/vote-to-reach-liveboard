# Vote to REACH Liveboard

This is the public, read-only Vote to REACH Scholarship Competition rankings board. It does **not** accept votes. The two official Jotform ballots remain the only place a voter submits payment or casts a vote.

## What the public sees

- REACH-branded live rankings
- Combined total of **verified** votes from both official ballots
- Candidate names, schools, rank, and verified vote total only
- The two official voting-form links
- No voter names, email addresses, payment records, or submission details

## Connect it before sharing it publicly

1. Create a GitHub repository named `vote-to-reach-liveboard`.
2. Upload the **contents** of this folder (not the folder itself and not the ZIP file).
3. Import that repository into Vercel.
4. In Vercel, open **Settings → Environment Variables** and add:
   - Name: `JOTFORM_API_KEY`
   - Value: the Jotform API key made for this board
   - Environment: Production, Preview, and Development
5. Add a second variable:
   - Name: `JOTFORM_FORM_IDS`
   - Value: `261923509398165,261923179002150`
6. Redeploy the project.

The key must be a Jotform key that has read access only, if Jotform offers a permissions choice. Do not put the key in a site file, GitHub, or chat.

## How the totals stay responsible

The server checks both forms privately, discovers the candidate products from each ballot, and sends the browser only candidate totals. It deliberately counts a submission only when it finds an explicit completed/paid payment status. The board is cached for fifteen minutes to respect Jotform's API limits; the page may refresh every two minutes but it does not repeatedly spend API calls.

## Before the public launch

After the key is saved, open `/api/leaderboard` on the deployed site once. Confirm that the candidate total matches the Jotform payment records. If Jotform represents a payment field differently on these two particular forms, the API will safely hold the totals instead of showing unverified results. In that case, we will adjust the private extraction pattern—without exposing a voter or a key.
