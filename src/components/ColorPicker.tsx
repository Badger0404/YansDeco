import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const presetColors = [
  { name: 'orange', color: '#FF6B00' },
  { name: 'amber', color: '#f59e0b' },
  { name: 'yellow', color: '#eab308' },
  { name: 'green', color: '#22c55e' },
  { name: 'emerald', color: '#10b981' },
  { name: 'teal', color: '#14b8a6' },
  { name: 'cyan', color: '#06b6d4' },
  { name: 'blue', color: '#3b82f6' },
  { name: 'indigo', color: '#6366f1' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'purple', color: '#a855f7' },
  { name: 'pink', color: '#ec4899' },
  { name: 'red', color: '#ef4444' },
  { name: 'rose', color: '#f43f5e' },
  { name: 'slate', color: '#64748b' },
  { name: 'zinc', color: '#71717a' },
  { name: 'black', color: '#000000' },
  { name: 'white', color: '#ffffff' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const displayColor = presetColors.find(c => c.name === value)?.color || value || '#FF6B00';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (colorName: string) => {
    onChange(colorName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.startsWith('#') && val.length === 7) {
      const found = presetColors.find(c => c.color.toLowerCase() === val.toLowerCase());
      if (found) val = found.name;
    }
    onChange(val);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 text-zinc-400">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg border border-zinc-600 overflow-hidden transition-all hover:border-[#FF6B00]"
          style={{ backgroundColor: displayColor }}
        />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1 px-3 py-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6B00]"
          placeholder="orange"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-[#1a1a1a] border border-[#FF6B00]/50 rounded-xl shadow-2xl w-64">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorSelect(color.name)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  value === color.name ? 'border-[#FF6B00] scale-110' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
          </div>
          
          <div className="pt-2 border-t border-zinc-700">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wide">Color name:</label>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="flex-1 px-2 py-1.5 mt-1 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white"
              placeholder="purple"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
