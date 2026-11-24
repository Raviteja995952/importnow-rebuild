# ImportNow website rebuild

A from-scratch rebuild of the ImportNow concept site (https://importnow-concept.vercel.app/), made as the practical assignment for the AI Executive role.

## What's in it
- Single-page site with the same sections: hero, services, scroll-driven shipping journey, products by Chinese manufacturing hub, Shanghai licence, Canton Fair trips, recent deliveries, client stories, import guides, FAQ and a quote form.
- Animated dotted globe with China to India shipping routes, drawn on an HTML canvas with no 3D library.
- Scroll-driven journey: a container ship sails across an animated sea while the six import steps, progress bar and day counter update.
- Quote form that opens WhatsApp with the customer's details filled in.
- Count-up stats, reveal-on-scroll animations, infinite route marquee, responsive layout with a mobile menu, and reduced-motion support.

## Tech
Plain HTML, CSS and vanilla JavaScript. No build step or framework. Content lives in `data.js` and is rendered by `main.js`, so copy can be edited in one place.

## Tools used
- AI coding assistant to plan the structure, write the HTML/CSS/JS and debug the canvas animations.
- Reference site studied for content, layout and section order. All code here was written fresh.
- Git and GitHub for version control, Vercel for hosting.

## Run locally
Live: https://importnow-rebuild.vercel.app/

Open `index.html` in a browser, or run `npx serve .`.
