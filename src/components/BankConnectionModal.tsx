import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Lock, Shield, ArrowLeft, Check, Loader2, Building2, X } from 'lucide-react';
import { BankConnection, BankAccount } from '../types';
import { POPULAR_BANKS } from '../data/mockData';

interface BankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (newAccount: BankAccount) => void;
}

export default function BankConnectionModal({ isOpen, onClose, onConnect }: BankConnectionModalProps) {
  const [step, setStep] = useState<'select' | 'credentials' | 'connecting' | 'success'>('select');
  const [selectedBank, setSelectedBank] = useState<BankConnection | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [initialBalance, setInitialBalance] = useState('1500');

  const filteredBanks = POPULAR_BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBank = (bank: BankConnection) => {
    setSelectedBank(bank);
    setStep('credentials');
  };

  const handleBack = () => {
    if (step === 'credentials') {
      setStep('select');
      setSelectedBank(null);
    }
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setStep('connecting');
    
    // Simulate Plaid linkage animation
    setTimeout(() => {
      setStep('success');
      
      const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
      const generatedAccount: BankAccount = {
        id: `acc-${selectedBank?.bankId}-${Date.now()}`,
        bankName: selectedBank?.name || 'Linked Bank',
        accountName: accountType === 'checking' ? 'Active Checking' : 'Direct Savings',
        accountNumber: `•••• ${lastFour}`,
        balance: parseFloat(initialBalance) || 1200.00,
        type: accountType,
        isConnected: true,
        logoColor: selectedBank?.logoColor || 'bg-neutral-600',
      };

      // Add to main state
      onConnect(generatedAccount);
    }, 2500);
  };

  const handleClose = () => {
    // Reset states
    setStep('select');
    setSelectedBank(null);
    setUsername('');
    setPassword('');
    setInitialBalance('1500');
    setAccountType('checking');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-apple-gray-50 shadow-2xl border border-apple-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-apple-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              {step === 'credentials' && (
                <button
                  onClick={handleBack}
                  className="rounded-full p-1.5 hover:bg-apple-gray-100 text-apple-gray-300 hover:text-apple-gold transition cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h3 className="font-serif font-light text-lg text-apple-gold tracking-wider">
                {step === 'select' && 'Connect Bank Account'}
                {step === 'credentials' && `Link ${selectedBank?.name}`}
                {step === 'connecting' && 'Securing Connection'}
                {step === 'success' && 'Connection Successful'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 hover:bg-apple-gray-100 text-apple-gray-300 hover:text-apple-gold transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {step === 'select' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 rounded-2xl bg-apple-gray-100 px-3.5 py-2.5 border border-apple-gray-200 focus-within:border-apple-gold transition-all">
                  <Search className="h-5 w-5 text-apple-gold" />
                  <input
                    type="text"
                    placeholder="Search your bank..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-apple-gray-650 outline-none placeholder-apple-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-apple-gray-300">Popular Banks</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {filteredBanks.slice(0, 6).map((bank) => (
                      <button
                        key={bank.bankId}
                        onClick={() => handleSelectBank(bank)}
                        className="flex items-center gap-3 rounded-2xl border border-apple-gray-100 bg-apple-gray-50 p-3 text-left hover:border-apple-gold/30 hover:bg-apple-gray-100 active:scale-98 transition-all cursor-pointer"
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-white font-bold text-xs ${bank.logoColor}`}>
                          {bank.name.substring(0, 2)}
                        </div>
                        <span className="font-medium text-xs text-apple-gray-650 truncate">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {filteredBanks.length > 6 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-apple-gray-300">Other Banks</p>
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1 no-scrollbar">
                      {filteredBanks.slice(6).map((bank) => (
                        <button
                          key={bank.bankId}
                          onClick={() => handleSelectBank(bank)}
                          className="flex w-full items-center justify-between rounded-xl border border-apple-gray-100/50 p-2.5 text-left hover:bg-apple-gray-100 active:scale-99 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-lg text-white font-bold text-[10px] ${bank.logoColor}`}>
                              {bank.name.substring(0, 2)}
                            </div>
                            <span className="text-xs font-medium text-apple-gray-450">{bank.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-950/20 p-3.5 border border-emerald-900/30">
                  <Shield className="h-5 w-5 text-apple-green shrink-0" />
                  <p className="text-[11px] leading-relaxed text-[#22C55E]">
                    Secure sandbox authorization. Military-grade standard read-only sync tokens. Credentials are never recorded.
                  </p>
                </div>
              </div>
            )}

            {step === 'credentials' && (
              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm ${selectedBank?.logoColor}`}>
                    {selectedBank?.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-apple-gray-650">{selectedBank?.name} Secure Portal</h4>
                    <p className="text-xs text-apple-gray-300">Secure authorization via sandbox simulation</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-apple-gray-300 mb-1">User ID / Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter online banking ID"
                      className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 text-apple-gray-650 px-3.5 py-2.5 text-sm outline-none focus:border-apple-gold transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-apple-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter online banking password"
                      className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 text-apple-gray-650 px-3.5 py-2.5 text-sm outline-none focus:border-apple-gold transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-apple-gray-300 mb-1">Account Type</label>
                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings')}
                        className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 text-apple-gray-650 px-3 py-2.5 text-xs outline-none focus:border-apple-gold transition"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-apple-gray-300 mb-1">Starting Balance ($)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        placeholder="1500"
                        className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 text-apple-gray-650 px-3 py-2.5 text-xs outline-none focus:border-apple-gold transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-apple-gray-300 mt-2">
                  <Lock className="h-3.5 w-3.5 text-apple-gold/70" />
                  <span>Authorized sandbox mock connection</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 rounded-xl bg-apple-gold py-3 text-sm font-bold text-black uppercase tracking-wider hover:bg-[#D5C18F] active:scale-99 transition-all cursor-pointer"
                >
                  Link My Account
                </button>
              </form>
            )}

            {step === 'connecting' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="mb-4"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-apple-gold" />
                </motion.div>
                <h4 className="font-serif font-light text-lg text-apple-gold mb-1">Connecting to {selectedBank?.name}</h4>
                <p className="text-xs text-apple-gray-300 max-w-xs leading-relaxed">
                  Verifying sandbox credentials, fetching current balances, and establishing secure read-only token handshakes...
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-900/40 text-[#22C55E]">
                  <Check className="h-7 w-7 stroke-[3px]" />
                </div>
                <h4 className="font-serif font-light text-xl text-apple-gold mb-1">Bank Connected!</h4>
                <p className="text-xs text-apple-gray-300 max-w-xs leading-relaxed mb-6">
                  Your <span className="font-semibold text-apple-gray-400">{selectedBank?.name}</span> account was securely linked. Your dashboard balances have been successfully updated.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full rounded-xl bg-apple-gold py-3 text-sm font-bold text-black uppercase tracking-wider hover:bg-[#D5C18F] active:scale-99 transition-all cursor-pointer"
                >
                  Back to Wallet
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
