"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  className = "",
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full min-w-[140px] px-4 py-3 
          bg-gradient-to-r from-slate-800/90 to-slate-700/90
          backdrop-blur-md border border-purple-500/30 rounded-xl
          text-white text-sm font-medium
          flex items-center justify-between gap-3
          transition-all duration-300 ease-out
          ${!disabled && 'hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'}
          ${isOpen && 'border-purple-400/60 shadow-lg shadow-purple-500/25'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
        `}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="text-base">{selectedOption.icon}</span>
          )}
          <span className="text-slate-100">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-gradient-to-b from-slate-800/95 to-slate-900/95
              backdrop-blur-xl border border-purple-500/30 rounded-xl
              shadow-2xl shadow-black/40
              max-h-60 overflow-y-auto
              custom-scrollbar
            "
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-3 text-left
                  flex items-center justify-between gap-3
                  text-sm font-medium
                  transition-all duration-200
                  ${option.value === value 
                    ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-400' 
                    : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'
                  }
                  ${index === 0 && 'rounded-t-xl'}
                  ${index === options.length - 1 && 'rounded-b-xl'}
                `}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ x: 4 }}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.icon && (
                    <span className="text-base">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </span>
                {option.value === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Check className="w-4 h-4 text-purple-400" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}