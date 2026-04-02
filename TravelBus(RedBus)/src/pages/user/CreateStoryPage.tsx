import { useState } from 'react';
import { Camera, MapPin, Tag, ArrowRight, Bus } from 'lucide-react';
import { motion } from 'motion/react';

export default function CreateStoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Share Your Journey</h1>
        <p className="text-slate-500">Inspire others with your elite travel experiences.</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Story Title</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
              placeholder="e.g., My Luxury Trip to the Mountains"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Route</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Delhi to Agra"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tags</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Adventure, Luxury, Solo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Story</label>
            <textarea 
              rows={8}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none leading-relaxed"
              placeholder="Tell us everything about your journey..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Add Photos</label>
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Camera className="w-8 h-8 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Click to upload photos</p>
                <p className="text-xs text-slate-400">PNG, JPG or WEBP up to 5MB each</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-slate-400">
            <Bus className="w-5 h-5" />
            <span className="text-sm font-medium">Your story will be reviewed by our elite moderators.</span>
          </div>
          <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10">
            Publish Story <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
