import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Camera, ShieldCheck, Clock, Droplets, Tv, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSubmit: (review: any) => void;
}

export default function ReviewModal({ isOpen, onClose, booking, onSubmit }: ReviewModalProps) {
  const [punctuality, setPunctuality] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [amenities, setAmenities] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (punctuality === 0 || cleanliness === 0 || amenities === 0) {
      alert('Please rate all categories');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: booking.busId._id,
          bookingId: booking._id,
          uid: booking.userId,
          authorName: booking.passengerDetails[0]?.name || 'Anonymous',
          punctuality,
          cleanliness,
          amenities,
          reviewText,
          photos
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSubmit(data.review);
          onClose();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ value, onChange, label, icon: Icon }: any) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xs font-black text-[#F97316]">{value}/5</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              star <= value 
                ? 'bg-[#1a1000] border-[#F97316] text-[#F97316]' 
                : 'bg-[#111111] border-[#2a2a2a] text-slate-600 hover:border-[#F97316]/50'
            }`}
          >
            <Star className={`w-5 h-5 ${star <= value ? 'fill-[#F97316]' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#111111] rounded-[40px] border border-[#2a2a2a] shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Review Submitted!</h2>
                  <p className="text-slate-400">Thank you for sharing your experience with us.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-[#2a2a2a] flex justify-between items-center">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Rate Your Journey</h2>
                    <p className="text-sm text-slate-400">{booking.fromCity} → {booking.toCity} • {booking.busId.busType}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <RatingStars value={punctuality} onChange={setPunctuality} label="Punctuality" icon={Clock} />
                    <RatingStars value={cleanliness} onChange={setCleanliness} label="Cleanliness" icon={Droplets} />
                    <RatingStars value={amenities} onChange={setAmenities} label="Amenities" icon={Tv} />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest">Add Photos</span>
                      </div>
                      <button className="w-full h-24 bg-[#111111] border-2 border-dashed border-[#2a2a2a] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#F97316]/50 transition-colors group">
                        <Plus className="w-6 h-6 text-slate-600 group-hover:text-[#F97316]" />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400">Upload Images</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-widest">Your Review</span>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell us about your experience..."
                      className="w-full bg-black border border-[#2a2a2a] rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-[#F97316] transition-colors text-slate-300"
                    />
                  </div>
                </div>

                <div className="p-8 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#F97316]" />
                    <span className="text-xs font-bold text-slate-400">Your review will be verified by our team.</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#F97316] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#ea6c05] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F97316]/20"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );
}
