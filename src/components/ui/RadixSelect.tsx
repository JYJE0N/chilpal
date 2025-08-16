"use client";

import * as Select from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface RadixSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function RadixSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  className = "",
  disabled = false,
}: RadixSelectProps) {
  return (
    <div className={className}>
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          className={`
            input-field group
            flex items-center justify-between gap-3
            ${!disabled && 'hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02]'}
            ${disabled && 'opacity-50 cursor-not-allowed'}
            focus:outline-none focus:border-pink-400/60 focus:shadow-lg focus:shadow-pink-500/25
            data-[state=open]:border-pink-400/60 data-[state=open]:shadow-lg data-[state=open]:shadow-pink-500/25
          `}
        >
          <Select.Value placeholder={placeholder} className="text-primary" />
          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={`
              glass-card-light
              shadow-2xl shadow-black/40
              overflow-hidden z-50
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
              data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2
            `}
            position="popper"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Select.Viewport className="p-1 max-h-60">
                {options.map((option, index) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={`
                      relative flex items-center justify-between gap-3
                      px-4 py-3 text-sm font-medium
                      text-secondary rounded-lg
                      outline-none cursor-pointer
                      transition-all duration-200
                      data-[highlighted]:bg-white/10 data-[highlighted]:text-primary
                      data-[state=checked]:bg-pink-500/20 data-[state=checked]:text-point
                      data-[state=checked]:border-l-2 data-[state=checked]:border-pink-400
                      hover:translate-x-1
                    `}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      {option.icon && (
                        <span className="text-base">{option.icon}</span>
                      )}
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </motion.div>
                    
                    <Select.ItemIndicator>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Check className="w-4 h-4 text-point" />
                      </motion.div>
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </motion.div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}