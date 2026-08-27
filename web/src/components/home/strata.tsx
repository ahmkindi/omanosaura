/**
 * Layered canyon-ridge divider that closes the hero: three strata stepping
 * from night navy down to the sand content background.
 */
export function Strata() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="relative">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="block h-[90px] w-full sm:h-[150px]"
        >
          <path
            d="M0 90 L140 60 L260 96 L420 34 L560 78 L720 22 L880 70 L1030 40 L1180 84 L1310 56 L1440 78 L1440 150 L0 150 Z"
            className="fill-primary"
            opacity="0.45"
          />
          <path
            d="M0 110 L180 84 L330 112 L500 62 L660 100 L820 54 L980 96 L1140 70 L1300 104 L1440 82 L1440 150 L0 150 Z"
            className="fill-primary"
            opacity="0.75"
          />
          <path
            d="M0 128 L200 106 L380 126 L560 92 L740 120 L920 88 L1100 116 L1280 98 L1440 118 L1440 150 L0 150 Z"
            className="fill-sand"
          />
        </svg>
      </div>
    </div>
  )
}
