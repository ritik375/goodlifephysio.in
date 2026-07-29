// Signature visual motif for the site: a goniometer-style "range of motion"
// arc with degree tick marks. It nods directly to how physiotherapists
// measure joint mobility, and reappears (in different sizes/rotations)
// across the hero, section dividers, and stat callouts for a consistent
// visual identity that's specific to this clinic's discipline.
const ROMArc = ({ className = '', degrees = 120, strokeColor = '#1F6F5C', showTicks = true, animate = true }) => {
  const radius = 90;
  const cx = 100;
  const cy = 110;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (degrees / 180) * circumference * 0.5 + circumference * 0.5; // approximate visual arc

  // Generate tick marks every 15 degrees along a semicircle
  const ticks = [];
  if (showTicks) {
    for (let i = 0; i <= 180; i += 15) {
      const angle = (Math.PI * i) / 180;
      const x1 = cx - radius * Math.cos(angle);
      const y1 = cy - radius * Math.sin(angle);
      const x2 = cx - (radius - (i % 45 === 0 ? 10 : 5)) * Math.cos(angle);
      const y2 = cy - (radius - (i % 45 === 0 ? 10 : 5)) * Math.sin(angle);
      ticks.push({ x1, y1, x2, y2, key: i });
    }
  }

  const activeAngle = (Math.PI * degrees) / 180;
  const needleX = cx - (radius - 16) * Math.cos(activeAngle);
  const needleY = cy - (radius - 16) * Math.sin(activeAngle);

  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Base track */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        stroke={strokeColor}
        strokeOpacity="0.15"
        strokeWidth="2"
      />
      {/* Active arc, drawn with a dash-offset animation */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference / 2}
        strokeDashoffset={animate ? undefined : 0}
        className={animate ? 'animate-arcDraw' : ''}
        style={!animate ? {} : { strokeDasharray: circumference / 2, strokeDashoffset: circumference / 2 }}
      />
      {ticks.map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={strokeColor} strokeOpacity="0.35" strokeWidth="1.5" />
      ))}
      {/* Needle indicating current measurement */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#C9762E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#C9762E" />
    </svg>
  );
};

export default ROMArc;
