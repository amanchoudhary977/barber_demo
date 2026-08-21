'use client';

import { useState } from 'react';
import { StyleOption, StyleCategory } from '@/types';
import { STYLE_CATALOG } from '@/lib/styles-data';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface StyleSelectorProps {
  onSelect: (style: StyleOption) => void;
  recommendedStyleIds?: string[];
  isDisabled?: boolean;
}

const CATEGORY_TABS: { key: StyleCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All Styles', icon: '✨' },
  { key: 'hair', label: 'Hair', icon: '💇' },
  { key: 'beard', label: 'Beard', icon: '🧔' },
];

export default function StyleSelector({
  onSelect,
  recommendedStyleIds = [],
  isDisabled = false,
}: StyleSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<StyleCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredStyles =
    activeCategory === 'all'
      ? STYLE_CATALOG
      : STYLE_CATALOG.filter((s) => s.category === activeCategory);

  const selectedStyle = STYLE_CATALOG.find((s) => s.id === selectedId);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-fade-in-up">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-white">
          Choose Your Style
        </h2>
        <p className="text-xs text-neutral-500">
          Select a hairstyle or beard style to preview
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`
                px-3.5 py-1.5 text-xs font-medium rounded-lg
                transition-all duration-200 cursor-pointer
                ${
                  activeCategory === tab.key
                    ? 'bg-primary-500/15 text-primary-300 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredStyles.map((style, index) => {
          const isSelected = selectedId === style.id;
          const isRecommended = recommendedStyleIds.includes(style.id);

          return (
            <button
              key={style.id}
              onClick={() => !isDisabled && setSelectedId(style.id)}
              disabled={isDisabled}
              className={`
                relative text-left rounded-xl p-3 sm:p-4 transition-all duration-250 cursor-pointer
                border
                animate-fade-in
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isSelected
                    ? 'bg-primary-500/10 border-primary-500/40 shadow-lg shadow-primary-900/20 scale-[1.02]'
                    : 'glass border-glass-border hover:border-white/15 hover:bg-white/[0.04]'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Recommended badge */}
              {isRecommended && (
                <div className="absolute -top-1.5 -right-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[8px] text-white font-bold shadow-lg shadow-accent-600/30">
                    AI
                  </span>
                </div>
              )}

              {/* Emoji */}
              <div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3
                  transition-colors duration-200
                  ${isSelected ? 'bg-primary-500/15' : 'bg-white/5'}
                `}
              >
                {style.emoji}
              </div>

              {/* Name */}
              <p
                className={`
                  text-sm font-semibold mb-1 transition-colors duration-200
                  ${isSelected ? 'text-primary-300' : 'text-neutral-200'}
                `}
              >
                {style.name}
              </p>

              {/* Description */}
              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                {style.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {style.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} size="sm" variant={isSelected ? 'primary' : 'default'}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm Selection */}
      {selectedStyle && (
        <div className="flex justify-center animate-fade-in">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelect(selectedStyle)}
            disabled={isDisabled}
            icon={<span>✨</span>}
          >
            Generate {selectedStyle.name} Preview
          </Button>
        </div>
      )}
    </div>
  );
}
