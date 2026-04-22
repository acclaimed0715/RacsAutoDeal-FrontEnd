import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import { motion } from 'framer-motion';
import { type Vehicle } from '../types';

// Spec definition
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
      { label: 'Model Year',   key: 'modelYear' as any,     icon: 'fa-solid fa-calendar-days' },
      { label: 'Brand',        key: 'brand' as any,         icon: 'fa-solid fa-car' },
      { label: 'Type',         key: 'type' as any,          icon: 'fa-solid fa-layer-group', badge: true },
    ],
  },
  {
    section: 'Performance',
    specs: [
      { label: 'Engine',       key: 'engine' as any,        icon: 'fa-solid fa-gears' },
      { label: 'Horsepower',   key: 'hp' as any,            icon: 'fa-solid fa-bolt', higherBetter: true },
      { label: 'Torque',       key: 'torque' as any,        icon: 'fa-solid fa-gauge-high', higherBetter: true },
      { label: 'Transmission', key: 'transmission' as any,  icon: 'fa-solid fa-screwdriver-wrench' },
      { label: 'Fuel Type',    key: 'fuelType' as any,      icon: 'fa-solid fa-gas-pump' },
    ],
  },
  {
    section: 'Details',
    specs: [
      { label: 'Mileage',      key: 'mileage' as any,       icon: 'fa-solid fa-road', lowerBetter: true },
      { label: 'Seating',      key: 'seating' as any,       icon: 'fa-solid fa-users', higherBetter: true },
      { label: 'Color',        key: 'color' as any,         icon: 'fa-solid fa-palette', color: true },
    ],
  },
];

const extractNum = (raw: any): number | null => {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return null;
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return isNaN(n) ? null : n;
};

const parseColorCss = (name: string | undefined): string => {
  if (!name) return 'transparent';
  const map: Record<string, string> = {
    white: '#f5f5f5', black: '#1a1a1a', red: '#cc0000', blue: '#1565c0',
    grey: '#9e9e9e', gray: '#9e9e9e', silver: '#c0c0c0', gold: '#ffd700',
    orange: '#e65100', green: '#2e7d32', brown: '#5d4037', beige: '#f5f5dc',
    maroon: '#800000', pearl: '#f8f8ff',
  };
  return map[name.toLowerCase().trim()] ?? name.toLowerCase();
};

const isBestValue = (key: string, rawVal: any, cars: Vehicle[], higherBetter?: boolean, lowerBetter?: boolean): boolean => {
  if (rawVal === undefined || cars.length < 2) return false;
  const nums = cars.map(c => extractNum((c as any)[key])).filter(n => n !== null) as number[];
  if (nums.length < 2) return false;
  const myNum = extractNum(rawVal);
  if (myNum === null) return false;
  if (higherBetter) return myNum === Math.max(...nums);
  if (lowerBetter)  return myNum === Math.min(...nums);
  return false;
};

const ComparePage: React.FC = () => {
  const { selectedCars, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (selectedCars.length < 2) return <Navigate to="/cars" replace />;

  return (
    <div className="compare-outer-container">
      <NavbarSpace />
      
      <div className="compare-header-section">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="compare-title"
        >
          Vehicle Comparison
        </motion.h1>
        <p className="compare-subtitle">Compare specifications for up to 4 vehicles side-by-side.</p>
        <button className="clear-all-mobile-btn" onClick={clearCompare}>Clear All</button>
      </div>

      <div className="comparison-viewport shadow-indicators">
        <div className="comparison-table">
          {/* STICKY TOP HEADER ROW */}
          <div className="comparison-header-row">
            <div className="sticky-label-cell empty"></div>
            {selectedCars.map(car => (
              <div key={car.id} className="car-header-cell">
                <button className="remove-car-btn" onClick={() => removeFromCompare(car.id)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="car-header-image">
                  <img src={car.images[0]} alt={car.name} />
                </div>
                <h3 className="car-header-name">{car.name}</h3>
                <div className="car-header-price">{formatPrice(car.price)}</div>
              </div>
            ))}
          </div>

          {/* SPECIFICATION SECTIONS */}
          {SPEC_SECTIONS.map(section => (
            <div key={section.section} className="comparison-section-group">
              <div className="comparison-section-divider">
                <div className="sticky-label-cell section-label">{section.section}</div>
                {selectedCars.map(car => <div key={car.id} className="section-spacer-cell"></div>)}
              </div>
              
              {section.specs.map((spec, sIdx) => (
                <div key={spec.key} className={`comparison-row ${sIdx % 2 === 0 ? 'even' : 'odd'}`}>
                  <div className="sticky-label-cell spec-label">
                    <i className={`spec-icon ${spec.icon}`}></i>
                    <span className="spec-name">{spec.label}</span>
                  </div>
                  {selectedCars.map(car => {
                    const rawVal = (car as any)[spec.key];
                    const best = isBestValue(spec.key, rawVal, selectedCars, spec.higherBetter, spec.lowerBetter);
                    return (
                      <div key={car.id} className="spec-value-cell">
                        {spec.color && rawVal && (
                          <div className="color-swatch" style={{ background: parseColorCss(String(rawVal)) }} />
                        )}
                        <span className={`spec-value ${best ? 'best' : ''}`}>
                          {rawVal ?? '—'}
                          {best && <i className="fa-solid fa-crown best-crown"></i>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* BOTTOM ACTIONS ROW */}
          <div className="comparison-row actions-row">
            <div className="sticky-label-cell spec-label">Actions</div>
            {selectedCars.map(car => (
              <div key={car.id} className="spec-value-cell">
                <button className="view-details-compact" onClick={() => navigate(`/car/${car.id}`)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="compare-footer-actions">
        <button className="clear-btn" onClick={clearCompare}>
          <i className="fa-solid fa-trash-can"></i> Clear Comparison
        </button>
      </div>
    </div>
  );
};

// Simplified space component to clear fixed navbar
const NavbarSpace = () => <div style={{ height: '100px' }}></div>;

export default ComparePage;
