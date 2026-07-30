import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  ShoppingBag, 
  Clapperboard, 
  Car, 
  Receipt, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Trash2,
  Filter
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  currencySymbol?: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  'Food & Dining': Utensils,
  'Shopping': ShoppingBag,
  'Entertainment': Clapperboard,
  'Travel & Transport': Car,
  'Bills & Utilities': Receipt,
  'Income': Coins,
};

export default function TransactionList({ transactions, onDeleteTransaction, currencySymbol = '$' }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filter UI */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 rounded-2xl bg-apple-gray-50 px-3.5 py-2.5 border border-apple-gray-100 shadow-xs">
          <Search className="h-4 w-4 text-apple-gold" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-apple-gray-600 outline-none placeholder-apple-gray-300"
          />
        </div>

        {/* Categories Badges Scroller */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-apple-gold text-black border-apple-gold shadow-xs font-extrabold' 
                  : 'bg-apple-gray-100 text-apple-gray-400 border-apple-gray-200 hover:border-apple-gold/30'
              }`}
            >
              {cat === 'all' ? 'All Transactions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Feed */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
        <AnimatePresence initial={false}>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-xs text-apple-gray-400 font-medium rounded-2xl border border-dashed border-apple-gray-200 bg-apple-gray-50/50">
              No transactions logged yet.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const IconComp = CATEGORY_ICONS[tx.category] || Coins;
              const isExpense = tx.amount < 0;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-center justify-between rounded-2xl bg-apple-gray-50 p-3.5 border border-apple-gray-100 hover:border-apple-gold/30 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    {/* Circle Icon Indicator */}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isExpense 
                        ? 'bg-apple-gray-100 text-apple-gold' 
                        : 'bg-emerald-950/30 text-apple-green border border-emerald-900/30'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-apple-gray-600">{tx.description}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] uppercase tracking-wider font-bold bg-apple-gray-100 text-apple-gold/80 px-1.5 py-0.5 rounded-sm border border-apple-gray-200">
                          {tx.category}
                        </span>
                        <span className="text-[9px] text-apple-gray-300">{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right hand figures & delete button */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className={`font-display font-bold text-xs ${
                        isExpense ? 'text-apple-gray-600' : 'text-apple-green font-bold'
                      }`}>
                        {isExpense ? '-' : '+'}{currencySymbol}{Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <p className="text-[9px] text-apple-gray-300 font-medium">
                        {tx.status === 'completed' ? 'Settled' : 'Pending'}
                      </p>
                    </div>

                    {/* Delete Action button for quick sandbox edits */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-apple-gray-300 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                      title="Undo transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
