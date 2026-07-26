import { useState } from 'react';
import { analyzeTestimonial } from '../services/aiService';


const AiInsightCard = ({ text }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleToggleAi = async () => {
    if (show) {
      setShow(false);
      return;
    }

    setShow(true);

    if (aiData) return;

    try {
      setLoading(true);
      setError('');
      const result = await analyzeTestimonial(text);
      setAiData(result);
    } catch (err) {
      setError('Unable to analyze testimonial. Please try again.');
      console.error('AI Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentBadgeClass = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'negative':
        return 'bg-rose-100 text-rose-800 border border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border border-amber-300';
    }
  };

  return (
    <div className="mt-3">
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={handleToggleAi}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 ${
            show
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 hover:bg-purple-700'
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/80 shadow-xs'
          }`}
        >
          <span>✨</span>
          <span>{show ? 'Hide AI Insights' : 'AI Insights'}</span>
        </button>
      </div>

      {/* AI Panel Container */}
      {show && (
        <div className="mt-3 bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-slate-50 border border-purple-200/80 rounded-xl p-4 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                Gemini AI Analysis
              </h4>
            </div>

            {aiData && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getSentimentBadgeClass(aiData.sentiment)}`}>
                {aiData.sentiment} ({aiData.sentimentScore}%)
              </span>
            )}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center gap-2 py-3 text-purple-700 text-xs font-semibold">
              <svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing sentiment, summary & key tags...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 mt-1 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => { setAiData(null); handleToggleAi(); }}
                className="underline text-rose-700 font-bold ml-2"
              >
                Retry
              </button>
            </div>
          )}

          {/* AI Output Content */}
          {!loading && aiData && (
            <div className="space-y-3 text-xs">
              {/* Summary */}
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-purple-100 shadow-xs">
                <p className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider mb-0.5">AI SUMMARY</p>
                <p className="text-slate-800 italic font-medium leading-relaxed">"{aiData.summary}"</p>
              </div>

              {/* Highlights */}
              {aiData.keyHighlights && aiData.keyHighlights.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">KEY HIGHLIGHTS</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {aiData.keyHighlights.map((highlight, idx) => (
                      <li key={idx} className="leading-snug">{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {aiData.tags && aiData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100/80 text-purple-800 border border-purple-200/60 text-[11px] font-bold px-2.5 py-0.5 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiInsightCard;
