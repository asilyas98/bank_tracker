import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Nfc, Cpu, Sparkles, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { BankAccount } from '../types';

interface AppleCardProps {
  accounts: BankAccount[];
  activeAccountId: string;
  onSelectAccount: (id: string) => void;
  currencySymbol?: string;
  onAddAccount?: () => void;
  onSyncAccount?: (id: string) => Promise<void>;
}

export default function AppleCard({ accounts, activeAccountId, onSelectAccount, currencySymbol = '$', onAddAccount, onSyncAccount }: AppleCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  const activeAccount = accounts.find(acc => acc.id === activeAccountId) || accounts[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Limit rotation to small values for dynamic premium effect
    setRotate({
      x: -y / 10,
      y: x / 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleSyncClick = async () => {
    if (!activeAccount || isSyncing) return;
    setIsSyncing(true);
    if (onSyncAccount) {
      try {
        await onSyncAccount(activeAccount.id);
      } catch (err) {
        console.error('Error syncing account:', err);
      }
    }
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Selector of Cards */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar items-center">
        {accounts.map((acc) => {
          const isActive = acc.id === activeAccountId;
          return (
            <button
              key={acc.id}
              onClick={() => onSelectAccount(acc.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-apple-gold text-black border-apple-gold shadow-xs font-bold' 
                  : 'bg-apple-gray-100 text-apple-gray-400 border-apple-gray-200 hover:border-apple-gold/40'
              }`}
            >
              {acc.bankName}
            </button>
          );
        })}
        {onAddAccount && (
          <button
            onClick={onAddAccount}
            className="p-2 rounded-full border border-dashed border-apple-gold/40 bg-apple-gray-50 text-apple-gold hover:border-apple-gold hover:bg-apple-gray-100/50 transition-all cursor-pointer flex items-center justify-center shrink-0 h-8 w-8"
            title="Link and sync more bank accounts"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Titanium Apple Card Mockup */}
      <div className="perspective-1000 py-2">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
          className="relative h-56 w-full cursor-pointer select-none overflow-hidden rounded-[24px] p-6 text-white shadow-2xl transition-all duration-200 ease-out border border-[#E8D4A2]/20"
        >
          {/* Card background styling based on account */}
          {activeAccount?.id === 'acc-apple-card' ? (
            // Premium Gold-infused Dark Titanium plate for Apple Card
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#211E17] to-[#141311]" />
          ) : activeAccount?.id === 'acc-apple-cash' ? (
            // Cool cyber gold mesh theme for Apple Cash
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-[#1C1A14] to-neutral-900" />
          ) : (
            // Custom card brand background (Gold-toned charcoal)
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0C0C0D] via-[#1A1A1A] to-[#151412]" />
          )}

          {/* Interactive Metallic Overlay reflection shine */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300 hover:opacity-70"
            style={{
              background: `radial-gradient(circle at ${rotate.y * 10 + 50}% ${-rotate.x * 10 + 50}%, rgba(232, 212, 162, 0.5) 0%, rgba(0,0,0,0) 65%)`
            }}
          />

          {/* Card Content Layout */}
          <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                {/* Bank Name */}
                <span className="font-serif text-lg font-light tracking-widest text-apple-gold">
                  {activeAccount?.bankName}
                </span>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-apple-gray-400">
                  {activeAccount?.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Nfc className="h-5 w-5 text-apple-gold/75" />
                {activeAccount?.id === 'acc-apple-card' && (
                  <Sparkles className="h-5 w-5 text-apple-gold animate-pulse" />
                )}
              </div>
            </div>

            {/* Simulated Chip */}
            <div className="h-8 w-11 rounded-md border bg-[#2C2C2E]/40 border-[#E8D4A2]/20 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-apple-gold/80" />
            </div>

            <div className="flex items-end justify-between">
              <div className="space-y-1.5">
                {/* Account details */}
                <p className="font-mono text-xs tracking-widest text-apple-gray-300">
                  {activeAccount?.accountNumber}
                </p>
                <p className="text-[9px] uppercase font-bold tracking-wider text-apple-gray-400">
                  Cardholder
                </p>
              </div>

              {/* Dynamic Balance indicator */}
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-wider font-bold text-apple-gray-400">
                  {activeAccount?.type === 'credit' ? 'Balance Due' : 'Available Balance'}
                </p>
                <p className="font-display font-bold text-lg text-apple-gold">
                  {currencySymbol}{Math.abs(activeAccount?.balance || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Synchronized status notification */}
      <div className="flex items-center justify-between rounded-xl bg-apple-gray-50 p-3 py-2.5 border border-apple-gray-100 text-xs">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-apple-gold animate-spin border border-dashed border-black/20' : 'bg-apple-green animate-pulse'}`} />
          <span className="text-apple-gray-500 font-medium">
            {isSyncing ? 'Syncing accounts...' : 'Synced with sandbox feeds'}
          </span>
        </div>
        {onSyncAccount ? (
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-apple-gold hover:text-apple-gold-dark cursor-pointer disabled:opacity-50 transition-all select-none"
            title="Fetch real-time transaction updates"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        ) : (
          <span className="text-apple-gray-400 font-mono text-[10px]">{activeAccount?.accountNumber}</span>
        )}
      </div>
    </div>
  );
}
