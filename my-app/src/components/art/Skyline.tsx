/**
 * The district's landmarks, as a line across the back of "where people go".
 *
 * Drawn rather than photographed for the reason every other scene on this
 * site is -- one hand, one weight of line, no licence -- and kept to a
 * hairline at low opacity because it is the paper the photographs are laid
 * on, not a thing to look at. Each shape is a real building: the gopuram at
 * Suchindram, the Gandhi Mandapam, the Thiruvalluvar statue and the rock
 * memorial side by side the way they stand off the cape, and the lighthouse
 * at the end of the beach.
 *
 * One continuous strip, 1600 wide, laid along the bottom of the band and
 * scaled to whatever width it is given. Nothing in it is announced: the
 * names of the places are in the cards in front of it.
 */
export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 320"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* ---- a gopuram, stepped and finialled ---- */}
      <g transform="translate(40 0)">
        <path d="M18 318V146l34-74h72l34 74v172" />
        <path d="M26 146h136M34 118h120M44 92h100" />
        <path d="M52 72 58 48M86 72 86 44M120 72 120 44M150 72 144 48" />
        {[58, 86, 120, 144].map((cx, i) => (
          <g key={cx}>
            <path d={`M${cx - 7} ${[48, 44, 44, 48][i]}h14`} />
            <path d={`M${cx} ${[48, 44, 44, 48][i]}v-11`} />
            <circle cx={cx} cy={[32, 28, 28, 32][i]} r="5" />
          </g>
        ))}
        {/* The doorway, which is what makes it read as a temple rather than
            as a stepped block. */}
        <path d="M70 318v-74a20 20 0 0 1 40 0v74" />
        <path d="M18 318h154" />
      </g>

      {/* ---- palms ---- */}
      <g transform="translate(236 0)">
        <path d="M30 318c2-54 6-96 14-132" />
        <path d="M44 186c-18-10-34-6-46 8M44 186c-6-18-20-28-38-28M44 186c16-14 34-14 48-2M44 186c4-18 18-30 36-32M44 186c10-20 8-36-4-48" />
        <path d="M86 318c-1-40-4-72-10-98" />
        <path d="M76 220c-14-8-26-5-35 6M76 220c-5-14-16-21-29-21M76 220c12-10 26-10 37-2M76 220c3-14 14-23 27-25" />
      </g>

      {/* ---- the Gandhi Mandapam: a tall vimana over a low hall ---- */}
      <g transform="translate(370 0)">
        <path d="M0 318v-96h260v96" />
        <path d="M0 222h260" />
        {[26, 72, 118, 164, 210].map((cx) => (
          <path key={cx} d={`M${cx} 318v-70a12 12 0 0 1 24 0v70`} />
        ))}
        <path d="M96 222v-62l34-74 34 74v62" />
        <path d="M104 160h52M112 134h36" />
        <path d="M130 86V58" />
        <circle cx="130" cy="48" r="8" />
        <path d="M0 318h260" />
      </g>

      {/* ---- the Thiruvalluvar statue on its plinth ---- */}
      <g transform="translate(690 0)">
        <path d="M14 318v-30h92v30M22 288v-26h76v26M30 262v-22h60v22" />
        {/* The figure: robe, shoulders, head, and the hand held out, which is
            the line everybody recognises it by. */}
        <path d="M44 240c0-34 4-62 10-82M76 240c0-34-4-62-10-82" />
        <path d="M54 158c-4-16-2-28 6-36M66 158c4-16 2-28-6-36" />
        <path d="M48 134c-10 6-16 16-16 28M72 134c10 6 16 16 16 28" />
        <path d="M60 122a13 13 0 1 0 0-26 13 13 0 0 0 0 26Z" />
        <path d="M60 96V84" />
        <path d="M14 318h92" />
      </g>

      {/* ---- the rock memorial, a mandapam on its island ---- */}
      <g transform="translate(830 0)">
        <path d="M0 318c26-6 44-18 62-32 22-18 44-24 72-24s52 8 74 26c18 14 34 24 56 30" />
        <path d="M44 262v-62h180v62" />
        <path d="M44 200h180" />
        {[58, 100, 142, 184].map((cx) => (
          <path key={cx} d={`M${cx} 262v-54`} />
        ))}
        <path d="M96 200v-44l38-56 38 56v44" />
        <path d="M104 156h60M112 130h44" />
        <path d="M134 100V76" />
        <circle cx="134" cy="66" r="8" />
      </g>

      {/* ---- more palms ---- */}
      <g transform="translate(1136 0)">
        <path d="M34 318c-2-48-6-86-14-118" />
        <path d="M20 200c-16-9-30-6-41 7M20 200c-5-16-18-25-34-25M20 200c14-12 30-12 43-2M20 200c4-16 16-27 32-29" />
      </g>

      {/* ---- the lighthouse ---- */}
      <g transform="translate(1270 0)">
        <path d="M24 318 42 128h44l18 190" />
        <path d="M30 258h86M34 212h78M38 170h70" />
        <path d="M38 128h72M44 128v-18h60v18" />
        <path d="M52 110V86h44v24" />
        <path d="M52 86h44M60 86V66h28v20" />
        <path d="M74 66V52" />
        <path d="M24 318h104" />
        {/* The beam, as two short strokes rather than a cone: a filled cone
            at this opacity reads as a smudge. */}
        <path d="M110 76l34-12M110 96l34 10" />
      </g>

      {/* ---- a last stand of palms, and the horizon ---- */}
      <g transform="translate(1430 0)">
        <path d="M58 318c-2-42-5-76-11-100" />
        <path d="M47 218c-14-8-26-5-36 6M47 218c-4-14-15-21-28-21M47 218c11-10 25-10 36-2M47 218c3-14 13-23 26-25" />
        <path d="M104 318c-1-32-3-58-8-78" />
        <path d="M96 240c-11-6-21-4-29 5M96 240c-4-11-13-17-23-17M96 240c9-8 20-8 29-2" />
      </g>

      <path d="M0 318h1600" strokeOpacity="0.7" />
    </svg>
  );
}
