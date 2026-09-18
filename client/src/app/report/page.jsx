'use client';
import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';

export default function ReportSubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infrastructure',
    description: '',
    latitude: '',
    longitude: ''
  });
  
  // Track selected file explicitly in React state
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log("File selected in state:", e.target.files[0].name);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let base64Evidence = '';
      
      if (selectedFile) {
        console.log("Converting selected file to Base64...");
        base64Evidence = await convertFileToBase64(selectedFile);
        console.log("Conversion complete. Base64 length:", base64Evidence.length);
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        evidence: base64Evidence 
      };

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("Server response:", result);
      
      if (response.ok && (result.success !== false)) {
        setSuccessMessage("Report submitted successfully with evidence and location!");
        setFormData({ title: '', category: 'Infrastructure', description: '', latitude: '', longitude: '' });
        setSelectedFile(null);
      } else {
        setErrorMessage(result.error || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("An error occurred connecting to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        
        <div>
          <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
            Citizen Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Log a Community Issue</h1>
          <p className="text-slate-400 text-sm mt-1">Submit infrastructure concerns and evidence attachments.</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm">
            {successMessage} <Link href="/admin" className="underline font-semibold ml-2">View in Admin Portal ↗</Link>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              placeholder="e.g., Broken Bridge on Main Road" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Infrastructure">Infrastructure & Roads</option>
              <option value="Public Spending">Public Spending / Transparency</option>
              <option value="Healthcare">Healthcare Service</option>
              <option value="Education">Education & Schools</option>
              <option value="Other">Other Grievance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea 
              name="description" 
              rows="4" 
              required
              value={formData.description} 
              onChange={handleChange}
              placeholder="Provide full details..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">📍 Location Coordinates</label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium transition"
              >
                📍 Auto-Detect My GPS
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input 
                  type="text" 
                  name="latitude" 
                  value={formData.latitude} 
                  onChange={handleChange}
                  placeholder="Latitude" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="longitude" 
                  value={formData.longitude} 
                  onChange={handleChange}
                  placeholder="Longitude" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="rounded-xl overflow-hidden border border-slate-800 h-40 mt-3">
                <iframe
                  title="Map Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
            )}
          </div>

          {/* File Upload Input using React State onChange */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Attach Evidence (Photo, Video, or Document)</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
            />
            {selectedFile && (
              <p className="text-[11px] text-amber-400 mt-1">✓ File ready: {selectedFile.name}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm disabled:opacity-50 mt-4"
          >
            {submitting ? 'Submitting Report...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}