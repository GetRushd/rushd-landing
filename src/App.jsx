import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Calendar, 
  Bell, 
  MapPin, 
  RefreshCw, 
  Leaf, 
  BarChart3, 
  BookOpen
} from 'lucide-react';

/**
 * Inabah - THE SACRED SANCTUARY
 * Strict implementation of DESIGN.md & screen.png
 * Updated: Manrope Font, Simplified Navigation, Arabic Branding (No Tashkeel)
 */

// Design Tokens
const tokens = {
  bg: '#F6FBF1',
  primary: '#061B0E',
  primaryContainer: '#1B3022',
  secondary: '#23674A',
  secondaryContainer: '#C9E8BF',
  surfaceLow: '#F0F5EB',
  surfaceHigh: '#E4EAE0',
  outline: 'rgba(195, 200, 193, 0.15)'
};

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { scrollYProgress } = useScroll();

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen font-['Manrope'] selection:bg-[#C9E8BF] selection:text-[#061B0E] scroll-smooth" style={{ backgroundColor: tokens.bg, color: tokens.primary }}>
      
      {/* Load Manrope Font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
      `}} />

      {/* Scroll Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#23674A] origin-left z-[60]" style={{ scaleX }} />

      {/* 1. NAVIGATION BAR - Simplified Branding */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 transition-all duration-500 ${scrolled ? 'bg-white/40 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <span className="font-extrabold text-2xl tracking-tighter">Inabah</span>
             <span className="text-xl font-light opacity-30 mt-1" dir="rtl">إنابة</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-[#061B0E] text-white px-8 py-3 rounded-full text-[11px] font-bold shadow-lg hover:scale-105 transition-transform active:scale-95 uppercase tracking-widest">
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-28 md:pt-40 pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="space-y-10 z-10"
          >
            <div className="space-y-4 text-left">
              <h1 className="text-7xl md:text-[100px] font-extrabold leading-[0.85] tracking-[-0.04em]">
                Put prayer<br />
                <span className="text-[#23674A] italic font-light">first.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#23674A] max-w-md leading-relaxed font-medium">
                Inabah helps you shape your day around Salah, transforming your digital schedule into a sacred sanctuary of focus and flow.
              </p>
            </div>

            {submitted ? (
              <div className="max-w-md py-5 px-7 bg-[#C9E8BF] rounded-full text-sm font-bold text-[#061B0E]">
                You're on the list — check your inbox.
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 bg-[#F0F5EB] rounded-full px-7 py-5 outline-none focus:ring-2 ring-[#061B0E]/5 text-sm font-medium border-none shadow-inner"
                  aria-label="Email address"
                />
                <button type="submit" disabled={loading} className="bg-[#061B0E] text-white px-8 py-5 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
                  {loading ? 'Joining...' : 'Join the waitlist'}
                </button>
              </form>
            )}
            {formError && <p className="text-red-500 text-xs font-medium max-w-md">{formError}</p>}
            
            <div className="flex items-center gap-4 opacity-40 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-[#061B0E]"></div>
              <span>Coming soon to iOS and Android</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Phone 1 (The Main Pivot) */}
            <div className="relative z-20 w-72 md:w-80 aspect-[1/2] bg-[#061B0E] rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(6,27,14,0.3)] border-[8px] border-[#1B3022] overflow-hidden transform lg:translate-x-12 -rotate-2 p-3">
                <img
                  src="/screenshot-1.png"
                  alt="Inabah app — prayer schedule view"
                  className="w-full h-full object-contain object-top rounded-[2.5rem]"
                />
            </div>
            
            {/* Phone 2 (Asymmetry) */}
            <div className="absolute z-10 w-64 md:w-72 aspect-[1/2] bg-white rounded-[3.5rem] shadow-[0_40px_80px_rgba(6,27,14,0.1)] border-[8px] border-white overflow-hidden transform -translate-x-36 translate-y-12 rotate-3 p-3">
               <img
                 src="/screenshot-2.png"
                 alt="Inabah app — calendar integration view"
                 className="w-full h-full object-contain object-top rounded-[2.5rem]"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CONTEXTUAL INTRO */}
      <section className="py-14 md:py-20 px-6 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 justify-between items-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="md:w-1/2 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Modern life is busy.<br />
              <span className="opacity-40 font-light">Losing direction is the real problem.</span>
            </h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="md:w-1/3 space-y-8"
          >
            <p className="text-[#23674A] font-medium leading-relaxed">
              Our days are full of meetings, errands, and notifications. Without intentional structure, our spiritual connection becomes a footnote. We aren't just busy; we're drifting from our center.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
               <div className="space-y-1">
                  <span className="text-3xl font-bold">84%</span>
                  <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Feel digitally overwhelmed</p>
               </div>
               <div className="space-y-1">
                  <span className="text-3xl font-bold">5x</span>
                  <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Daily moments of peace needed</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-16 md:py-28 px-6 text-center space-y-8 md:space-y-12">
        <div className="inline-block bg-[#C9E8BF] text-[#23674A] px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          The Anchoring Principle
        </div>
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={fadeInVariant}
           className="space-y-8"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Five prayers.<br />Five pivots.
          </h2>
          <p className="text-xl text-[#23674A] leading-relaxed max-w-2xl mx-auto font-medium">
            Inabah is built on a simple premise: the five daily prayers should be treated like the true anchors of our existence. Instead of squeezing prayer into your day, we help you build your day around your prayers.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4 pt-8 md:pt-12">
           <StepCard number="01" title="Fajr Awakening" desc="Setting intention before the world wakes." />
           <StepCard number="02" title="Dhuhr Pivot" desc="A mid-day pause in the height of action." className="md:translate-x-8" />
           <ConflictCard />
           <StepCard number="03" title="Asr Checkpoint" desc="Protected — no meetings allowed in this window." className="md:translate-x-4" />
           <StepCard number="04" title="Maghrib Reset" desc="The day winds down. Your inbox can wait." className="md:translate-x-12" />
           <StepCard number="05" title="Isha Closure" desc="A moment of reflection before rest." className="md:translate-x-6" />
        </div>
      </section>

      {/* 5. FEATURES */}
      <section id="features" className="py-16 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter">Built for real life.</h2>
          <p className="text-[#23674A] font-medium opacity-50 uppercase text-[11px] tracking-widest">Sophisticated tools for a balanced spiritual life.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Calendar className="w-5 h-5" />} 
            title="Plan with prayer in mind" 
            description="Sync your Google or Outlook calendar and see your tasks mapped alongside prayer windows."
          />
          <FeatureCard 
            icon={<Bell className="w-5 h-5" />} 
            title="Get reminders that actually matter" 
            description="No aggressive alarms. Just gentle nudges that prepare you for the coming connection."
          />
          <FeatureCard 
            icon={<MapPin className="w-5 h-5" />} 
            title="Find places to pray nearby" 
            description="Integrated map feature to locate masjids and prayer spaces whenever your journey takes you."
          />
          <FeatureCard 
            icon={<RefreshCw className="w-5 h-5" />} 
            title="Keep your calendar connected" 
            description="Automatic time blocking ensures you're never booked during the most important appointments of the day."
          />
          <FeatureCard 
            icon={<Leaf className="w-5 h-5" />} 
            title="Stay grounded in calm UI" 
            description="A distraction-free environment designed to lower your heart rate and lift your focus."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-5 h-5" />} 
            title="Sacred Analytics" 
            description="Track your consistency and find patterns in your spiritual rhythm without the 'gamification' pressure."
          />
        </div>
      </section>

      {/* 6. A CLEARER RHYTHM */}
      <section className="py-16 md:py-28 px-6 max-w-7xl mx-auto text-center space-y-12 md:space-y-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter">A clearer rhythm for the day.</h2>
        
        <div className="grid lg:grid-cols-3 gap-8 items-center">
           <div className="text-left space-y-12">
              <div className="space-y-3">
                 <h4 className="font-bold text-xl">Know what prayer is next</h4>
                 <p className="text-sm opacity-60 leading-relaxed">A persistent, calm countdown that keeps you aware without creating anxiety.</p>
              </div>
              <div className="space-y-3">
                 <h4 className="font-bold text-xl">Find a place to pray on the go</h4>
                 <p className="text-sm opacity-60 leading-relaxed">One tap to see the nearest sanctuary, complete with directions and facilities info.</p>
              </div>
           </div>
           
           <div className="flex justify-center relative">
              <div className="w-64 aspect-[9/19.5] bg-[#061B0E] rounded-[3rem] shadow-2xl overflow-hidden p-3">
                 <img
                   src="/screenshot-3.png"
                   alt="Inabah app — prayer time view"
                   className="w-full h-full object-cover rounded-[2rem]"
                 />
              </div>
           </div>

           <div className="flex justify-center">
              <div className="w-64 aspect-[9/19.5] bg-[#F0F5EB] rounded-[3rem] shadow-xl border border-white overflow-hidden p-3">
                 <img
                   src="/screenshot-2.png"
                   alt="Inabah app — calendar view"
                   className="w-full h-full object-cover rounded-[2rem]"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* 7. THE ETHOS */}
      <section className="py-16 md:py-28 px-6 text-center max-w-4xl mx-auto space-y-8 md:space-y-12">
        <BookOpen className="w-10 h-10 mx-auto opacity-30 text-[#061B0E]" />
        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={fadeInVariant}
           className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Technology is a vessel.<br />What we fill it with matters.</h2>
          <blockquote className="text-2xl text-[#23674A] font-light italic leading-relaxed opacity-80">
            "The same tools that distract can also serve good. Inabah is an attempt to reclaim the digital landscape for the soul, making the path to presence easier, not harder."
          </blockquote>
          <div className="pt-4 flex flex-col items-center gap-2">
            <div className="w-12 h-[1px] bg-[#061B0E]/20"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">The Inabah Ethos</span>
          </div>
        </motion.div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="px-6 pb-20 md:pb-32">
        <motion.div 
           whileHover={{ scale: 1.01 }}
           className="max-w-6xl mx-auto bg-[#061B0E] rounded-[3.5rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_60px_100px_-20px_rgba(6,27,14,0.4)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9E8BF]/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9]">Busy life is real.<br />Prayer is still first.</h2>
              <p className="text-white/50 text-lg md:text-xl font-medium max-w-xl mx-auto">Inabah is for people who want to live in the modern world without letting it decide what comes first.</p>
            </div>
            
            {submitted ? (
              <div className="py-5 px-8 bg-white/10 rounded-full text-sm font-bold text-white/80">
                You're on the list — check your inbox.
              </div>
            ) : (
              <>
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto bg-white/5 p-2 rounded-[2.5rem] border border-white/5">
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full bg-transparent px-8 py-4 outline-none text-sm font-medium"
                    aria-label="Email address"
                  />
                  <button type="submit" disabled={loading} className="w-full sm:w-auto bg-white text-[#061B0E] px-8 py-4 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap shadow-xl disabled:opacity-50">
                    {loading ? 'Joining...' : 'Notify me at launch'}
                  </button>
                </form>
                {formError && <p className="text-red-400 text-xs font-medium">{formError}</p>}
              </>
            )}
            
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.25em]">Join 2,500+ others on the early access list.</p>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 max-w-7xl mx-auto">
        <div className="w-full h-[1px] bg-[#061B0E]/10 mb-12" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg tracking-tighter">Inabah</span>
            <span className="text-base font-light opacity-30" dir="rtl">إنابة</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-25">
            © 2026 Inabah · getInabah.app
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            <a href="#" className="hover:opacity-100 transition-opacity">X</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Internal Components
const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-[#F0F5EB] rounded-[2.5rem] p-12 space-y-6 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_rgba(6,27,14,0.06)]"
  >
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#061B0E]">
      {icon}
    </div>
    <div className="space-y-3">
      <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
      <p className="text-sm text-[#23674A] font-medium leading-relaxed opacity-60">
        {description}
      </p>
    </div>
  </motion.div>
);

const ConflictCard = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="md:translate-x-16 bg-[#FFF8F0] border border-orange-200/60 rounded-2xl p-5 shadow-[0_10px_30px_rgba(6,27,14,0.04)]"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">!</div>
      <div className="flex-1 text-left space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#061B0E]">Conflict detected</h4>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-100 px-2 py-0.5 rounded-full">Auto-fixed</span>
        </div>
        <div className="space-y-1.5 text-[11px] font-medium">
          <div className="flex items-center gap-3 line-through opacity-40">
            <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>
            <span>Team sync — 3:45 PM → 4:30 PM</span>
            <span className="text-orange-400 no-underline font-black not-italic">overlaps Asr</span>
          </div>
          <div className="flex items-center gap-3 text-[#23674A]">
            <div className="w-2 h-2 rounded-full bg-[#23674A] shrink-0"></div>
            <span>Team sync rescheduled → 4:45 PM</span>
          </div>
        </div>
        <p className="text-[10px] opacity-40 leading-relaxed">Inabah detected your 3:45 PM meeting overlaps with Asr and suggested a slot right after. Your team has been notified.</p>
      </div>
    </div>
  </motion.div>
);

const StepCard = ({ number, title, desc, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-2xl p-6 flex items-center gap-6 shadow-[0_10px_30px_rgba(6,27,14,0.04)] border border-white/40 ${className}`}
  >
    <div className="w-10 h-10 bg-[#061B0E] text-white rounded-full flex items-center justify-center font-bold text-xs italic shrink-0">
      {number}
    </div>
    <div className="text-left">
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-[11px] opacity-40">{desc}</p>
    </div>
  </motion.div>
);

export default App;