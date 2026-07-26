import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testimonialApi } from '../services/api';
import RatingStars from '../components/RatingStars';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyugrhvaq';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Dhavalfirst_image-folder';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

const Submit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    testimonial: '',
    rating: 5,
    website: '', // Honeypot field (hidden from real users)
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let photoUrl = null;

      if (photoFile) {
        try {
          photoUrl = await uploadToCloudinary(photoFile);
        } catch (uploadErr) {
          console.warn('Cloudinary upload failed, submitting without photo:', uploadErr);
        }
      }

      await testimonialApi.submit({ ...formData, photo: photoUrl });

      setSuccess('Testimonial submitted successfully! It will appear on the wall once approved by our team.');
      setFormData({
        name: '',
        email: '',
        company: '',
        testimonial: '',
        rating: 5,
        website: '',
      });
      setPhotoFile(null);
      setPhotoPreview(null);

      setTimeout(() => navigate('/wall'), 2000);
    } catch (err) {
      const serverMessage = err.response?.data?.error || 'Failed to submit testimonial. Please try again.';
      setError(serverMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial-mesh py-10 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>✍️</span>
            <span>Customer Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
            We value your honest review! Fill out the short form below to leave your testimonial.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 md:p-8">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span>🎉</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="name">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. sarah@company.com"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="company">
                Company / Organization *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g. Acme Tech Solutions"
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="testimonial">
                Your Testimonial *
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                rows="4"
                placeholder="What did you love most about using our product?"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition leading-relaxed"
                required
              />
            </div>

            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <label className="block text-slate-800 text-xs font-bold uppercase tracking-wider">
                  Overall Rating *
                </label>
                <p className="text-xs text-slate-500 mt-0.5">Click stars to rate your experience</p>
              </div>
              <RatingStars 
                rating={formData.rating} 
                interactive={true}
                onRatingChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="photo">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-sm" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Testimonial ✨</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit;