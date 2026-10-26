/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, Appointment } from './types';
import { getSamplePatients, getSampleAppointments } from './sampleData';
import DashboardOverview from './components/DashboardOverview';
import bezDentalLogo from "./assets/images/bezdental_logo_1782613458006.jpg";
import headDoctorPortrait from "./assets/images/head_doctor_portrait_1782612644910.jpg";
import PatientManager from './components/PatientManager';
import AppointmentCalendar from './components/AppointmentCalendar';
import PatientDetailsView from './components/PatientDetailsView';
import { 
  HeartPulse, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  LogOut, 
  ClipboardCheck, 
  AlertTriangle,
  User,
  Activity,
  Smile,
  ShieldCheck
} from 'lucide-react';

type MainTab = 'dashboard' | 'patients' | 'appointments';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  
  // State for Patient EHR Database
  const [patients, setPatients] = useState<Patient[]>([]);
  // State for Scheduling Calendar
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Selected Patient for EHR view
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // 1. Initialize data from LocalStorage or pre-load sample data
  useEffect(() => {
    const cachedPatients = localStorage.getItem('DRH_patients');
    const cachedAppointments = localStorage.getItem('DRH_appointments');

    if (cachedPatients) {
      setPatients(JSON.parse(cachedPatients));
    } else {
      const initialPatients = getSamplePatients();
      setPatients(initialPatients);
      localStorage.setItem('DRH_patients', JSON.stringify(initialPatients));
    }

    if (cachedAppointments) {
      setAppointments(JSON.parse(cachedAppointments));
    } else {
      const initialAppointments = getSampleAppointments();
      setAppointments(initialAppointments);
      localStorage.setItem('DRH_appointments', JSON.stringify(initialAppointments));
    }
  }, []);

  // 2. State persistence helper
  const savePatientsToStorage = (updatedPatients: Patient[]) => {
    setPatients(updatedPatients);
    localStorage.setItem('DRH_patients', JSON.stringify(updatedPatients));
  };

  const saveAppointmentsToStorage = (updatedAppointments: Appointment[]) => {
    setAppointments(updatedAppointments);
    localStorage.setItem('DRH_appointments', JSON.stringify(updatedAppointments));
  };

  // 3. Clinical operations callbacks

  // Patients DB callbacks
  const handleAddPatient = (newPatient: Patient) => {
    const updated = [newPatient, ...patients];
    savePatientsToStorage(updated);
  };

  const handleDeletePatient = (patientId: string) => {
    const updated = patients.filter(p => p.id !== patientId);
    savePatientsToStorage(updated);
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
    }
  };

  const handleUpdatePatientData = (updatedPatient: Patient) => {
    const updated = patients.map(p => {
      if (p.id === updatedPatient.id) {
        return updatedPatient;
      }
      return p;
    });
    savePatientsToStorage(updated);
  };

  // Appointments callbacks
  const handleAddAppointment = (newApt: Appointment) => {
    const updated = [newApt, ...appointments];
    saveAppointmentsToStorage(updated);
  };

  const handleUpdateAppointmentStatus = (aptId: string, status: Appointment['status']) => {
    const updated = appointments.map(apt => {
      if (apt.id === aptId) {
        return { ...apt, status };
      }
      return apt;
    });
    saveAppointmentsToStorage(updated);
  };

  const handleDeleteAppointment = (aptId: string) => {
    const updated = appointments.filter(apt => apt.id !== aptId);
    saveAppointmentsToStorage(updated);
  };

  // Find currently active patient for details view
  const activePatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Clinician Left Navigation Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 hidden md:flex border-r border-slate-800">
        <div className="flex flex-col flex-1">
          {/* Sidebar Header Brand */}
          <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-red-600/20">
              <img 
                src={bezDentalLogo} 
                alt="BezDental Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-black text-sm tracking-widest text-white uppercase block">BezDental</span>
              <span className="text-[10px] font-bold text-red-500 tracking-wider">Ghana CRM v1.2</span>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedPatientId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all text-left cursor-pointer ${
                activeTab === 'dashboard' && selectedPatientId === null
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Control</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('patients');
                setSelectedPatientId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all text-left cursor-pointer ${
                activeTab === 'patients' || selectedPatientId !== null
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Files (EHR)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('appointments');
                setSelectedPatientId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all text-left cursor-pointer ${
                activeTab === 'appointments' && selectedPatientId === null
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments Chair</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer metadata */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Active Session Secure</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-semibold">
            Dr. Bezaleel Mawugbe • BezDental
          </div>
          <div className="text-[9px] text-slate-400 mt-1 font-medium space-y-0.5">
            <div>✉️ mawugbebezaleel13@gmail.com</div>
            <div>📞 (0256488754)</div>
          </div>
        </div>
      </aside>

      {/* Main content body container */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header navbar */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-10 shrink-0 select-none">
          {/* Left: Mobile Nav triggers & Brand fallback */}
          <div className="flex items-center gap-3">
            {/* Logo representation for mobile screens */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={bezDentalLogo} 
                  alt="BezDental Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">BezDental</span>
            </div>

            {/* Title corresponding to current state */}
            <h2 className="hidden md:block font-extrabold text-lg text-slate-900 capitalize tracking-tight">
              {selectedPatientId !== null
                ? 'Electronic Health Record (EHR)'
                : activeTab === 'dashboard'
                ? 'Clinical Control Dashboard'
                : activeTab === 'patients'
                ? 'Registered Patient Files'
                : 'Scheduling & Chair Coordinator'}
            </h2>
          </div>

          {/* Right: Quick actions and clinician badge */}
          <div className="flex items-center gap-4">
            {/* Quick Mobile Navigation links */}
            <div className="flex md:hidden bg-slate-100 border border-slate-200 p-1 rounded-xl text-[10px] font-bold">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSelectedPatientId(null); }}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('patients'); setSelectedPatientId(null); }}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${activeTab === 'patients' || selectedPatientId !== null ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                EHR
              </button>
              <button 
                onClick={() => { setActiveTab('appointments'); setSelectedPatientId(null); }}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Calendar
              </button>
            </div>

            {/* Clinician Account Capsule */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-full pl-2 pr-4 py-1.5">
              <img 
                src={headDoctorPortrait} 
                alt="Dr. Bezaleel Mawutorwu Mawugbe" 
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-inner"
              />
              <div className="hidden sm:block">
                <span className="text-[10px] font-extrabold text-slate-800 block leading-tight">Dr. Bezaleel Mawutorwu Mawugbe</span>
                <span className="text-[9px] font-bold text-red-600 block leading-none">Head Doctor & Oral Surgeon</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content canvas viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {selectedPatientId !== null && activePatient ? (
            /* Selected Patient EHR Detailed Tabs */
            <PatientDetailsView
              patient={activePatient}
              onBackToList={() => setSelectedPatientId(null)}
              onUpdatePatientData={handleUpdatePatientData}
            />
          ) : activeTab === 'dashboard' ? (
            /* Dashboard control view */
            <DashboardOverview
              patients={patients}
              appointments={appointments}
              onSelectPatient={(id) => {
                setSelectedPatientId(id);
                setActiveTab('patients');
              }}
              onNavigateToTab={(tab) => setActiveTab(tab as MainTab)}
            />
          ) : activeTab === 'patients' ? (
            /* Registered Patients database view */
            <PatientManager
              patients={patients}
              onSelectPatient={setSelectedPatientId}
              onAddPatient={handleAddPatient}
              onDeletePatient={handleDeletePatient}
            />
          ) : (
            /* Scheduled appointments calendar view */
            <AppointmentCalendar
              appointments={appointments}
              patients={patients}
              onAddAppointment={handleAddAppointment}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}
        </div>
      </main>
    </div>
  );
}
