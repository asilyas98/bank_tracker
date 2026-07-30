import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  ShoppingBag, 
  Clapperboard, 
  Car, 
  Receipt, 
  Plus, 
  Edit3, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Coins,
  DollarSign
} from 'lucide-react';
import { Budget } from '../types';

interface BudgetManagerProps {
  budgets: Budget[];
  onUpdateBudgetLimit: (id: string, newLimit: number) => void;
  onAddBudget: (category: string, limit: number, iconName: string) => void;
  currencySymbol?: string;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Utensils: Utensils,
  ShoppingBag: ShoppingBag,
  Clapperboard: Clapperboard,
  Car: Car,
  Receipt: Receipt,
  Coins: Coins,
};

export default function BudgetManager({ budgets, onUpdateBudgetLimit, onAddBudget, currencySymbol = '$' }: BudgetManagerProps) {
  const [filter, setFilter] = useState<'all' | 'red' | 'green'>('all');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState('');
  
  // Adding new budget
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newIcon, setNewIcon] = useState('Coins');

  // Filter budgets
  const filteredBudgets = budgets.filter(b => {
    const isOver = b.spent > b.limit;
    if (filter === 'red') return isOver;
    if (filter === 'green') return !isOver;
    return true;
  });

  const handleStartEdit = (b: Budget) => {
    setEditingBudgetId(b.id);
    setEditingLimit(b.limit.toString());
  };

  const handleSaveEdit = (id: string) => {
    const parsed = parseFloat(editingLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBudgetLimit(id, parsed);
    }
    setEditingBudgetId(null);
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(newLimit);
    if (!newCategory || isNaN(parsedLimit) || parsedLimit <= 0) return;
    
    // Check if category already exists
    if (budgets.some(b => b.category.toLowerCase() === newCategory.toLowerCase())) {
      alert('This budget category already exists!');
      return;
    }

    onAddBudget(newCategory, parsedLimit, newIcon);
    setNewCategory('');
    setNewLimit('');
    setNewIcon('Coins');
    setShowAddForm(false);
  };

  const totalBudgeted = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const overBudgetCategoriesCount = budgets.filter(b => b.spent > b.limit).length;

  return (
    <div className="space-y-5">
      {/* Budget Summary Card */}
      <div className="rounded-3xl bg-apple-gray-50 p-5 border border-apple-gray-100 shadow-xs">
        <h3 className="font-serif font-light text-sm text-apple-gold uppercase tracking-[0.15em] mb-4">Monthly Budget Overview</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200">
            <span className="text-xs text-apple-gray-300 font-medium">Total Limit</span>
            <div className="text-2xl font-semibold font-display text-apple-gray-600 mt-1">{currencySymbol}{totalBudgeted.toFixed(2)}</div>
          </div>
          <div className={`rounded-2xl p-4 border transition-all ${
            totalSpent > totalBudgeted 
              ? 'bg-red-950/20 border-red-900/50' 
              : 'bg-emerald-950/10 border-emerald-900/40'
          }`}>
            <span className="text-xs font-medium text-apple-gray-300">Total Spent</span>
            <div className={`text-2xl font-semibold font-display mt-1 ${
              totalSpent > totalBudgeted ? 'text-apple-red' : 'text-apple-green'
            }`}>
              {currencySymbol}{totalSpent.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-apple-gray-400">Global Utilization</span>
            <span className={totalSpent > totalBudgeted ? 'text-apple-red font-semibold' : 'text-apple-green font-semibold'}>
              {totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-apple-gray-100 rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min((totalSpent / (totalBudgeted || 1)) * 100, 100)}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                totalSpent > totalBudgeted ? 'bg-apple-red animate-pulse' : 'bg-apple-green'
              }`}
            />
          </div>
          {overBudgetCategoriesCount > 0 ? (
            <div className="flex items-center gap-1.5 text-[11px] text-apple-red mt-1 font-medium bg-red-950/30 border border-red-900/30 px-2.5 py-1 rounded-lg w-fit">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{overBudgetCategoriesCount} categories are currently over budget!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-apple-green mt-1 font-medium bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-lg w-fit">
              <Check className="h-3.5 w-3.5 stroke-[3px]" />
              <span>All budget categories are healthy and on track.</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 rounded-xl bg-apple-gray-100 p-1 border border-apple-gray-200 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'all' ? 'bg-apple-gold text-black shadow-xs font-extrabold' : 'text-apple-gray-300 hover:text-apple-gray-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('red')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              filter === 'red' ? 'bg-red-500 text-white shadow-xs font-semibold' : 'text-red-400 hover:bg-red-950/30'
            }`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
            Red Alerts
          </button>
          <button
            onClick={() => setFilter('green')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              filter === 'green' ? 'bg-emerald-500 text-white shadow-xs font-semibold' : 'text-apple-green hover:bg-emerald-950/30'
            }`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
            Green Safe
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 rounded-xl bg-apple-gold px-3 py-1.5 text-xs font-bold text-black hover:bg-[#D5C18F] transition cursor-pointer uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Create New Budget Category Dialog */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleCreateBudget}
            className="rounded-3xl border border-apple-gray-100 bg-apple-gray-50 p-5 space-y-3.5 overflow-hidden shadow-xs"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-serif font-light text-sm text-apple-gold tracking-wider uppercase">New Budget Category</h4>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-xs text-apple-gray-300 hover:text-apple-gold font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-apple-gray-300 uppercase tracking-wider mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs rounded-xl border border-apple-gray-200 bg-apple-gray-50 text-apple-gray-600 px-3.5 py-2.5 outline-none focus:border-apple-gold"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-apple-gray-300 uppercase tracking-wider mb-1">Limit Target ({currencySymbol})</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="250.00"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full text-xs rounded-xl border border-apple-gray-200 bg-apple-gray-50 text-apple-gray-600 px-3.5 py-2.5 outline-none focus:border-apple-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-semibold text-apple-gray-300 uppercase tracking-wider mb-2">Select Visual Icon</label>
              <div className="flex gap-2.5">
                {Object.keys(ICON_MAP).map(iconName => {
                  const IconComp = ICON_MAP[iconName];
                  const isSelected = newIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewIcon(iconName)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected ? 'border-apple-gold bg-apple-gray-100 text-apple-gold scale-105' : 'border-apple-gray-200 hover:border-apple-gold/30'
                      }`}
                    >
                      <IconComp className="h-4 w-4 text-apple-gold/80" />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-apple-gold py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-[#D5C18F] transition cursor-pointer"
            >
              Establish Category Target
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Budgets List */}
      <div className="space-y-3.5">
        {filteredBudgets.length === 0 ? (
          <div className="rounded-2xl bg-apple-gray-50 p-8 text-center border border-dashed border-apple-gray-200 text-apple-gray-400 text-xs">
            No budget categories match the selected filter.
          </div>
        ) : (
          filteredBudgets.map((b) => {
            const isOverBudget = b.spent > b.limit;
            const percentUsed = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            const IconComponent = ICON_MAP[b.iconName] || Coins;
            const isEditing = editingBudgetId === b.id;

            return (
              <motion.div
                key={b.id}
                layout
                className={`rounded-2xl bg-apple-gray-50 p-4 border transition-all ${
                  isOverBudget 
                    ? 'border-red-950 hover:border-red-900 shadow-xs' 
                    : 'border-apple-gray-100 hover:border-apple-gold/30 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      isOverBudget 
                        ? 'bg-red-950/40 text-apple-red border border-red-900/30' 
                        : 'bg-emerald-950/20 text-apple-green border border-emerald-900/20'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-apple-gray-600">{b.category}</h4>
                      <p className="text-[10px] text-apple-gray-400">
                        {isOverBudget ? (
                          <span className="text-apple-red font-medium">Over budget by {currencySymbol}{(b.spent - b.limit).toFixed(2)}</span>
                        ) : (
                          <span className="text-apple-green font-medium">Remaining: {currencySymbol}{(b.limit - b.spent).toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex items-center border border-apple-gray-200 rounded-lg px-2 py-1 bg-apple-gray-100">
                          <span className="text-xs text-apple-gray-300">{currencySymbol}</span>
                          <input
                            type="number"
                            value={editingLimit}
                            onChange={(e) => setEditingLimit(e.target.value)}
                            className="w-16 bg-transparent text-xs text-apple-gray-600 outline-none font-medium ml-0.5"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveEdit(b.id)}
                          className="p-1.5 rounded-lg bg-apple-gold text-black hover:bg-[#D5C18F] transition cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5 font-bold" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-xs">
                          <span className="font-semibold text-apple-gray-600">{currencySymbol}{b.spent.toFixed(0)}</span>
                          <span className="text-apple-gray-300"> / {currencySymbol}{b.limit.toFixed(0)}</span>
                        </div>
                        <button
                          onClick={() => handleStartEdit(b)}
                          className="rounded-lg p-1.5 hover:bg-apple-gray-100 text-apple-gray-300 hover:text-apple-gold transition cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar with Color states */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-apple-gray-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-apple-red animate-pulse' : 'bg-apple-green'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isOverBudget ? 'bg-red-950/40 text-apple-red border-red-900/30' : 'bg-emerald-950/20 text-apple-green border-emerald-900/30'
                    }`}>
                      {isOverBudget ? 'Above Limit' : 'Safe'}
                    </span>
                    <span className="text-apple-gray-300 font-medium">{percentUsed.toFixed(0)}% utilized</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
