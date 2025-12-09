import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Activity, Baby, Users, Calendar, FileText, ShieldAlert, 
  ChevronRight, ChevronLeft, Plus, Search, Bell, Wifi, User, 
  Stethoscope, QrCode, AlertTriangle, ArrowUpRight, Home, Lock, 
  Camera, X, Check, Wallet, CreditCard, RefreshCw, FileCheck,
  TrendingUp, ShieldCheck, Clock, CheckCircle2
} from 'lucide-react';

// --- MOCK DATA & UTILS ---

const TIME_RANGES = ['1D', '1W', '1M', '6M'];

const FAMILY_MEMBERS = [
  { id: 'user', name: 'Rahul (You)', role: 'Self', type: 'General', avatar: 'bg-teal-100 text-teal-600' },
  { id: 'wife', name: 'Priya', role: 'Wife', type: 'Pregnancy', avatar: 'bg-pink-100 text-pink-600', status: 'Week 24' },
  { id: 'dad', name: 'Dad', role: 'Father', type: 'Senior', avatar: 'bg-orange-100 text-orange-600', status: 'BP Alert' },
];

const MOCK_RECORDS = [
  { id: 1, type: 'Prescription', title: 'Viral Fever Meds', doctor: 'Dr. Sharma', date: 'Oct 24, 2023', category: 'General' },
  { id: 2, type: 'Lab Report', title: 'Thyroid Profile', doctor: 'City Labs', date: 'Nov 02, 2023', category: 'Senior' },
  { id: 3, type: 'Scan', title: 'Ultrasound - 2nd Trimester', doctor: 'Dr. Rao', date: 'Nov 15, 2023', category: 'Pregnancy' },
];

const INSURANCE_DETAILS = {
  provider: 'CareLink Protect+',
  policyNo: 'CL-8821-9902-XP',
  planName: 'Family Floater Gold',
  validThru: '25 Dec 2025',
  sumInsured: 1000000, // 10 Lakhs
  used: 125000, // 1.25 Lakhs used
  members: ['Rahul', 'Priya', 'Dad'],
  status: 'Active',
  renewalDue: false, // Set to true to test renewal flow
};

const CLAIMS_HISTORY = [
  { id: 101, hospital: 'Apollo City Hosp.', amount: '₹45,000', date: 'Aug 12, 2023', status: 'Approved', purpose: 'Dengue Treatment' },
  { id: 102, hospital: 'Max Super Speciality', amount: '₹12,500', date: 'Oct 05, 2023', status: 'Processing', purpose: 'Diagnostic Scans' },
];

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Anita Roy', specialty: 'Gynecologist', rating: 4.8, exp: '12 yrs' },
  { id: 2, name: 'Dr. K. Patel', specialty: 'Cardiologist', rating: 4.9, exp: '20 yrs' },
];

// Simple chart generator
const generateTrendData = (base, variance, points) => {
  return Array.from({ length: points }, (_, i) => ({
    label: i, 
    value: base + Math.random() * variance - (variance / 2)
  }));
};

const VITALS_DATA = {
  '1D': generateTrendData(72, 5, 24),
  '1W': generateTrendData(74, 10, 7),
  '1M': generateTrendData(75, 15, 30),
  '6M': generateTrendData(76, 20, 6),
};

// --- COMPONENT: CHART ---
const SimpleChart = ({ data, colorClass, strokeColor }) => {
  const height = 100;
  const width = 300;
  const maxVal = Math.max(...data.map(d => d.value)) + 5;
  const minVal = Math.min(...data.map(d => d.value)) - 5;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minVal) / (maxVal - minVal)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-32 relative mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`grad-${colorClass}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,${height} ${points} L${width},${height} Z`} fill={`url(#grad-${colorClass})`} />
        <polyline fill="none" stroke={strokeColor} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
        {data.length <= 10 && data.map((d, i) => {
           const x = (i / (data.length - 1)) * width;
           const y = height - ((d.value - minVal) / (maxVal - minVal)) * height;
           return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={strokeColor} strokeWidth="2" />;
        })}
      </svg>
    </div>
  );
};

// --- COMPONENT: VITALS WIDGET ---
const VitalsWidget = ({ title, value, unit, icon: Icon, color, bg }) => {
  const [range, setRange] = useState('1D');
  const [expanded, setExpanded] = useState(false);
  
  const getHexColor = (c) => {
    if (c.includes('teal')) return '#14b8a6';
    if (c.includes('rose')) return '#f43f5e';
    if (c.includes('blue')) return '#3b82f6';
    if (c.includes('pink')) return '#ec4899';
    if (c.includes('orange')) return '#f97316';
    return '#64748b';
  };

  return (
    <div className={`flex flex-col p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 ${expanded ? 'ring-2 ring-teal-500/20' : ''}`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
            <Icon size={20} className={color} />
          </div>
          <div>
            <span className="text-sm text-slate-500 font-medium block">{title}</span>
            <span className="text-xl font-bold text-slate-800">{value} <span className="text-xs text-slate-400 font-normal">{unit}</span></span>
          </div>
        </div>
        <div className="p-1 bg-slate-50 rounded-full text-slate-400">
          {expanded ? <ArrowUpRight size={18} className="rotate-180" /> : <ArrowUpRight size={18} />}
        </div>
      </div>
      {expanded && (
        <div className="mt-4 animate-fade-in">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-max mb-2">
            {TIME_RANGES.map(r => (
              <button key={r} onClick={(e) => { e.stopPropagation(); setRange(r); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${range === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{r}</button>
            ))}
          </div>
          <SimpleChart data={VITALS_DATA[range]} colorClass={color} strokeColor={getHexColor(color)} />
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: AUTH SCREEN ---
const AuthScreen = ({ onAuthenticated }) => {
  const [step, setStep] = useState('password'); 
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);

  const handlePasswordSubmit = () => {
    if (password === '1234') setStep('otp'); 
    else alert('Wrong password (try 1234)');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1].focus();
  };

  const handleOtpSubmit = () => {
    if (otp.join('') === '0000') onAuthenticated();
    else alert('Wrong OTP (try 0000)');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 opacity-50"></div>
      
      {step === 'password' ? (
        <div className="w-full max-w-xs z-10 animate-fade-in text-center">
          <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-teal-500/20">
             <Lock size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-400 mb-8 text-sm">Enter your CareLink password</p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-center text-xl tracking-widest focus:outline-none focus:border-teal-500 transition-colors mb-6"
            placeholder="••••"
          />
          <button onClick={handlePasswordSubmit} className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-500/20">
            Unlock
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xs z-10 animate-slide-in text-center">
          <div className="w-16 h-16 bg-rose-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/20 animate-pulse">
             <ShieldAlert size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">2-Step Verification</h2>
          <p className="text-slate-400 mb-8 text-xs">Enter the 4-digit code sent to your mobile <br/>for full secure access.</p>
          <div className="flex justify-center gap-4 mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-12 h-14 bg-white/10 border border-white/20 rounded-lg text-center text-2xl font-bold focus:border-rose-500 focus:bg-white/20 outline-none transition-all"
                maxLength={1}
              />
            ))}
          </div>
          <button onClick={handleOtpSubmit} className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-500/20">
            Verify & Enter
          </button>
        </div>
      )}
    </div>
  );
};

// --- FEATURE VIEWS ---

const HealthWallet = () => {
  const [activeTab, setActiveTab] = useState('insurance'); // 'insurance' | 'records'
  const [isScanning, setIsScanning] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
  const percentUsed = (INSURANCE_DETAILS.used / INSURANCE_DETAILS.sumInsured) * 100;

  return (
    <div className="animate-fade-in pb-24 h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
         <div className="flex justify-between items-center mb-4">
           <h1 className="text-xl font-bold text-slate-800">Health Wallet</h1>
           <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Wallet size={20}/></div>
         </div>
         <div className="flex p-1 bg-slate-100 rounded-xl">
            <button onClick={() => setActiveTab('insurance')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'insurance' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Insurance & IDs</button>
            <button onClick={() => setActiveTab('records')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Records</button>
         </div>
      </div>

      <div className="p-6">
        {activeTab === 'insurance' ? (
          <div className="animate-fade-in space-y-6">
            
            {/* DIGITAL INSURANCE CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
               <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                       <p className="text-xs text-slate-400 font-medium tracking-wider">HEALTH CARD</p>
                       <h3 className="font-bold text-lg">{INSURANCE_DETAILS.provider}</h3>
                    </div>
                    <ShieldCheck size={28} className="text-amber-400" />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xs text-slate-400 mb-1">Policy Number</p>
                    <p className="font-mono text-xl tracking-widest text-slate-100">{INSURANCE_DETAILS.policyNo}</p>
                  </div>

                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-xs text-slate-400 mb-1">Primary Insured</p>
                        <p className="font-medium text-sm">Rahul Sharma</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Valid Thru</p>
                        <p className="font-medium text-sm">{INSURANCE_DETAILS.validThru}</p>
                     </div>
                  </div>
               </div>
               
               {/* Quick Actions Strip */}
               <div className="bg-white/10 backdrop-blur-md p-3 flex justify-between items-center text-xs font-medium">
                  <button onClick={() => setShowRenewal(true)} className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                     <RefreshCw size={14} /> Renew Policy
                  </button>
                  <button className="flex items-center gap-1 hover:text-teal-400 transition-colors">
                     <FileCheck size={14} /> View Benefits
                  </button>
               </div>
            </div>

            {/* COVERAGE MONITOR */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Coverage Usage</h3>
                  <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-md">Family Floater</span>
               </div>
               
               <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div style={{ width: `${percentUsed}%` }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"></div>
               </div>
               
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-teal-700">{formatCurrency(INSURANCE_DETAILS.used)} Used</span>
                  <span className="text-slate-400">of {formatCurrency(INSURANCE_DETAILS.sumInsured)} Limit</span>
               </div>
            </div>

            {/* CLAIMS TRACKER */}
            <div>
               <h3 className="font-bold text-slate-800 mb-3">Claims History</h3>
               {CLAIMS_HISTORY.map(claim => (
                 <div key={claim.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-full ${claim.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {claim.status === 'Approved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm">{claim.hospital}</h4>
                          <p className="text-xs text-slate-500">{claim.purpose}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-800 text-sm">{claim.amount}</p>
                       <p className={`text-[10px] font-bold ${claim.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>{claim.status}</p>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        ) : (
          <div className="animate-fade-in space-y-4">
             {/* RECORDS VIEW */}
             <button onClick={() => setIsScanning(true)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                <Camera size={18} /> Scan & Add Record
             </button>

             {MOCK_RECORDS.map((rec) => (
               <div key={rec.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500"><FileText size={20}/></div>
                     <div>
                       <h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4>
                       <p className="text-xs text-slate-400">{rec.date} • {rec.doctor}</p>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300"/>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* RENEWAL MODAL */}
      {showRenewal && (
         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative">
               <button onClick={() => setShowRenewal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
               <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                  <RefreshCw size={24} />
               </div>
               <h2 className="text-xl font-bold text-slate-800 mb-1">Renew Policy</h2>
               <p className="text-sm text-slate-500 mb-6">CareLink Protect+ Gold Plan</p>
               
               <div className="bg-slate-50 p-4 rounded-xl mb-6">
                  <div className="flex justify-between mb-2">
                     <span className="text-sm text-slate-500">Premium</span>
                     <span className="font-bold text-slate-800">₹12,400</span>
                  </div>
                  <div className="flex justify-between mb-2">
                     <span className="text-sm text-slate-500">GST (18%)</span>
                     <span className="font-bold text-slate-800">₹2,232</span>
                  </div>
                  <div className="border-t border-slate-200 my-2"></div>
                  <div className="flex justify-between">
                     <span className="font-bold text-slate-800">Total</span>
                     <span className="font-bold text-teal-600 text-lg">₹14,632</span>
                  </div>
               </div>

               <button onClick={() => { alert('Redirecting to Payment Gateway...'); setShowRenewal(false); }} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                  Proceed to Pay
               </button>
            </div>
         </div>
      )}

      {/* SCANNER MODAL */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
           <div className="p-4 flex justify-between items-center text-white bg-black/50 backdrop-blur-sm absolute top-0 w-full z-10">
              <span className="font-bold">Scan Document</span>
              <button onClick={() => setIsScanning(false)}><X size={24}/></button>
           </div>
           <div className="flex-1 relative flex items-center justify-center bg-gray-900">
              <div className="w-full h-full absolute inset-0 opacity-30 bg-gradient-to-br from-slate-800 to-black"></div>
              <div className="w-64 h-80 border-2 border-teal-500 rounded-3xl relative z-0 flex items-center justify-center">
                 <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-[scan_2s_infinite]"></div>
              </div>
              <p className="absolute bottom-32 text-white/70 text-sm">Align document within frame</p>
           </div>
           <div className="h-24 bg-black flex items-center justify-center">
              <button onClick={() => { alert('Document Digitized!'); setIsScanning(false); }} className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-95 transition-transform">
                 <div className="w-14 h-14 bg-white rounded-full border-2 border-black"></div>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const FamilyCenter = ({ onNavigate }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');

  const handleAddMember = () => {
    alert(`Request sent to ABHA ID: ${newMemberId}. Waiting for user consent.`);
    setShowAddModal(false);
    setNewMemberId('');
  };

  if (selectedMember) {
    return (
      <MemberDetailView 
        member={selectedMember} 
        onBack={() => setSelectedMember(null)} 
      />
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
         <h1 className="text-xl font-bold text-slate-800">Family Center</h1>
         <div className="bg-slate-100 p-2 rounded-full"><Users size={20} className="text-slate-600"/></div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {FAMILY_MEMBERS.map((member) => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="group relative bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                member.type === 'Pregnancy' ? 'bg-pink-400' : 
                member.type === 'Senior' ? 'bg-orange-400' : 'bg-teal-400'
              }`}></div>
              <div className={`w-12 h-12 rounded-full ${member.avatar} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {member.type === 'Pregnancy' ? <Baby size={22} /> : 
                 member.type === 'Senior' ? <Users size={22} /> : <User size={22} />}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-2">{member.role}</p>
              {member.status && <div className="inline-block px-2 py-1 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 border border-slate-100">{member.status}</div>}
            </div>
          ))}
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[160px]"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} className="text-gray-400" />
            </div>
            <span className="font-bold text-slate-400">Add Member</span>
            <span className="text-[10px] text-slate-300 mt-1">via ABHA ID</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-green-100 rounded-lg text-green-600"><QrCode size={20}/></div>
               <h3 className="font-bold text-lg">Link Family Member</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Enter their 14-digit ABHA ID to send a consent request.</p>
            <input 
              type="text" 
              placeholder="e.g. 12-3456-7890-1234" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 font-mono text-sm focus:border-teal-500 outline-none"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
            />
            <button onClick={handleAddMember} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">Send Request</button>
          </div>
        </div>
      )}
    </div>
  );
};

const MemberDetailView = ({ member, onBack }) => {
  const [viewMode, setViewMode] = useState('pregnancy');

  return (
    <div className="animate-slide-in pb-24 bg-slate-50 min-h-screen">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-500"><ChevronLeft size={24}/></button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{member.name}</h1>
            <p className="text-xs text-slate-400">{member.type} Profile</p>
          </div>
        </div>
        
        {member.type === 'Pregnancy' && (
          <div className="flex bg-slate-100 rounded-lg p-1">
             <button 
               onClick={() => setViewMode('general')}
               className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'general' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
             >
               General
             </button>
             <button 
               onClick={() => setViewMode('pregnancy')}
               className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'pregnancy' ? 'bg-pink-500 shadow-sm text-white' : 'text-slate-400'}`}
             >
               Pregnancy
             </button>
          </div>
        )}
      </div>

      {member.type === 'Pregnancy' && viewMode === 'pregnancy' ? (
        <div className="animate-fade-in">
          <div className="mx-6 mt-6 p-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl shadow-lg shadow-pink-200 text-white relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-1">Week 24</h2>
              <p className="text-pink-100 text-sm font-medium">2nd Trimester • Size of a Corn</p>
              <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                <div className="w-[60%] h-full bg-white/90 rounded-full"></div>
              </div>
            </div>
            <Baby size={120} className="absolute -right-4 -bottom-4 text-white/20 rotate-12" />
          </div>
          <div className="px-6 mt-6 grid grid-cols-2 gap-4">
             <VitalsWidget title="Fetal HR" value="140" unit="bpm" icon={Heart} color="text-pink-500" bg="bg-pink-50" />
             <VitalsWidget title="Kicks" value="12" unit="/hr" icon={Activity} color="text-purple-500" bg="bg-purple-50" />
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {member.type === 'Senior' && (
            <div className="mx-6 mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4">
               <div className="p-3 bg-white rounded-full text-orange-500 shadow-sm"><Users size={20}/></div>
               <div>
                 <h3 className="font-bold text-orange-800">Senior Guard Active</h3>
                 <p className="text-xs text-orange-600">Fall detection & Geofencing enabled</p>
               </div>
            </div>
          )}
          <div className="px-6 mt-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800">General Health Vitals</h3>
            <VitalsWidget title="Heart Rate" value="72" unit="bpm" icon={Heart} color="text-teal-500" bg="bg-teal-50" />
            <VitalsWidget title="Blood Pressure" value="118/78" unit="mmHg" icon={Activity} color="text-blue-500" bg="bg-blue-50" />
            <VitalsWidget title="Temperature" value="98.6" unit="°F" icon={Activity} color="text-rose-500" bg="bg-rose-50" />
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => (
  <div className="animate-fade-in pb-24">
    <div className="p-6 bg-white flex justify-between items-center border-b border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hello, Rahul</h1>
        <p className="text-xs text-slate-400">All Systems Normal</p>
      </div>
      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">R</div>
    </div>
    
    <div className="mx-6 mt-6 grid grid-cols-2 gap-3">
       {/* IOT WIDGET */}
       <div className="p-4 bg-slate-800 rounded-2xl shadow-lg text-white flex flex-col justify-between h-32">
         <div className="p-2 bg-white/20 w-max rounded-full"><Wifi size={16} /></div>
         <div>
            <h3 className="font-bold text-sm">Synced</h3>
            <p className="text-slate-300 text-xs">Watch & BP</p>
         </div>
       </div>
       
       {/* INSURANCE WIDGET */}
       <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg text-white flex flex-col justify-between h-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4"></div>
         <div className="p-2 bg-white/20 w-max rounded-full backdrop-blur-sm"><ShieldCheck size={16} /></div>
         <div>
            <h3 className="font-bold text-sm">Active</h3>
            <p className="text-amber-100 text-xs">₹8.75L left</p>
         </div>
       </div>
    </div>

    <div className="px-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-slate-800">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
         {[{icon:CreditCard, l:'Pay'}, {icon:Calendar, l:'Book'}, {icon:Stethoscope, l:'Consult'}, {icon:ShieldAlert, l:'SOS'}].map((item, i) => (
           <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
             <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-slate-50 transition-all">
               <item.icon size={24} className="text-slate-600"/>
             </div>
             <span className="text-[10px] font-medium text-slate-500">{item.l}</span>
           </div>
         ))}
      </div>
    </div>

    <div className="px-6 mt-8 mb-6">
       <h2 className="font-bold text-slate-800 mb-4">My Vitals</h2>
       <div className="space-y-4">
         <VitalsWidget title="Heart Rate" value="78" unit="bpm" icon={Heart} color="text-rose-500" bg="bg-rose-50" />
         <VitalsWidget title="SPO2" value="99" unit="%" icon={Activity} color="text-blue-500" bg="bg-blue-50" />
       </div>
    </div>
  </div>
);

const Appointments = () => (
   <div className="animate-fade-in pb-24">
      <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
         <h1 className="text-xl font-bold text-slate-800">Find Doctors</h1>
      </div>
      <div className="p-6">
         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['General', 'Dental', 'Cardiac', 'Neuro'].map((tag, i) => (
              <button key={i} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${i===0 ? 'bg-slate-800 text-white' : 'bg-white border border-gray-200 text-slate-600'}`}>
                {tag}
              </button>
            ))}
         </div>
         <div className="space-y-4">
            {MOCK_DOCTORS.map(doc => (
               <div key={doc.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><User size={32}/></div>
                  <div className="flex-1">
                     <h4 className="font-bold text-slate-800">{doc.name}</h4>
                     <p className="text-xs text-teal-600 font-bold uppercase tracking-wide">{doc.specialty}</p>
                     <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>★ {doc.rating}</span> • <span>{doc.exp} Exp</span>
                     </div>
                     <button onClick={() => alert('Booking flow initiated')} className="mt-3 w-full py-2 bg-slate-50 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100">Book Appointment</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   </div>
);

// --- MAIN APP SHELL ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'family': return <FamilyCenter />;
      case 'appointments': return <Appointments />;
      case 'wallet': return <HealthWallet />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl relative">
        {renderContent()}
        
        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-end z-40 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
          <NavButton active={activeTab === 'family'} onClick={() => setActiveTab('family')} icon={Users} label="Family" />
          
          <div className="relative -top-5">
            <button 
              onClick={() => setActiveTab('home')} 
              className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-300 text-white hover:scale-105 transition-transform"
            >
              <ShieldAlert size={24} />
            </button>
          </div>
          
          <NavButton active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={Calendar} label="Book" />
          <NavButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={Wallet} label="Wallet" />
        </div>
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 w-14 py-2 transition-colors duration-300 ${active ? 'text-teal-600' : 'text-slate-300 hover:text-slate-400'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);