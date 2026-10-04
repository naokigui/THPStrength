interface BiomechanicsRadarProps {
  scores: {
    absoluteForce: number;
    elasticitySsc: number;
    approachMechanics: number;
    tendonResilience: number;
    rateOfForceDev: number;
  };
}

export function BiomechanicsRadar({ scores }: BiomechanicsRadarProps) {
  // 5 axis radar
  const center = 110;
  const radius = 80;
  const labels = [
    { name: 'Força Máxima', key: 'absoluteForce' as const, angle: -Math.PI / 2 },
    { name: 'Elasticidade (SSC)', key: 'elasticitySsc' as const, angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
    { name: 'Mecânica Penúltimo', key: 'approachMechanics' as const, angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
    { name: 'Saúde Tendão', key: 'tendonResilience' as const, angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
    { name: 'RFD / Explosão', key: 'rateOfForceDev' as const, angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  ];

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Outer web grids
  const levels = [0.25, 0.5, 0.75, 1];

  const dataPoints = labels.map((l) => {
    const val = scores[l.key] || 50;
    return getCoordinates(val, l.angle);
  });

  const polygonPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-3">
      <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
        {/* Radar concentric rings */}
        {levels.map((lvl, idx) => {
          const r = radius * lvl;
          const points = labels
            .map((l) => {
              const x = center + r * Math.cos(l.angle);
              const y = center + r * Math.sin(l.angle);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="#27272a"
              strokeWidth="1"
              strokeDasharray={idx < 3 ? '2 2' : 'none'}
            />
          );
        })}

        {/* Axis lines */}
        {labels.map((l, idx) => {
          const edge = getCoordinates(100, l.angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={edge.x}
              y2={edge.y}
              stroke="#3f3f46"
              strokeWidth="1"
            />
          );
        })}

        {/* Value polygon */}
        <polygon
          points={polygonPath}
          fill="rgba(34, 197, 94, 0.18)"
          stroke="#22c55e"
          strokeWidth="2"
        />

        {/* Value Points */}
        {dataPoints.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#22c55e"
            className="transition-all duration-300"
          />
        ))}
      </svg>

      {/* Axis text badges */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-zinc-400 w-full max-w-xs">
        {labels.map((l) => (
          <div key={l.key} className="flex items-center justify-between bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800/80">
            <span className="truncate">{l.name}</span>
            <span className="font-mono text-emerald-400 font-semibold ml-1">
              {scores[l.key]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
