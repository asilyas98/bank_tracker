import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ArrowRightLeft, DollarSign, Sparkles, Check, Loader2, Users, AlertTriangle, AlertCircle, X, Plus } from 'lucide-react';
import { BankAccount, Contact, Budget, Transaction } from '../types';
import { INITIAL_CONTACTS } from '../data/mockData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  budgets: Budget[];
  onExecutePayment: (paymentData: {
    amount: number;
    description: string;
    category: string;
    accountId: string;
    contactName?: string;
  }) => void;
  currencySymbol?: string;
}

export default function PaymentModal({ isOpen, onClose, accounts, budgets, onExecutePayment, currencySymbol = '$' }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'confirming' | 'success'>('details');
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Shopping');
  
  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customRecipientDetail, setCustomRecipientDetail] = useState('');

  // State initialization
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  const activeAccount = accounts.find(acc => acc.id === selectedAccount);
  const activeBudget = budgets.find(b => b.category === selectedCategory);

  const parsedAmount = parseFloat(amount) || 0;
  
  // Check if this payment exceeds the category budget
  const willBeAboveBudget = activeBudget 
    ? (activeBudget.spent + parsedAmount > activeBudget.limit)
    : false;

  const budgetLeft = activeBudget ? (activeBudget.limit - activeBudget.spent) : 0;
  const overdraftAmount = activeBudget ? (activeBudget.spent + parsedAmount - activeBudget.limit) : 0;

  // Check if account has sufficient funds
  const hasSufficientFunds = activeAccount 
    ? (activeAccount.type === 'credit' ? true : activeAccount.balance >= parsedAmount)
    : false;

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsCustomRecipient(false);
  };

  const handleSelectCustom = () => {
    setSelectedContact(null);
    setIsCustomRecipient(true);
  };

  const handleAddCustomContact = () => {
    if (!customRecipientName) return;
    const newContact: Contact = {
      id: `custom-${Date.now()}`,
      name: customRecipientName,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=120&h=120&q=80`,
      phoneOrEmail: customRecipientDetail || 'Direct Debit',
    };
    setContacts(prev => [newContact, ...prev]);
    setSelectedContact(newContact);
    setIsCustomRecipient(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parsedAmount <= 0) return;
    if (!selectedAccount) return;
    if (!selectedContact && !customRecipientName) return;

    setStep('confirming');

    // Simulate Payment processing
    setTimeout(() => {
      setStep('success');
      const recipient = selectedContact ? selectedContact.name : customRecipientName;
      onExecutePayment({
        amount: parsedAmount,
        description: `Payment to ${recipient}`,
        category: selectedCategory,
        accountId: selectedAccount,
        contactName: recipient,
      });
    }, 2200);
  };

  const handleClose = () => {
    setStep('details');
    setAmount('');
    setSelectedContact(null);
    setIsCustomRecipient(false);
    setCustomRecipientName('');
    setCustomRecipientDetail('');
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
            <h3 className="font-serif font-light text-lg text-apple-gold flex items-center gap-2 tracking-wider">
              <ArrowRightLeft className="h-5 w-5 text-apple-gold/80" />
              Send Payment
            </h3>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 hover:bg-apple-gray-100 text-apple-gray-300 hover:text-apple-gold transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {step === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact Selection */}
                <div>
                  <label className="block text-[9px] font-semibold text-apple-gray-300 uppercase tracking-wider mb-2">Recipient</label>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                    {contacts.map((c) => {
                      const isSelected = selectedContact?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectContact(c)}
                          className={`flex flex-col items-center gap-1.5 shrink-0 rounded-2xl p-2 w-18 border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-apple-gold bg-apple-gray-100 scale-102 font-medium' 
                              : 'border-apple-gray-100 hover:border-apple-gold/30 bg-apple-gray-50'
                          }`}
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={c.avatarUrl}
                            alt={c.name}
                            className="h-9 w-9 rounded-full object-cover border border-apple-gray-100"
                          />
                          <span className="text-[10px] text-apple-gray-650 text-center truncate w-full">{c.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleSelectCustom}
                      className={`flex flex-col items-center justify-center gap-1.5 shrink-0 rounded-2xl p-2 w-18 border border-dashed transition-all cursor-pointer ${
                        isCustomRecipient 
                          ? 'border-apple-gold bg-apple-gray-100 font-medium' 
                          : 'border-apple-gray-250 hover:border-apple-gold/30 bg-apple-gray-50'
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-apple-gray-100 text-apple-gold">
                        <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] text-apple-gray-300 text-center font-medium">Custom</span>
                    </button>
                  </div>
                </div>

                {/* Custom Recipient Fields */}
                {isCustomRecipient && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-3.5 rounded-2xl bg-apple-gray-100 border border-apple-gray-200 space-y-3"
                  >
                    <h4 className="text-xs font-semibold text-apple-gray-650">Add Custom Recipient</h4>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={customRecipientName}
                        onChange={(e) => setCustomRecipientName(e.target.value)}
                        className="w-full text-xs rounded-xl border border-apple-gray-200 px-3 py-2 outline-none focus:border-apple-gold bg-apple-gray-50 text-apple-gray-650"
                      />
                      <input
                        type="text"
                        placeholder="Phone or Email (Optional)"
                        value={customRecipientDetail}
                        onChange={(e) => setCustomRecipientDetail(e.target.value)}
                        className="w-full text-xs rounded-xl border border-apple-gray-200 px-3 py-2 outline-none focus:border-apple-gold bg-apple-gray-50 text-apple-gray-650"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomContact}
                        disabled={!customRecipientName}
                        className="w-full rounded-lg bg-apple-gold text-black text-xs py-1.5 font-bold uppercase tracking-wider hover:bg-[#D5C18F] disabled:opacity-40 transition cursor-pointer"
                      >
                        Confirm Recipient
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Selected Recipient Banner */}
                {selectedContact && (
                  <div className="flex items-center justify-between rounded-2xl bg-apple-gray-100 p-3 border border-apple-gray-200">
                    <div className="flex items-center gap-2.5">
                      <img
                        referrerPolicy="no-referrer"
                        src={selectedContact.avatarUrl}
                        alt={selectedContact.name}
                        className="h-8 w-8 rounded-full object-cover border border-apple-gray-200"
                      />
                      <div>
                        <p className="text-xs font-semibold text-apple-gray-650">{selectedContact.name}</p>
                        <p className="text-[10px] text-[#8E8E93]">{selectedContact.phoneOrEmail}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium bg-apple-gray-200 text-apple-gold px-2 py-0.5 rounded-md">
                      {selectedContact.bankName || 'Direct Transfer'}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Account Choice */}
                  <div>
                    <label className="block text-xs font-semibold text-apple-gray-300 uppercase tracking-wider mb-1.5">From Account</label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 px-3 py-2.5 text-xs outline-none text-apple-gray-650 focus:border-apple-gold transition"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.bankName} - {acc.accountName} ({currencySymbol}{acc.balance.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Category */}
                  <div>
                    <label className="block text-xs font-semibold text-apple-gray-300 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-xl border border-apple-gray-200 bg-apple-gray-100 px-3 py-2.5 text-xs outline-none text-apple-gray-650 focus:border-apple-gold transition"
                    >
                      {budgets.map((b) => (
                        <option key={b.id} value={b.category}>
                          {b.category}
                        </option>
                      ))}
                      <option value="Income">Income (Direct Credit)</option>
                      <option value="Transfer">Transfer / Savings Goal</option>
                    </select>
                  </div>
                </div>

                {/* Amount Entry */}
                <div>
                  <label className="block text-xs font-semibold text-apple-gray-300 uppercase tracking-wider mb-1.5">Amount</label>
                  <div className="relative flex items-center rounded-2xl border border-apple-gray-200 bg-apple-gray-100 px-4 py-3 focus-within:border-apple-gold transition">
                    <span className="text-apple-gold font-semibold text-lg w-5 text-center flex items-center justify-center">{currencySymbol}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent ml-1 font-display font-medium text-lg text-apple-gray-650 outline-none placeholder-apple-gray-300"
                    />
                  </div>
                </div>

                {/* BUDGET CHECK ALERTS (RED vs GREEN visual mechanics) */}
                {parsedAmount > 0 && activeBudget && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      willBeAboveBudget
                        ? 'border-red-900/50 bg-red-950/20 text-[#EF4444]'
                        : 'border-emerald-900/40 bg-emerald-950/10 text-apple-green'
                    }`}
                  >
                    <div className="flex gap-2.5 items-start">
                      {willBeAboveBudget ? (
                        <AlertCircle className="h-5 w-5 text-apple-red shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-apple-green shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <span className="font-semibold block">
                          {willBeAboveBudget ? 'Over Budget Alert' : 'Within Safe Budget'}
                        </span>
                        <p className="mt-0.5 text-apple-gray-300 leading-relaxed">
                          {willBeAboveBudget ? (
                            <span>
                              This payment will exceed your <span className="font-semibold text-apple-gray-650">{selectedCategory}</span> budget limit by <span className="font-bold text-apple-red">{currencySymbol}{overdraftAmount.toFixed(2)}</span>! (Limit: {currencySymbol}{activeBudget.limit.toFixed(2)}, Current: {currencySymbol}{activeBudget.spent.toFixed(2)})
                            </span>
                          ) : (
                            <span>
                              Perfect! You have <span className="font-semibold text-apple-green">{currencySymbol}{budgetLeft.toFixed(2)}</span> remaining of your {currencySymbol}{activeBudget.limit.toFixed(2)} budget for <span className="font-semibold text-apple-gray-650">{selectedCategory}</span>.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Account Overdraft Alert */}
                {parsedAmount > 0 && activeAccount && !hasSufficientFunds && activeAccount.type !== 'credit' && (
                  <div className="flex gap-2 rounded-2xl border border-red-900/50 bg-red-950/20 p-3 text-xs text-apple-red">
                    <AlertTriangle className="h-4 w-4 text-apple-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Insufficient Funds</span>
                      <span className="text-apple-gray-300">Your account balance is {currencySymbol}{activeAccount.balance.toFixed(2)}, which is lower than the requested transfer amount.</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedAccount || (!selectedContact && !customRecipientName) || parsedAmount <= 0 || (!hasSufficientFunds && activeAccount?.type !== 'credit')}
                  className="w-full mt-4 rounded-xl bg-apple-gold py-3.5 text-sm font-bold text-black uppercase tracking-wider hover:bg-[#D5C18F] active:scale-99 disabled:bg-apple-gray-100 disabled:text-apple-gray-300 disabled:border-apple-gray-200 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Pay with Apple Pay
                </button>
              </form>
            )}

            {step === 'confirming' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="mb-4"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-apple-gold" />
                </motion.div>
                <h4 className="font-serif font-light text-lg text-apple-gold mb-1">Processing Payment</h4>
                <p className="text-xs text-apple-gray-300 max-w-xs leading-relaxed">
                  Securing authorization token, executing bank ledger settlement, and updating real-time category spending budgets...
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-900/40 text-apple-green">
                  <Check className="h-7 w-7 stroke-[3px]" />
                </div>
                <h4 className="font-serif font-light text-xl text-apple-gold mb-1">Transfer Complete!</h4>
                <p className="text-xs text-apple-gray-300 max-w-xs leading-relaxed mb-6">
                  Successfully transferred <span className="font-bold text-apple-gray-650">{currencySymbol}{parsedAmount.toFixed(2)}</span> to <span className="font-semibold text-apple-gray-650">{selectedContact ? selectedContact.name : customRecipientName}</span> funded by your {activeAccount?.bankName} account.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full rounded-xl bg-apple-gold py-3 text-sm font-bold text-black uppercase tracking-wider hover:bg-[#D5C18F] active:scale-99 transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
