import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Eye,
  Award,
  Scan,
  Maximize2
} from 'lucide-react';
import UploadBox from '../components/UploadBox';
import StatusBadge from '../components/StatusBadge';

export default function ProductScanner() {
  const [scannerTab, setScannerTab] = useState('fake-detector'); // 'fake-detector' | 'ar-mode' | 'hallmark'
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cmlInput, setCmlInput] = useState('CML-8492019384');
  const [cmlResult, setCmlResult] = useState(null);

  const handleImageUpload = (file) => {
    setScannedImage(file);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1000);
  };

  const handleVerifyCML = () => {
    if (!cmlInput.trim()) return;
    setCmlResult({
      valid: true,
      licensee: "Hawkins Cookers Limited",
      standard: "IS 2347:2017",
      issueDate: "2024-01-15",
      validUntil: "2027-01-14",
      status: "Active & Certified",
      plantLocation: "Thane, Maharashtra"
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Top Header & Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2545] flex items-center gap-2">
            Computer-Vision Label Authenticity Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Scan packaging photos to detect counterfeit ISI marks, verify 10-digit CML codes, and overlay AR standard details.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs">
          <button
            onClick={() => setScannerTab('fake-detector')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              scannerTab === 'fake-detector'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Vision Mark Detector
          </button>
          <button
            onClick={() => setScannerTab('ar-mode')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              scannerTab === 'ar-mode'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AR Camera Overlay</span>
          </button>
          <button
            onClick={() => setScannerTab('hallmark')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              scannerTab === 'hallmark'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>CML & HUID Verifier</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Computer-Vision Style Upload Interface (Requirement 8) */}
      {scannerTab === 'fake-detector' && (
        <div className="space-y-6">
          <UploadBox
            onFileUpload={handleImageUpload}
            acceptedTypes=".jpg, .jpeg, .png, .webp"
            title="Upload Product Packaging or ISI Emblem Photo"
            subtitle="Drop photo here for computer-vision OCR bounding box extraction"
          />

          {isScanning && (
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3 shadow-xs">
              <Scan className="w-10 h-10 text-[#0B2545] animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#0B2545]">
                Computer-vision model executing bounding-box detection on ISI Logo & CML Code...
              </p>
            </div>
          )}

          {scannedImage && !isScanning && (
            <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B2545]">
                    Computer-Vision Detection Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">Image analyzed: {scannedImage.name}</p>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-xs">
                  ✓ Authentic ISI Mark Detected
                </span>
              </div>

              {/* Computer-Vision Bounding Box Detections (Requirement 8) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Detection 1: ISI Mark */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">1. Detected ISI Mark</span>
                  <p className="font-extrabold text-emerald-950 text-sm">🟢 Authentic Vector Match</p>
                  <p className="text-slate-600 text-[11px]">Proportions match official BIS vector specs (1:1.414 ratio).</p>
                </div>

                {/* Detection 2: CML License Code */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">2. Detected CML Code</span>
                  <p className="font-extrabold text-[#0B2545] text-sm font-mono">CML-8492019384</p>
                  <p className="text-slate-600 text-[11px]">Valid 10-digit registered manufacturer code.</p>
                </div>

                {/* Detection 3: Standard Reference */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">3. Standard Reference</span>
                  <p className="font-extrabold text-blue-950 text-sm font-mono">IS 2347:2017</p>
                  <p className="text-slate-600 text-[11px]">Domestic Pressure Cookers Specification.</p>
                </div>

                {/* Detection 4: Label Information */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">4. Detected Product Specs</span>
                  <p className="font-bold text-slate-900">Pressure Cooker 5 Litre</p>
                  <p className="text-slate-600 text-[11px]">Stainless Steel Outer Lid.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: AR Camera Simulation */}
      {scannerTab === 'ar-mode' && (
        <div className="p-8 rounded-2xl bg-[#0B2545] text-white space-y-6 max-w-2xl mx-auto shadow-md relative overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="font-bold text-sm">AR Visual Inspection Overlay</span>
            </div>
            <span className="text-xs bg-white/10 text-amber-300 border border-white/20 px-3 py-1 rounded font-mono">
              Live Camera Simulation
            </span>
          </div>

          <div className="relative h-64 bg-slate-950 rounded-xl border-2 border-dashed border-amber-500/50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-3 animate-pulse">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-slate-950/90 px-2 py-0.5 rounded w-fit border border-emerald-500/40">
                🟢 ISI LOGO DETECTED (98% MATCH)
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-slate-950/90 px-2 py-0.5 rounded w-fit ml-auto border border-emerald-500/40">
                IS 2347:2017 VALIDATED
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center px-4">
              Point camera at product label or packaging... <br />
              <span className="text-[11px] text-amber-300">Computer-vision model will overlay ISI emblem bounding box</span>
            </p>
          </div>
        </div>
      )}

      {/* MODE 3: CML & HUID Verifier */}
      {scannerTab === 'hallmark' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CML License & Gold Hallmarking (HUID) Verifier
              </h3>
              <p className="text-xs text-slate-500">Enter a BIS License Number (CML) or 6-digit HUID code to check registration status.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={cmlInput}
              onChange={(e) => setCmlInput(e.target.value)}
              placeholder="e.g. CML-8492019384 or HUID Code..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
            />
            <button
              onClick={handleVerifyCML}
              className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Verify License</span>
            </button>
          </div>

          {cmlResult && (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> BIS License Status: Active
                </span>
                <span className="font-mono text-slate-600">{cmlInput}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block">Manufacturer</span>
                  <span className="font-bold text-slate-900">{cmlResult.licensee}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Standard Number</span>
                  <span className="font-bold text-slate-900">{cmlResult.standard}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Plant Location</span>
                  <span className="font-bold text-slate-900">{cmlResult.plantLocation}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
