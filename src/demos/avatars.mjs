// Flat illustrated portraits for the dental concept.
//
// Drawn rather than photographed on purpose: a fictional practice must not
// put an identifiable person's face on its team page under a made-up name.
// An illustration reads as a person without being one.

const HAIR = {
  bob: (c) => `<path d="M62 84c0-24 17-40 38-40s38 16 38 40c0 8-2 15-4 20l-6-2c2-6 3-12 3-18 0-4-2-6-5-6-6 0-12 3-26 3s-20-3-26-3c-3 0-5 2-5 6 0 6 1 12 3 18l-6 2c-2-5-4-12-4-20z" fill="${c}"/>
    <path d="M60 82c0-8 4-16 10-16 4-8 16-14 30-14s26 6 30 14c6 0 10 8 10 16-2-10-8-14-14-14-6-6-16-9-26-9s-20 3-26 9c-6 0-12 4-14 14z" fill="${c}"/>`,
  crop: (c) => `<path d="M63 82c-1-22 16-38 37-38s38 16 37 38c-3-4-5-10-7-14-8 6-22 8-30 8s-16-1-22-5c-5 3-11 7-15 11z" fill="${c}"/>`,
  tail: (c) => `<path d="M64 86c-2-25 15-42 36-42s38 17 36 42l-6 1c1-8-1-14-4-18-7 5-19 7-26 7s-19-2-26-7c-3 4-5 10-4 18z" fill="${c}"/>
    <path d="M126 60c10 2 16 10 16 22 0 10-3 20-9 27l-9-5c5-6 8-14 8-22 0-9-3-17-6-22z" fill="${c}"/>`,
  curls: (c) => `<g fill="${c}"><circle cx="72" cy="72" r="13"/><circle cx="90" cy="60" r="15"/><circle cx="110" cy="59" r="15"/><circle cx="128" cy="72" r="13"/><circle cx="66" cy="88" r="10"/><circle cx="134" cy="88" r="10"/></g>`,
};

const PEOPLE = {
  meier:   { bg: "#D8E7EE", skin: "#E8C4A6", hair: ["bob",   "#3B2A22"], top: "#FFFFFF", scrub: "#2E6F8E", glasses: false },
  frei:    { bg: "#D9EAE2", skin: "#D9A87C", hair: ["crop",  "#241A14"], top: "#FFFFFF", scrub: "#3E7F6A", glasses: true  },
  hofer:   { bg: "#E1E5EF", skin: "#F0D2B6", hair: ["tail",  "#8A4B2A"], top: "#EDF3F6", scrub: "#6B7F97", glasses: false },
  baumann: { bg: "#DCE6EC", skin: "#A9714A", hair: ["curls", "#20150F"], top: "#EDF3F6", scrub: "#4A6E86", glasses: false },
};

export function avatar(key) {
  const p = PEOPLE[key];
  if (!p) throw new Error(`unknown avatar "${key}"`);
  const [style, hairColor] = p.hair;
  const glasses = p.glasses
    ? `<g fill="none" stroke="#3A3A3A" stroke-width="2.6">
         <circle cx="87" cy="90" r="11"/><circle cx="113" cy="90" r="11"/>
         <path d="M98 89h4M76 87l-8-2M124 87l8-2"/>
       </g>`
    : "";

  return `<svg class="avatar" viewBox="0 0 200 200" role="img" aria-hidden="true">
  <defs><clipPath id="cl-${key}"><circle cx="100" cy="100" r="100"/></clipPath></defs>
  <g clip-path="url(#cl-${key})">
    <circle cx="100" cy="100" r="100" fill="${p.bg}"/>
    <path d="M100 140c34 0 62 24 66 60H34c4-36 32-60 66-60z" fill="${p.scrub}"/>
    <path d="M100 140c-14 0-27 4-38 11l14 49h-25c3-30 22-52 49-60z" fill="${p.top}"/>
    <path d="M100 140c14 0 27 4 38 11l-14 49h25c-3-30-22-52-49-60z" fill="${p.top}"/>
    <path d="M88 133h24v14c0 6-5 11-12 11s-12-5-12-11z" fill="${p.skin}"/>
    <path d="M88 133h24v8c-4 3-8 4-12 4s-8-1-12-4z" fill="#000" opacity=".08"/>
    <circle cx="66" cy="92" r="7" fill="${p.skin}"/><circle cx="134" cy="92" r="7" fill="${p.skin}"/>
    <ellipse cx="100" cy="90" rx="34" ry="38" fill="${p.skin}"/>
    ${HAIR[style](hairColor)}
    <g fill="#2B2320"><ellipse cx="87" cy="92" rx="3.4" ry="4.2"/><ellipse cx="113" cy="92" rx="3.4" ry="4.2"/></g>
    <path d="M91 108c3 3 6 4 9 4s6-1 9-4" fill="none" stroke="#2B2320" stroke-width="2.6" stroke-linecap="round"/>
    <g fill="#E8927C" opacity=".35"><ellipse cx="76" cy="101" rx="6" ry="4"/><ellipse cx="124" cy="101" rx="6" ry="4"/></g>
    ${glasses}
  </g>
</svg>`;
}
