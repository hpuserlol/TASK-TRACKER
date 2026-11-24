# Cozy Pixel Weekly Planner

A small, static weekly planner with a cozy pixel inspired interface. Tasks are stored only in this browser using `localStorage`; there is no account or server sync.

## Run locally

Open `index.html` in a current browser, or serve this folder over HTTP:

```powershell
python -m http.server 4173
```

Then visit <http://localhost:4173/>.

## Publish with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` publishes the static app from the repository root whenever `main` or `master` receives a push. It serves `index.html`, `styles.css`, and `app.js` directly, so the relative asset paths work under a repository subpath.

After pushing the workflow to GitHub:

1. Open the repository **Settings > Pages**.
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. Open **Actions** and wait for the `Deploy GitHub Pages` workflow to finish.
4. Open the Pages URL shown in the workflow deployment environment and verify the planner loads.

The first Pages deployment requires the repository's Pages source to be set to GitHub Actions. Deployments then run automatically on pushes to the default branch when that branch is `main` or `master`.
