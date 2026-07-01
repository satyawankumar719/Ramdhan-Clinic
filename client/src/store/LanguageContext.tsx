import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Common
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Sign Out',
    'dashboard': 'Dashboard',
    'appointments': 'Appointments',
    'prescriptions': 'Prescriptions',
    'emergency': 'Emergency',
    'aiAssistant': 'AI Assistant',
    'settings': 'Settings',
    'doctors': 'Doctors',
    'patients': 'Patients',
    'overview': 'Overview',
    'adminConsole': 'Admin Console',
    'patientPortal': 'Patient Portal',
    'doctorPortal': 'Doctor Portal',

    // Patient Dashboard
    'goodAfternoon': 'Good afternoon',
    'howFeeling': 'How are you feeling today?',
    'noUpcomingAppointments': 'No upcoming confirmed appointments. Book one now!',
    'confirmedAppointments': 'You have {count} confirmed appointment coming up.',
    'confirmedAppointments_plural': 'You have {count} confirmed appointments coming up.',
    'bookAppointment': 'Book Appointment',
    'talkToAI': 'Talk to AI Assistant',
    'emergencyBtn': 'Emergency',
    'healthStatus': 'Health Status',
    'nextCheckup': 'Your next checkup will be soon',
    'upcoming': 'Upcoming',
    'active': 'active',
    'healthScore': 'Health score',
    'avgWait': 'Avg wait',
    'thisWeek': 'this week',
    'thisMonth': 'this month',
    'upcomingAppointments': 'Upcoming appointments',
    'viewAll': 'View all →',
    'loadingAppointments': 'Loading appointments...',
    'noUpcoming': 'No upcoming appointments',
    'bookFirst': 'Book your first appointment',
    'activePrescriptions': 'Active prescriptions',
    'noPrescriptions': 'No active prescriptions yet',
    'aiAssistantTeaser': 'Describe your symptoms in plain language',
    'aiAssistantTeaserDesc': "We'll suggest the right specialist and prepare a summary for the doctor.",

    // Doctor Dashboard
    'today': 'Today',
    'noAppointmentsToday': 'No Appointments today',
    'todaySchedule': "Today's Appointments",
    'newRequests': 'New Requests',
    'loadingRequests': 'Loading... Please wait',
    'noRequests': 'No new requests',
    'accept': 'Accept',
    'pleaseWait': 'Please wait...',
    'waiting': 'Waiting',
    'joinNow': 'Join Now',
    'completed': 'Completed',
    'noEmergency': 'No Emergency calls right now',
    'emergencyAlert': 'If there is an emergency, we will alert you at once.',
    'writePrescription': 'Write Prescription',
    'blockSchedule': 'Block Schedule',
    'patientRecords': 'Patient Records',
    'setAvailability': 'Set Availability',

    // Appointments Page
    'allPastUpcoming': 'All your past and upcoming consultations.',
    'yourSchedule': 'Your schedule across all patients.',
    'bookNew': 'Book new',
    'bookFirstAppointment': 'Book your first appointment',
    'noAppointmentsYet': 'No appointments yet',
    'patientNoAppointments': 'Start your health journey by booking your first appointment.',
    'doctorNoAppointments': 'Your schedule is clear. No appointments scheduled yet.',
    'when': 'When',
    'doctor': 'Doctor',
    'patient': 'Patient',
    'specialty': 'Specialty',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'reBook': 'Re-book',

    // Emergency Page
    'emergencyHomeVisit': 'Emergency Home Visit',
    'needDoctorNow': 'Need a doctor at your door — right now?',
    'sendDoctor': "We'll dispatch the nearest available doctor based on your symptoms. Stay calm — help is on the way.",
    'phoneNumber': 'Phone Number',
    'symptoms': 'Symptoms',
    'tapToRequest': 'Tap to request',
    'requestSent': 'Request sent',
    'avgResponse': 'Average response: under 3 minutes',
    'drArriving': 'Dr. Parveen — arriving in 7 min',
    'yourDetails': 'Your details',
    'location': 'Location',
    'onCallDoctor': 'On-Call Doctor',
    'recentEmergencies': 'Recent emergencies',
    'resolvedOnSite': 'Resolved on-site',
    'referredToHospital': 'Referred to hospital',
    'pleaseFillDetails': 'Please fill in all details',
    'failedSendEmergency': 'Failed to send emergency request',

    // AI Assistant
    'aiHealthAssistant': 'AI Health Assistant',
    'howCanHelp': 'How can I help you today?',

    // Prescriptions
    'prescriptionsTitle': 'Prescriptions',
    'noPrescriptionsMessage': 'No Prescriptions Yet',
    'patientPrescriptionNote': 'Book an appointment to get your first prescription',
    'doctorPrescriptionNote': 'Prescribe medicines to patients to see them here',
    'medicines': 'Medicines',
    'notes': 'Notes',
  },
  hi: {
    // Common
    'login': 'लॉगिन करें',
    'signup': 'साइन अप करें',
    'logout': 'साइन आउट',
    'dashboard': 'डैशबोर्ड',
    'appointments': 'अपॉइंटमेंट',
    'prescriptions': 'पर्चे',
    'emergency': 'आपातकालीन',
    'aiAssistant': 'AI असिस्टेंट',
    'settings': 'सेटिंग्स',
    'doctors': 'डॉक्टर',
    'patients': 'रोगी',
    'overview': 'अवलोकन',
    'adminConsole': 'एडमिन कंसोल',
    'patientPortal': 'रोगी पोर्टल',
    'doctorPortal': 'डॉक्टर पोर्टल',

    // Patient Dashboard
    'goodAfternoon': 'नमस्ते',
    'howFeeling': 'आज आप कैसा महसूस कर रहे हैं?',
    'noUpcomingAppointments': 'कोई अपॉइंटमेंट नहीं है। अभी बुक करें!',
    'confirmedAppointments': 'आपका {count} अपॉइंटमेंट कन्फर्म हुआ है।',
    'confirmedAppointments_plural': 'आपके {count} अपॉइंटमेंट कन्फर्म हुए हैं।',
    'bookAppointment': 'अपॉइंटमेंट बुक करें',
    'talkToAI': 'AI से बात करें',
    'emergencyBtn': 'आपातकालीन',
    'healthStatus': 'स्वास्थ्य स्थिति',
    'nextCheckup': 'आपका अगला चेकअप जल्द होगा',
    'upcoming': 'आगामी',
    'active': 'सक्रिय',
    'healthScore': 'स्वास्थ्य स्कोर',
    'avgWait': 'औसत इंतजार',
    'thisWeek': 'इस हफ्ते',
    'thisMonth': 'इस महीने',
    'upcomingAppointments': 'आगामी अपॉइंटमेंट',
    'viewAll': 'सभी देखें →',
    'loadingAppointments': 'अपॉइंटमेंट लोड हो रहे हैं...',
    'noUpcoming': 'कोई आगामी अपॉइंटमेंट नहीं',
    'bookFirst': 'अपना पहला अपॉइंटमेंट बुक करें',
    'activePrescriptions': 'सक्रिय पर्चे',
    'noPrescriptions': 'अभी तक कोई पर्चा नहीं है',
    'aiAssistantTeaser': 'अपने लक्षण सरल भाषा में बताएं',
    'aiAssistantTeaserDesc': 'हम सही विशेषज्ञ का सुझाव देंगे और डॉक्टर के लिए सार तैयार करेंगे।',

    // Doctor Dashboard
    'today': 'आज',
    'noAppointmentsToday': 'आज कोई अपॉइंटमेंट नहीं',
    'todaySchedule': "आज के अपॉइंटमेंट",
    'newRequests': 'नए अनुरोध',
    'loadingRequests': 'लोड हो रहा है... कृपया प्रतीक्षा करें',
    'noRequests': 'कोई नया अनुरोध नहीं',
    'accept': 'स्वीकार करें',
    'pleaseWait': 'कृपया प्रतीक्षा करें...',
    'waiting': 'प्रतीक्षारत',
    'joinNow': 'अभी जुड़ें',
    'completed': 'पूर्ण',
    'noEmergency': 'अभी कोई आपातकालीन कॉल नहीं',
    'emergencyAlert': 'अगर कोई आपातकालीन स्थिति होगी, हम आपको तुरंत सूचित करेंगे।',
    'writePrescription': 'पर्चा लिखें',
    'blockSchedule': 'समय ब्लॉक करें',
    'patientRecords': 'रोगी के रिकॉर्ड',
    'setAvailability': 'उपलब्धता सेट करें',

    // Appointments Page
    'allPastUpcoming': 'आपके सभी पिछले और आगामी परामर्श।',
    'yourSchedule': 'आपका सभी रोगियों का समय।',
    'bookNew': 'नया बुक करें',
    'bookFirstAppointment': 'अपना पहला अपॉइंटमेंट बुक करें',
    'noAppointmentsYet': 'अभी तक कोई अपॉइंटमेंट नहीं',
    'patientNoAppointments': 'अपना पहला अपॉइंटमेंट बुक करके अपनी स्वास्थ्य यात्रा शुरू करें।',
    'doctorNoAppointments': 'आपका समय खाली है। अभी तक कोई अपॉइंटमेंट शेड्यूल नहीं हुआ है।',
    'when': 'कब',
    'doctor': 'डॉक्टर',
    'patient': 'रोगी',
    'specialty': 'विशेषज्ञता',
    'cancel': 'रद्द करें',
    'confirm': 'कन्फर्म करें',
    'reBook': 'फिर से बुक करें',

    // Emergency Page
    'emergencyHomeVisit': 'आपातकालीन घर पर डॉक्टर',
    'needDoctorNow': 'अपने दरवाजे पर डॉक्टर चाहिए — अभी?',
    'sendDoctor': "हम आपके लक्षणों के आधार पर निकटतम उपलब्ध डॉक्टर भेजेंगे। शांत रहिए — मदद आ रही है।",
    'phoneNumber': 'फ़ोन नंबर',
    'symptoms': 'लक्षण',
    'tapToRequest': 'अनुरोध करने के लिए टैप करें',
    'requestSent': 'अनुरोध भेजा गया',
    'avgResponse': 'औसत प्रतिक्रिया: 3 मिनट से कम',
    'drArriving': 'डॉ. प्रवीण — 7 मिनट में पहुंचेंगे',
    'yourDetails': 'आपका विवरण',
    'location': 'स्थान',
    'onCallDoctor': 'ऑन-कॉल डॉक्टर',
    'recentEmergencies': 'हाल के आपातकालीन मामले',
    'resolvedOnSite': 'वहां पर हल हुआ',
    'referredToHospital': 'हॉस्पिटल भेजा गया',
    'pleaseFillDetails': 'कृपया सभी विवरण भरें',
    'failedSendEmergency': 'आपातकालीन अनुरोध भेजने में विफल',

    // AI Assistant
    'aiHealthAssistant': 'AI स्वास्थ्य सहायक',
    'howCanHelp': 'आज मैं आपकी कैसे मदद कर सकता हूं?',

    // Prescriptions
    'prescriptionsTitle': 'पर्चे',
    'noPrescriptionsMessage': 'अभी तक कोई पर्चा नहीं है',
    'patientPrescriptionNote': 'अपना पहला पर्चा पाने के लिए अपॉइंटमेंट बुक करें',
    'doctorPrescriptionNote': 'पर्चे यहां दिखाई देंगे जब आप रोगियों को पर्चे लिखेंगे',
    'medicines': 'दवाइयां',
    'notes': 'नोट्स',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi for village people

  const t = (key: string, params?: { [key: string]: string | number }) => {
    let text = translations[language][key] || translations['en'][key] || key;
    if (params) {
      Object.keys(params).forEach((param) => {
        const val = params[param];
        const pluralKey = `${key}_plural`;
        if (typeof val === 'number' && val > 1 && translations[language][pluralKey]) {
          text = translations[language][pluralKey];
        }
        text = text.replace(`{${param}}`, String(val));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
