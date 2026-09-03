import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Input } from '../ui/Input';

export default function PartnerSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', theaterName: '', screens: '1-5' });

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setSubmitted(false);
      setForm({ name: '', email: '', theaterName: '', screens: '1-5' });
    }, 2000);
  };

  return (
    <section id="partner-section" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Container Box */}
        <div className="glass rounded-3xl p-8 md:p-14 border border-white/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-secondary/15">
          
          {/* Background Decorative Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="primary" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                CineVerse Enterprise Solutions
              </Badge>

              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-h m-0 leading-tight">
                Empower Your Theater with <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">CineVerse Cloud POS</span>
              </h2>

              <p className="text-text/80 text-base md:text-lg leading-relaxed">
                Are you a theater owner, distributor, or event manager? Partner with CineVerse to list your screens, automate real-time seat inventory, maximize seat occupancy, and access our 2.5M+ active moviegoer audience.
              </p>

              {/* B2B Perks List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 glass p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-h">Real-Time Sync</div>
                    <div className="text-[11px] text-text/70">Instant Cloud POS integration</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                    📈
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-h">+35% Revenue Boost</div>
                    <div className="text-[11px] text-text/70">Dynamic yield pricing AI</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold">
                    🍿
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-h">F&B Upsell Engine</div>
                    <div className="text-[11px] text-text/70">+40% average order value</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-h">Zero Onboarding Fee</div>
                    <div className="text-[11px] text-text/70">Free hardware & setup</div>
                  </div>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="font-bold text-sm uppercase tracking-wider shadow-xl shadow-primary/20"
                >
                  <span>Apply for Partnership</span>
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>

                <a href="#faq-section">
                  <Button variant="ghost" size="lg" className="text-xs font-bold uppercase tracking-wider">
                    Learn Requirements
                  </Button>
                </a>
              </div>

            </div>

            {/* Right Interactive Dashboard Card Preview */}
            <div className="lg:col-span-5">
              <Card className="p-6 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl bg-white/60 dark:bg-neutral-dark/80 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-text-h uppercase tracking-wider">Live Partner Portal</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    CineVerse Cloud v4.2
                  </span>
                </div>

                {/* Stat Preview */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10">
                    <div className="text-[10px] text-text/60 font-bold uppercase">Today's Occupancy</div>
                    <div className="text-2xl font-extrabold text-text-h mt-0.5">94.2%</div>
                    <div className="text-[10px] text-emerald-600 font-bold">↑ 14% vs avg</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10">
                    <div className="text-[10px] text-text/60 font-bold uppercase">Ticket Revenue</div>
                    <div className="text-2xl font-extrabold text-secondary mt-0.5">$48,290</div>
                    <div className="text-[10px] text-emerald-600 font-bold">↑ 22% this week</div>
                  </div>
                </div>

                {/* Showtimes Status List */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-text-h uppercase tracking-wider">Screen Schedule Overview</div>
                  
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/30 dark:bg-white/5 text-xs">
                    <div>
                      <div className="font-bold text-text-h">Screen 1 (IMAX Laser)</div>
                      <div className="text-[10px] text-text/70">Oppenheimer • 07:30 PM</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 text-[10px] font-bold">
                      Sold Out
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/30 dark:bg-white/5 text-xs">
                    <div>
                      <div className="font-bold text-text-h">Screen 2 (Dolby Atmos)</div>
                      <div className="text-[10px] text-text/70">Toxic: A Fairy Tale • 08:15 PM</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] font-bold">
                      92% Booked
                    </span>
                  </div>
                </div>

              </Card>
            </div>

          </div>
        </div>

      </div>

      {/* Partner Application Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Become a CineVerse Cinema Partner</DialogTitle>
            <DialogDescription>
              Submit your theater details and our business development team will contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h4 className="text-lg font-bold text-text-h">Application Submitted!</h4>
              <p className="text-xs text-text/70">Thank you. We'll be in touch with your customized onboarding kit.</p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-text-h mb-1">Your Full Name</label>
                <Input
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-h mb-1">Business Email</label>
                <Input
                  required
                  type="email"
                  placeholder="sarah@cinema.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-h mb-1">Theater / Chain Name</label>
                <Input
                  required
                  placeholder="e.g. Starlight Multiplex NYC"
                  value={form.theaterName}
                  onChange={(e) => setForm({ ...form, theaterName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-h mb-1">Number of Screens</label>
                <select
                  value={form.screens}
                  onChange={(e) => setForm({ ...form, screens: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="1-5">1 - 5 Screens</option>
                  <option value="6-15">6 - 15 Screens</option>
                  <option value="16+">16+ Multiplex Chain</option>
                </select>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="font-bold">
                  Submit Partner Request
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
