Developer Notes — portfolio-site-v1

Purpose

- Summarizes design, performance, and developer tooling choices for this feature branch (lpolt-silver-journey).

Key points

- LCP image: bridge-* AVIF/WebP responsive candidates are preloaded in index.html to improve LCP measurement. Use <picture> to allow format fallbacks.
- Avatar & logos: generated AVIF + WebP variants. index.html now uses <picture> for the avatar and .webp for logos where possible.
- Image tools: scripts/optimize-images.js (regenerate AVIF/WebP), scripts/convert-*.js exist as utilities. Re-run locally with `node scripts/optimize-images.js`.
- CI: scripts/check-images.js + .github/workflows/image-check.yml enforce max source image size on PRs.

UI notes

- Carousel: uses horizontal scroll-snap with keyboard focus (tab to carousel, ArrowLeft/ArrowRight). scripts/carousel-controls.js manages buttons and entrance animations.
- Accessibility: focus-visible outlines are enabled; prefers-reduced-motion respected for animations.
- Styling: .card rules were consolidated into a single block in styles.css to avoid conflicting overrides.

Repo hygiene

- node_modules were untracked and removed from Git. Run `npm ci` after pulling.
- Originals moved to src/zzSunset/ for manual review before permanent deletion.

Recommended next steps

- Run Lighthouse locally at http://localhost:8000 and save HTML report for review.
- Consider moving large images to a CDN or enabling Git LFS if images must remain in repo.
- Add a husky pre-commit hook to run scripts/check-images.js before commits.

Contact

- If anything here should be adjusted or moved, open an issue or ping me in the branch.
