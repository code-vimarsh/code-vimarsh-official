import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-display font-bold">Initialize Connection.</h1>
        <p className="text-textMuted">Have a query? Want to partner? Send us a payload.</p>
      </header>

      <form className="bg-surface border border-surfaceLight p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">Name</label>
            <input type="text" className="w-full bg-bgDark border border-surfaceLight rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">Email</label>
            <input type="email" className="w-full bg-bgDark border border-surfaceLight rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-textMuted">Subject</label>
          <input type="text" className="w-full bg-bgDark border border-surfaceLight rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-textMuted">Message payload</label>
          <textarea rows={5} className="w-full bg-bgDark border border-surfaceLight rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
        </div>

        <button type="button" className="w-full bg-primary hover:bg-secondary text-black font-bold py-4 rounded-lg transition-colors">
          Transmit Message
        </button>
      </form>
    </div>
  );
};

export default Contact;