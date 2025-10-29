import React, { useMemo, useState } from 'react';
import PatientDataService from '../services/PatientDataService';

type Status = 'normal' | 'warning' | 'critical';

const statusColor: Record<Status, string> = {
  normal: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444'
};

const HumanBodyAnalytics: React.FC = () => {
  const svc = PatientDataService.getInstance();
  const organs = useMemo(() => svc.getOrgans(), [svc]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showCallouts, setShowCallouts] = useState<boolean>(true);

  const selected = organs.find(o => o.key === selectedKey) || organs[0];

  // Callout anchor positions per organ (diagram coordinates)
  const calloutPos: Record<string, { x1: number; y1: number; x2: number; y2: number; align: 'left' | 'right' } > = {
    brain: { x1: 148, y1: 64, x2: 210, y2: 40, align: 'right' },
    lungs: { x1: 176, y1: 150, x2: 220, y2: 120, align: 'right' },
    heart: { x1: 144, y1: 168, x2: 220, y2: 168, align: 'right' },
    liver: { x1: 186, y1: 200, x2: 230, y2: 210, align: 'right' },
    stomach: { x1: 118, y1: 210, x2: 40, y2: 210, align: 'left' },
    pancreas: { x1: 144, y1: 233, x2: 210, y2: 248, align: 'right' },
    spleen: { x1: 96, y1: 220, x2: 40, y2: 200, align: 'left' },
    kidneys: { x1: 156, y1: 254, x2: 220, y2: 274, align: 'right' },
    intestines: { x1: 140, y1: 298, x2: 220, y2: 312, align: 'right' },
    bladder: { x1: 148, y1: 354, x2: 210, y2: 376, align: 'right' }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Body Diagram */}
        <div className="lg:col-span-2 bg-dark-card rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Human Body Diagram</h3>
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input type="checkbox" checked={showCallouts} onChange={(e) => setShowCallouts(e.target.checked)} />
              <span>Show labels</span>
            </label>
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 260 540" width="360" height="760">
              <defs>
                <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1f2937"/>
                  <stop offset="100%" stopColor="#111827"/>
                </linearGradient>
              </defs>
              {/* Silhouette with shoulders/legs */}
              <path d="M130 18c-13 0-24 11-24 24v30c0 9-7 16-16 16H70c-11 0-20 9-20 20v42c0 11 9 20 20 20h6c8 0 14 6 14 14v66c0 10-8 18-18 18H56c-9 0-16 7-16 16v44c0 14 12 26 26 26h12c6 0 12 4 14 10l22 62c5 14 25 14 30 0l22-62c2-6 8-10 14-10h12c14 0 26-12 26-26v-44c0-9-7-16-16-16h-16c-10 0-18-8-18-18v-66c0-8 6-14 14-14h6c11 0 20-9 20-20v-42c0-11-9-20-20-20h-20c-9 0-16-7-16-16V42c0-13-11-24-24-24z" fill="url(#skin)" stroke="#374151" />

              {/* Brain */}
              <ellipse cx="130" cy="64" rx="18" ry="14" fill={statusColor[organs.find(o=>o.key==='brain')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('brain')} style={{ cursor: 'pointer' }}>
                <title>Brain</title>
              </ellipse>

              {/* Lungs */}
              <path d="M102 120c-10 0-18 10-18 22v16c0 10 8 18 18 18 10 0 18-8 18-18v-22c0-8-8-16-18-16z" fill={statusColor[organs.find(o=>o.key==='lungs')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('lungs')} style={{ cursor: 'pointer' }}>
                <title>Left Lung</title>
              </path>
              <path d="M158 120c10 0 18 10 18 22v16c0 10-8 18-18 18-10 0-18-8-18-18v-22c0-8 8-16 18-16z" fill={statusColor[organs.find(o=>o.key==='lungs')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('lungs')} style={{ cursor: 'pointer' }}>
                <title>Right Lung</title>
              </path>

              {/* Heart */}
              <path d="M130 150c-8 0-14 6-14 14 0 12 14 20 14 20s14-8 14-20c0-8-6-14-14-14z" fill={statusColor[organs.find(o=>o.key==='heart')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('heart')} style={{ cursor: 'pointer' }}>
                <title>Heart</title>
              </path>

              {/* Liver */}
              <path d="M170 200c-20 0-36 10-46 10-8 0-16-4-20-4-6 0-10 6-10 12 0 8 8 12 18 12 18 0 30-6 46-10 8-2 20-2 28-2 4 0 8-4 8-8 0-6-6-10-12-10h-12z" fill={statusColor[organs.find(o=>o.key==='liver')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('liver')} style={{ cursor: 'pointer' }}>
                <title>Liver</title>
              </path>

              {/* Stomach */}
              <path d="M108 204c-8 6-10 20 2 28 8 6 22 4 28-4 8-10 0-24-8-28-8-4-16-2-22 4z" fill={statusColor[organs.find(o=>o.key==='stomach')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('stomach')} style={{ cursor: 'pointer' }}>
                <title>Stomach</title>
              </path>

              {/* Pancreas */}
              <rect x="120" y="230" width="24" height="6" rx="3" fill={statusColor[organs.find(o=>o.key==='pancreas')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('pancreas')} style={{ cursor: 'pointer' }}>
                <title>Pancreas</title>
              </rect>

              {/* Spleen */}
              <ellipse cx="96" cy="220" rx="10" ry="12" fill={statusColor[organs.find(o=>o.key==='spleen')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('spleen')} style={{ cursor: 'pointer' }}>
                <title>Spleen</title>
              </ellipse>

              {/* Kidneys */}
              <ellipse cx="104" cy="254" rx="9" ry="12" fill={statusColor[organs.find(o=>o.key==='kidneys')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('kidneys')} style={{ cursor: 'pointer' }}>
                <title>Left Kidney</title>
              </ellipse>
              <ellipse cx="156" cy="254" rx="9" ry="12" fill={statusColor[organs.find(o=>o.key==='kidneys')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('kidneys')} style={{ cursor: 'pointer' }}>
                <title>Right Kidney</title>
              </ellipse>

              {/* Intestines (small + large as paths) */}
              <path d="M98 272c0 10 10 16 20 16s20-6 20-16-10-14-20-14-20 4-20 14z" fill="#F59E0B" opacity="0.45" stroke="#0b0f19" strokeWidth="2" />
              <path d="M98 292c0 10 10 16 20 16s20-6 20-16-10-14-20-14-20 4-20 14z" fill="#F59E0B" opacity="0.45" stroke="#0b0f19" strokeWidth="2" />
              <path d="M98 312c0 10 10 16 20 16s20-6 20-16-10-14-20-14-20 4-20 14z" fill="#F59E0B" opacity="0.45" stroke="#0b0f19" strokeWidth="2" />

              {/* Bladder */}
              <path d="M130 344c-10 0-18 8-18 18 0 6 6 12 18 12s18-6 18-12c0-10-8-18-18-18z" fill={statusColor[organs.find(o=>o.key==='bladder')?.status || 'normal']} stroke="#0b0f19" strokeWidth="2" onClick={() => setSelectedKey('bladder')} style={{ cursor: 'pointer' }}>
                <title>Bladder</title>
              </path>

              {/* Callouts with leader lines */}
              {showCallouts && (
                <g fontSize="10" stroke="#4B5563">
                  {organs.map((org) => {
                    const pos = calloutPos[org.key];
                    if (!pos) return null;
                    const textX = pos.align === 'right' ? pos.x2 + 4 : pos.x2 - 4;
                    const anchor = pos.align === 'right' ? 'start' : 'end';
                    const color = statusColor[org.status as Status];
                    const label = `${org.name} • ${org.status} (${org.score})`;
                    return (
                      <g key={`callout-${org.key}`}>
                        <line x1={pos.x1} y1={pos.y1} x2={pos.x2} y2={pos.y2} />
                        <text x={textX} y={pos.y2} textAnchor={anchor} fill={color}>{label}</text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: statusColor.normal }} />
            <span className="text-gray-300">Normal</span>
            <span className="inline-block h-2 w-2 rounded-full ml-4" style={{ background: statusColor.warning }} />
            <span className="text-gray-300">Warning</span>
            <span className="inline-block h-2 w-2 rounded-full ml-4" style={{ background: statusColor.critical }} />
            <span className="text-gray-300">Critical</span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Organ Status</h3>
          <div className="space-y-4">
            {organs.map(org => (
              <button key={org.key} onClick={() => setSelectedKey(org.key)} className={`w-full flex items-center justify-between px-3 py-2 rounded ${selected?.key===org.key ? 'bg-gray-700' : 'hover:bg-gray-700/60'} text-left`}>
                <div className="flex items-center space-x-3">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: statusColor[org.status] }} />
                  <div>
                    <p className="text-white text-sm font-medium">{org.name}</p>
                    <p className="text-gray-400 text-xs">Score: {org.score}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{org.lastUpdated.toLocaleDateString()}</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-6 p-4 rounded-lg border border-gray-700">
              <p className="text-white font-medium">{selected.name}</p>
              <p className="text-sm text-gray-300 mt-1">Status: <span style={{ color: statusColor[selected.status] }}>{selected.status}</span></p>
              <p className="text-sm text-gray-300 mt-1">Score: {selected.score}</p>
              {selected.note && <p className="text-sm text-gray-400 mt-2">Note: {selected.note}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanBodyAnalytics;


