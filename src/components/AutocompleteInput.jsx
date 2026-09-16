import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown } from 'lucide-react';

export default function AutocompleteInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSelect,
  isLoading = false,
  required = false,
  error = null
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when there are suggestions and input is focused
  useEffect(() => {
    if (suggestions.length > 0 && value.trim().length > 0) {
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [suggestions, value]);

  // Auto-scroll to highlighted item
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  const handleInputChange = (e) => {
    onChange(e);
    if (e.target.value.trim().length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onSelect(suggestion);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
          <User className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim().length > 0 && suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full px-12 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: error ? '#f87171' : 'var(--border-input)',
            color: 'var(--text-primary)'
          }}
        />

        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && suggestions.length > 0 && value.trim().length > 0 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-y-auto animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            scrollBehavior: 'smooth',
            maxHeight: '180px'
          }}
        >
          <div className="p-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.idKunjungan}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-150 hover:scale-[1.02] ${
                  highlightedIndex === index ? 'bg-sky-500/20 border-sky-400' : 'border-transparent'
                }`}
                style={{
                  border: '1px solid',
                  borderColor: highlightedIndex === index ? '#38bdf8' : 'transparent',
                  backgroundColor: highlightedIndex === index ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card-deep)'
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: 'var(--text-heading)' }}>
                      {suggestion.nama}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {suggestion.instansi}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {suggestion.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Custom scrollbar styling */}
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 10px;
            }
            div::-webkit-scrollbar-track {
              background: rgba(3, 21, 34, 0.3);
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: rgba(56, 189, 248, 0.6);
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: rgba(56, 189, 248, 0.9);
            }
          `}</style>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {!error && suggestions.length === 0 && value.trim().length > 2 && !isLoading && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Tidak ada pengunjung yang sedang berkunjung dengan nama tersebut
        </p>
      )}
    </div>
  );
}
