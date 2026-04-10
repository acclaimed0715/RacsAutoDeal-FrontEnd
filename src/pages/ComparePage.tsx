import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import { motion } from 'framer-motion';

// ─── Spec definitions (mirrors mobile app exactly) ────────────────────────────
const SPEC_SECTIONS = [
  {
    section: 'Overview',
    specs: [
      { label: 'Model Year',   key: 'modelYear',     icon: '📅' },
      { label: 'Brand',        key: 'brand',         icon: '⭐' },
      { label: 'Type',         key: 'type',          icon: '🏷️', badge: true },
    ],
  },
  {
    section: 'Performance',
    specs: [
      { label: 'Engine',       key: 'engine',        icon: '⚙️' },
      { label: 'Horsepower',   key: 'hp',            icon: '⚡', higherBetter: true },
      { label: 'Torque',       key: 'torque',        icon: '🔄', higherBetter: true },
      { label: 'Transmission', key: 'transmission',  icon: '🔧' },
      { label: 'Fuel Type',    key: 'fuelType',      icon: '⛽' },
    ],
  },
  {
    section: 'Details',
    specs: [
      { label: 'Mileage',      key: 'mileage',       icon: '📍', lowerBetter: true },
      { label: 'Seating',      key: 'seating',       icon: '💺', higherBetter: true },
      { label: 'Color',        key: 'color',         icon: '🎨', color: true },
    ],
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function extractNum(raw: string | undefined): number | null {
  if (!raw) return null;
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
  key: string, rawVal: string | undefined,
  cars: any[], higherBetter?: boolean, lowerBetter?: boolean
): boolean {
  if (!rawVal || cars.length < 2) return false;
  const nums = cars.map(c => extractNum(String(c[key] ?? ''))).filter(n => n !== null) as number[];
  if (nums.length < 2) return false;
  const myNum = extractNum(rawVal);
  if (myNum === null) return false;
  if (higherBetter) return myNum === Math.max(...nums);
  if (lowerBetter)  return myNum === Math.min(...nums);
  return false;
}

// ─── Layout constants ────────────────────────────────────────────────────────────────
const HEADER_H  = 332; // car header card height
const SECTION_H = 40;  // section label row height
const ROW_H     = 64;  // each spec row height
const LABEL_W   = 160; // fixed left label column width (px)

// ─── Component ────────────────────────────────────────────────────────────────

const ComparePage: React.FC = () => {
  const { selectedCars, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Empty State ─────────────────────────────────────────────────────────────
  if (selectedCars.length === 0) {
    return (
      <div className="compare-empty-state" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="compare-page-container"
          style={{ 
            textAlign: 'center', 
            maxWidth: '550px', 
            padding: '60px 40px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            borderRadius: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto'
          }}
        >
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(204, 0, 0, 0.08) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              animate={{ 
                y: [0, -12, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ marginBottom: '35px' }}
            >
              <div style={{ 
                width: '90px', 
                height: '90px', 
                backgroundColor: 'rgba(204, 0, 0, 0.12)', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                border: '1px solid rgba(204, 0, 0, 0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                <i className="fa-solid fa-right-left" style={{ fontSize: '2.8rem', color: '#CC0000' }}></i>
              </div>
            </motion.div>

            <h2 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 900, 
              color: 'white', 
              marginBottom: '15px', 
              letterSpacing: '-1.5px',
              textShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
              No vehicles selected
            </h2>
            
            <p style={{ 
              color: '#9499A1', 
              fontSize: '1.15rem', 
              lineHeight: '1.7', 
              marginBottom: '45px',
              fontWeight: 400,
              maxWidth: '380px',
              margin: '0 auto 45px'
            }}>
              Choose up to 4 vehicles from our inventory to start a detailed side-by-side comparison.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(204, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="compare-now-btn" 
              onClick={() => navigate('/cars')}
              style={{
                padding: '18px 45px',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                borderRadius: '16px',
                textTransform: 'uppercase'
              }}
            >
              BROWSE INVENTORY
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Table ───────────────────────────────────────────────────────────────────
  let rowIdx = 0;

  return (
    <div className="compare-page-container" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <motion.div
        className="compare-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ width: '100%' }}
      >
        <h1 className="compare-title">Vehicle Comparison</h1>
        <p className="compare-subtitle">
          {selectedCars.length} of 4 vehicles · Side-by-side analysis
        </p>
      </motion.div>

      {/* Table area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>

        {/* ── FIXED LEFT LABEL COLUMN ───────────────────────────────────── */}
        <div style={{
          width: LABEL_W,
          flexShrink: 0,
          marginTop: 0,
        }}>
          {/* Spacer matching EXACT car header card height */}
          <div style={{ height: HEADER_H }} />

          {SPEC_SECTIONS.map(({ section, specs }) => (
            <div key={section}>
              {/* Section header */}
              <div style={{
                height: SECTION_H,
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: 8,
                paddingLeft: 16,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{
                  color: '#cc0000',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                }}>{section}</span>
              </div>

              {/* Spec labels */}
              {specs.map((spec, si) => {
                const even = rowIdx++ % 2 === 0;
                return (
                  <div key={spec.key} style={{
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    paddingLeft: 16,
                    paddingRight: 8,
                    background: even ? 'rgba(255,255,255,0.025)' : 'transparent',
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: 11, lineHeight: 1 }}>{spec.icon}</span>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}>{spec.label}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Actions label */}
          <div style={{
            height: ROW_H,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            background: 'rgba(255,255,255,0.025)',
          }}>
            <span style={{
              color: '#cc0000',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
            }}>Actions</span>
          </div>
        </div>

        {/* ── SCROLLABLE CAR COLUMNS ────────────────────────────────────── */}
        <div ref={scrollRef} style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'visible',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(204,0,0,0.4) transparent',
        }}>
          <div style={{
            display: 'flex',
            gap: 12,
            width: '100%',
          }}>
            {selectedCars.map((car) => {
              let valRowIdx = 0;
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {/* ── Car Header Card ──────────────────────────────────── */}
                  <div style={{
                    background: '#14141f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    marginBottom: 0,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    height: HEADER_H,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* Image */}
                    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                      <img
                        src={car.images?.[0] ?? car.image}
                        alt={car.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        onError={e => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.background = '#1e1e2e';
                        }}
                      />
                      {/* Gradient */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))',
                      }} />
                      {/* Best deal badge */}
                      {car.isBestDeal && (
                        <div style={{
                          position: 'absolute', bottom: 10, left: 10,
                          background: '#cc0000',
                          color: '#fff',
                          fontSize: 8,
                          fontWeight: 900,
                          letterSpacing: '0.5px',
                          padding: '3px 8px',
                          borderRadius: 20,
                          textTransform: 'uppercase',
                        }}>BEST DEAL</div>
                      )}
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCompare(car.id)}
                        style={{
                          position: 'absolute', top: 10, right: 10,
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          width: 28, height: 28,
                          color: '#fff',
                          fontSize: 14,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#cc0000')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
                        title="Remove"
                      >✕</button>
                    </div>

                    {/* Name + Price */}
                    <div style={{
                      padding: '12px 14px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 800,
                        lineHeight: 1.3,
                        marginBottom: 8,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>{car.name}</div>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(204,0,0,0.1)',
                        border: '1px solid rgba(204,0,0,0.3)',
                        borderRadius: 8,
                        padding: '3px 12px',
                        color: '#cc0000',
                        fontSize: 15,
                        fontWeight: 900,
                      }}>{formatPrice(car.price)}</div>
                    </div>
                  </div>

                  {/* ── Spec value rows ───────────────────────────────────── */}
                  {SPEC_SECTIONS.map(({ section, specs }) => (
                    <div key={section}>
                      {/* Section spacer */}
                      <div style={{ height: 40 }} />

                      {specs.map((spec) => {
                        const even = valRowIdx++ % 2 === 0;
                        const rawVal = (car as any)[spec.key];
                        const displayVal = rawVal ?? '—';
                        const best = isBestValue(
                          spec.key, String(rawVal ?? ''),
                          selectedCars, spec.higherBetter, spec.lowerBetter
                        );

                        return (
                          <div key={spec.key} style={{
                            height: ROW_H,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 12px',
                            background: even ? 'rgba(255,255,255,0.025)' : 'transparent',
                            borderBottom: best ? '2px solid #4caf50' : '2px solid transparent',
                            boxSizing: 'border-box',
                            gap: 6,
                          }}>
                            {/* Color swatch */}
                            {spec.color && rawVal && rawVal !== '—' && (
                              <div style={{
                                width: 12, height: 12,
                                borderRadius: '50%',
                                background: parseColorCss(String(rawVal)),
                                border: '1px solid rgba(255,255,255,0.2)',
                                flexShrink: 0,
                              }} />
                            )}

                            {/* Badge for type */}
                            {spec.badge && rawVal ? (
                              <span className="feature-pill-small">{String(rawVal)}</span>
                            ) : (
                              <span style={{
                                color: best ? '#4caf50' : '#cbd5e1',
                                fontSize: 14,
                                fontWeight: best ? 800 : 600,
                                textAlign: 'center',
                                lineHeight: 1.3,
                              }}>{String(displayVal)}</span>
                            )}

                            {/* Best badge */}
                            {best && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* ── View Details button ───────────────────────────────── */}
                  <div style={{
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 12px',
                    background: 'rgba(255,255,255,0.025)',
                  }}>
                    <button
                      className="compare-now-btn"
                      style={{ width: '100%', padding: '10px 16px', fontSize: 12 }}
                      onClick={() => navigate(`/car/${car.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        width: '100%'
      }}>
        {selectedCars.length < 4 ? (
          <button className="compare-now-btn" onClick={() => navigate('/cars')}>
            <i className="fa-solid fa-chart-simple" style={{ marginRight: '10px' }}></i> Add More Vehicles
          </button>
        ) : (
          <div style={{ 
            color: '#cc0000', 
            fontSize: '0.9rem', 
            fontWeight: 700,
            background: 'rgba(204,0,0,0.1)',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(204,0,0,0.2)'
          }}>
            Maximum limit of 4 vehicles reached
          </div>
        )}
        <button className="clear-btn" onClick={clearCompare}
          style={{ fontSize: '0.75rem', opacity: 0.5 }}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
