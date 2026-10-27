import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCENARIO_ITEMS } from '../../data/mockScenariosAndOfficers';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Briefcase, 
  Building, 
  Home as HomeIcon, 
  Eye, 
  Globe, 
  UserX, 
  HeartHandshake, 
  Ban, 
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { ScenarioItem } from '../../types';

export const ScenarioLibraryPage: React.FC = () => {
  const { selectScenario } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Threat or intimidation',
    'Physical violence',
    'Social exclusion or boycott',
    'Workplace discrimination',
    'Community discrimination',
    'Family-related threat',
    'Property-related issue',
    'Sexual violence',
    'Retaliation or fear of reporting',
    'Other concern'
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'Users': return <Users className="w-5 h-5 text-teal-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-sky-400" />;
      case 'Building': return <Building className="w-5 h-5 text-indigo-400" />;
      case 'Home': return <HomeIcon className="w-5 h-5 text-emerald-400" />;
      case 'Eye': return <Eye className="w-5 h-5 text-orange-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'UserX': return <UserX className="w-5 h-5 text-rose-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-pink-400" />;
      case 'Ban': return <Ban className="w-5 h-5 text-red-400" />;
      default: return <HelpCircle className="w-5 h-5 text-teal-400" />;
    }
  };

  const filteredScenarios = selectedCategory === 'ALL'
    ? SCENARIO_ITEMS
    : SCENARIO_ITEMS.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Select a Situation</h2>
        <p className="text-xs text-slate-400">
          Choose a situation to help us understand the context of your concern. The scenario is only a starting point; our system will process your situation dynamically.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenarios Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((item: ScenarioItem) => (
          <div
            key={item.id}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {getIcon(item.iconName)}
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-semibold text-teal-300">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-[11px] text-slate-400 italic">
                "{item.initialMessage.slice(0, 75)}..."
              </div>
            </div>

            <button
              onClick={() => selectScenario(item)}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 transition text-xs font-bold flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start with This Situation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
