import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Home, Calculator, X, ArrowRight, CheckCircle, LogOut, User, Settings, ChevronDown, Lock, Plus, Trash2, Receipt, PiggyBank, Menu, FileText } from 'lucide-react';
import { supabase } from './lib/supabase';
import Landing from './Landing';
import jsPDF from 'jspdf';
import FeedbackShareButtons from './FeedbackShareButtons';

const SetasAI = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [state, setState] = useState('');
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savedCalculations, setSavedCalculations] = useState([]);
const [showSaveModal, setShowSaveModal] = useState(false);
const [saveName, setSaveName] = useState('');
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [userProfile, setUserProfile] = useState({
    paymentsPerYear: 12,
    expectedAnnualIncome: '',
    businessType: '',
    hasHealthInsurance: false
  });

  const states = {
    'AL': { name: 'Alabama', rate: 0.05 },
    'AK': { name: 'Alaska', rate: 0 },
    'AZ': { name: 'Arizona', rate: 0.0425 },
    'AR': { name: 'Arkansas', rate: 0.055 },
    'CA': { name: 'California', rate: 0.093 },
    'CO': { name: 'Colorado', rate: 0.0455 },
    'CT': { name: 'Connecticut', rate: 0.065 },
    'DE': { name: 'Delaware', rate: 0.066 },
    'DC': { name: 'District of Columbia', rate: 0.0975 },
    'FL': { name: 'Florida', rate: 0 },
    'GA': { name: 'Georgia', rate: 0.0575 },
    'HI': { name: 'Hawaii', rate: 0.11 },
    'ID': { name: 'Idaho', rate: 0.06 },
    'IL': { name: 'Illinois', rate: 0.0495 },
    'IN': { name: 'Indiana', rate: 0.0323 },
    'IA': { name: 'Iowa', rate: 0.06 },
    'KS': { name: 'Kansas', rate: 0.057 },
    'KY': { name: 'Kentucky', rate: 0.05 },
    'LA': { name: 'Louisiana', rate: 0.0425 },
    'ME': { name: 'Maine', rate: 0.075 },
    'MD': { name: 'Maryland', rate: 0.0575 },
    'MA': { name: 'Massachusetts', rate: 0.05 },
    'MI': { name: 'Michigan', rate: 0.0425 },
    'MN': { name: 'Minnesota', rate: 0.0985 },
    'MS': { name: 'Mississippi', rate: 0.05 },
    'MO': { name: 'Missouri', rate: 0.054 },
    'MT': { name: 'Montana', rate: 0.069 },
    'NE': { name: 'Nebraska', rate: 0.0684 },
    'NV': { name: 'Nevada', rate: 0 },
    'NH': { name: 'New Hampshire', rate: 0 },
    'NJ': { name: 'New Jersey', rate: 0.1075 },
    'NM': { name: 'New Mexico', rate: 0.059 },
    'NY': { name: 'New York', rate: 0.0685 },
    'NC': { name: 'North Carolina', rate: 0.0525 },
    'ND': { name: 'North Dakota', rate: 0.029 },
    'OH': { name: 'Ohio', rate: 0.039 },
    'OK': { name: 'Oklahoma', rate: 0.05 },
    'OR': { name: 'Oregon', rate: 0.099 },
    'PA': { name: 'Pennsylvania', rate: 0.0307 },
    'RI': { name: 'Rhode Island', rate: 0.0599 },
    'SC': { name: 'South Carolina', rate: 0.07 },
    'SD': { name: 'South Dakota', rate: 0 },
    'TN': { name: 'Tennessee', rate: 0 },
    'TX': { name: 'Texas', rate: 0 },
    'UT': { name: 'Utah', rate: 0.0495 },
    'VT': { name: 'Vermont', rate: 0.0875 },
    'VA': { name: 'Virginia', rate: 0.0575 },
    'WA': { name: 'Washington', rate: 0 },
    'WV': { name: 'West Virginia', rate: 0.065 },
    'WI': { name: 'Wisconsin', rate: 0.0765 },
    'WY': { name: 'Wyoming', rate: 0 },
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user data when authenticated (using localStorage for now - will migrate to Supabase tables)
  useEffect(() => {
    const loadReminders = async () => {
      if (user) {
        try {
          const data = localStorage.getItem(`setasai-reminders-${user.id}`);
          if (data) {
            setReminders(JSON.parse(data));
          }
        } catch (e) {
          setReminders([]);
        }
      }
    };
    loadReminders();
  }, [user]);

  useEffect(() => {
    const loadExpenses = async () => {
      if (user) {
        try {
          const data = localStorage.getItem(`setasai-expenses-${user.id}`);
          if (data) {
            setExpenses(JSON.parse(data));
          }
        } catch (e) {
          setExpenses([]);
        }
      }
    };
    loadExpenses();
  }, [user]);

  // Load saved calculations
useEffect(() => {
  const loadSavedCalculations = async () => {
    if (user && !user.anonymous) {
      try {
        const { data, error } = await supabase
          .from('saved_calculations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedCalculations(data || []);
      } catch (error) {
        console.error('Error loading saved calculations:', error);
        setSavedCalculations([]);
      }
    }
  };
  loadSavedCalculations();
}, [user]);

const saveCalculation = async () => {
  if (!user || user.anonymous || !saveName.trim()) return;

  // Check if user has reached limit (5 for free)
  if (savedCalculations.length >= 5) {
    alert('You\'ve reached the limit of 5 saved calculations. Upgrade to Pro for unlimited saves!');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert([
        {
          user_id: user.id,
          name: saveName.trim(),
          state: state,
          income: result.income,
          total_tax: result.total,
          take_home: result.take,
          tax_rate: result.rate,
          annual_tax: result.annualTax,
          quarterly_payment: result.quarterlyPayment,
          expenses_deducted: result.expensesDeducted || 0,
          taxable_income: result.taxableIncome,
          payments_per_year: userProfile.paymentsPerYear || 12,
          expected_annual_income: userProfile.expectedAnnualIncome || null,  // Changed
          business_type: userProfile.businessType || null,                    // Changed
          has_health_insurance: userProfile.hasHealthInsurance || false
        }
      ])
      .select();

    if (error) throw error;

    setSavedCalculations([data[0], ...savedCalculations]);
    setShowSaveModal(false);
    setSaveName('');
    alert('Calculation saved successfully!');
  } catch (error) {
    console.error('Error saving calculation:', error);
    alert('Failed to save calculation. Please try again.');
  }
};

const deleteCalculation = async (id) => {
  if (!confirm('Delete this calculation?')) return;

  try {
    const { error } = await supabase
      .from('saved_calculations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setSavedCalculations(savedCalculations.filter(calc => calc.id !== id));
  } catch (error) {
    console.error('Error deleting calculation:', error);
    alert('Failed to delete calculation.');
  }
};

const generatePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with branding
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('SetasAI', 20, 25);
  doc.setFontSize(12);
  doc.text('Tax Calculation Report', 20, 33);
  
  // Date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 60, 33);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Income Summary Section
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Income Summary', 20, 55);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`State: ${states[state]?.name || state}`, 20, 65);
  doc.text(`Gross Income: $${result.income.toFixed(2)}`, 20, 72);
  if (result.expensesDeducted > 0) {
    doc.text(`Business Expenses: -$${result.expensesDeducted.toFixed(2)}`, 20, 79);
    doc.text(`Taxable Income: $${result.taxableIncome.toFixed(2)}`, 20, 86);
  }
  
  // Tax Breakdown Section
  let yPos = result.expensesDeducted > 0 ? 100 : 85;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Tax Breakdown', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  // Tax boxes
  doc.setFillColor(254, 242, 242); // Red background
  doc.rect(20, yPos, 80, 30, 'F');
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(10);
  doc.text('Total Tax Per Paycheck', 25, yPos + 8);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`$${result.total.toFixed(2)}`, 25, yPos + 18);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`${result.rate.toFixed(1)}% effective rate`, 25, yPos + 25);
  
  doc.setFillColor(240, 253, 244); // Green background
  doc.rect(110, yPos, 80, 30, 'F');
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(10);
  doc.text('Take-Home Pay', 115, yPos + 8);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`$${result.take.toFixed(2)}`, 115, yPos + 18);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('After all taxes', 115, yPos + 25);
  
  // Quarterly Payments Section
  yPos += 45;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Quarterly Tax Payments', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const quarterlyDates = getQuarterlyDates();
  quarterlyDates.forEach((q, idx) => {
    doc.text(`${q.label}: $${result.quarterlyPayment.toFixed(2)} - Due: ${q.date}`, 25, yPos + (idx * 7));
  });
  
  // Annual Summary
  yPos += 35;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Annual Summary', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Annual Tax: $${result.annualTax.toLocaleString()}`, 20, yPos);
  doc.text(`Payment Frequency: ${userProfile.paymentsPerYear || 12} times per year`, 20, yPos + 7);
  
  if (result.expensesDeducted > 0) {
    doc.text(`Tax Savings from Expenses: $${result.taxSavingsFromExpenses.toFixed(2)}`, 20, yPos + 14);
  }
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by SetasAI - Smart Tax Allocation for 1099 Workers', 20, 280);
  doc.text('This is an estimate. Consult a tax professional for personalized advice.', 20, 285);
  
  // Save the PDF
  doc.save(`SetasAI-Tax-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const data = localStorage.getItem(`setasai-profile-${user.id}`);
          if (data) {
            setUserProfile(JSON.parse(data));
          }
        } catch (e) {}
      }
    };
    loadProfile();
  }, [user]);

  const handleAuth = async () => {
    setAuthError('');
    setAuthSuccess('');

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setShowAuth(false);
        setEmail('');
        setPassword('');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess('Check your email to confirm your account!');
        setEmail('');
        setPassword('');
        setName('');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setResult(null);
    setReminders([]);
    setExpenses([]);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return;

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowForgotPassword(false);
        setResetEmail('');
      }, 3000);
    }
  };

  const saveProfile = async (profile) => {
    if (user) {
      try {
        localStorage.setItem(`setasai-profile-${user.id}`, JSON.stringify(profile));
        setUserProfile(profile);
      } catch (e) {}
    }
  };

  const saveReminders = async (newReminders) => {
    if (user) {
      try {
        localStorage.setItem(`setasai-reminders-${user.id}`, JSON.stringify(newReminders));
        setReminders(newReminders);
      } catch (e) {}
    }
  };

  const addReminder = (date, amount, type) => {
    const newReminder = {
      id: Date.now().toString(),
      date,
      amount,
      type,
      paid: false,
      created: new Date().toISOString()
    };
    saveReminders([...reminders, newReminder]);
  };

  const togglePaid = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, paid: !r.paid } : r);
    saveReminders(updated);
  };

  const deleteReminder = (id) => {
    saveReminders(reminders.filter(r => r.id !== id));
  };

  const getQuarterlyDates = () => {
    const year = new Date().getFullYear();
    return [
      { quarter: 'Q1', date: `${year}-04-15`, label: 'Q1 (Jan-Mar)' },
      { quarter: 'Q2', date: `${year}-06-15`, label: 'Q2 (Apr-May)' },
      { quarter: 'Q3', date: `${year}-09-15`, label: 'Q3 (Jun-Aug)' },
      { quarter: 'Q4', date: `${year + 1}-01-15`, label: 'Q4 (Sep-Dec)' }
    ];
  };

  const expenseCategories = [
    'Office Supplies',
    'Software & Tools',
    'Travel & Transportation',
    'Meals & Entertainment',
    'Marketing & Advertising',
    'Professional Services',
    'Equipment',
    'Home Office',
    'Education & Training',
    'Insurance',
    'Licenses & Permits',
    'Subscriptions & Memberships',
    'Shipping & Postage',
    'Contract Labor',
    'Banking & Fees',
    'Repairs & Maintenance',
    'Phone & Internet',
    'Printing & Copying',
    'Business Meals',
    'Business Clothing',
    'Other'
  ];

  const saveExpenses = async (newExpenses) => {
    if (user) {
      try {
        localStorage.setItem(`setasai-expenses-${user.id}`, JSON.stringify(newExpenses));
        setExpenses(newExpenses);
      } catch (e) {}
    }
  };

  const addExpense = () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.category) return;

    const newExpense = {
      id: Date.now().toString(),
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      date: expenseForm.date,
      created: new Date().toISOString()
    };

    saveExpenses([...expenses, newExpense]);
    setExpenseForm({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowExpenseModal(false);
  };

  const deleteExpense = (id) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getExpensesByCategory = () => {
    const byCategory = {};
    expenses.forEach(exp => {
      if (!byCategory[exp.category]) {
        byCategory[exp.category] = 0;
      }
      byCategory[exp.category] += exp.amount;
    });
    return byCategory;
  };

  const calc = () => {
    const amt = parseFloat(income);
    if (!amt || !state) return;

    const totalExpenses = getTotalExpenses();
    const taxableIncome = Math.max(0, amt - totalExpenses);

    const se = taxableIncome * 0.9235 * 0.153;
    let fed = 0;
    const adj = taxableIncome - (se * 0.5);

    if (adj > 47150) fed += Math.min(adj - 47150, 53375) * 0.22;
    if (adj > 11600) fed += Math.min(adj - 11600, 35550) * 0.12;
    if (adj > 0) fed += Math.min(adj, 11600) * 0.10;

    const stateTax = taxableIncome * states[state].rate;
    const total = se + fed + stateTax;

    const paymentsPerYear = userProfile.paymentsPerYear || 12;
    const annualIncome = userProfile.expectedAnnualIncome 
      ? parseFloat(userProfile.expectedAnnualIncome) 
      : amt * paymentsPerYear;

    const annualExpenses = totalExpenses * paymentsPerYear;
    const annualTaxableIncome = Math.max(0, annualIncome - annualExpenses);

    const annualSE = annualTaxableIncome * 0.9235 * 0.153;
    let annualFed = 0;
    const annualAdj = annualTaxableIncome - (annualSE * 0.5);

    if (annualAdj > 47150) annualFed += Math.min(annualAdj - 47150, 53375) * 0.22;
    if (annualAdj > 11600) annualFed += Math.min(annualAdj - 11600, 35550) * 0.12;
    if (annualAdj > 0) annualFed += Math.min(annualAdj, 11600) * 0.10;

    const annualStateTax = annualTaxableIncome * states[state].rate;
    const annualTotalTax = annualSE + annualFed + annualStateTax;

    setResult({
      income: amt,
      state,
      total,
      take: amt - total,
      rate: (total / amt) * 100,
      annualTax: annualTotalTax,
      perYear: paymentsPerYear,
      quarterlyPayment: annualTotalTax / 4,
      expensesDeducted: totalExpenses,
      taxableIncome: taxableIncome,
      taxSavingsFromExpenses: (totalExpenses * 0.25)
    });

    setView('dashboard');

// Only show modal if they've NEVER filled it out (both are empty)
if (!userProfile.expectedAnnualIncome && !userProfile.businessType) {
  setTimeout(() => setShowMoreInfoModal(true), 500);
}
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

if (!user && !loading && !isAnonymous) {
  return (
    <>
      <Landing 
        onGetStarted={() => setShowAuth(true)} 
      onSkipToCalculator={() => {
    setIsAnonymous(true);
    setView('dashboard');
  }}
/>
      
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button onClick={() => { setShowAuth(false); setAuthError(''); setAuthSuccess(''); }} className="absolute top-4 right-4"><X /></button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h2 className="text-2xl font-bold">{isLogin ? 'Welcome back' : 'Get started'}</h2>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {authSuccess}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />
              {isLogin && (
                <div className="text-right">
                  <button onClick={() => { setShowAuth(false); setShowForgotPassword(true); }} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </button>
                </div>
              )}
              <button onClick={handleAuth} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
            <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); setAuthSuccess(''); }} className="mt-4 text-sm text-slate-600 w-full">
              {isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

  // [Continued in next part due to length...]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-space">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
           <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
  setIsAnonymous(false);
  setUser(null);
  setView('dashboard');
}}>
  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
    <span className="text-xl font-bold text-white">S</span>
  </div>
  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-poppins">SetasAI</span>
</div>

            {user ? (
              <>
                <div className="hidden md:block relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-all">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border py-2 z-50">
                      <div className="px-5 py-4 border-b">
                        <p className="text-sm font-semibold">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <button onClick={() => { setView('dashboard'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                        <Home className="w-4 h-4" />Dashboard
                      </button>
                      <button onClick={() => { setView('calculator'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                        <Calculator className="w-4 h-4" />Calculator
                      </button>
                      <button onClick={() => { setView('calendar'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                        <Calendar className="w-4 h-4" />Tax Calendar
                      </button>
                      <button onClick={() => { setView('expenses'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                        <Receipt className="w-4 h-4" />Expenses
                      </button>
                      <button onClick={() => { setView('expenses'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
  <Receipt className="w-4 h-4" />Expenses
</button>
<button onClick={() => { setView('saved'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
  <FileText className="w-4 h-4" />Saved Calculations
</button>
<button onClick={() => { setView('settings'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3"></button>
                      <button onClick={() => { setView('settings'); setShowUserMenu(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                        <Settings className="w-4 h-4" />Settings
                      </button>
                      <div className="border-t pt-2">
                        <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                          <LogOut className="w-4 h-4" />Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 hover:bg-slate-50 rounded-lg">
                  <Menu className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuth(true)} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-medium hover:shadow-lg transition-all">
                Sign in
              </button>
            )}
          </div>
        </div>

        {showMobileMenu && user && (
          <div className="md:hidden bg-white border-t">
            <div className="px-6 py-4 border-b">
              <p className="text-sm font-semibold">{user.user_metadata?.full_name || 'User'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button onClick={() => { setView('dashboard'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
              <Home className="w-4 h-4" />Dashboard
            </button>
            <button onClick={() => { setView('calculator'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
              <Calculator className="w-4 h-4" />Calculator
            </button>
            <button onClick={() => { setView('calendar'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
              <Calendar className="w-4 h-4" />Tax Calendar
            </button>
            <button onClick={() => { setView('expenses'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
              <Receipt className="w-4 h-4" />Expenses
            </button>
            <button onClick={() => { setView('expenses'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
  <Receipt className="w-4 h-4" />Expenses
</button>
<button onClick={() => { setView('saved'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
  <FileText className="w-4 h-4" />Saved Calculations
</button>
<button onClick={() => { setView('settings'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
  <Settings className="w-4 h-4" />Settings
</button>
            <button onClick={() => { setView('settings'); setShowMobileMenu(false); }} className="w-full text-left px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
              <Settings className="w-4 h-4" />Settings
            </button>
            <div className="border-t">
              <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                <LogOut className="w-4 h-4" />Sign out
              </button>
            </div>
          </div>
        )}
      </nav>


{showAuth && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button onClick={() => { setShowAuth(false); setAuthError(''); setAuthSuccess(''); }} className="absolute top-4 right-4"><X /></button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h2 className="text-2xl font-bold">{isLogin ? 'Welcome back' : 'Get started'}</h2>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {authSuccess}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" />
              {isLogin && (
                <div className="text-right">
                  <button onClick={() => { setShowAuth(false); setShowForgotPassword(true); }} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </button>
                </div>
              )}
              <button onClick={handleAuth} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
            <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); setAuthSuccess(''); }} className="mt-4 text-sm text-slate-600 w-full">
              {isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </div>
        </div>
      )}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button onClick={() => { setShowForgotPassword(false); setResetSent(false); setResetEmail(''); setAuthError(''); }} className="absolute top-4 right-4">
              <X />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-sm text-slate-600">Enter your email and we'll send you a reset link</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            {!resetSent ? (
              <div className="space-y-4">
                <input 
                  type="email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  placeholder="Email" 
                  className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none" 
                />
                <button 
                  onClick={handleForgotPassword} 
                  disabled={!resetEmail}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                >
                  Send Reset Link
                </button>
                <button 
                  onClick={() => { setShowForgotPassword(false); setShowAuth(true); }} 
                  className="w-full text-sm text-slate-600"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-slate-600 mb-4">Reset link sent to {resetEmail}</p>
                <p className="text-xs text-slate-500">Check your inbox and follow the instructions</p>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'dashboard' && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 font-poppins" style={{ fontWeight: 800 }}>
                {user ? `Hey ${user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]} 👋` : 'Tax made simple'}
              </h1>
              <p className="text-xl text-slate-600 mb-8" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>Smart tax allocation for 1099 workers</p>
              <button onClick={() => setView('calculator')} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold hover:shadow-xl transition-all">
                <Calculator className="w-5 h-5" />
                Calculate your taxes
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {result && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl p-8 border shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-50 rounded-2xl">
                        <DollarSign className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Tax per paycheck</p>
                    </div>
                    <p className="text-4xl font-bold mb-2">${result.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">{result.rate.toFixed(1)}% rate</p>
                    {result.expensesDeducted > 0 && (
                      <p className="text-xs text-green-600 mt-2">Saved ${result.taxSavingsFromExpenses.toFixed(2)} from expenses</p>
                    )}
                  </div>

                  <div className="bg-white rounded-3xl p-8 border shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 rounded-2xl">
                        <PiggyBank className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Take-home</p>
                    </div>
                    <p className="text-4xl font-bold text-green-600 mb-2">${result.take.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">After taxes</p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Annual</p>
                    </div>
                    <p className="text-4xl font-bold mb-2">${result.annualTax.toLocaleString()}</p>
                    <p className="text-sm opacity-80">Total tax/year</p>
                  </div>

                  </div>

                <div className="bg-white rounded-3xl p-8 border shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 text-center">Your Money Breakdown</h3>
                  <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Taxes</span>
                          <span className="text-sm font-bold text-red-600">{result.rate.toFixed(1)}%</span>
                        </div>
                        <div className="h-12 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                            style={{ width: `${result.rate.toFixed(1)}%` }}
                          />
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-2">${result.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Take-Home</span>
                          <span className="text-sm font-bold text-green-600">{((result.take / result.income) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-12 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                            style={{ width: `${((result.take / result.income) * 100).toFixed(1)}%` }}
                          />
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">${result.take.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-slate-600 mb-1">Total Income</p>
                        <p className="text-4xl font-bold text-slate-900">${result.income.toFixed(2)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                        <div className="text-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2" />
                          <p className="text-xs text-slate-500">Taxes</p>
                          <p className="text-lg font-bold text-red-600">${result.total.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
                          <p className="text-xs text-slate-500">Yours</p>
                          <p className="text-lg font-bold text-green-600">${result.take.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               {/* Save & Download Buttons */}
<div className="flex flex-col items-center gap-4">
  <div className="flex gap-4">
    <button
      onClick={() => setShowSaveModal(true)}
      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all"
    >
      <FileText className="w-5 h-5" />
      Save Calculation
    </button>
    <button
      onClick={generatePDF}
      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
    >
      <ArrowRight className="w-5 h-5 rotate-90" />
      Download PDF
    </button>
  </div>
  <p className="text-sm text-slate-500">
    {savedCalculations.length}/5 calculations saved
  </p>
</div>

                <div className="bg-white rounded-3xl p-8 border shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    Quarterly Payment Breakdown
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => (
                      <div key={quarter} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-100">
                        <p className="text-sm font-medium text-slate-600 mb-2">{quarter} Payment</p>
                        <p className="text-3xl font-bold text-indigo-600">${result.quarterlyPayment.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Due: {getQuarterlyDates()[idx].date.split('-').slice(1).join('/')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="font-medium">Set aside per paycheck for quarterly taxes:</span>
                    <span className="text-2xl font-bold text-indigo-600">${(result.quarterlyPayment / 3).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setView('calendar')}
                    className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Set Up Tax Reminders
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-8 border shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Tax Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="font-medium">Gross Income</span>
                      <span className="font-bold">${result.income.toFixed(2)}</span>
                    </div>
                    {result.expensesDeducted > 0 && (
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
                        <span className="font-medium text-green-700">Business Expenses</span>
                        <span className="font-bold text-green-700">-${result.expensesDeducted.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl">
                      <span className="font-medium text-indigo-700">Taxable Income</span>
                      <span className="font-bold text-indigo-700">${result.taxableIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
                      <span className="font-medium text-red-700">Total Tax</span>
                      <span className="font-bold text-red-700">${result.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calculator className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Start your first calculation</h3>
                <p className="text-slate-600 mb-8">Get instant tax insights in seconds</p>
                <button onClick={() => setView('calculator')} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold">
                  Calculate
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'calculator' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Tax Calculator</h1>
            <div className="bg-white rounded-3xl p-8 border shadow-sm space-y-6">
              <div>
                <label className="block font-semibold mb-3">State</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none">
                  <option value="">Select state</option>
                  {Object.entries(states).map(([code, data]) => <option key={code} value={code}>{data.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-3">Paycheck Amount</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="5000" className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none text-lg" />
              </div>
              <button onClick={calc} disabled={!state || !income} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-full font-semibold disabled:opacity-50">
                Calculate
              </button>
            </div>
          </div>
        )}

        {view === 'calendar' && user && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Tax Payment Calendar</h1>

            <div className="bg-white rounded-3xl p-8 border shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Quarterly Tax Deadlines
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {getQuarterlyDates().map((q) => {
                  const isPast = new Date(q.date) < new Date();
                  return (
                    <div key={q.quarter} className={`p-6 rounded-2xl border-2 ${isPast ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50 border-indigo-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{q.quarter}</span>
                        <span className={`text-sm px-3 py-1 rounded-full ${isPast ? 'bg-slate-200 text-slate-600' : 'bg-indigo-200 text-indigo-700'}`}>
                          {isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{q.label}</p>
                      <p className="text-lg font-semibold">{new Date(q.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      {!isPast && result && (
                        <button
                          onClick={() => addReminder(q.date, result.quarterlyPayment, 'quarterly')}
                          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Set Reminder
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-indigo-600" />
                Your Tax Reminders
              </h2>

              {reminders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-4">No reminders yet</p>
                  <p className="text-sm text-slate-500">Click "Set Reminder" on a quarterly date to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((reminder) => {
                      const isPast = new Date(reminder.date) < new Date();
                      const daysUntil = Math.ceil((new Date(reminder.date) - new Date()) / (1000 * 60 * 60 * 24));

                      return (
                        <div key={reminder.id} className={`p-5 rounded-2xl border-2 flex items-center justify-between ${reminder.paid ? 'bg-green-50 border-green-200' : isPast ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-4 flex-1">
                            <button
                              onClick={() => togglePaid(reminder.id)}
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                reminder.paid
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-slate-300 hover:border-indigo-500'
                              }`}
                            >
                              {reminder.paid && <CheckCircle className="w-5 h-5 text-white" />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className={`font-semibold ${reminder.paid ? 'line-through text-slate-500' : ''}`}>
                                  {new Date(reminder.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                {!reminder.paid && !isPast && daysUntil <= 7 && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                    {daysUntil} days left
                                  </span>
                                )}
                                {!reminder.paid && isPast && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-2xl font-bold text-indigo-600">${reminder.amount.toFixed(2)}</p>
                              <p className="text-sm text-slate-500 capitalize">{reminder.type} payment</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {reminders.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-lg">
                  <p className="text-sm mb-2 opacity-80">Total Scheduled</p>
                  <p className="text-3xl font-bold">
                    ${reminders.filter(r => !r.paid).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border shadow-sm">
                  <p className="text-sm mb-2 text-slate-600">Paid</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${reminders.filter(r => r.paid).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border shadow-sm">
                  <p className="text-sm mb-2 text-slate-600">Upcoming</p>
                  <p className="text-3xl font-bold">
                    {reminders.filter(r => !r.paid && new Date(r.date) >= new Date()).length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'expenses' && user && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Expense Tracker</h1>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Total Expenses</p>
                </div>
                <p className="text-4xl font-bold mb-2">${getTotalExpenses().toLocaleString()}</p>
                <p className="text-sm opacity-80">This year</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-50 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Tax Savings</p>
                </div>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  ${(getTotalExpenses() * 0.25).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">Estimated @ 25%</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Total Tracked</p>
                </div>
                <p className="text-4xl font-bold mb-2">{expenses.length}</p>
                <p className="text-sm text-slate-500">Expenses</p>
              </div>
            </div>

            {expenses.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">By Category</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(getExpensesByCategory()).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="font-medium">{category}</span>
                      <span className="text-lg font-bold text-indigo-600">${amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-8 border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">All Expenses</h2>

              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-4">No expenses yet</p>
                  <p className="text-sm text-slate-500">Click "Add Expense" to start tracking your business deductions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((expense) => (
                      <div key={expense.id} className="p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 transition-colors flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-lg">{expense.description}</p>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {expense.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold text-indigo-600">${expense.amount.toFixed(2)}</p>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showExpenseModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
              <button onClick={() => setShowExpenseModal(false)} className="absolute top-4 right-4">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Add Expense</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    placeholder="Coffee meeting with client"
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Amount</label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    placeholder="45.00"
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>
                <button
                  onClick={addExpense}
                  disabled={!expenseForm.description || !expenseForm.amount || !expenseForm.category}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {showMoreInfoModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowMoreInfoModal(false)} className="absolute top-4 right-4">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Get More Accurate Results</h2>
                <p className="text-sm text-slate-600">Help us personalize your tax estimates</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Expected Annual Income</label>
                  <input
                    type="number"
                    value={userProfile.expectedAnnualIncome}
                    onChange={(e) => setUserProfile({...userProfile, expectedAnnualIncome: e.target.value})}
                    placeholder="120000"
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Your total expected income for the year</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">How Often Are You Paid?</label>
                  <select
                    value={userProfile.paymentsPerYear}
                    onChange={(e) => setUserProfile({...userProfile, paymentsPerYear: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  >
                    <option value="12">Monthly (12x/year)</option>
                    <option value="24">Bi-monthly (24x/year)</option>
                    <option value="26">Bi-weekly (26x/year)</option>
                    <option value="52">Weekly (52x/year)</option>
                    <option value="4">Quarterly (4x/year)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Business Type</label>
                  <select
                    value={userProfile.businessType}
                    onChange={(e) => setUserProfile({...userProfile, businessType: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="freelancer">Freelancer / Consultant</option>
                    <option value="rideshare">Rideshare Driver</option>
                    <option value="delivery">Delivery Driver</option>
                    <option value="creative">Creative Professional</option>
                    <option value="tech">Tech Contractor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <input
                    type="checkbox"
                    id="healthInsurance"
                    checked={userProfile.hasHealthInsurance}
                    onChange={(e) => setUserProfile({...userProfile, hasHealthInsurance: e.target.checked})}
                    className="w-5 h-5 rounded accent-indigo-600"
                  />
                  <label htmlFor="healthInsurance" className="text-sm font-medium flex-1">
                    I pay for my own health insurance
                    <p className="text-xs text-slate-500 mt-1">This may be deductible</p>
                  </label>
                </div>
                <button
                  onClick={() => {
                    saveProfile(userProfile);
                    setShowMoreInfoModal(false);
                    if (income && state) {
                      calc();
                    }
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold"
                >
                  Save & Update Results
                </button>
                <button
                  onClick={() => setShowMoreInfoModal(false)}
                  className="w-full text-sm text-slate-600"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'saved' && user && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Saved Calculations</h1>
                <p className="text-slate-600 mt-2">{savedCalculations.length}/5 calculations saved (Free tier)</p>
              </div>
            </div>

            {savedCalculations.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No saved calculations yet</h3>
                <p className="text-slate-600 mb-8">Run a tax calculation and save it for future reference</p>
                <button onClick={() => setView('calculator')} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold">
                  Calculate Taxes
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedCalculations.map((calc) => (
                  <div key={calc.id} className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{calc.name}</h3>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {calc.state}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                          Saved on {new Date(calc.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Income</p>
                            <p className="text-lg font-bold">${parseFloat(calc.income).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Total Tax</p>
                            <p className="text-lg font-bold text-red-600">${parseFloat(calc.total_tax).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Take Home</p>
                            <p className="text-lg font-bold text-green-600">${parseFloat(calc.take_home).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Tax Rate</p>
                            <p className="text-lg font-bold">{parseFloat(calc.tax_rate).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCalculation(calc.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'settings' && user && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Settings</h1>
            <div className="bg-white rounded-3xl p-8 border shadow-sm space-y-6">
              <div>
                <label className="block font-semibold mb-2">Name</label>
                <input type="text" value={user.user_metadata?.full_name || ''} className="w-full px-4 py-3 border-2 rounded-2xl bg-slate-50" disabled />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input type="email" value={user.email} className="w-full px-4 py-3 border-2 rounded-2xl bg-slate-50" disabled />
              </div>
              <div>
                <label className="block font-semibold mb-2">Plan</label>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="font-medium capitalize">Free Plan</span>
                </div>
              </div>
            </div>
          </div>
        )}
               <footer className="mt-20 border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
              <p>© 2025 SetasAI. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </a>
                <a href="mailto:dylehein@gmail.com" className="hover:text-indigo-600 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>

        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
              <button onClick={() => { setShowSaveModal(false); setSaveName(''); }} className="absolute top-4 right-4">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Save Calculation</h2>
                <p className="text-sm text-slate-600">Give this calculation a name</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Calculation Name</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="e.g., Summer 2025 Estimate"
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:border-indigo-500 outline-none"
                    maxLength={50}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {savedCalculations.length}/5 calculations saved (Free tier)
                  </p>
                </div>

                <button
                  onClick={saveCalculation}
                  disabled={!saveName.trim() || savedCalculations.length >= 5}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savedCalculations.length >= 5 ? 'Limit Reached - Upgrade to Pro' : 'Save Calculation'}
                </button>

                {savedCalculations.length >= 5 && (
                  <p className="text-xs text-center text-amber-600">
                    You've reached the free tier limit. Upgrade to Pro for unlimited saves!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

       <FeedbackShareButtons />
    </div>
  );
}

export default SetasAI;