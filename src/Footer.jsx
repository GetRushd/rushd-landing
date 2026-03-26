import React from 'react';

const Footer = () => (
  <footer className="py-20 px-6 max-w-7xl mx-auto">
    <div className="w-full h-[1px] bg-[#061B0E]/10 mb-12" />
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-lg tracking-tighter">Rushd</span>
        <span className="text-base font-light opacity-30" dir="rtl">رشد</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-25">
        © 2026 Rushd · getrushd.app
      </p>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
        <a href="#" className="hover:opacity-100 transition-opacity">X</a>
      </div>
    </div>
  </footer>
);

export default Footer;
