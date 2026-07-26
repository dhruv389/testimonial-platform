const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-slate-500 text-sm">
      <div className="container mx-auto px-4">
        <p className="font-medium text-slate-600">
          TestimonialHQ &copy; {new Date().getFullYear()} &bull; Powered by Gemini AI
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Collect, moderate, analyze, and showcase customer praise seamlessly.
        </p>
      </div>
    </footer>
  );
};

export default Footer;