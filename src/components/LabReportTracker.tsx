// src/components/LabReportTracker.tsx
// Doctor-Style Diagnostic Lab Test Ingestion & Ayurvedic Dietary Recalibrator

import { useState } from 'react'
import {
  getClinicalLabReports,
  saveClinicalLabReport,
  analyzeLabReportNumbers,
  type ClinicalLabReport,
} from '@/lib/anatomyEngine'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { todayKey } from '@/lib/store'

interface Props {
  patientName?: string
  onClose?: () => void
}

export default function LabReportTracker({ patientName = 'Arjun', onClose }: Props) {
  const [reports, setReports] = useState<ClinicalLabReport[]>(getClinicalLabReports())
  const [showAddForm, setShowAddForm] = useState(false)

  // Form draft state
  const [fastingGlucose, setFastingGlucose] = useState<string>('')
  const [postPrandialGlucose, setPostPrandialGlucose] = useState<string>('')
  const [hba1c, setHba1c] = useState<string>('')
  const [systolic, setSystolic] = useState<string>('')
  const [diastolic, setDiastolic] = useState<string>('')
  const [cholesterol, setCholesterol] = useState<string>('')
  const [triglycerides, setTriglycerides] = useState<string>('')
  const [hemoglobin, setHemoglobin] = useState<string>('')
  const [tsh, setTsh] = useState<string>('')
  const [creatinine, setCreatinine] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault()

    const draftReport: Partial<ClinicalLabReport> = {
      fastingBloodSugarMgDl: fastingGlucose ? parseFloat(fastingGlucose) : undefined,
      postPrandialBloodSugarMgDl: postPrandialGlucose ? parseFloat(postPrandialGlucose) : undefined,
      hba1cPct: hba1c ? parseFloat(hba1c) : undefined,
      systolicBpMmHg: systolic ? parseFloat(systolic) : undefined,
      diastolicBpMmHg: diastolic ? parseFloat(diastolic) : undefined,
      totalCholesterolMgDl: cholesterol ? parseFloat(cholesterol) : undefined,
      triglyceridesMgDl: triglycerides ? parseFloat(triglycerides) : undefined,
      hemoglobinGDl: hemoglobin ? parseFloat(hemoglobin) : undefined,
      tshUiuMl: tsh ? parseFloat(tsh) : undefined,
      serumCreatinineMgDl: creatinine ? parseFloat(creatinine) : undefined,
      doctorNotes: notes || 'Routine outpatient laboratory assessment.',
    }

    const { correlation, recommendations } = analyzeLabReportNumbers(draftReport)

    const newReport: ClinicalLabReport = {
      id: `lab-${Date.now()}`,
      date: todayKey(),
      patientName,
      testType: 'blood_glucose',
      ...draftReport,
      clinicalCorrelation: correlation,
      dietaryRecalibration: recommendations,
    }

    saveClinicalLabReport(newReport)
    setReports(getClinicalLabReports())
    setShowAddForm(false)

    // Reset fields
    setFastingGlucose('')
    setPostPrandialGlucose('')
    setHba1c('')
    setSystolic('')
    setDiastolic('')
    setCholesterol('')
    setTriglycerides('')
    setHemoglobin('')
    setTsh('')
    setCreatinine('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c2317] via-[#091a10] to-[#040e08] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔬</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-mono">
                CLINICAL DIAGNOSTIC INGESTION
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-mono">
                DOCTOR MODE
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-50">
              Diagnostic Lab Test & Count Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/70 mt-1 max-w-xl">
              Enter counts from your actual lab reports (Blood Sugar, HbA1c, BP, Lipid, CBC, Thyroid). Jaya evaluates the findings clinically and recalibrates your Ayurvedic diet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono shadow-md"
            >
              {showAddForm ? '✕ Close Form' : '+ Record New Lab Report'}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── ADD LAB REPORT FORM MODAL / PANEL ─── */}
      {showAddForm && (
        <Card className="rounded-3xl border-emerald-600/50 bg-[#08180e] p-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-900/40 pb-3">
            <div>
              <h3 className="text-base font-bold text-emerald-100 flex items-center gap-2">
                <span>📋</span> Enter Laboratory Biomarkers & Counts
              </h3>
              <p className="text-xs text-emerald-400/60 mt-0.5">
                Fill any values provided in your pathology or hospital report
              </p>
            </div>
            <Badge className="bg-emerald-900/60 text-emerald-200 border-emerald-700/40 text-[10px] font-mono">
              Patient: {patientName}
            </Badge>
          </div>

          <form onSubmit={handleSaveReport} className="space-y-4">
            {/* GLUCOSE & METABOLIC PANEL */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                1. Blood Glucose & Glycemic Index
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Fasting Sugar (mg/dL)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 110"
                    value={fastingGlucose}
                    onChange={e => setFastingGlucose(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: 70–99</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Post-Prandial (mg/dL)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 165"
                    value={postPrandialGlucose}
                    onChange={e => setPostPrandialGlucose(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: &lt; 140</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    HbA1c (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.8"
                    value={hba1c}
                    onChange={e => setHba1c(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: &lt; 5.7%</span>
                </div>
              </div>
            </div>

            {/* CARDIOVASCULAR & LIPID PANEL */}
            <div className="pt-2 border-t border-emerald-900/30">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                2. Blood Pressure & Lipid Profile
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 132"
                    value={systolic}
                    onChange={e => setSystolic(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Ideal: 110–120</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 86"
                    value={diastolic}
                    onChange={e => setDiastolic(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Ideal: 70–80</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Cholesterol (mg/dL)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 215"
                    value={cholesterol}
                    onChange={e => setCholesterol(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Optimal: &lt; 200</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Triglycerides (mg/dL)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 175"
                    value={triglycerides}
                    onChange={e => setTriglycerides(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Optimal: &lt; 150</span>
                </div>
              </div>
            </div>

            {/* HEMATOLOGY & THYROID */}
            <div className="pt-2 border-t border-emerald-900/30">
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                3. Hematology, Thyroid & Renal Markers
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Hemoglobin (g/dL)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 13.5"
                    value={hemoglobin}
                    onChange={e => setHemoglobin(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: 12.0–16.5</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    TSH Thyroid (uIU/mL)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.2"
                    value={tsh}
                    onChange={e => setTsh(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: 0.4–4.0</span>
                </div>
                <div>
                  <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                    Serum Creatinine (mg/dL)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.9"
                    value={creatinine}
                    onChange={e => setCreatinine(e.target.value)}
                    className="border-emerald-800/60 bg-black/40 text-emerald-100 rounded-xl text-xs"
                  />
                  <span className="text-[9px] text-emerald-500/60 mt-0.5 block font-mono">Normal: 0.7–1.2</span>
                </div>
              </div>
            </div>

            {/* DOCTOR NOTES */}
            <div>
              <label className="text-[10px] text-emerald-300/70 uppercase font-mono block mb-1">
                Doctor Impression / Imaging / Ultrasound Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Ultrasound showed mild fatty liver grade 1; doctor suggested 30 min daily walking..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full rounded-xl border border-emerald-800/60 bg-black/40 p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono px-5"
              >
                Analyze & Recalibrate Diet ✓
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ─── HISTORICAL LAB REPORTS LIST ─── */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-wider">
          Recorded Diagnostic History ({reports.length})
        </h3>

        {reports.map(report => (
          <Card key={report.id} className="rounded-3xl border-emerald-800/40 bg-[#08180e] p-5 shadow-xl text-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/50 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🩺</span>
                <div>
                  <h4 className="text-sm font-bold text-emerald-100">Clinical Evaluation · {report.date}</h4>
                  <p className="text-[10px] text-emerald-400/60 font-mono">Patient: {report.patientName}</p>
                </div>
              </div>
              <Badge className="bg-emerald-950 border-emerald-700/50 text-emerald-300 text-[10px] font-mono self-start sm:self-auto">
                VERIFIED BIOMARKERS
              </Badge>
            </div>

            {/* Biomarker counts badge matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {report.fastingBloodSugarMgDl && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">Fasting Glucose</span>
                  <span className="text-base font-bold font-mono text-emerald-200">
                    {report.fastingBloodSugarMgDl} <span className="text-[10px] font-normal text-emerald-400/60">mg/dL</span>
                  </span>
                </div>
              )}
              {report.hba1cPct && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">HbA1c</span>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {report.hba1cPct}%
                  </span>
                </div>
              )}
              {report.systolicBpMmHg && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">Blood Pressure</span>
                  <span className="text-base font-bold font-mono text-emerald-200">
                    {report.systolicBpMmHg}/{report.diastolicBpMmHg} <span className="text-[10px] font-normal text-emerald-400/60">mmHg</span>
                  </span>
                </div>
              )}
              {report.totalCholesterolMgDl && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">Total Cholesterol</span>
                  <span className="text-base font-bold font-mono text-emerald-200">
                    {report.totalCholesterolMgDl} <span className="text-[10px] font-normal text-emerald-400/60">mg/dL</span>
                  </span>
                </div>
              )}
              {report.hemoglobinGDl && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">Hemoglobin</span>
                  <span className="text-base font-bold font-mono text-emerald-200">
                    {report.hemoglobinGDl} <span className="text-[10px] font-normal text-emerald-400/60">g/dL</span>
                  </span>
                </div>
              )}
              {report.tshUiuMl && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-500/70 font-mono block">TSH (Thyroid)</span>
                  <span className="text-base font-bold font-mono text-emerald-200">
                    {report.tshUiuMl} <span className="text-[10px] font-normal text-emerald-400/60">uIU/mL</span>
                  </span>
                </div>
              )}
            </div>

            {/* DOCTOR IMPRESSION & AYURVEDIC CORRELATION */}
            {report.clinicalCorrelation && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 mb-3">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                  🩺 Vaidya Clinical Interpretation:
                </span>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {report.clinicalCorrelation}
                </p>
              </div>
            )}

            {/* DIETARY RECALIBRATION */}
            {report.dietaryRecalibration && report.dietaryRecalibration.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/40">
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block mb-1.5">
                  🥗 Lab-Calibrated Dietary Prescriptions:
                </span>
                <ul className="space-y-1 text-xs text-amber-100/90">
                  {report.dietaryRecalibration.map((recal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">➔</span>
                      <span>{recal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
