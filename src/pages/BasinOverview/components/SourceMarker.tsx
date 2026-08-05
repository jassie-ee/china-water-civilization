import type { BasinOverviewPhase } from '@/types/basin';

interface SourceMarkerProps {
  phase: BasinOverviewPhase;
}

function SourceMarker({ phase }: SourceMarkerProps) {
  return (
    <g className={`source-marker source-marker--${phase}`} aria-hidden="true">
      <g className="source-marker__mountains">
        <path
          className="source-marker__terrain source-marker__terrain--far"
          d="M180 363 C194 342 205 315 220 300 C231 287 244 283 255 294 C264 280 278 280 287 295 C294 308 294 323 299 335 C307 340 315 344 322 351 C328 356 333 360 339 363 L339 371 L180 371 Z"
        />
        <path
          className="source-marker__terrain source-marker__terrain--near"
          d="M190 366 C204 350 215 330 229 320 C241 312 253 315 262 327 C272 317 285 321 291 334 C296 342 303 346 311 350 C320 350 329 356 337 366 L337 376 L190 376 Z"
        />
        <path className="source-marker__contour source-marker__contour--one" d="M191 351 C205 337 216 319 229 311 C241 305 252 310 260 320 C270 311 281 314 287 326 C291 333 293 339 298 344" />
        <path className="source-marker__contour source-marker__contour--two" d="M202 361 C214 347 225 334 237 330 C249 326 258 332 266 341 C275 334 284 338 289 348" />
      </g>
      <circle className="source-marker__energy" cx="302" cy="342" r="26" />
      <circle className="source-marker__ripple source-marker__ripple--one" cx="302" cy="342" r="16" />
      <circle className="source-marker__ripple source-marker__ripple--two" cx="302" cy="342" r="16" />
      <path className="source-marker__drop" d="M302 282 C287 303 282 311 282 322 A20 20 0 0 0 322 322 C322 311 317 303 302 282 Z" />
      <circle className="source-marker__point" cx="302" cy="342" r="4" />
      <text className="source-marker__label" x="202" y="394">青藏高原</text>
    </g>
  );
}

export default SourceMarker;
