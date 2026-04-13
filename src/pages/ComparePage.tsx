import React, { useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import { motion } from 'framer-motion';
import { type Vehicle } from '../types';

// Spec definition with explicit typing to avoid TS errors
interface SpecDef {
  label: string;
  key: keyof Vehicle;
  icon: string;
  badge?: boolean;
  higherBetter?: boolean;
  lowerBetter?: boolean;
  color?: boolean;
}

interface SpecSection {
  section: string;
  specs: SpecDef[];
}

const SPEC_SECTIONS: SpecSection[] = [
  {
    section: 'Overview',
    specs: [
      { label: 'Model Year',   key: 'modelYear' as any,     icon: '📅' },
      { label: 'Brand',        key: 'brand' as any,         icon: '⭐' },
      { label: 'Type',         key: 'type' as any,          icon: '🏷️', badge: true },
    ],
  },
  {
    section: 'Performance',
    specs: [
      { label: 'Engine',       key: 'engine' as any,        icon: '⚙️' },
      { label: 'Horsepower',   key: 'hp' as any,            icon: '⚡', higherBetter: true },
      { label: 'Torque',       key: 'torque' as any,        icon: '🔄', higherBetter: true },
      { label: 'Transmission', key: 'transmission' as any,  icon: '🔧' },
      { label: 'Fuel Type',    key: 'fuelType' as any,      icon: '⛽' },
    ],
  },
  {
    section: 'Details',
    specs: [
      { label: 'Mileage',      key: 'mileage' as any,       icon: '📍', lowerBetter: true },
      { label: 'Seating',      key: 'seating' as any,       icon: '💺', higherBetter: true },
      { label: 'Color',        key: 'color' as any,         icon: '🎨', color: true },
    ],
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function extractNum(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return null;
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return isNaN(n) ? null : n;
}

function parseColorCss(name: string | undefined): string {
  if (!name) return 'transparent';
  const map: Record<string, string> = {
    white: '#f5f5f5', black: '#1a1a1a', red: '#cc0000', blue: '#1565c0',
    grey: '#9e9e9e', gray: '#9e9e9e', silver: '#c0c0c0', gold: '#ffd700',
    orange: '#e65100', green: '#2e7d32', brown: '#5d4037', beige: '#f5f5dc',
    maroon: '#800000', pearl: '#f8f8ff',
  };
  return map[name.toLowerCase().trim()] ?? name.toLowerCase();
}

function isBestValue(
  key: string, rawVal: any,
  cars: Vehicle[], higherBetter?: boolean, lowerBetter?: boolean
): boolean {
  if (rawVal === undefined || cars.length < 2) return false;
  const nums = cars.map(c => extractNum((c as any)[key])).filter(n => n !== null) as number[];
  if (nums.length < 2) return false;
  const myNum = extractNum(rawVal);
  if (myNum === null) return false;
  if (higherBetter) return myNum === Math.max(...nums);
  if (lowerBetter)  return myNum === Math.min(...nums);
  return false;
}

// ─── Layout constants ────────────────────────────────────────────────────────────────
const HEADER_H  = 332; 
const SECTION_H = 40;  
const ROW_H     = 64;  
const LABEL_W   = 160; 

const ComparePage: React.FC = () => {
  const { selectedCars, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (selectedCars.length < 2) {
    return <Navigate to="/cars" replace />;
  }

  let rowIdxGlobal = 0;

  return (
    <div className="compare-page-container" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-dark)', minHeight: '100vh', padding: '120px 20px 100px' }}>
      <motion.div
        className="compare-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ width: '100%', textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 className="compare-title" style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>Vehicle Comparison</h1>
        <p className="compare-subtitle" style={{ color: 'var(--text-muted)' }}>
          {selectedCars.length} of 4 vehicles · Side-by-side analysis
        </p>
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '1400px', margin: '0 auto', width: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>

        {/* FIXED LEFT LABEL COLUMN */}
        <div style={{ width: LABEL_W, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ height: HEADER_H }} />
          {SPEC_SECTIONS.map(({ section, specs }) => (
            <div key={section}>
              <div style={{
                height: SECTION_H,
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: 8,
                paddingLeft: 20,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ color: 'var(--primary)', fontSize: 10, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>{section}</span>
              </div>
              {specs.map((spec) => {
                const even = rowIdxGlobal++ % 2 === 0;
                return (
                  <div key={spec.key} style={{
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingLeft: 20,
                    background: even ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}>
                    <span style={{ fontSize: 14 }}>{spec.icon}</span>
                    <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700 }}>{spec.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ height: ROW_H, display: 'flex', alignItems: 'center', paddingLeft: 20, background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ color: 'var(--primary)', fontSize: 10, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>Actions</span>
          </div>
        </div>

        {/* SCROLLABLE CAR COLUMNS */}
        <div ref={scrollRef} style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            {selectedCars.map((car) => {
              let valRowIdx = 0;
              return (
                <motion.div key={car.id} style={{ flex: 1, minWidth: '300px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  {/* Car Header */}
                  <div style={{ height: HEADER_H, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '15px' }}>
                      <img 
                        src={(car.images && car.images.length > 0) ? car.images[0] : ''} 
                        alt={car.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{car.name}</h3>
                      <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.4rem' }}>{formatPrice(car.price)}</div>
                      <button 
                        onClick={() => removeFromCompare(car.id)}
                        style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' }}
                      >Remove</button>
                    </div>
                  </div>

                  {/* Spec Values */}
                  {SPEC_SECTIONS.map(({ section, specs }) => (
                    <div key={section}>
                      <div style={{ height: SECTION_H }} />
                      {specs.map((spec) => {
                        const even = valRowIdx++ % 2 === 0;
                        const rawVal = (car as any)[spec.key];
                        const displayVal = rawVal ?? '—';
                        const best = isBestValue(spec.key, rawVal, selectedCars, spec.higherBetter, spec.lowerBetter);

                        return (
                          <div key={spec.key} style={{
                            height: ROW_H,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: even ? 'rgba(255,255,255,0.02)' : 'transparent',
                            gap: 8,
                            padding: '0 15px'
                          }}>
                            {spec.color && rawVal && (
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: parseColorCss(String(rawVal)), border: '1px solid white' }} />
                            )}
                            <span style={{ color: best ? '#4caf50' : 'white', fontWeight: best ? 800 : 500 }}>
                              {String(displayVal)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  <div style={{ height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', background: 'rgba(255,255,255,0.02)' }}>
                    <button 
                      className="message-dealer-btn" 
                      style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}
                      onClick={() => navigate(`/car/${car.id}`)}
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="clear-btn" onClick={clearCompare} style={{ opacity: 0.6 }}>Clear All</button>
      </div>
    </div>
  );
};

export default ComparePage;
