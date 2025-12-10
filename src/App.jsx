import React, { useState, useEffect } from 'react';
import { 
  Heart, Activity, Baby, Users, Calendar, FileText, ShieldAlert, 
  ChevronRight, ChevronLeft, Plus, Search, Bell, Wifi, User, 
  Stethoscope, QrCode, AlertTriangle, ArrowUpRight, Home, Lock, 
  Camera, X, Check, Wallet, CreditCard, RefreshCw, FileCheck,
  TrendingUp, ShieldCheck, Clock, CheckCircle2, Phone, MapPin, 
  Video, Mic, MicOff, VideoOff, Pill, Store, Info, Trash2,
  Smartphone, Watch, Bluetooth, Power, ScanLine
} from 'lucide-react';

// --- MOCK DATABASE ---

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Anita Roy', specialty: 'Gynecologist', category: 'General', rating: 4.8, exp: '12 yrs', image: 'bg-pink-100 text-pink-600' },
  { id: 2, name: 'Dr. K. Patel', specialty: 'Cardiologist', category: 'Cardiac', rating: 4.9, exp: '20 yrs', image: 'bg-red-100 text-red-600' },
  { id: 3, name: 'Dr. S. Mehta', specialty: 'General Physician', category: 'General', rating: 4.5, exp: '8 yrs', image: 'bg-blue-100 text-blue-600' },
  { id: 4, name: 'Dr. R. Singh', specialty: 'Dentist', category: 'Dental', rating: 4.7, exp: '5 yrs', image: 'bg-teal-100 text-teal-600' },
  { id: 5, name: 'Dr. V. Rao', specialty: 'Neurologist', category: 'Neuro', rating: 5.0, exp: '18 yrs', image: 'bg-purple-100 text-purple-600' },
];

const MEDICINE_DB = {
  'Metformin': { desc: 'Antidiabetic medication', vendor: 'Apollo Pharmacy (1.2km)', price: '₹45', stock: 'Available' },
  'Ashwagandha': { desc: 'Herbal supplement for stress', vendor: 'AyurKart (Online)', price: '₹350', stock: 'In Stock' },
  'Aspirin': { desc: 'Blood thinner / Pain relief', vendor: 'MedPlus (0.5km)', price: '₹15', stock: 'Available' },
  'Warfarin': { desc: 'Anticoagulant', vendor: 'City Hospital Pharmacy', price: '₹120', stock: 'Low Stock' },
  'Dolo 650': { desc: 'Paracetamol / Fever', vendor: 'Local Chemist', price: '₹30', stock: 'Available' }
};

const INTERACTION_DB = [
  { drugs: ['Warfarin', 'Aspirin'], severity: 'High', risk: 'Increased bleeding risk. Avoid combination.' },
  { drugs: ['Metformin', 'Ashwagandha'], severity: 'Moderate', risk: 'May cause hypoglycemia (low blood sugar).' },
];

const FAMILY_MEMBERS = [
  { id: 'user', name: 'Rahul (You)', role: 'Self', type: 'General', avatar: 'bg-teal-100 text-teal-600' },
  { id: 'wife', name: 'Priya', role: 'Wife', type: 'Pregnancy', avatar: 'bg-pink-100 text-pink-600', status: 'Week 24' },
  { id: 'dad', name: 'Dad', role: 'Father', type: 'Senior', avatar: 'bg-orange-100 text-orange-600', status: 'BP Alert' },
];

const PENDING_BILLS = [
  { id: 1, title: 'Consultation Fee', provider: 'Apollo Clinic', date: 'Today', amount: 800 },
  { id: 2, title: 'Lab Tests (Thyroid)', provider: 'City Labs', date: 'Yesterday', amount: 1200 },
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
  sumInsured: 1000000, 
  used: 125000, 
  status: 'Active',
};

const CLAIMS_HISTORY = [
  { id: 101, hospital: 'Apollo City Hosp.', amount: '₹45,000', date: 'Aug 12, 2023', status: 'Approved', purpose: 'Dengue Treatment' },
  { id: 102, hospital: 'Max Super Speciality', amount: '₹12,500', date: 'Oct 05, 2023', status: 'Processing', purpose: 'Diagnostic Scans' },
];

const CONNECTED_DEVICES = [
    { id: 1, name: 'Apple Watch S8', type: 'Wearable', status: 'Connected', battery: '82%', icon: Watch },
    { id: 2, name: 'Omron BP Monitor', type: 'Medical', status: 'Disconnected', battery: '--', icon: Activity },
    { id: 3, name: 'Accu-Chek Instant', type: 'Medical', status: 'Connected', battery: '40%', icon: Smartphone },
];

// --- CHART DATA GENERATOR ---
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
  '1Y': generateTrendData(76, 20, 12), // Added 1 Year
};

// --- UTILITY COMPONENTS ---

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
      </svg>
      {/* Simple X-Axis */}
      <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
        <span>Start</span>
        <span>Mid</span>
        <span>Now</span>
      </div>
    </div>
  );
};

const VitalsWidget = ({ title, value, unit, icon: Icon, color, bg }) => {
  const [range, setRange] = useState('1D');
  const [expanded, setExpanded] = useState(false);
  const data = VITALS_DATA[range] || VITALS_DATA['1D'];

  const getHexColor = (c) => {
    if (c.includes('teal')) return '#14b8a6';
    if (c.includes('rose')) return '#f43f5e';
    if (c.includes('blue')) return '#3b82f6';
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
          <ArrowUpRight size={18} className={expanded ? "rotate-180" : ""} />
        </div>
      </div>
      {expanded && (
        <div className="mt-4 animate-fade-in">
           <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-max mb-2">
            {['1D', '1W', '1M', '1Y'].map(r => (
              <button key={r} onClick={(e) => { e.stopPropagation(); setRange(r); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${range === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{r}</button>
            ))}
          </div>
           <SimpleChart data={data} colorClass={color} strokeColor={getHexColor(color)} />
        </div>
      )}
    </div>
  );
};

// --- AUTH SCREEN ---
const AuthScreen = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-teal-500/20">
         <Lock size={40} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2">CareLink Secure</h2>
      <p className="text-slate-400 mb-8 text-sm">Enter your CareLink Passcode</p>
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs bg-white/10 border border-white/10 rounded-xl p-4 text-center text-xl tracking-widest focus:outline-none focus:border-teal-500 mb-6"
        placeholder="••••"
      />
      <button onClick={() => password === '1234' ? onAuthenticated() : alert('Try 1234')} className="w-full max-w-xs bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg">Unlock</button>
    </div>
  );
};

// --- MODALS ---

const ScannerModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
        <div className="p-4 flex justify-between items-center text-white bg-black/50 backdrop-blur-sm absolute top-0 w-full z-10">
            <span className="font-bold">Scan Prescription</span>
            <button onClick={onClose}><X size={24}/></button>
        </div>
        <div className="flex-1 relative flex items-center justify-center bg-gray-900">
            <div className="w-64 h-80 border-2 border-teal-500 rounded-3xl relative z-0 flex items-center justify-center overflow-hidden">
                <ScanLine className="text-teal-500 animate-pulse" size={64}/>
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-[scan_2s_infinite]"></div>
            </div>
            <p className="absolute bottom-32 text-white/70 text-sm">Align document within frame</p>
        </div>
        <div className="h-32 bg-black flex items-center justify-center pb-6">
            <button onClick={() => { alert('Document Digitized & Added!'); onClose(); }} className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-95 transition-transform">
                <div className="w-14 h-14 bg-white rounded-full border-2 border-black"></div>
            </button>
        </div>
    </div>
);

const RenewalModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-slide-up">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                <RefreshCw size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Renew Policy</h2>
            <p className="text-sm text-slate-500 mb-6">CareLink Protect+ Gold Plan</p>
            
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-500">Premium (1 Year)</span>
                    <span className="font-bold text-slate-800">₹12,400</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-500">GST (18%)</span>
                    <span className="font-bold text-slate-800">₹2,232</span>
                </div>
                <div className="border-t border-slate-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Total Payable</span>
                    <span className="font-bold text-teal-600 text-lg">₹14,632</span>
                </div>
            </div>

            <button onClick={() => { alert('Redirecting to Payment Gateway...'); onClose(); }} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                Proceed to Pay
            </button>
        </div>
    </div>
);

const DeviceManagerModal = ({ onClose }) => {
    const [devices, setDevices] = useState(CONNECTED_DEVICES);
    const toggleDevice = (id) => {
        setDevices(devices.map(d => d.id === id ? { ...d, status: d.status === 'Connected' ? 'Disconnected' : 'Connected' } : d));
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-slide-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-800"><Bluetooth size={24} /></div>
                    <div><h2 className="text-xl font-bold text-slate-800">Device Manager</h2><p className="text-xs text-slate-500">Manage connected health IoT</p></div>
                </div>
                <div className="space-y-3 mb-6">
                    {devices.map(device => (
                        <div key={device.id} className="p-4 border border-gray-100 rounded-xl bg-white flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${device.status === 'Connected' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}><device.icon size={20} /></div>
                                <div><h4 className="font-bold text-slate-800 text-sm">{device.name}</h4><p className="text-[10px] text-slate-500">{device.type} • {device.battery}</p></div>
                            </div>
                            <button onClick={() => toggleDevice(device.id)} className={`p-2 rounded-full transition-colors ${device.status === 'Connected' ? 'text-teal-500 bg-teal-50' : 'text-slate-300 bg-slate-50'}`}><Power size={20} /></button>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">Done</button>
            </div>
        </div>
    );
};

const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X size={20}/></button>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Book Appointment</h2>
        <p className="text-sm text-slate-500 mb-6">with {doctor.name} ({doctor.specialty})</p>
        <div className="space-y-4 mb-6">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Select Date</label><input type="date" className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-teal-500" onChange={e => setDate(e.target.value)} /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Select Time</label><input type="time" className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-teal-500" onChange={e => setTime(e.target.value)} /></div>
        </div>
        <button onClick={() => { if(!date || !time) return alert('Please select date and time'); onConfirm({ doctor, date, time }); }} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800">Confirm Booking</button>
      </div>
    </div>
  );
};

const MedicineModal = ({ medicine, onClose }) => {
    const details = MEDICINE_DB[medicine] || { desc: 'No details found', vendor: 'Unknown', price: 'N/A', stock: 'Unknown' };
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X size={20}/></button>
                <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Pill size={24}/></div><div><h2 className="text-xl font-bold text-slate-800">{medicine}</h2><p className="text-xs text-slate-500">Medicine Details</p></div></div>
                <div className="space-y-3 mb-6">
                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-400 font-bold uppercase">Description</p><p className="text-sm font-medium text-slate-700">{details.desc}</p></div>
                    <div className="flex gap-3">
                         <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100"><p className="text-xs text-green-600 font-bold uppercase">Best Vendor</p><p className="text-sm font-bold text-green-800">{details.vendor}</p><p className="text-xs text-green-700 mt-1 flex items-center gap-1"><CheckCircle2 size={10}/> {details.stock}</p></div>
                         <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100"><p className="text-xs text-blue-600 font-bold uppercase">Best Price</p><p className="text-lg font-bold text-blue-800">{details.price}</p></div>
                    </div>
                </div>
                <button onClick={() => alert('Order placed with vendor!')} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Order Now</button>
            </div>
        </div>
    );
};

const QuickPayModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
    <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-slide-up">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
      <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><CreditCard size={24} /></div><div><h2 className="text-xl font-bold text-slate-800">Quick Pay</h2><p className="text-xs text-slate-500">Clear your pending medical bills</p></div></div>
      <div className="space-y-3 mb-6">{PENDING_BILLS.map(bill => (<div key={bill.id} className="p-4 border border-gray-100 rounded-xl bg-slate-50 flex justify-between items-center"><div><h4 className="font-bold text-slate-800 text-sm">{bill.title}</h4><p className="text-xs text-slate-500">{bill.provider} • {bill.date}</p></div><div className="text-right"><span className="block font-bold text-slate-800">₹{bill.amount}</span><input type="checkbox" className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-teal-500" defaultChecked /></div></div>))}</div>
      <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-gray-200"><span className="text-slate-500 font-medium">Total Payable</span><span className="text-2xl font-bold text-slate-900">₹2,000</span></div>
      <button onClick={() => { alert('Payment Successful!'); onClose(); }} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Pay Securely</button>
    </div>
  </div>
);

const ConsultModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-white">
    <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 relative">
      <div className="absolute top-4 right-4 z-10"><button onClick={onClose} className="p-2 bg-black/40 rounded-full hover:bg-black/60"><X size={20}/></button></div>
      <div className="h-96 bg-slate-800 relative flex items-center justify-center">
         <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="w-20 h-20 rounded-full border-4 border-teal-500 flex items-center justify-center animate-pulse"><User size={40} className="text-teal-500" /></div><p className="mt-4 font-bold text-lg">Connecting to Dr. Verma...</p><p className="text-sm text-teal-400">General Physician • Online</p></div>
         <div className="absolute bottom-4 right-4 w-24 h-32 bg-black rounded-xl border border-slate-700 overflow-hidden"><div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs text-slate-500">You</div></div>
      </div>
      <div className="p-6 bg-slate-900 flex justify-center gap-6"><button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white"><MicOff size={24}/></button><button className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20" onClick={onClose}><Phone size={28} className="rotate-135"/></button><button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white"><VideoOff size={24}/></button></div>
    </div>
  </div>
);

// --- MAIN SCREENS ---

const FamilyCenter = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');

  const handleAddMember = () => { alert(`Request sent to ABHA ID: ${newMemberId}. Waiting for user consent.`); setShowAddModal(false); setNewMemberId(''); };

  if (selectedMember) return <MemberDetailView member={selectedMember} onBack={() => setSelectedMember(null)} />;

  return (
    <div className="animate-fade-in pb-24">
      <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10"><h1 className="text-xl font-bold text-slate-800">Family Center</h1><div className="bg-slate-100 p-2 rounded-full"><Users size={20} className="text-slate-600"/></div></div>
      <div className="p-6"><div className="grid grid-cols-2 gap-4">{FAMILY_MEMBERS.map((member) => (<div key={member.id} onClick={() => setSelectedMember(member)} className="group relative bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"><div className={`absolute top-0 left-0 w-1.5 h-full ${member.type === 'Pregnancy' ? 'bg-pink-400' : member.type === 'Senior' ? 'bg-orange-400' : 'bg-teal-400'}`}></div><div className={`w-12 h-12 rounded-full ${member.avatar} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{member.type === 'Pregnancy' ? <Baby size={22} /> : member.type === 'Senior' ? <Users size={22} /> : <User size={22} />}</div><h3 className="font-bold text-slate-800 text-lg">{member.name}</h3><p className="text-xs text-slate-400 font-medium mb-2">{member.role}</p>{member.status && <div className="inline-block px-2 py-1 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 border border-slate-100">{member.status}</div>}</div>))}<button onClick={() => setShowAddModal(true)} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[160px]"><div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3"><Plus size={24} className="text-gray-400" /></div><span className="font-bold text-slate-400">Add Member</span><span className="text-xs text-slate-300 mt-1">via ABHA ID</span></button></div></div>
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"><div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative"><button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button><div className="flex items-center gap-2 mb-4"><div className="p-2 bg-green-100 rounded-lg text-green-600"><QrCode size={20}/></div><h3 className="font-bold text-lg">Link Family Member</h3></div><p className="text-sm text-slate-500 mb-4">Enter their 14-digit ABHA ID to send a consent request.</p><input type="text" placeholder="e.g. 12-3456-7890-1234" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 font-mono text-sm focus:border-teal-500 outline-none" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} /><button onClick={handleAddMember} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">Send Request</button></div></div>}
    </div>
  );
};

const MemberDetailView = ({ member, onBack }) => {
  const [viewMode, setViewMode] = useState('pregnancy');
  return (
    <div className="animate-slide-in pb-24 bg-slate-50 min-h-screen">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10"><div className="flex items-center gap-2"><button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-500"><ChevronLeft size={24}/></button><div><h1 className="text-lg font-bold text-slate-800">{member.name}</h1><p className="text-xs text-slate-400">{member.type} Profile</p></div></div>{member.type === 'Pregnancy' && <div className="flex bg-slate-100 rounded-lg p-1"><button onClick={() => setViewMode('general')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'general' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>General</button><button onClick={() => setViewMode('pregnancy')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'pregnancy' ? 'bg-pink-500 shadow-sm text-white' : 'text-slate-400'}`}>Pregnancy</button></div>}</div>
      {member.type === 'Pregnancy' && viewMode === 'pregnancy' ? (<div className="animate-fade-in"><div className="mx-6 mt-6 p-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl shadow-lg shadow-pink-200 text-white relative overflow-hidden"><div className="relative z-10 text-center"><h2 className="text-3xl font-bold mb-1">Week 24</h2><p className="text-pink-100 text-sm font-medium">2nd Trimester • Size of a Corn</p><div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden"><div className="w-[60%] h-full bg-white/90 rounded-full"></div></div></div><Baby size={120} className="absolute -right-4 -bottom-4 text-white/20 rotate-12" /></div><div className="px-6 mt-6 grid grid-cols-2 gap-4"><VitalsWidget title="Fetal HR" value="140" unit="bpm" icon={Heart} color="text-pink-500" bg="bg-pink-50" /><VitalsWidget title="Kicks" value="12" unit="/hr" icon={Activity} color="text-purple-500" bg="bg-purple-50" /></div></div>) : (<div className="animate-fade-in">{member.type === 'Senior' && <div className="mx-6 mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4"><div className="p-3 bg-white rounded-full text-orange-500 shadow-sm"><Users size={20}/></div><div><h3 className="font-bold text-orange-800">Senior Guard Active</h3><p className="text-xs text-orange-600">Fall detection & Geofencing enabled</p></div></div>}<div className="px-6 mt-6 flex flex-col gap-4"><h3 className="font-bold text-slate-800">General Health Vitals</h3><VitalsWidget title="Heart Rate" value="72" unit="bpm" icon={Heart} color="text-teal-500" bg="bg-teal-50" /><VitalsWidget title="Blood Pressure" value="118/78" unit="mmHg" icon={Activity} color="text-blue-500" bg="bg-blue-50" /><VitalsWidget title="Temperature" value="98.6" unit="°F" icon={Activity} color="text-rose-500" bg="bg-rose-50" /></div></div>)}
    </div>
  );
};

const Appointments = ({ bookings, onAddBooking, onCancelBooking }) => {
  const [activeTab, setActiveTab] = useState('find');
  const [category, setCategory] = useState('General');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const filteredDoctors = MOCK_DOCTORS.filter(d => d.category === category);

  return (
    <div className="animate-fade-in pb-24">
       <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Appointments</h1>
          <div className="flex p-1 bg-slate-100 rounded-xl mt-4"><button onClick={() => setActiveTab('find')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'find' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Find Doctors</button><button onClick={() => setActiveTab('my')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>My Bookings</button></div>
       </div>
       {activeTab === 'find' ? (<div className="p-6"><div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">{['General', 'Dental', 'Cardiac', 'Neuro'].map((tag) => (<button key={tag} onClick={() => setCategory(tag)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${category === tag ? 'bg-slate-800 text-white' : 'bg-white border border-gray-200 text-slate-600'}`}>{tag}</button>))}</div><div className="space-y-4">{filteredDoctors.map(doc => (<div key={doc.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4"><div className={`w-16 h-16 rounded-xl flex items-center justify-center ${doc.image}`}><User size={32}/></div><div className="flex-1"><h4 className="font-bold text-slate-800">{doc.name}</h4><p className="text-xs text-teal-600 font-bold uppercase tracking-wide">{doc.specialty}</p><div className="flex items-center gap-2 mt-1 text-xs text-slate-400"><span>★ {doc.rating}</span> • <span>{doc.exp} Exp</span></div><button onClick={() => setSelectedDoc(doc)} className="mt-3 w-full py-2 bg-slate-50 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100">Book Appointment</button></div></div>))}</div></div>) : (<div className="p-6 space-y-4">{bookings.length === 0 ? (<div className="text-center text-slate-400 mt-10">No active appointments.</div>) : (bookings.map((booking, idx) => (<div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"><div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-slate-800">{booking.doctor.name}</h4><span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold">CONFIRMED</span></div><p className="text-xs text-slate-500 mb-4">{booking.doctor.specialty}</p><div className="flex items-center gap-4 text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl"><div className="flex items-center gap-2"><Calendar size={16} className="text-teal-500"/> {booking.date}</div><div className="flex items-center gap-2"><Clock size={16} className="text-teal-500"/> {booking.time}</div></div><button onClick={() => onCancelBooking(idx)} className="mt-3 w-full py-2 border border-red-100 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center justify-center gap-2"><Trash2 size={14} /> Cancel Appointment</button></div>)))}</div>)}
       {selectedDoc && <BookingModal doctor={selectedDoc} onClose={() => setSelectedDoc(null)} onConfirm={(booking) => { onAddBooking(booking); setSelectedDoc(null); setActiveTab('my'); }} />}
    </div>
  );
};

const MedicineIntelligence = () => {
    const [drugA, setDrugA] = useState('');
    const [drugB, setDrugB] = useState('');
    const [result, setResult] = useState(null);
    const [viewMedicine, setViewMedicine] = useState(null);
    const checkInteraction = () => { const conflict = INTERACTION_DB.find(i => (i.drugs.includes(drugA) && i.drugs.includes(drugB))); setResult(conflict || { severity: 'Safe', risk: 'No known interactions found in database.' }); };
    return (
        <div className="animate-fade-in pb-24"><div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10"><h1 className="text-xl font-bold text-slate-800">Medicine Intelligence</h1></div><div className="p-6 space-y-8"><div className="bg-indigo-600 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden"><ShieldAlert className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" /><h2 className="text-lg font-bold mb-4 relative z-10">Interaction Checker</h2><div className="space-y-3 relative z-10"><select className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none" onChange={e => setDrugA(e.target.value)}><option value="" className="text-slate-800">Select Drug 1</option>{Object.keys(MEDICINE_DB).map(m => <option key={m} value={m} className="text-slate-800">{m}</option>)}</select><select className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none" onChange={e => setDrugB(e.target.value)}><option value="" className="text-slate-800">Select Drug 2</option>{Object.keys(MEDICINE_DB).map(m => <option key={m} value={m} className="text-slate-800">{m}</option>)}</select><button onClick={checkInteraction} className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg">Test Safety</button></div>{result && (<div className={`mt-4 p-4 rounded-xl ${result.severity === 'Safe' ? 'bg-green-500/20 border border-green-400/50' : 'bg-red-500/20 border border-red-400/50'} relative z-10 animate-fade-in`}><p className="font-bold text-sm uppercase">{result.severity}</p><p className="text-xs opacity-90">{result.risk}</p></div>)}</div><div><h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Store size={18}/> Pharmacy & Details</h3><div className="space-y-3">{Object.keys(MEDICINE_DB).map(med => (<div key={med} onClick={() => setViewMedicine(med)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-teal-200 transition-colors"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600"><Pill size={18}/></div><span className="font-bold text-slate-700">{med}</span></div><Info size={18} className="text-slate-300" /></div>))}</div></div></div>{viewMedicine && <MedicineModal medicine={viewMedicine} onClose={() => setViewMedicine(null)} />}</div>
    );
};

const HealthWallet = () => {
    const [subTab, setSubTab] = useState('insurance'); // 'insurance' | 'records'
    const [showRenewal, setShowRenewal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);
    const percentUsed = (INSURANCE_DETAILS.used / INSURANCE_DETAILS.sumInsured) * 100;

    return (
        <div className="animate-fade-in pb-24">
            <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold text-slate-800">Health Wallet</h1><div className="bg-amber-100 p-2 rounded-full text-amber-600"><Wallet size={20}/></div></div>
                <div className="flex p-1 bg-slate-100 rounded-xl"><button onClick={() => setSubTab('insurance')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subTab === 'insurance' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Insurance</button><button onClick={() => setSubTab('records')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subTab === 'records' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Records</button></div>
            </div>

            {subTab === 'insurance' ? (
                <div className="p-6 space-y-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl"><div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div><div className="p-6 relative z-10"><div className="flex justify-between items-start mb-6"><div><p className="text-xs text-slate-400 font-medium tracking-wider">HEALTH CARD</p><h3 className="font-bold text-lg">{INSURANCE_DETAILS.provider}</h3></div><ShieldCheck size={28} className="text-amber-400" /></div><div className="mb-6"><p className="text-xs text-slate-400 mb-1">Policy Number</p><p className="font-mono text-xl tracking-widest text-slate-100">{INSURANCE_DETAILS.policyNo}</p></div><div className="flex justify-between items-end"><div><p className="text-xs text-slate-400 mb-1">Primary Insured</p><p className="font-medium text-sm">Rahul Sharma</p></div><div className="text-right"><p className="text-xs text-slate-400 mb-1">Valid Thru</p><p className="font-medium text-sm">{INSURANCE_DETAILS.validThru}</p></div></div></div><div className="bg-white/10 backdrop-blur-md p-3 flex justify-between items-center text-xs font-medium"><button onClick={() => setShowRenewal(true)} className="flex items-center gap-1 hover:text-amber-400 transition-colors"><RefreshCw size={14} /> Renew Policy</button><button className="flex items-center gap-1 hover:text-teal-400 transition-colors"><FileCheck size={14} /> View Benefits</button></div></div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Coverage Usage</h3><span className="text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-md">Family Floater</span></div><div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2"><div style={{ width: `${percentUsed}%` }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"></div></div><div className="flex justify-between text-sm"><span className="font-medium text-teal-700">{formatCurrency(INSURANCE_DETAILS.used)} Used</span><span className="text-slate-400">of {formatCurrency(INSURANCE_DETAILS.sumInsured)} Limit</span></div></div>
                    <div><h3 className="font-bold text-slate-800 mb-3">Claims History</h3>{CLAIMS_HISTORY.map(claim => (<div key={claim.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded-full ${claim.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{claim.status === 'Approved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}</div><div><h4 className="font-bold text-slate-800 text-sm">{claim.hospital}</h4><p className="text-xs text-slate-500">{claim.purpose}</p></div></div><div className="text-right"><p className="font-bold text-slate-800 text-sm">{claim.amount}</p><p className={`text-[10px] font-bold ${claim.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>{claim.status}</p></div></div>))}</div>
                </div>
            ) : (
                <div className="p-6 space-y-4">
                    <button onClick={() => setShowScanner(true)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"><Camera size={18} /> Scan New Prescription</button>
                    {MOCK_RECORDS.map((rec) => (<div key={rec.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500"><FileText size={20}/></div><div><h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4><p className="text-xs text-slate-400">{rec.date} • {rec.doctor}</p></div></div><ChevronRight size={16} className="text-gray-300"/></div>))}
                </div>
            )}
            {showRenewal && <RenewalModal onClose={() => setShowRenewal(false)} />}
            {showScanner && <ScannerModal onClose={() => setShowScanner(false)} />}
        </div>
    );
};

const Dashboard = ({ onNavigate, onSOS, onPay, onConsult, onOpenDevices }) => (
    <div className="animate-fade-in pb-24">
      <div className="p-6 bg-white flex justify-between items-center border-b border-gray-100">
        <div><h1 className="text-2xl font-bold text-slate-800">Hello, Rahul</h1><p className="text-xs text-slate-400">All Systems Normal</p></div>
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">R</div>
      </div>
      <div className="mx-6 mt-6 grid grid-cols-2 gap-3">
         <div onClick={onOpenDevices} className="p-4 bg-slate-800 rounded-2xl shadow-lg text-white flex flex-col justify-between h-32 cursor-pointer hover:bg-slate-700 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-4 -mt-4 group-hover:bg-white/10 transition-colors"></div>
            <div className="p-2 bg-white/20 w-max rounded-full"><Wifi size={16} /></div>
            <div>
               <h3 className="font-bold text-sm">Synced</h3>
               <p className="text-slate-300 text-xs">Tap to Manage</p>
            </div>
         </div>
         <div onClick={() => onNavigate('wallet')} className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg text-white flex flex-col justify-between h-32 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4"></div>
             <div className="p-2 bg-white/20 w-max rounded-full backdrop-blur-sm"><ShieldCheck size={16} /></div>
             <div>
                <h3 className="font-bold text-sm">Active</h3>
                <p className="text-amber-100 text-xs">₹8.75L left</p>
             </div>
         </div>
      </div>
      <div className="px-6 mt-8 grid grid-cols-4 gap-4 text-center">
           <ActionButton icon={CreditCard} label="Pay" onClick={onPay} />
           <ActionButton icon={Calendar} label="Book" onClick={() => onNavigate('appointments')} />
           <ActionButton icon={Stethoscope} label="Consult" onClick={onConsult} />
           <ActionButton icon={ShieldAlert} label="SOS" color="text-rose-600" bg="bg-rose-50" onClick={onSOS} />
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

const ActionButton = ({ icon: Icon, label, onClick, color="text-slate-600", bg="bg-white" }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
        <div className={`w-14 h-14 ${bg} border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md`}>
            <Icon size={24} className={color}/>
        </div>
        <span className="text-[10px] font-medium text-slate-500">{label}</span>
    </button>
);

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-14 py-2 transition-colors ${active ? 'text-teal-600' : 'text-slate-300'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- APP ROOT ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [bookings, setBookings] = useState([]);
  
  // Modals
  const [showSOS, setShowSOS] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showConsult, setShowConsult] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  // Dashboard Action Handlers
  const handlePay = () => setShowPay(true);
  const handleConsult = () => setShowConsult(true);

  if (!isAuthenticated) return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onNavigate={setActiveTab} onSOS={() => setShowSOS(true)} onPay={handlePay} onConsult={handleConsult} onOpenDevices={() => setShowDevices(true)} />;
      case 'family': return <FamilyCenter />; 
      case 'appointments': return <Appointments bookings={bookings} onAddBooking={b => setBookings([...bookings, b])} onCancelBooking={idx => setBookings(bookings.filter((_, i) => i !== idx))} />;
      case 'safety': return <MedicineIntelligence />;
      case 'wallet': return <HealthWallet />;
      default: return <Dashboard onNavigate={setActiveTab} onSOS={() => setShowSOS(true)} onPay={handlePay} onConsult={handleConsult} onOpenDevices={() => setShowDevices(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl relative">
        {renderContent()}
        
        {/* Modals */}
        {showSOS && (
            <div className="fixed inset-0 z-50 bg-red-600 flex items-center justify-center p-6 text-white text-center animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold mb-4">SOS ALERT SENT</h2>
                    <p className="mb-8">Location shared with family & ambulance.</p>
                    <button onClick={() => setShowSOS(false)} className="bg-white text-red-600 font-bold py-3 px-8 rounded-xl">Deactivate</button>
                </div>
            </div>
        )}
        
        {showPay && <QuickPayModal onClose={() => setShowPay(false)} />}
        {showConsult && <ConsultModal onClose={() => setShowConsult(false)} />}
        {showDevices && <DeviceManagerModal onClose={() => setShowDevices(false)} />}

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-end z-40 pb-safe">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
          <NavButton active={activeTab === 'family'} onClick={() => setActiveTab('family')} icon={Users} label="Family" />
          <div className="relative -top-5">
            <button onClick={() => setActiveTab('safety')} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${activeTab === 'safety' ? 'bg-indigo-600 scale-110' : 'bg-slate-800 hover:scale-105'}`}>
              <ShieldCheck size={24} className="text-white" />
            </button>
          </div>
          <NavButton active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={Calendar} label="Book" />
          <NavButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={Wallet} label="Wallet" />
        </div>
      </div>
    </div>
  );
}