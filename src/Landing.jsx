import React from 'react';
import { Calculator, Receipt, Calendar, TrendingUp, CheckCircle, ArrowRight, Sparkles, DollarSign, Shield } from 'lucide-react';

const Landing = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-space">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">allocai</span>
            </div>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Free for 1099 workers
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 font-syne leading-tight" style={{ fontWeight: 800 }}>
            Stop guessing.<br/>Start <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">saving</span>.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed" style={{ fontWeight: 300, letterSpacing: '0.01em' }}>
            The smartest tax calculator for freelancers, contractors, and self-employed workers. Know exactly how much to set aside—before tax season hits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transition-all"
            >
              Calculate Your Taxes Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-700 rounded-full font-semibold text-lg border-2 border-slate-200 hover:border-indigo-200 transition-all"
            >
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>All 50 states supported</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
              </div>
              <div className="flex-1 text-center text-white text-sm font-medium">allocai.vercel.app</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-50 to-indigo-50">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-sm text-slate-600 mb-2">Tax per paycheck</div>
                  <div className="text-3xl font-bold text-slate-900">$1,247.50</div>
                  <div className="text-sm text-slate-500 mt-2">24.8% rate</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-sm text-slate-600 mb-2">Take-home</div>
                  <div className="text-3xl font-bold text-green-600">$3,752.50</div>
                  <div className="text-sm text-slate-500 mt-2">After taxes</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 shadow-lg text-white">
                  <div className="text-sm opacity-90 mb-2">Annual tax</div>
                  <div className="text-3xl font-bold">$14,970</div>
                  <div className="text-sm opacity-80 mt-2">Total/year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 mb-8">Trusted by freelancers and contractors across the US</p>
          <div className="flex flex-wrap justify-center items-center gap-12 text-slate-400">
            <div className="text-2xl font-bold">1099 Workers</div>
            <div className="text-2xl font-bold">Freelancers</div>
            <div className="text-2xl font-bold">Contractors</div>
            <div className="text-2xl font-bold">Gig Workers</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-syne">
            Tax season shouldn't be scary
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            As a 1099 worker, you're on your own when it comes to taxes. No employer withholding. No guidance. Just you, a calculator, and a growing sense of dread every April.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
            <div className="text-4xl mb-4">😰</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Guessing How Much to Save</h3>
            <p className="text-slate-600">
              "Should I set aside 20%? 30%? I have no idea and Google gives me 47 different answers."
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Quarterly Payment Panic</h3>
            <p className="text-slate-600">
              "Wait, I owe HOW much?! And it's due next week? Why didn't anyone tell me??"
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Expense Tracking Chaos</h3>
            <p className="text-slate-600">
              "I know I can deduct that software... but where did I put that receipt? Or was it last year?"
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-br from-indigo-600 to-violet-600 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-syne">
              Everything you need in one place
            </h2>
            <p className="text-xl text-indigo-100">
              No spreadsheets. No confusion. Just clear answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <Calculator className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Tax Calculations</h3>
              <p className="text-indigo-100">
                Enter your income, get your tax estimate in seconds. Covers federal, state, and self-employment taxes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <Receipt className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Expense Tracking</h3>
              <p className="text-indigo-100">
                21 categories of business expenses. Track everything, maximize deductions, reduce your tax bill.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quarterly Reminders</h3>
              <p className="text-indigo-100">
                Never miss a payment deadline. We calculate your quarterly estimates and remind you when they're due.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Year-Round Planning</h3>
              <p className="text-indigo-100">
                See your annual tax picture at a glance. Plan ahead, save smart, avoid surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-syne">
            Three steps to tax clarity
          </h2>
          <p className="text-xl text-slate-600">
            It takes less than 2 minutes to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
              1
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sign Up Free</h3>
            <p className="text-slate-600">
              Create your account in 30 seconds. No credit card, no commitments, no catch.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
              2
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Enter Your Numbers</h3>
            <p className="text-slate-600">
              Tell us your state and income. Add expenses if you want even more accurate results.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
              3
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Your Answer</h3>
            <p className="text-slate-600">
              See exactly how much to save per paycheck, plus your quarterly and annual totals.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-syne">
                Built for real 1099 workers
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                We get it. Because we've been there. Allocai is designed by freelancers, for freelancers.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">All 50 States Covered</h4>
                    <p className="text-slate-600">From California to New York, we've got your state tax rates dialed in.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Your Data is Private</h4>
                    <p className="text-slate-600">Bank-level encryption. We never sell your data. Ever.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Actually Free</h4>
                    <p className="text-slate-600">No hidden fees. No "freemium" tricks. The whole thing, free, forever.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="font-semibold text-slate-700">Gross Income</span>
                  <span className="font-bold text-slate-900">$5,000.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
                  <span className="font-semibold text-green-700">Business Expenses</span>
                  <span className="font-bold text-green-700">-$450.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <span className="font-semibold text-indigo-700">Taxable Income</span>
                  <span className="font-bold text-indigo-700">$4,550.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-200">
                  <span className="font-semibold text-red-700">Total Tax</span>
                  <span className="font-bold text-red-700">$1,127.50</span>
                </div>
                <div className="pt-4 border-t-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">You Keep</span>
                    <span className="text-3xl font-bold text-green-600">$3,872.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-syne">
            Ready to take control of your taxes?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers who sleep better knowing exactly where they stand with the IRS.
          </p>
          <button 
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
          >
            Start Calculating Free
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-indigo-200 text-sm mt-6">
            No credit card • No setup fees • No surprises
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">allocai</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
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
            
            <p className="text-sm text-slate-500">© 2024 Allocai. Washington, DC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;