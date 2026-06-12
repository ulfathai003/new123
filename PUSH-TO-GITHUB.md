# Push this to your GitHub (2 minutes)

This folder is already a complete Git repository with full history. To publish it:

## 1. Create an empty repo on GitHub
Go to https://github.com/new — name it e.g. `softiintel-website`.
**Do NOT** add a README, .gitignore, or license (this project already has them).

## 2. Connect and push
Open a terminal **in this folder** and run (replace YOUR-USERNAME):

```bash
git remote add origin https://github.com/YOUR-USERNAME/softiintel-website.git
git branch -M main
git push -u origin main
```

If it asks you to authenticate, log in with your GitHub account (or a Personal
Access Token as the password).

## 3. (Recommended) Auto-deploy on Vercel
- Go to https://vercel.com → **Add New… → Project** → import the repo you just pushed.
- Framework preset: **Next.js** (auto-detected). No environment variables needed.
- Click **Deploy**. Every future `git push` redeploys automatically — no CLI, no manual steps.

That's it. The site is live and self-updating.
