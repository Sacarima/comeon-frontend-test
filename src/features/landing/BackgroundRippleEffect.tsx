const ROWS = 8;
const COLUMNS = 18;

export function BackgroundRippleEffect() {
  return (
    <div className="background-ripple" aria-hidden="true">
      {Array.from({ length: ROWS * COLUMNS }).map((_, index) => (
        <span key={index} className="background-ripple-box" />
      ))}
    </div>
  );
}