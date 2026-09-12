const TICKER_TEXT = "Check out our Guarantee selection";
const COPIES = 20;

export function AnnouncementTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0b1b3a] text-white">
      <div className="marquee flex whitespace-nowrap py-2">
        {Array.from({ length: COPIES }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center px-4 text-sm font-medium tracking-wide"
          >
            {TICKER_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
