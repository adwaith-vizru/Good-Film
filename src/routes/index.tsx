import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import qrCodeIcon from "../qr-code-icon.svg";
import {
  BookMarked,
  Globe,
  CalendarCheck,
  Printer,
  FilePlus2,
  Fingerprint,
  RefreshCw,
  CreditCard,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Upload,
  Calendar,
  QrCode,
  Loader2,
  Check,
  AlertCircle,
  FileText,
  ShieldCheck,
  Languages,
  FileCheck,
  DollarSign,
  User,
  Scan,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "e-Passport & Visa Services — Kiosk" },
      {
        name: "description",
        content:
          "Government e-services kiosk. Select a passport or visa service to begin.",
      },
      { property: "og:title", content: "e-Passport & Visa Services" },
      {
        property: "og:description",
        content: "Select a service to begin at the self-service kiosk.",
      },
    ],
  }),
  component: KioskHome,
});

type Service = {
  title: string;
  hint: string;
  Icon: LucideIcon;
};

const services: Service[] = [
  { title: "Passport Renewal", hint: "Renew an existing passport", Icon: BookMarked },
  { title: "Visa Extension", hint: "Extend your current visa", Icon: RefreshCw },
  { title: "Visa Application", hint: "Apply for a new visa", Icon: Globe },
  { title: "Appointment Booking", hint: "Schedule a counter visit", Icon: CalendarCheck },
  { title: "Status Check & Print", hint: "Track and print receipts", Icon: Printer },
  { title: "New Passport Pre-Application", hint: "Start a first-time application", Icon: FilePlus2 },
  { title: "Biometrics Enrolment", hint: "Capture fingerprints & photo", Icon: Fingerprint },
  { title: "Fee Payment", hint: "Pay government service fees", Icon: CreditCard },
  { title: "Contact/Address Update", hint: "Update your registered details", Icon: MapPin },
];

function KioskHome() {
  const [appState, setAppState] = useState<"WELCOME" | "LANGUAGE" | "SERVICES" | "VISA_FLOW" | "PASSPORT_FLOW" | "VISA_APPLICATION_FLOW" | "APPOINTMENT_FLOW">("LANGUAGE");
  const [language, setLanguage] = useState("English");
  
  // Visa step state
  const [visaStep, setVisaStep] = useState<
    | "PASSPORT"
    | "VERIFY_DETAILS"
    | "REASON"
    | "STAY_DETAILS"
    | "DOCUMENTS"
    | "SUMMARY"
    | "FEE_PAYMENT"
    | "PAYMENT_PROCESS"
    | "PRINTING"
    | "SUCCESS"
  >("PASSPORT");

  // Passport step state
  const [passportStep, setPassportStep] = useState<
    | "SCAN_PASSPORT"
    | "CONFIRM_DETAILS"
    | "UPLOAD_DOCUMENTS"
    | "PHOTO_CAPTURE"
    | "BIOMETRICS"
    | "REVIEW_APPLICATION"
    | "FEE_CALCULATION"
    | "PAYMENT_PROCESS"
    | "SUBMIT_APPLICATION"
    | "PRINTING"
    | "SUCCESS"
  >("SCAN_PASSPORT");

  // Shared simulation states
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Form details states
  const [fullName, setFullName] = useState("Johnathan Doe");
  const [passportNum, setPassportNum] = useState("A98234812");
  const [nationality, setNationality] = useState("United Kingdom (GBR)");
  const [existingVisaExpiry, setExistingVisaExpiry] = useState("2026-07-15");

  // Visa Extension flow states
  const [extensionReason, setExtensionReason] = useState<"Tourism" | "Business" | "Medical" | "Emergency" | null>(null);
  const [reasonFee, setReasonFee] = useState(0);
  const [departureDate, setDepartureDate] = useState("2026-08-15");
  const [stayDuration, setStayDuration] = useState("30"); // 30, 60, 90 days
  const [uploadedTicket, setUploadedTicket] = useState(false);
  const [uploadingTicket, setUploadingTicket] = useState(false);
  const [uploadingItinerary, setUploadingItinerary] = useState(false);
  const [uploadedItinerary, setUploadedItinerary] = useState(false);
  const [uploadingFunds, setUploadingFunds] = useState(false);
  const [uploadedFunds, setUploadedFunds] = useState(false);
  const [uploadingInsurance, setUploadingInsurance] = useState(false);
  const [uploadedInsurance, setUploadedInsurance] = useState(false);
  const [hasOverstay, setHasOverstay] = useState(false);

  // Passport Renewal flow states
  const [street, setStreet] = useState("12 Jalan Ampang");
  const [city, setCity] = useState("Kuala Lumpur");
  const [postcode, setPostcode] = useState("50450");
  const [addressState, setAddressState] = useState("Wilayah Persekutuan");
  const [phone, setPhone] = useState("+60 12-345 6789");
  const [email, setEmail] = useState("john.doe@example.com");
  const [deliveryOption, setDeliveryOption] = useState<"Pickup" | "Delivery">("Pickup");
  
  const [verifyingFace, setVerifyingFace] = useState(false);
  const [verifyFaceProgress, setVerifyFaceProgress] = useState(0);

  const [uploadedOldPassport, setUploadedOldPassport] = useState(false);
  const [uploadingOldPassport, setUploadingOldPassport] = useState(false);
  const [uploadedIdCard, setUploadedIdCard] = useState(false);
  const [uploadingIdCard, setUploadingIdCard] = useState(false);

  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [photoCountdown, setPhotoCountdown] = useState(0);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const [scanningBiometrics, setScanningBiometrics] = useState(false);
  const [biometricsProgress, setBiometricsProgress] = useState(0);
  const [flashActive, setFlashActive] = useState(false);

  // Submission state
  const [submittingApp, setSubmittingApp] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [uploadingViaWhatsApp, setUploadingViaWhatsApp] = useState(false);

  // Payment process simulation state
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "UPI" | "Cash" | null>(null);
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Printing animation state
  const [printProgress, setPrintProgress] = useState(0);
  const [successCountdown, setSuccessCountdown] = useState(15);

  // General maintenance warning
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);

  // Visa Application flow state
  const [visaAppStep, setVisaAppStep] = useState<
    | "ELIGIBILITY"
    | "VISA_TYPE"
    | "SCAN_PASSPORT"
    | "VERIFY_IDENTITY"
    | "TRAVEL_DETAILS"
    | "UPLOAD_DOCUMENTS"
    | "PHOTO_CAPTURE"
    | "BIOMETRICS"
    | "REVIEW_CONFIRM"
    | "FEE_CALCULATION"
    | "PAYMENT_PROCESS"
    | "SUBMIT_APPLICATION"
    | "STATUS"
  >("ELIGIBILITY");
  const [visaAppNationality, setVisaAppNationality] = useState("United Kingdom (GBR)");
  const [visaAppPurpose, setVisaAppPurpose] = useState<"Tourism" | "Business" | "Medical" | "Transit" | "Study" | null>(null);
  const [visaAppStayDuration, setVisaAppStayDuration] = useState("30");
  const [visaAppType, setVisaAppType] = useState<"Tourist" | "Business" | "Medical" | "Transit" | "Study" | null>(null);
  const [visaAppEntryDate, setVisaAppEntryDate] = useState("2026-07-15");
  const [visaAppExitDate, setVisaAppExitDate] = useState("2026-08-15");
  const [visaAppAccommodation, setVisaAppAccommodation] = useState("Grand Hyatt Hotel, Kuala Lumpur");
  const [visaAppUploadedPassportCopy, setVisaAppUploadedPassportCopy] = useState(false);
  const [visaAppUploadingPassportCopy, setVisaAppUploadingPassportCopy] = useState(false);
  const [visaAppUploadedItinerary, setVisaAppUploadedItinerary] = useState(false);
  const [visaAppUploadingItinerary, setVisaAppUploadingItinerary] = useState(false);
  const [visaAppUploadedFinancial, setVisaAppUploadedFinancial] = useState(false);
  const [visaAppUploadingFinancial, setVisaAppUploadingFinancial] = useState(false);
  const [visaAppUploadedSponsor, setVisaAppUploadedSponsor] = useState(false);
  const [visaAppUploadingSponsor, setVisaAppUploadingSponsor] = useState(false);
  const [visaAppUploadedInsurance, setVisaAppUploadedInsurance] = useState(false);
  const [visaAppUploadingInsurance, setVisaAppUploadingInsurance] = useState(false);
  const [visaAppSigned, setVisaAppSigned] = useState(false);
  const [visaAppStatus, setVisaAppStatus] = useState<"APPROVED" | "UNDER_REVIEW" | "INTERVIEW_REQUIRED" | null>(null);
  const [submittingVisaApp, setSubmittingVisaApp] = useState(false);
  const [submitVisaProgress, setSubmitVisaProgress] = useState(0);

  // Appointment Booking flow state
  const [apptStep, setApptStep] = useState<
    | "SELECT_ACTION"
    | "BOOK_IDENTITY" | "APPT_TYPE" | "SELECT_LOCATION" | "SELECT_DATETIME"
    | "SPECIAL_REQUIREMENTS" | "BOOK_REVIEW" | "CONFIRMATION"
    | "RESCHEDULE_IDENTITY" | "CURRENT_APPT" | "NEW_DATETIME" | "RESCHEDULE_REVIEW" | "RESCHEDULE_CONFIRM"
    | "CANCEL_IDENTITY" | "CANCEL_APPT_DETAILS" | "CANCEL_CONFIRM" | "CANCEL_RECEIPT"
  >("SELECT_ACTION");
  const [apptAction, setApptAction] = useState<"BOOK" | "RESCHEDULE" | "CANCEL" | null>(null);
  const [apptAppNumber, setApptAppNumber] = useState("VA-9284-A");
  const [apptOtpSent, setApptOtpSent] = useState(false);
  const [apptOtpValue, setApptOtpValue] = useState("");
  const [apptOtpVerified, setApptOtpVerified] = useState(false);
  const [apptType, setApptType] = useState<"Visa Application" | "Visa Extension" | "Passport Renewal" | "Other Services" | null>(null);
  const [apptLocation, setApptLocation] = useState<string | null>(null);
  const [apptDate, setApptDate] = useState<string | null>(null);
  const [apptTime, setApptTime] = useState<string | null>(null);
  const [apptAccessibility, setApptAccessibility] = useState(false);
  const [apptNotes, setApptNotes] = useState("");
  const [apptNewDate, setApptNewDate] = useState<string | null>(null);
  const [apptNewTime, setApptNewTime] = useState<string | null>(null);
  const [apptBookingRef] = useState("APT-" + String(Math.floor(Math.random() * 90000 + 10000)));

  // Calculated fees
  const durationSurcharge = stayDuration === "30" ? 0 : stayDuration === "60" ? 50 : 100;
  const overstayFine = hasOverstay ? 75 : 0;
  const totalFee = reasonFee + durationSurcharge + overstayFine;

  const deliveryFee = deliveryOption === "Delivery" ? 15 : 0;
  const totalPassportFee = 80 + deliveryFee;

  // Trigger passport scan simulation
  const startPassportScan = () => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            if (appState === "PASSPORT_FLOW") {
              setPassportStep("CONFIRM_DETAILS");
            } else {
              setVisaStep("VERIFY_DETAILS");
            }
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Facial verification simulation
  const startFacialVerification = () => {
    setVerifyingFace(true);
    setVerifyFaceProgress(0);
    const interval = setInterval(() => {
      setVerifyFaceProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVerifyingFace(false);
            setPassportStep("CONFIRM_DETAILS");
          }, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Photo capture camera shutter
  const startPhotoCapture = () => {
    setCapturingPhoto(true);
    setPhotoCountdown(3);
    
    const countInterval = setInterval(() => {
      setPhotoCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          // Trigger screen flash effect
          setFlashActive(true);
          setTimeout(() => {
            setFlashActive(false);
            setCapturingPhoto(false);
            setPhotoCaptured(true);
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Fingerprint scan simulation
  const startBiometricsScan = () => {
    setScanningBiometrics(true);
    setBiometricsProgress(0);
    const interval = setInterval(() => {
      setBiometricsProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanningBiometrics(false);
            setPassportStep("REVIEW_APPLICATION");
          }, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Simulate file uploads
  const simulateUpload = (type: "ticket" | "itinerary" | "funds" | "insurance" | "oldpassport" | "idcard") => {
    if (type === "ticket") {
      setUploadingTicket(true);
      setTimeout(() => {
        setUploadingTicket(false);
        setUploadedTicket(true);
      }, 1000);
    } else if (type === "itinerary") {
      setUploadingItinerary(true);
      setTimeout(() => {
        setUploadingItinerary(false);
        setUploadedItinerary(true);
      }, 1000);
    } else if (type === "funds") {
      setUploadingFunds(true);
      setTimeout(() => {
        setUploadingFunds(false);
        setUploadedFunds(true);
      }, 1000);
    } else if (type === "insurance") {
      setUploadingInsurance(true);
      setTimeout(() => {
        setUploadingInsurance(false);
        setUploadedInsurance(true);
      }, 1000);
    } else if (type === "oldpassport") {
      setUploadingOldPassport(true);
      setTimeout(() => {
        setUploadingOldPassport(false);
        setUploadedOldPassport(true);
      }, 1000);
    } else if (type === "idcard") {
      setUploadingIdCard(true);
      setTimeout(() => {
        setUploadingIdCard(false);
        setUploadedIdCard(true);
      }, 1000);
    }
  };

  // Simulate payment processing
  const handlePaymentMethodSelection = (method: "Card" | "UPI" | "Cash") => {
    setPaymentMethod(method);
    if (appState === "PASSPORT_FLOW") {
      setPassportStep("PAYMENT_PROCESS");
    } else {
      setVisaStep("PAYMENT_PROCESS");
    }
    setPaymentProgress(0);
  };

  useEffect(() => {
    const isProcessing = (appState === "VISA_FLOW" && visaStep === "PAYMENT_PROCESS") ||
                         (appState === "PASSPORT_FLOW" && passportStep === "PAYMENT_PROCESS") ||
                         (appState === "VISA_APPLICATION_FLOW" && visaAppStep === "PAYMENT_PROCESS");
    if (isProcessing) {
      const interval = setInterval(() => {
        setPaymentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (appState === "PASSPORT_FLOW") {
                setPassportStep("SUBMIT_APPLICATION");
              } else if (appState === "VISA_APPLICATION_FLOW") {
                setVisaAppStep("SUBMIT_APPLICATION");
              } else {
                setVisaStep("PRINTING");
              }
            }, 600);
            return 100;
          }
          return prev + 20;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [visaStep, passportStep, visaAppStep, appState]);

  // Simulate ticket printing
  useEffect(() => {
    const isPrinting = (appState === "VISA_FLOW" && visaStep === "PRINTING") ||
                       (appState === "PASSPORT_FLOW" && passportStep === "PRINTING");
    if (isPrinting) {
      const interval = setInterval(() => {
        setPrintProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (appState === "PASSPORT_FLOW") {
                setPassportStep("SUCCESS");
              } else {
                setVisaStep("SUCCESS");
              }
              setSuccessCountdown(15);
            }, 2500);
            return 100;
          }
          return prev + 3;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [visaStep, passportStep, appState]);

  // Success countdown timer
  useEffect(() => {
    const isSuccess = (appState === "VISA_FLOW" && visaStep === "SUCCESS") ||
                      (appState === "PASSPORT_FLOW" && passportStep === "SUCCESS") ||
                      (appState === "VISA_APPLICATION_FLOW" && visaAppStep === "STATUS") ||
                      (appState === "APPOINTMENT_FLOW" && (apptStep === "CONFIRMATION" || apptStep === "RESCHEDULE_CONFIRM" || apptStep === "CANCEL_RECEIPT"));
    if (isSuccess && successCountdown > 0) {
      const timer = setTimeout(() => {
        setSuccessCountdown(successCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && successCountdown === 0) {
      resetSession();
    }
  }, [visaStep, passportStep, visaAppStep, apptStep, appState, successCountdown]);

  const resetSession = () => {
    setAppState("LANGUAGE");
    setLanguage("English");
    setVisaStep("PASSPORT");
    setPassportStep("SCAN_PASSPORT");
    setScanning(false);
    setScanProgress(0);
    setFullName("Johnathan Doe");
    setPassportNum("A98234812");
    setNationality("United Kingdom (GBR)");
    setExistingVisaExpiry("2026-07-15");
    setExtensionReason(null);
    setReasonFee(0);
    setDepartureDate("2026-08-15");
    setStayDuration("30");
    setUploadedTicket(false);
    setUploadedItinerary(false);
    setUploadedFunds(false);
    setUploadedInsurance(false);
    setHasOverstay(false);
    setPaymentMethod(null);
    setPaymentProgress(0);
    setPrintProgress(0);

    // Reset passport flow details
    setStreet("12 Jalan Ampang");
    setCity("Kuala Lumpur");
    setPostcode("50450");
    setAddressState("Wilayah Persekutuan");
    setPhone("+60 12-345 6789");
    setEmail("john.doe@example.com");
    setDeliveryOption("Pickup");
    setVerifyingFace(false);
    setVerifyFaceProgress(0);
    setUploadedOldPassport(false);
    setUploadingOldPassport(false);
    setUploadedIdCard(false);
    setUploadingIdCard(false);
    setCapturingPhoto(false);
    setPhotoCountdown(0);
    setPhotoCaptured(false);
    setScanningBiometrics(false);
    setBiometricsProgress(0);
    setSubmittingApp(false);
    setSubmitProgress(0);
    setUploadingViaWhatsApp(false);
    // Reset Visa Application flow
    setVisaAppStep("ELIGIBILITY");
    setVisaAppNationality("United Kingdom (GBR)");
    setVisaAppPurpose(null);
    setVisaAppStayDuration("30");
    setVisaAppType(null);
    setVisaAppEntryDate("2026-07-15");
    setVisaAppExitDate("2026-08-15");
    setVisaAppAccommodation("Grand Hyatt Hotel, Kuala Lumpur");
    setVisaAppUploadedPassportCopy(false);
    setVisaAppUploadingPassportCopy(false);
    setVisaAppUploadedItinerary(false);
    setVisaAppUploadingItinerary(false);
    setVisaAppUploadedFinancial(false);
    setVisaAppUploadingFinancial(false);
    setVisaAppUploadedSponsor(false);
    setVisaAppUploadingSponsor(false);
    setVisaAppUploadedInsurance(false);
    setVisaAppUploadingInsurance(false);
    setVisaAppSigned(false);
    setVisaAppStatus(null);
    setSubmittingVisaApp(false);
    setSubmitVisaProgress(0);
    // Reset Appointment flow
    setApptStep("SELECT_ACTION");
    setApptAction(null);
    setApptAppNumber("VA-9284-A");
    setApptOtpSent(false);
    setApptOtpValue("");
    setApptOtpVerified(false);
    setApptType(null);
    setApptLocation(null);
    setApptDate(null);
    setApptTime(null);
    setApptAccessibility(false);
    setApptNotes("");
    setApptNewDate(null);
    setApptNewTime(null);
  };

  const handleReasonSelection = (reason: "Tourism" | "Business" | "Medical" | "Emergency") => {
    setExtensionReason(reason);
    const fee = reason === "Tourism" ? 100 : reason === "Business" ? 200 : reason === "Medical" ? 120 : 80;
    setReasonFee(fee);
    setVisaStep("STAY_DETAILS");
  };

  const showMaintenance = (serviceTitle: string) => {
    setMaintenanceMsg(`"${serviceTitle}" is under maintenance. For testing purposes, please select "Visa Extension" or "Passport Renewal".`);
    setTimeout(() => {
      setMaintenanceMsg(null);
    }, 4000);
  };

  if (appState === "WELCOME") {
    return (
      <main 
        onClick={() => setAppState("LANGUAGE")}
        className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-[#001b94] to-[#000a3a] text-white flex flex-col justify-between p-12 cursor-pointer select-none"
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-[#FF6F00] animate-spin-slow" />
            <span className="font-medium tracking-wider text-xs text-white/70 uppercase">E-Services Terminal</span>
          </div>
          <span className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-medium tracking-widest text-[#FF6F00] uppercase border border-white/10">STATION #02</span>
        </div>

        <div className="text-center my-auto flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner animate-pulse">
            <Fingerprint className="h-12 w-12 text-[#FF6F00]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-light font-display tracking-tight leading-none uppercase">
            Government of Malaysia
          </h1>
          <p className="text-[#FF6F00] text-sm tracking-widest font-medium uppercase mt-3">
            e-Passport & Visa Authority
          </p>
          <div className="mt-16 flex flex-col items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider animate-pulse">Tap anywhere to begin</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-white/40 font-medium uppercase tracking-wider w-full">
          <p>© Department of Immigration</p>
          <p>Language / Bahasa / 语言 / தமிழ்</p>
        </div>
      </main>
    );
  }

  if (appState === "LANGUAGE") {
    const languages = [
      { name: "English", code: "ENGLISH", flag: "🇬🇧" },
      { name: "Afrikaans", code: "AFRIKAANS", flag: "🇿🇦" },
      { name: "عربي", code: "ARABIC", flag: "🇸🇦" },
      { name: "தமிழ்", code: "TAMIL", flag: "🇮🇳" }
    ];

    return (
      <main className="h-screen max-h-screen bg-background flex flex-col justify-center py-12 overflow-hidden">
        <div className="max-w-[800px] w-full mx-auto px-16 text-center overflow-y-auto no-scrollbar my-auto">
          <h2 className="text-4xl font-light font-display text-[#1F2937] tracking-tight">
            Select Language
          </h2>
          <p className="text-sm text-[#64748B] mt-2 font-medium font-sans">
            Please select your preferred language to proceed
          </p>

          <div className="grid grid-cols-2 gap-6 mt-12">
            {languages.map((l) => (
              <button
                key={l.name}
                onClick={() => {
                  setLanguage(l.name);
                  setAppState("SERVICES");
                }}
                className="group p-8 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-[#001b94]"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span className="text-4xl">{l.flag}</span>
                <div>
                  <h3 className="text-lg font-medium text-[#0F294D] group-hover:text-[#001b94] transition-colors">{l.name}</h3>
                  <span className="text-[10px] font-medium text-[#64748B] tracking-widest uppercase">{l.code}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Back to Welcome Screen removed as per user request */}
        </div>
      </main>
    );
  }

  if (appState === "SERVICES") {
    return (
      <main className="h-screen max-h-screen bg-background flex flex-col relative overflow-hidden">
        {maintenanceMsg && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium py-3 px-6 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>{maintenanceMsg}</span>
          </div>
        )}

        <header className="bg-card border-b border-border z-20 py-5">
          <div className="max-w-[1200px] w-full mx-auto px-16 text-center flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-medium font-display text-[#1F2937] tracking-tight">
              Welcome to
            </h2>
            <h2 className="text-2xl sm:text-3xl font-medium font-display text-[#001b94] tracking-tight mt-0.5">
              e-Passport & Visa Hub
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-16 py-6 flex-1">
            <div
              className="grid grid-cols-3 gap-6"
            >
              {services.map((s) => (
                <ServiceCard 
                  key={s.title} 
                  {...s} 
                  onClick={() => {
                    if (s.title === "Visa Extension") {
                      setAppState("VISA_FLOW");
                      setVisaStep("PASSPORT");
                    } else if (s.title === "Passport Renewal") {
                      setAppState("PASSPORT_FLOW");
                      setPassportStep("SCAN_PASSPORT");
                    } else if (s.title === "Visa Application") {
                      setAppState("VISA_APPLICATION_FLOW");
                      setVisaAppStep("ELIGIBILITY");
                      setSuccessCountdown(15);
                    } else if (s.title === "Appointment Booking") {
                      setAppState("APPOINTMENT_FLOW");
                      setApptStep("SELECT_ACTION");
                      setSuccessCountdown(15);
                    } else {
                      showMaintenance(s.title);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="h-16 border-t border-border bg-card">
          <div className="h-full max-w-[1200px] mx-auto px-16 flex items-center justify-between text-xs font-medium">
            <button
              onClick={() => setAppState("LANGUAGE")}
              className="px-4 py-2 border border-border hover:border-slate-300 rounded-lg text-[#0F294D] transition-colors flex items-center gap-2 font-sans"
            >
              <Languages className="h-4 w-4 text-[#001b94]" /> Change Language
            </button>
            <button
              onClick={resetSession}
              className="px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium font-sans"
            >
              Cancel Session
            </button>
          </div>
        </footer>
      </main>
    );
  }

  if (appState === "VISA_FLOW") {
    const wizardSteps = [
      { id: "PASSPORT", label: "Scan Passport" },
      { id: "VERIFY_DETAILS", label: "Verify Details" },
      { id: "REASON", label: "Select Reason" },
      { id: "STAY_DETAILS", label: "Stay & Flight" },
      { id: "DOCUMENTS", label: "Documents" },
      { id: "SUMMARY", label: "Summary" },
      { id: "FEE_PAYMENT", label: "Calculation" }
    ];

    const currentStepIndex = wizardSteps.findIndex((s) => s.id === visaStep);
    const showStepsIndicator = ["PASSPORT", "VERIFY_DETAILS", "REASON", "STAY_DETAILS", "DOCUMENTS", "SUMMARY", "FEE_PAYMENT"].includes(visaStep);

    const renderPassportStep = () => (
      <div className="flex flex-col items-center py-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-xl font-medium text-[#0F294D] mb-2">Scan Passport</h3>
          <p className="text-xs text-[#64748B] mb-6">
            Please place your passport photo page face down on the flatbed scanner and tap Start Scan.
          </p>

          <div className="relative h-48 w-72 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6">
            {scanning ? (
              <>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-laser z-20" />
                <Loader2 className="h-8 w-8 text-[#001b94] animate-spin z-10" />
                <span className="text-xs font-medium text-[#001b94] mt-3 z-10">Scanning: {scanProgress}%</span>
              </>
            ) : (
              <>
                <Camera className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Passport Scanner Ready</span>
              </>
            )}
          </div>

          <button
            onClick={startPassportScan}
            disabled={scanning}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md"
          >
            {scanning ? "Scan in Progress..." : "Start Passport Scan"}
          </button>
        </div>
      </div>
    );

    const renderVerifyStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1">Verify Identity Details</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">
          Please review the scanned passport info. Make corrections if details were scanned incorrectly.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-border rounded-xl font-medium text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Passport Number</label>
            <input
              type="text"
              value={passportNum}
              onChange={(e) => setPassportNum(e.target.value)}
              className="w-full p-3 border border-border rounded-xl font-medium text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Nationality</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full p-3 border border-border rounded-xl font-medium text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Existing Visa Expiry</label>
            <input
              type="date"
              value={existingVisaExpiry}
              onChange={(e) => setExistingVisaExpiry(e.target.value)}
              className="w-full p-3 border border-border rounded-xl font-medium text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 mt-6 text-left">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-medium text-emerald-800">Biometrics Authenticated</h4>
            <p className="text-[10px] text-emerald-600 mt-0.5">Passport match and live facial matching completed successfully.</p>
          </div>
        </div>

        <button
          onClick={() => setVisaStep("REASON")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm shadow-md"
        >
          Confirm & Continue
        </button>
      </div>
    );

    const renderReasonStep = () => {
      const reasons = [
        { key: "Tourism", desc: "For tourism, sightseeing, and leisure stay", fee: 100, icon: Globe },
        { key: "Business", desc: "For attending conferences, meetings, or training", fee: 200, icon: BookMarked },
        { key: "Medical", desc: "For medical treatment and healthcare stays", fee: 120, icon: CalendarCheck },
        { key: "Emergency", desc: "For urgent travel extensions due to emergencies", fee: 80, icon: RefreshCw }
      ];

      return (
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-[#0F294D]">Select Extension Reason</h3>
            <p className="text-xs text-[#64748B] mt-1 font-sans">Select the main reason you are extending your stay in Malaysia.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {reasons.map((r) => {
              const IconComponent = r.icon;
              const isSelected = extensionReason === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleReasonSelection(r.key as any)}
                  className={`group py-5 px-6 bg-card border rounded-2xl flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected ? "border-[#001b94] ring-2 ring-[#001b94]/20" : "border-border hover:border-slate-300"
                  }`}
                  style={{ boxShadow: "var(--shadow-card)", height: 176 }}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#001b94] text-white" : "bg-[#EBF3FC] text-[#001b94] group-hover:bg-[#001b94] group-hover:text-white transition-colors"}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    {isSelected && <span className="h-5 w-5 rounded-full bg-[#001b94] text-white flex items-center justify-center"><Check className="h-3 w-3" strokeWidth={3} /></span>}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-[#0F294D]">{r.key}</h4>
                    <p className="text-[10px] text-[#64748B] mt-1 leading-normal line-clamp-2">{r.desc}</p>
                  </div>

                  <div className="mt-3 flex justify-between items-center w-full text-xs border-t border-slate-50 pt-2">
                    <span className="text-[10px] text-[#64748B] uppercase font-medium tracking-wider">Base Fee</span>
                    <span className="font-medium text-[#001b94]">${r.fee}.00</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    const renderStayStep = () => {
      const durations = [
        { days: "30", label: "30 Days Extension", fee: 0 },
        { days: "60", label: "60 Days Extension", fee: 50 },
        { days: "90", label: "90 Days Extension", fee: 100 }
      ];

      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-xl font-medium text-[#0F294D] mb-1">Departure Ticket & Stay Duration</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Provide details about your requested duration and return ticket.</p>

          <div className="space-y-5 text-left">
            {/* Duration Selector */}
            <div>
              <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Requested Stay Duration</label>
              <div className="grid grid-cols-3 gap-3">
                {durations.map((d) => (
                  <button
                    key={d.days}
                    onClick={() => setStayDuration(d.days)}
                    className={`p-4 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                      stayDuration === d.days ? "border-[#001b94] bg-[#EBF3FC]/30 font-medium animate-fade-in" : "border-border hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm font-medium text-[#0F294D]">{d.days} Days</span>
                    <span className="text-[9px] text-[#64748B] mt-1 uppercase font-medium tracking-wider">
                      {d.fee === 0 ? "No Surcharge" : `+$${d.fee}.00`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1.5">Departure Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-3 border border-border rounded-xl font-medium text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none pl-10"
                />
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Upload Flight Ticket */}
            <div>
              <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-1.5">Departure Ticket Upload</label>
              {uploadedTicket ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-medium text-emerald-800">flight_ticket_A9823.pdf</h4>
                      <p className="text-[9px] text-emerald-600 mt-0.5">File uploaded & verified</p>
                    </div>
                  </div>
                  <button onClick={() => setUploadedTicket(false)} className="text-[10px] text-rose-500 font-medium hover:underline">Remove</button>
                </div>
              ) : (
                <button
                  onClick={() => simulateUpload("ticket")}
                  disabled={uploadingTicket}
                  className="w-full p-6 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50 rounded-xl flex flex-col items-center justify-center transition-all disabled:opacity-50"
                >
                  {uploadingTicket ? (
                    <>
                      <Loader2 className="h-6 w-6 text-[#001b94] animate-spin" />
                      <span className="text-xs font-medium text-[#001b94] mt-2">Uploading & scanning ticket...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-600">Scan / Upload Return Ticket PDF</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Required for stay validation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setVisaStep("DOCUMENTS")}
            disabled={!uploadedTicket}
            className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md flex items-center justify-center gap-2"
          >
            Continue to Documents
          </button>
        </div>
      );
    };

    const renderDocsStep = () => {
      const isAllUploaded = uploadedItinerary && uploadedFunds && uploadedInsurance;
      
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-xl font-medium text-[#0F294D] mb-1">Upload Required Documents</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Upload the remaining documents required by the Immigration Authority.</p>

          <div className="space-y-4 text-left">
            {/* Document 1: Itinerary */}
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#001b94]" />
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">Travel Itinerary</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5">Detailed day-by-day travel details</p>
                </div>
              </div>
              {uploadedItinerary ? (
                <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              ) : (
                <button
                  onClick={() => simulateUpload("itinerary")}
                  disabled={uploadingItinerary}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {uploadingItinerary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                </button>
              )}
            </div>

            {/* Document 2: Funds */}
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#001b94]" />
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">Proof of Funds</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5">Recent bank statement / credit card summary</p>
                </div>
              </div>
              {uploadedFunds ? (
                <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              ) : (
                <button
                  onClick={() => simulateUpload("funds")}
                  disabled={uploadingFunds}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {uploadingFunds ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                </button>
              )}
            </div>

            {/* Document 3: Insurance */}
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#001b94]" />
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">Travel Insurance</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5">Medical coverage certificate for extension duration</p>
                </div>
              </div>
              {uploadedInsurance ? (
                <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              ) : (
                <button
                  onClick={() => simulateUpload("insurance")}
                  disabled={uploadingInsurance}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {uploadingInsurance ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setVisaStep("SUMMARY")}
            disabled={!isAllUploaded}
            className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md"
          >
            Review Application Summary
          </button>
        </div>
      );
    };

    const renderSummaryStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1">Application Summary</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Review all details before proceeding to fee calculation and payment.</p>

        <div className="space-y-4 border-t border-b border-slate-100 py-4 text-xs text-left">
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Full Name</span>
              <span className="font-medium text-[#0F294D]">{fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Passport Number</span>
              <span className="font-medium text-[#0F294D]">{passportNum}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Nationality</span>
              <span className="font-medium text-[#0F294D]">{nationality}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Extension Reason</span>
              <span className="font-medium text-[#0F294D]">{extensionReason}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Requested Stay</span>
              <span className="font-medium text-[#0F294D]">{stayDuration} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Departure Date</span>
              <span className="font-medium text-[#0F294D]">{departureDate}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block mb-2">Verified Documents</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Passport Scan</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Return Ticket</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Travel Itinerary</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Funds Proof</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Insurance Policy</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setVisaStep("FEE_PAYMENT")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm shadow-md"
        >
          Proceed to Fee Calculation
        </button>
      </div>
    );

    const renderFeePaymentStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1">Fee Calculation & Payment</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Confirm calculated terminal fees and select your payment method.</p>

        {/* Bill receipt */}
        <div className="bg-[#F2F5FA] rounded-xl p-5 border border-slate-200/50 space-y-3 mb-6 text-xs text-left">
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Visa Extension Fee ({extensionReason})</span>
            <span className="font-medium text-[#0F294D]">${reasonFee}.00</span>
          </div>
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Stay Duration Surcharge ({stayDuration} days)</span>
            <span className="font-medium text-[#0F294D]">${durationSurcharge}.00</span>
          </div>
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Overstay Fine</span>
            <span className="font-medium text-[#0F294D]">${overstayFine}.00</span>
          </div>
          <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-sm font-medium text-[#001b94]">
            <span>Total Fee due</span>
            <span className="text-lg font-medium">${totalFee}.00</span>
          </div>
        </div>

        {/* Overstay option */}
        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
          <input
            type="checkbox"
            id="overstay"
            checked={hasOverstay}
            onChange={(e) => setHasOverstay(e.target.checked)}
            className="h-4 w-4 border-slate-300 rounded text-[#001b94] focus:ring-[#001b94]"
          />
          <label htmlFor="overstay" className="text-xs font-medium text-amber-800 cursor-pointer">
            Visa is expired / Overstay check (adds $75.00 fine)
          </label>
        </div>

        {/* Payment methods */}
        <div className="text-left">
          <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-3">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handlePaymentMethodSelection("Card")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">Credit/Debit</span>
            </button>
            <button
              onClick={() => handlePaymentMethodSelection("UPI")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <QrCode className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">UPI / QR Pay</span>
            </button>
            <button
              onClick={() => handlePaymentMethodSelection("Cash")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <DollarSign className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">Cash Bill</span>
            </button>
          </div>
        </div>
      </div>
    );

    const renderPaymentProcessStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1">Payment Processing</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Please complete the transaction through the terminal</p>

        {paymentMethod === "UPI" && (
          <div className="flex flex-col items-center">
            <div className="h-44 w-44 rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center relative overflow-hidden mb-4 shadow-inner">
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center z-10 animate-pulse">
                <span className="bg-[#001b94] text-white text-[9px] font-medium px-2 py-0.5 rounded-full tracking-wider">SECURE QR CODE</span>
              </div>
              <div className="grid grid-cols-6 gap-2 w-full h-full opacity-60">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-5 rounded-sm ${
                      (idx * 7 + 13) % 5 === 0 || (idx * 3 + 2) % 7 === 0 ? "bg-[#0F172A]" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1">Scan to Pay: ${totalFee}.00</p>
            <p className="text-[10px] text-[#64748B] font-sans">Scan the QR using GPay, Paytm, or BHIM UPI app</p>
          </div>
        )}

        {paymentMethod === "Card" && (
          <div className="flex flex-col items-center py-6">
            <div className="h-20 w-32 rounded-xl bg-slate-100 border-2 border-slate-200 flex flex-col justify-between p-3 relative overflow-hidden mb-6 animate-pulse shadow-md">
              <div className="h-4 w-6 bg-[#FF6F00] rounded-sm animate-pulse" />
              <div className="h-2 w-full bg-slate-300 rounded-sm" />
              <div className="h-2 w-12 bg-[#001b94] rounded-sm" />
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1">Insert / Tap Credit Card</p>
            <p className="text-[10px] text-[#64748B] font-sans">Please follow instructions on the card reader terminal slot</p>
          </div>
        )}

        {paymentMethod === "Cash" && (
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-40 rounded-lg bg-[#EBF3FC] border border-[#001b94]/20 flex items-center justify-center gap-2 mb-6 animate-pulse shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-medium text-[#001b94] tracking-widest uppercase">Insert Bills Here</span>
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1">Insert Bill Notes (${totalFee}.00)</p>
            <p className="text-[10px] text-[#64748B] font-sans">Accepts cash notes: $5, $10, $20, $50, $100</p>
          </div>
        )}

        {/* Processing Indicator */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
          <div 
            className="bg-[#001b94] h-full transition-all duration-300"
            style={{ width: `${paymentProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#64748B] font-medium mt-2 inline-block animate-pulse font-sans">
          {paymentProgress < 100 ? "Awaiting authorization..." : "Payment Authorized!"}
        </span>
      </div>
    );

    const renderPrintingStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1">Printing Receipt</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Processing approval and printing your visa extension token</p>

        <div className="relative w-72 h-80 flex flex-col items-center justify-start mt-4">
          <div className="w-64 h-3 bg-slate-800 rounded-t-full z-20 shadow-md" />
          <div 
            className="w-56 bg-white border-l border-r border-b border-dashed border-slate-300 shadow-xl p-4 text-left font-mono text-[9px] text-slate-800 z-10 select-none transition-all duration-1000 origin-top overflow-hidden"
            style={{ 
              height: `${Math.max(40, printProgress * 2.54)}px`, 
              opacity: printProgress > 0 ? 1 : 0,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="text-center font-medium border-b border-dashed border-slate-200 pb-2 mb-2">
              <h4 className="font-medium uppercase text-[10px] text-[#001b94]">Visa Extension Receipt</h4>
              <p className="text-[8px] text-slate-400 mt-0.5">IMMIGRATION AUTHORITY OF MALAYSIA</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>RECEIPT NO:</span>
                <span className="font-medium">TXN-984812A</span>
              </div>
              <div className="flex justify-between">
                <span>PASSPORT:</span>
                <span className="font-medium">{passportNum}</span>
              </div>
              <div className="flex justify-between">
                <span>NAME:</span>
                <span className="font-medium truncate max-w-[80px]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>REASON:</span>
                <span className="font-medium">{extensionReason}</span>
              </div>
              <div className="flex justify-between">
                <span>NEW EXPIRY:</span>
                <span className="font-medium text-[#001b94]">{departureDate}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 mt-1.5">
                <span>TOTAL PAID:</span>
                <span className="font-medium text-[#FF6F00]">${totalFee}.00</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-dashed border-slate-200 text-center flex flex-col items-center gap-1 pb-3">
              <div className="h-6 w-full bg-slate-900 flex gap-[1px] p-0.5 justify-center">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={`h-full bg-white ${i % 3 === 0 ? "w-[1px]" : i % 5 === 0 ? "w-[3px]" : "w-[2px]"}`} />
                ))}
              </div>
              <span className="text-[7px] tracking-widest text-slate-400">TXN984812AMY</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
          <div 
            className="bg-[#FF6F00] h-full transition-all duration-300"
            style={{ width: `${printProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#64748B] font-medium mt-2 inline-block animate-pulse font-sans">
          {printProgress < 100 ? "Printing slip..." : "Printing Complete!"}
        </span>
      </div>
    );

    const renderSuccessStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-inner animate-bounce">
          <Check className="h-8 w-8" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-medium text-[#001b94]">Visa Extension Approved</h3>
        <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">
          Your visa extension has been registered in the system. Your new stay is valid until <strong className="text-[#0F294D]">{departureDate}</strong>.
        </p>


        <button
          onClick={resetSession}
          className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm shadow-md"
        >
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    return (
      <main className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border shadow-sm z-20">
          <div className="max-w-[1200px] w-full mx-auto px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EBF3FC] text-[#001b94] flex items-center justify-center">
                <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-medium text-[#001b94] tracking-tight uppercase">Visa Extension</h1>
                <p className="text-[9px] text-[#64748B] font-medium uppercase tracking-wider font-sans">Self-Service Process</p>
              </div>
            </div>
            
            <span className="text-[10px] font-medium text-[#001b94] bg-[#001b94]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step {currentStepIndex + 1} of {wizardSteps.length}
            </span>
          </div>

          {showStepsIndicator && (
            <div className="border-t border-slate-100 bg-slate-50/50 py-2.5">
              <div className="max-w-[1200px] w-full mx-auto px-16 flex items-center justify-between">
                {wizardSteps.map((step, idx) => {
                  const isActive = step.id === visaStep;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-2">
                        <span className={`h-6 w-6 rounded-full text-[10px] font-medium flex items-center justify-center border transition-all ${
                          isActive 
                            ? "bg-[#001b94] text-white border-[#001b94]" 
                            : isCompleted 
                              ? "bg-emerald-500 text-white border-emerald-500" 
                              : "bg-white text-slate-400 border-slate-200"
                        }`}>
                          {isCompleted ? <Check className="h-3 w-3" strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className={`text-[10px] font-medium hidden md:inline transition-colors ${
                          isActive ? "text-[#001b94]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < wizardSteps.length - 1 && (
                        <div className={`h-[2px] flex-1 mx-4 min-w-[20px] rounded-full transition-colors ${
                          idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-16 py-6 my-auto flex flex-col justify-center">
            {visaStep === "PASSPORT" && renderPassportStep()}
            {visaStep === "VERIFY_DETAILS" && renderVerifyStep()}
            {visaStep === "REASON" && renderReasonStep()}
            {visaStep === "STAY_DETAILS" && renderStayStep()}
            {visaStep === "DOCUMENTS" && renderDocsStep()}
            {visaStep === "SUMMARY" && renderSummaryStep()}
            {visaStep === "FEE_PAYMENT" && renderFeePaymentStep()}
            {visaStep === "PAYMENT_PROCESS" && renderPaymentProcessStep()}
            {visaStep === "PRINTING" && renderPrintingStep()}
            {visaStep === "SUCCESS" && renderSuccessStep()}
          </div>
        </div>

        {showStepsIndicator && (
          <footer className="h-16 border-t border-border bg-card">
            <div className="h-full max-w-[1200px] mx-auto px-16 flex items-center justify-between text-xs font-medium">
              <button
                onClick={() => {
                  if (visaStep === "PASSPORT") {
                    setAppState("SERVICES");
                  } else if (visaStep === "VERIFY_DETAILS") {
                    setVisaStep("PASSPORT");
                  } else if (visaStep === "REASON") {
                    setVisaStep("VERIFY_DETAILS");
                  } else if (visaStep === "STAY_DETAILS") {
                    setVisaStep("REASON");
                  } else if (visaStep === "DOCUMENTS") {
                    setVisaStep("STAY_DETAILS");
                  } else if (visaStep === "SUMMARY") {
                    setVisaStep("DOCUMENTS");
                  } else if (visaStep === "FEE_PAYMENT") {
                    setVisaStep("SUMMARY");
                  }
                }}
                className="px-4 py-2 border border-border hover:border-slate-300 rounded-lg text-[#0F294D] transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              
              <button
                onClick={resetSession}
                className="px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
              >
                Cancel Session
              </button>
            </div>
          </footer>
        )}
      </main>
    );
  }

  if (appState === "PASSPORT_FLOW") {
    const passportWizardSteps = [
      { id: "SCAN_PASSPORT", label: "Scan Passport" },
      { id: "CONFIRM_DETAILS", label: "Confirm Details" },
      { id: "UPLOAD_DOCUMENTS", label: "Documents" },
      { id: "PHOTO_CAPTURE", label: "Photo Capture" },
      { id: "BIOMETRICS", label: "Biometrics" },
      { id: "REVIEW_APPLICATION", label: "Review" },
      { id: "FEE_CALCULATION", label: "Fee Calculation" }
    ];

    const currentStepIndex = passportWizardSteps.findIndex((s) => s.id === passportStep);
    const showStepsIndicator = ["SCAN_PASSPORT", "CONFIRM_DETAILS", "UPLOAD_DOCUMENTS", "PHOTO_CAPTURE", "BIOMETRICS", "REVIEW_APPLICATION", "FEE_CALCULATION"].includes(passportStep);

    const renderPassportScanStep = () => (
      <div className="flex flex-col items-center py-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Scan Existing Passport</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">
            Please place your current passport photo page face down on the flatbed scanner and tap Start Scan.
          </p>

          <div className="relative h-48 w-72 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6">
            {scanning ? (
              <>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-laser z-20" />
                <Loader2 className="h-8 w-8 text-[#001b94] animate-spin z-10" />
                <span className="text-xs font-medium text-[#001b94] mt-3 z-10 font-sans">Scanning: {scanProgress}%</span>
              </>
            ) : (
              <>
                <Scan className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest font-sans">Passport Scanner Ready</span>
              </>
            )}
          </div>

          <button
            onClick={startPassportScan}
            disabled={scanning}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md font-sans"
          >
            {scanning ? "Scan in Progress..." : "Start Passport Scan"}
          </button>
        </div>
      </div>
    );

    const renderIdentityVerificationStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Identity Verification</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans text-center">
          Look directly into the kiosk camera. We will cross-reference your live features with your scanned passport details.
        </p>

        <div className="relative h-48 w-48 rounded-full border-4 border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {verifyingFace ? (
            <>
              <div className="absolute inset-0 bg-[#001b94]/5 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#001b94] shadow-[0_0_12px_#001b94] animate-scan-laser z-20" />
              <User className="h-20 w-20 text-[#001b94]/30 animate-pulse" />
              <span className="absolute bottom-4 bg-[#001b94] text-white text-[9px] font-medium px-2 py-0.5 rounded-full font-mono z-30">MATCHING: {verifyFaceProgress}%</span>
            </>
          ) : (
            <>
              <User className="h-20 w-20 text-slate-400" />
              <span className="absolute bottom-4 bg-slate-200 text-slate-600 text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Camera Standby</span>
            </>
          )}
        </div>

        <button
          onClick={startFacialVerification}
          disabled={verifyingFace}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md font-sans"
        >
          {verifyingFace ? "Analyzing facial biometrics..." : "Verify Identity"}
        </button>
      </div>
    );

    const renderConfirmDetailsStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Confirm Details</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">
          Verify and update your address, contact information, and select a passport delivery method.
        </p>

        <div className="space-y-4 text-left font-sans">
          {/* Address info */}
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-xs font-medium text-[#0F294D] mb-2 uppercase tracking-wide">Registered Address</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Postcode</label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">State</label>
                  <input
                    type="text"
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-xs font-medium text-[#0F294D] mb-2 uppercase tracking-wide">Contact Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Option */}
          <div>
            <h4 className="text-xs font-medium text-[#0F294D] mb-2 uppercase tracking-wide">Passport Delivery Option</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryOption("Pickup")}
                className={`p-3 border rounded-xl flex flex-col justify-between text-left transition-all ${
                  deliveryOption === "Pickup" ? "border-[#001b94] bg-[#EBF3FC]/20" : "border-border hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-medium text-[#0F294D]">Kiosk Pickup</span>
                  {deliveryOption === "Pickup" && <span className="h-4 w-4 rounded-full bg-[#001b94] text-white flex items-center justify-center"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>}
                </div>
                <p className="text-[9px] text-[#64748B] mt-1 font-sans">Collect at this counter in 3 Hours. Fee: Free.</p>
              </button>
              <button
                onClick={() => setDeliveryOption("Delivery")}
                className={`p-3 border rounded-xl flex flex-col justify-between text-left transition-all ${
                  deliveryOption === "Delivery" ? "border-[#001b94] bg-[#EBF3FC]/20" : "border-border hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-medium text-[#0F294D]">Home Courier</span>
                  {deliveryOption === "Delivery" && <span className="h-4 w-4 rounded-full bg-[#001b94] text-white flex items-center justify-center"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>}
                </div>
                <p className="text-[9px] text-[#64748B] mt-1 font-sans">Courier to your address in 3-5 days. Fee: +$15.00.</p>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPassportStep("UPLOAD_DOCUMENTS")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm shadow-md font-sans"
        >
          Confirm Details & Continue
        </button>
      </div>
    );

    const renderUploadDocsStep = () => {
      const isAllUploaded = uploadedOldPassport && uploadedIdCard;
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Upload Supporting Documents</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Scan or attach the required passport renewal documents.</p>

          <div className="space-y-4 text-left font-sans">
            {/* WhatsApp upload option card inspired by attached mockup */}
            <div className="border border-border bg-white rounded-xl py-3 px-4 flex items-center gap-4 text-left">
              {/* Left side: White QR Code card wrapper containing the SVG QR code (no WhatsApp badge on QR) */}
              <div className="relative w-16 h-16 bg-white border border-border rounded-none p-1.5 flex items-center justify-center shrink-0">
                <img src={qrCodeIcon} className="w-full h-full object-contain" alt="QR Code" />
              </div>

              {/* Right side: text details and green action pill vertically stacked */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-[#075e54]">Send via WhatsApp</h4>
                  <span className="bg-[#e1f5eb] text-[#075e54] text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-sans line-clamp-1">
                  Scan QR or tap the button to simulate instant mobile connection.
                </p>
                
                <div className="mt-1.5">
                  <div className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-1.5 rounded-full text-[10px] font-medium select-none whitespace-nowrap">
                    {/* Official WhatsApp Logo SVG */}
                    <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>+1 408 872 8367</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Old Passport Scan */}
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#001b94]" />
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">Old Passport Page Scan</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5">Copy of bio-data and signature pages</p>
                </div>
              </div>
              {uploadedOldPassport ? (
                <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              ) : (
                <button
                  onClick={() => simulateUpload("oldpassport")}
                  disabled={uploadingOldPassport}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 font-sans"
                >
                  {uploadingOldPassport ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Scan / Upload"}
                </button>
              )}
            </div>

            {/* National ID Scan */}
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#001b94]" />
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">Identity Card (MyKad / Front & Back)</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5">Scanned copy of national identity card</p>
                </div>
              </div>
              {uploadedIdCard ? (
                <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              ) : (
                <button
                  onClick={() => simulateUpload("idcard")}
                  disabled={uploadingIdCard}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 font-sans"
                >
                  {uploadingIdCard ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Scan / Upload"}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setPassportStep("PHOTO_CAPTURE")}
            disabled={!isAllUploaded}
            className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md font-sans"
          >
            Continue to Photo Capture
          </button>
        </div>
      );
    };

    const renderPhotoCaptureStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center relative" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Shutter flash overlay effect */}
        {flashActive && <div className="absolute inset-0 bg-white z-50 animate-flash rounded-2xl" />}

        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Biometric Photo Capture</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Align your head within the frame. Remove eyeglasses or hats before capturing.</p>

        {/* Mock camera view finder */}
        <div className="relative h-56 w-56 rounded-full border-4 border-slate-300 bg-slate-900 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {capturingPhoto ? (
            <>
              {/* Vibe: blinking countdown text */}
              <span className="text-7xl font-medium text-white tracking-widest animate-pulse font-display">
                {photoCountdown}
              </span>
              <span className="absolute bottom-4 bg-[#FF6F00] text-white text-[9px] font-medium px-2 py-0.5 rounded-full font-sans tracking-wide">HOLD STILL</span>
            </>
          ) : photoCaptured ? (
            <>
              {/* Stylized captured profile vector profile image */}
              <div className="h-full w-full bg-[#EBF3FC] flex flex-col items-center justify-center relative">
                <User className="h-32 w-32 text-[#001b94]/70 mt-6" />
                <span className="absolute bottom-4 bg-emerald-500 text-white text-[9px] font-medium px-2.5 py-0.5 rounded-full font-sans tracking-wide shadow-sm">PHOTO CONFIRMED</span>
              </div>
            </>
          ) : (
            <>
              <div className="absolute border border-dashed border-white/30 h-[80%] w-[70%] rounded-full z-10 flex flex-col items-center justify-center">
                <span className="text-[7px] text-white/50 tracking-widest uppercase font-medium mt-16 font-sans">Center Face Here</span>
              </div>
              <Camera className="h-10 w-10 text-white/40" />
            </>
          )}
        </div>

        {!photoCaptured ? (
          <button
            onClick={startPhotoCapture}
            disabled={capturingPhoto}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md font-sans"
          >
            {capturingPhoto ? `Capturing in ${photoCountdown}s...` : "Capture Passport Photo"}
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setPhotoCaptured(false)}
              className="w-1/2 py-3 border border-border hover:border-slate-300 text-[#0F294D] font-medium rounded-xl transition-all text-sm font-sans"
            >
              Retake Photo
            </button>
            <button
              onClick={() => setPassportStep("BIOMETRICS")}
              className="w-1/2 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-all text-sm shadow-md font-sans"
            >
              Verify & Continue
            </button>
          </div>
        )}
      </div>
    );

    const renderBiometricsStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Biometric Fingerprint Scan</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">
          Place your right thumb firmly on the glowing green biometric scanner slot.
        </p>

        <div className="relative h-48 w-48 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {scanningBiometrics ? (
            <>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-laser z-20" />
              <Fingerprint className="h-24 w-24 text-green-500/80 animate-pulse" />
              <span className="text-[10px] font-medium text-[#001b94] mt-3 z-10 font-sans">SCANNING BIOMETRIC: {biometricsProgress}%</span>
            </>
          ) : (
            <>
              <Fingerprint className="h-24 w-24 text-slate-300" />
              <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-2 font-sans">Scanner Ready</span>
            </>
          )}
        </div>

        <button
          onClick={startBiometricsScan}
          disabled={scanningBiometrics}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm shadow-md font-sans"
        >
          {scanningBiometrics ? "Reading fingerprint sensor..." : "Scan Biometric Thumbprint"}
        </button>
      </div>
    );

    const renderPassportReviewStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Review Passport Application</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Verify your details before proceeding to fee calculation and terminal submission.</p>

        <div className="space-y-4 border-t border-b border-slate-100 py-4 text-xs text-left font-sans">
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Full Name</span>
              <span className="font-medium text-[#0F294D]">{fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Passport Number</span>
              <span className="font-medium text-[#0F294D]">{passportNum}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Courier / Pickup Address</span>
              <span className="font-medium text-[#0F294D]">{street}, {city}, {postcode}, {addressState}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Mobile Number</span>
              <span className="font-medium text-[#0F294D]">{phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Delivery Option</span>
              <span className="font-medium text-[#0F294D]">{deliveryOption === "Pickup" ? "Counter pickup (Free)" : "Express Home Delivery"}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block mb-2">Authenticated Verification checklist</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Supporting Scans</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Photo Captured</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" /> Fingerprint Match</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPassportStep("FEE_CALCULATION")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm shadow-md font-sans"
        >
          Proceed to Fee Calculation
        </button>
      </div>
    );

    const renderPassportFeeStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Fee Calculation & Payment</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Confirm calculated passport renewal fees and select your payment method.</p>

        {/* Bill receipt */}
        <div className="bg-[#F2F5FA] rounded-xl p-5 border border-slate-200/50 space-y-3 mb-6 text-xs text-left font-sans">
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Passport Renewal Application Fee</span>
            <span className="font-medium text-[#0F294D]">$80.00</span>
          </div>
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Delivery Courier Option ({deliveryOption})</span>
            <span className="font-medium text-[#0F294D]">${deliveryFee}.00</span>
          </div>
          <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-sm font-medium text-[#001b94]">
            <span>Total Fee due</span>
            <span className="text-lg font-medium">${totalPassportFee}.00</span>
          </div>
        </div>

        {/* Payment methods */}
        <div className="text-left font-sans">
          <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-3">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handlePaymentMethodSelection("Card")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">Credit/Debit</span>
            </button>
            <button
              onClick={() => handlePaymentMethodSelection("UPI")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <QrCode className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">UPI / QR Pay</span>
            </button>
            <button
              onClick={() => handlePaymentMethodSelection("Cash")}
              className="p-4 border border-border hover:border-[#001b94] hover:bg-[#EBF3FC]/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <DollarSign className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">Cash Bill</span>
            </button>
          </div>
        </div>
      </div>
    );

    const renderPassportPaymentProcessStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Payment Processing</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Please complete the transaction through the terminal</p>

        {paymentMethod === "UPI" && (
          <div className="flex flex-col items-center">
            {/* Mock QR Code Container */}
            <div className="h-44 w-44 rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center relative overflow-hidden mb-4 shadow-inner">
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center z-10 animate-pulse">
                <span className="bg-[#001b94] text-white text-[9px] font-medium px-2 py-0.5 rounded-full tracking-wider font-sans">SECURE QR CODE</span>
              </div>
              <div className="grid grid-cols-6 gap-2 w-full h-full opacity-60">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-5 rounded-sm ${
                      (idx * 7 + 13) % 5 === 0 || (idx * 3 + 2) % 7 === 0 ? "bg-[#0F172A]" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1 font-sans">Scan to Pay: ${totalPassportFee}.00</p>
            <p className="text-[10px] text-[#64748B] font-sans">Scan the QR using GPay, Paytm, or BHIM UPI app</p>
          </div>
        )}

        {paymentMethod === "Card" && (
          <div className="flex flex-col items-center py-6">
            <div className="h-20 w-32 rounded-xl bg-slate-100 border-2 border-slate-200 flex flex-col justify-between p-3 relative overflow-hidden mb-6 animate-pulse shadow-md">
              <div className="h-4 w-6 bg-[#FF6F00] rounded-sm animate-pulse" />
              <div className="h-2 w-full bg-slate-300 rounded-sm" />
              <div className="h-2 w-12 bg-[#001b94] rounded-sm" />
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1 font-sans">Insert / Tap Credit Card</p>
            <p className="text-[10px] text-[#64748B] font-sans">Please follow instructions on the card reader terminal slot</p>
          </div>
        )}

        {paymentMethod === "Cash" && (
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-40 rounded-lg bg-[#EBF3FC] border border-[#001b94]/20 flex items-center justify-center gap-2 mb-6 animate-pulse shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-medium text-[#001b94] tracking-widest uppercase">Insert Bills Here</span>
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1 font-sans">Insert Bill Notes (${totalPassportFee}.00)</p>
            <p className="text-[10px] text-[#64748B] font-sans">Accepts cash notes: $5, $10, $20, $50, $100</p>
          </div>
        )}

        {/* Processing Indicator */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
          <div 
            className="bg-[#001b94] h-full transition-all duration-300"
            style={{ width: `${paymentProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#64748B] font-medium mt-2 inline-block animate-pulse font-sans">
          {paymentProgress < 100 ? "Awaiting authorization..." : "Payment Authorized!"}
        </span>
      </div>
    );

    const handleStartSubmission = () => {
      setSubmittingApp(true);
      setSubmitProgress(0);
      const interval = setInterval(() => {
        setSubmitProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPassportStep("PRINTING");
            }, 600);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    };

    const renderPassportSubmitApplicationStep = () => {
      return (
        <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center animate-fade-in" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001b94] mb-6 shadow-inner animate-pulse">
            <FileCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-normal text-[#0F294D] mb-1 font-display">Submit Application</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans text-center">
            Your payment was successful. Click below to securely submit your passport renewal application to the immigration authority.
          </p>

          {submittingApp ? (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs font-medium text-[#0F294D] font-sans">
                <span>Syncing biometric details...</span>
                <span>{submitProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#001b94] h-full transition-all duration-100"
                  style={{ width: `${submitProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans italic animate-pulse">
                Do not close the screen or eject cards
              </p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="bg-[#F2F5FA] rounded-xl p-4 border border-slate-200/50 space-y-2 text-left text-xs font-sans">
                <div className="flex justify-between text-slate-600">
                  <span>Receipt Ref:</span>
                  <span className="font-medium text-[#0F294D]">PAY-REC-982</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Charged:</span>
                  <span className="font-medium text-emerald-600">${totalPassportFee}.00 (Paid)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Mode:</span>
                  <span className="font-medium text-[#0F294D]">{deliveryOption}</span>
                </div>
              </div>

              <button
                onClick={handleStartSubmission}
                className="w-full py-3.5 bg-[#FF6F00] hover:bg-[#E05E00] text-white font-medium rounded-xl transition-all text-sm shadow-md font-sans flex items-center justify-center gap-2 animate-bounce"
              >
                Submit Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      );
    };

    const renderPassportPrintingStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Printing Receipt</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Processing submission and printing your passport application token</p>

        <div className="relative w-72 h-80 flex flex-col items-center justify-start mt-4">
          <div className="w-64 h-3 bg-slate-800 rounded-t-full z-20 shadow-md" />
          <div 
            className="w-56 bg-white border-l border-r border-b border-dashed border-slate-300 shadow-xl p-4 text-left font-mono text-[9px] text-slate-800 z-10 select-none transition-all duration-1000 origin-top overflow-hidden"
            style={{ 
              height: `${Math.max(40, printProgress * 2.54)}px`, 
              opacity: printProgress > 0 ? 1 : 0,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="text-center font-medium border-b border-dashed border-slate-200 pb-2 mb-2">
              <h4 className="font-medium uppercase text-[10px] text-[#001b94]">Passport Renewal Slip</h4>
              <p className="text-[8px] text-slate-400 mt-0.5">IMMIGRATION AUTHORITY OF MALAYSIA</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>APPLICATION ID:</span>
                <span className="font-medium text-[#001b94]">PR-92841-A</span>
              </div>
              <div className="flex justify-between">
                <span>PASSPORT NO:</span>
                <span className="font-medium">{passportNum}</span>
              </div>
              <div className="flex justify-between">
                <span>APPLICANT:</span>
                <span className="font-medium truncate max-w-[80px]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>TIMELINE:</span>
                <span className="font-medium">{deliveryOption === "Pickup" ? "Ready in 3 Hours" : "Courier in 3-5 Days"}</span>
              </div>
              <div className="flex justify-between">
                <span>METHOD:</span>
                <span className="font-medium">{deliveryOption === "Pickup" ? "Kiosk Counter" : "Home Courier"}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 mt-1.5">
                <span>TOTAL PAID:</span>
                <span className="font-medium text-[#FF6F00]">${totalPassportFee}.00</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-dashed border-slate-200 text-center flex flex-col items-center gap-1 pb-3">
              <div className="h-6 w-full bg-slate-900 flex gap-[1px] p-0.5 justify-center">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={`h-full bg-white ${i % 3 === 0 ? "w-[1px]" : i % 5 === 0 ? "w-[3px]" : "w-[2px]"}`} />
                ))}
              </div>
              <span className="text-[7px] tracking-widest text-slate-400">PR92841AMYKISK</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
          <div 
            className="bg-[#FF6F00] h-full transition-all duration-300"
            style={{ width: `${printProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#64748B] font-medium mt-2 inline-block animate-pulse font-sans">
          {printProgress < 100 ? "Printing slip..." : "Printing Complete!"}
        </span>
      </div>
    );

    const renderPassportSuccessStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-inner animate-bounce">
          <Check className="h-8 w-8" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-medium text-[#001b94] font-display">Renewal Request Submitted</h3>
        <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">
          Your passport renewal has been processed. Your tracking reference is <strong className="text-[#0F294D]">PR-92841-A</strong>.
        </p>

        <button
          onClick={resetSession}
          className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm shadow-md font-sans"
        >
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    return (
      <main className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border shadow-sm z-20">
          <div className="max-w-[1200px] w-full mx-auto px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EBF3FC] text-[#001b94] flex items-center justify-center">
                <BookMarked className="h-4.5 w-4.5" />
              </div>
              <div className="text-left font-sans">
                <h1 className="text-sm font-medium text-[#001b94] tracking-tight uppercase">Passport Renewal</h1>
                <p className="text-[9px] text-[#64748B] font-medium uppercase tracking-wider">Self-Service Process</p>
              </div>
            </div>
            
            <span className="text-[10px] font-medium text-[#001b94] bg-[#001b94]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
              Step {currentStepIndex + 1} of {passportWizardSteps.length}
            </span>
          </div>

          {showStepsIndicator && (
            <div className="border-t border-slate-100 bg-slate-50/50 py-2.5">
              <div className="max-w-[1200px] w-full mx-auto px-16 flex items-center justify-between">
                {passportWizardSteps.map((step, idx) => {
                  const isActive = step.id === passportStep;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-2">
                        <span className={`h-6 w-6 rounded-full text-[10px] font-medium flex items-center justify-center border transition-all ${
                          isActive 
                            ? "bg-[#001b94] text-white border-[#001b94]" 
                            : isCompleted 
                              ? "bg-emerald-500 text-white border-emerald-500" 
                              : "bg-white text-slate-400 border-slate-200"
                        }`}>
                          {isCompleted ? <Check className="h-3 w-3" strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className={`text-[10px] font-medium hidden md:inline transition-colors font-sans ${
                          isActive ? "text-[#001b94]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < passportWizardSteps.length - 1 && (
                        <div className={`h-[2px] flex-1 mx-4 min-w-[20px] rounded-full transition-colors ${
                          idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-16 py-6 my-auto flex flex-col justify-center">
            {passportStep === "SCAN_PASSPORT" && renderPassportScanStep()}
            {passportStep === "CONFIRM_DETAILS" && renderConfirmDetailsStep()}
            {passportStep === "UPLOAD_DOCUMENTS" && renderUploadDocsStep()}
            {passportStep === "PHOTO_CAPTURE" && renderPhotoCaptureStep()}
            {passportStep === "BIOMETRICS" && renderBiometricsStep()}
            {passportStep === "REVIEW_APPLICATION" && renderPassportReviewStep()}
            {passportStep === "FEE_CALCULATION" && renderPassportFeeStep()}
            {passportStep === "PAYMENT_PROCESS" && renderPassportPaymentProcessStep()}
            {passportStep === "SUBMIT_APPLICATION" && renderPassportSubmitApplicationStep()}
            {passportStep === "PRINTING" && renderPassportPrintingStep()}
            {passportStep === "SUCCESS" && renderPassportSuccessStep()}
          </div>
        </div>

        {showStepsIndicator && (
          <footer className="h-16 border-t border-border bg-card">
            <div className="h-full max-w-[1200px] mx-auto px-16 flex items-center justify-between text-xs font-medium">
              <button
                onClick={() => {
                  if (passportStep === "SCAN_PASSPORT") {
                    setAppState("SERVICES");
                  } else if (passportStep === "CONFIRM_DETAILS") {
                    setPassportStep("SCAN_PASSPORT");
                  } else if (passportStep === "UPLOAD_DOCUMENTS") {
                    setPassportStep("CONFIRM_DETAILS");
                  } else if (passportStep === "PHOTO_CAPTURE") {
                    setPassportStep("UPLOAD_DOCUMENTS");
                  } else if (passportStep === "BIOMETRICS") {
                    setPassportStep("PHOTO_CAPTURE");
                  } else if (passportStep === "REVIEW_APPLICATION") {
                    setPassportStep("BIOMETRICS");
                  } else if (passportStep === "FEE_CALCULATION") {
                    setPassportStep("REVIEW_APPLICATION");
                  }
                }}
                className="px-4 py-2 border border-border hover:border-slate-300 rounded-lg text-[#0F294D] transition-colors flex items-center gap-2 font-sans"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              
              <button
                onClick={resetSession}
                className="px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium font-sans"
              >
                Cancel Session
              </button>
            </div>
          </footer>
        )}
      </main>
    );
  }

  // ─── Visa Application upload helper ────────────────────────────────────────
  const simulateVisaAppUpload = (type: "passportcopy" | "itinerary" | "financial" | "sponsor" | "insurance") => {
    const map: Record<string, [React.Dispatch<React.SetStateAction<boolean>>, React.Dispatch<React.SetStateAction<boolean>>]> = {
      passportcopy: [setVisaAppUploadingPassportCopy, setVisaAppUploadedPassportCopy],
      itinerary:    [setVisaAppUploadingItinerary,    setVisaAppUploadedItinerary],
      financial:    [setVisaAppUploadingFinancial,    setVisaAppUploadedFinancial],
      sponsor:      [setVisaAppUploadingSponsor,      setVisaAppUploadedSponsor],
      insurance:    [setVisaAppUploadingInsurance,    setVisaAppUploadedInsurance],
    };
    const [setUploading, setUploaded] = map[type];
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 1000);
  };

  // ─── VISA APPLICATION FLOW ──────────────────────────────────────────────────
  if (appState === "VISA_APPLICATION_FLOW") {
    const visaAppWizardSteps = [
      { id: "ELIGIBILITY",      label: "Eligibility"  },
      { id: "VISA_TYPE",        label: "Visa Type"    },
      { id: "SCAN_PASSPORT",    label: "Scan Passport"},
      { id: "VERIFY_IDENTITY",  label: "Verify"       },
      { id: "TRAVEL_DETAILS",   label: "Travel"       },
      { id: "UPLOAD_DOCUMENTS", label: "Documents"    },
      { id: "PHOTO_CAPTURE",    label: "Photo"        },
      { id: "BIOMETRICS",       label: "Biometrics"   },
      { id: "REVIEW_CONFIRM",   label: "Review"       },
      { id: "FEE_CALCULATION",  label: "Fee & Pay"    },
    ];
    const currentStepIndex = visaAppWizardSteps.findIndex((s) => s.id === visaAppStep);
    const showStepsIndicator = visaAppWizardSteps.some((s) => s.id === visaAppStep);
    const visaFee = visaAppType === "Tourist" ? 150 : visaAppType === "Business" ? 300 : visaAppType === "Medical" ? 200 : visaAppType === "Transit" ? 50 : 250;

    // Step 1: Eligibility Check
    const renderEligibilityStep = () => {
      const purposes = [
        { key: "Tourism", icon: Globe },
        { key: "Business", icon: BookMarked },
        { key: "Medical", icon: CalendarCheck },
        { key: "Transit", icon: RefreshCw },
        { key: "Study", icon: FilePlus2 },
      ];
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Eligibility Check</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Confirm your nationality, purpose of visit, and intended stay duration.</p>
          <div className="space-y-5 text-left">
            <div>
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1.5">Nationality</label>
              <input type="text" value={visaAppNationality} onChange={(e) => setVisaAppNationality(e.target.value)}
                className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none" />
            </div>
            <div>
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Purpose of Visit</label>
              <div className="grid grid-cols-5 gap-2">
                {purposes.map((p) => {
                  const IconComp = p.icon;
                  const isSelected = visaAppPurpose === p.key;
                  return (
                    <button key={p.key} onClick={() => setVisaAppPurpose(p.key as any)}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all ${isSelected ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                      <IconComp className={`h-4 w-4 ${isSelected ? "text-[#001b94]" : "text-slate-400"}`} />
                      <span className={`text-[9px] font-medium ${isSelected ? "text-[#001b94]" : "text-[#64748B]"}`}>{p.key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Intended Stay Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {["30", "60", "90"].map((d) => (
                  <button key={d} onClick={() => setVisaAppStayDuration(d)}
                    className={`p-3 border rounded-xl text-center transition-all ${visaAppStayDuration === d ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                    <span className={`text-sm font-medium ${visaAppStayDuration === d ? "text-[#001b94]" : "text-[#0F294D]"}`}>{d} Days</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setVisaAppStep("VISA_TYPE")} disabled={!visaAppPurpose}
            className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            Check Eligibility & Continue
          </button>
        </div>
      );
    };

    // Step 2: Select Visa Type
    const renderVisaTypeStep = () => {
      const types = [
        { key: "Tourist",  desc: "Short-term leisure and sightseeing",               fee: 150, icon: Globe       },
        { key: "Business", desc: "Meetings, conferences and trade visits",            fee: 300, icon: BookMarked  },
        { key: "Medical",  desc: "Medical treatment and healthcare stays",            fee: 200, icon: CalendarCheck},
        { key: "Transit",  desc: "Connecting through Malaysia to another destination",fee: 50,  icon: RefreshCw   },
        { key: "Study",    desc: "Enrolled in an approved educational institution",   fee: 250, icon: FilePlus2   },
      ];
      return (
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-[#0F294D]">Select Visa Type</h3>
            <p className="text-xs text-[#64748B] mt-1 font-sans">Choose the visa category that best matches your purpose of visit.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {types.map((t) => {
              const IconComp = t.icon;
              const isSelected = visaAppType === t.key;
              return (
                <button key={t.key} onClick={() => { setVisaAppType(t.key as any); setVisaAppStep("SCAN_PASSPORT"); }}
                  className={`group py-5 px-6 bg-card border rounded-2xl flex flex-col justify-between text-left transition-all duration-300 ${isSelected ? "border-[#001b94] ring-2 ring-[#001b94]/20" : "border-border hover:border-[#001b94]"}`}
                  style={{ height: 160 }}>
                  <div className="flex items-start justify-between w-full">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#001b94] text-white" : "bg-[#EBF3FC] text-[#001b94] group-hover:bg-[#001b94] group-hover:text-white transition-colors"}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    {isSelected && <span className="h-5 w-5 rounded-full bg-[#001b94] text-white flex items-center justify-center"><Check className="h-3 w-3" strokeWidth={3} /></span>}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-[#0F294D]">{t.key} Visa</h4>
                    <p className="text-[10px] text-[#64748B] mt-1 leading-normal">{t.desc}</p>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                    <span className="text-[9px] text-[#64748B] uppercase font-medium tracking-wider">Application Fee</span>
                    <span className="font-medium text-[#001b94]">${t.fee}.00</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    // Step 3: Scan Passport
    const renderVisaAppScanStep = () => (
      <div className="flex flex-col items-center py-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
          <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Scan Passport</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Place your passport photo page face down on the flatbed scanner.</p>
          <div className="relative h-48 w-72 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6">
            {scanning ? (
              <>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-laser z-20" />
                <Loader2 className="h-8 w-8 text-[#001b94] animate-spin z-10" />
                <span className="text-xs font-medium text-[#001b94] mt-3 z-10 font-sans">Scanning: {scanProgress}%</span>
              </>
            ) : (
              <>
                <Scan className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest font-sans">Passport Scanner Ready</span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setScanning(true); setScanProgress(0);
              const iv = setInterval(() => setScanProgress((p) => { if (p >= 100) { clearInterval(iv); setTimeout(() => { setScanning(false); setVisaAppStep("VERIFY_IDENTITY"); }, 600); return 100; } return p + 10; }), 150);
            }}
            disabled={scanning}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            {scanning ? "Scan in Progress..." : "Start Passport Scan"}
          </button>
        </div>
      </div>
    );

    // Step 4: Verify Identity
    const renderVisaAppVerifyStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Verify Identity</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Look directly into the camera. Live facial matching with your passport data.</p>
        <div className="relative h-48 w-48 rounded-full border-4 border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {verifyingFace ? (
            <>
              <div className="absolute inset-0 bg-[#001b94]/5 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#001b94] shadow-[0_0_12px_#001b94] animate-scan-laser z-20" />
              <User className="h-20 w-20 text-[#001b94]/30 animate-pulse" />
              <span className="absolute bottom-4 bg-[#001b94] text-white text-[9px] font-medium px-2 py-0.5 rounded-full font-mono z-30">MATCHING: {verifyFaceProgress}%</span>
            </>
          ) : (
            <>
              <User className="h-20 w-20 text-slate-400" />
              <span className="absolute bottom-4 bg-slate-200 text-slate-600 text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Camera Standby</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            setVerifyingFace(true); setVerifyFaceProgress(0);
            const iv = setInterval(() => setVerifyFaceProgress((p) => { if (p >= 100) { clearInterval(iv); setTimeout(() => { setVerifyingFace(false); setVisaAppStep("TRAVEL_DETAILS"); }, 800); return 100; } return p + 10; }), 150);
          }}
          disabled={verifyingFace}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
          {verifyingFace ? "Analyzing facial biometrics..." : "Verify Identity"}
        </button>
      </div>
    );

    // Step 5: Travel Details
    const renderTravelDetailsStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Travel Details</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Provide intended travel dates and accommodation or host details.</p>
        <div className="space-y-4 text-left font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Entry Date</label>
              <div className="relative">
                <input type="date" value={visaAppEntryDate} onChange={(e) => setVisaAppEntryDate(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none pl-9" />
                <Calendar className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Exit Date</label>
              <div className="relative">
                <input type="date" value={visaAppExitDate} onChange={(e) => setVisaAppExitDate(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none pl-9" />
                <Calendar className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Accommodation / Host Details</label>
            <input type="text" value={visaAppAccommodation} onChange={(e) => setVisaAppAccommodation(e.target.value)}
              placeholder="Hotel name, address, or host contact"
              className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none" />
          </div>
        </div>
        <button onClick={() => setVisaAppStep("UPLOAD_DOCUMENTS")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans">
          Continue to Documents
        </button>
      </div>
    );

    // Step 6: Upload Documents
    const renderVisaAppDocsStep = () => {
      const needsSponsor  = visaAppType === "Business" || visaAppType === "Study";
      const needsInsurance = visaAppType === "Medical"  || visaAppType === "Tourist";
      const isAllUploaded = visaAppUploadedPassportCopy && visaAppUploadedItinerary && visaAppUploadedFinancial &&
        (!needsSponsor  || visaAppUploadedSponsor)  && (!needsInsurance || visaAppUploadedInsurance);

      const docs = [
        { key: "passportcopy", label: "Passport Copy",    desc: "Scanned bio-data & signature pages",         icon: FileText,   uploaded: visaAppUploadedPassportCopy, uploading: visaAppUploadingPassportCopy },
        { key: "itinerary",    label: "Travel Itinerary", desc: "Detailed day-by-day travel plan",             icon: BookMarked, uploaded: visaAppUploadedItinerary,    uploading: visaAppUploadingItinerary    },
        { key: "financial",    label: "Financial Proof",  desc: "Bank statement or financial certificate",     icon: CreditCard, uploaded: visaAppUploadedFinancial,    uploading: visaAppUploadingFinancial    },
        ...(needsSponsor  ? [{ key: "sponsor",   label: "Sponsor Letter",   desc: "Letter from sponsor or institution",   icon: FileCheck,   uploaded: visaAppUploadedSponsor,   uploading: visaAppUploadingSponsor   }] : []),
        ...(needsInsurance ? [{ key: "insurance", label: "Travel Insurance", desc: "Medical coverage certificate",        icon: ShieldCheck, uploaded: visaAppUploadedInsurance, uploading: visaAppUploadingInsurance }] : []),
      ];

      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Upload Documents</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Upload all required documents for your {visaAppType} visa application.</p>
          <div className="space-y-3 text-left">
            {docs.map((doc) => {
              const IconComp = doc.icon;
              return (
                <div key={doc.key} className="p-4 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComp className="h-5 w-5 text-[#001b94]" />
                    <div>
                      <h4 className="text-xs font-medium text-[#0F294D]">{doc.label}</h4>
                      <p className="text-[9px] text-[#64748B] mt-0.5">{doc.desc}</p>
                    </div>
                  </div>
                  {doc.uploaded ? (
                    <span className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  ) : (
                    <button onClick={() => simulateVisaAppUpload(doc.key as any)} disabled={doc.uploading}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 font-sans">
                      {doc.uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => setVisaAppStep("PHOTO_CAPTURE")} disabled={!isAllUploaded}
            className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            Continue to Photo Capture
          </button>
        </div>
      );
    };

    // Step 7: Photo Capture
    const renderVisaAppPhotoStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center relative">
        {flashActive && <div className="absolute inset-0 bg-white z-50 animate-flash rounded-2xl" />}
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Biometric Photo Capture</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Align your face within the frame. Remove glasses or hats before capturing.</p>
        <div className="relative h-56 w-56 rounded-full border-4 border-slate-300 bg-slate-900 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {capturingPhoto ? (
            <>
              <span className="text-7xl font-medium text-white tracking-widest animate-pulse font-display">{photoCountdown}</span>
              <span className="absolute bottom-4 bg-[#FF6F00] text-white text-[9px] font-medium px-2 py-0.5 rounded-full font-sans tracking-wide">HOLD STILL</span>
            </>
          ) : photoCaptured ? (
            <div className="h-full w-full bg-[#EBF3FC] flex flex-col items-center justify-center relative">
              <User className="h-32 w-32 text-[#001b94]/70 mt-6" />
              <span className="absolute bottom-4 bg-emerald-500 text-white text-[9px] font-medium px-2.5 py-0.5 rounded-full font-sans tracking-wide">PHOTO CONFIRMED</span>
            </div>
          ) : (
            <>
              <div className="absolute border border-dashed border-white/30 h-[80%] w-[70%] rounded-full z-10 flex flex-col items-center justify-center">
                <span className="text-[7px] text-white/50 tracking-widest uppercase font-medium mt-16 font-sans">Center Face Here</span>
              </div>
              <Camera className="h-10 w-10 text-white/40" />
            </>
          )}
        </div>
        {!photoCaptured ? (
          <button onClick={startPhotoCapture} disabled={capturingPhoto}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            {capturingPhoto ? `Capturing in ${photoCountdown}s...` : "Capture Passport Photo"}
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button onClick={() => setPhotoCaptured(false)} className="w-1/2 py-3 border border-border hover:border-slate-300 text-[#0F294D] font-medium rounded-xl transition-all text-sm font-sans">Retake Photo</button>
            <button onClick={() => setVisaAppStep("BIOMETRICS")} className="w-1/2 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-all text-sm font-sans">Verify & Continue</button>
          </div>
        )}
      </div>
    );

    // Step 8: Biometrics
    const renderVisaAppBiometricsStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Biometric Fingerprint Scan</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Place your right thumb firmly on the glowing green biometric scanner slot.</p>
        <div className="relative h-48 w-48 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
          {scanningBiometrics ? (
            <>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-laser z-20" />
              <Fingerprint className="h-24 w-24 text-green-500/80 animate-pulse" />
              <span className="text-[10px] font-medium text-[#001b94] mt-3 z-10 font-sans">SCANNING: {biometricsProgress}%</span>
            </>
          ) : (
            <>
              <Fingerprint className="h-24 w-24 text-slate-300" />
              <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-2 font-sans">Scanner Ready</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            setScanningBiometrics(true); setBiometricsProgress(0);
            const iv = setInterval(() => setBiometricsProgress((p) => { if (p >= 100) { clearInterval(iv); setTimeout(() => { setScanningBiometrics(false); setVisaAppStep("REVIEW_CONFIRM"); }, 800); return 100; } return p + 10; }), 150);
          }}
          disabled={scanningBiometrics}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
          {scanningBiometrics ? "Reading fingerprint sensor..." : "Scan Biometric Thumbprint"}
        </button>
      </div>
    );

    // Step 9: Review & E-Signature
    const renderReviewConfirmStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Review & Confirm</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Review your application details, sign the declaration, then proceed to fee payment.</p>
        <div className="space-y-3 border-t border-b border-slate-100 py-4 text-xs text-left font-sans">
          <div className="grid grid-cols-2 gap-y-3">
            {[
              ["Full Name", fullName], ["Passport Number", passportNum],
              ["Nationality", visaAppNationality], ["Visa Type", `${visaAppType} Visa`],
              ["Entry Date", visaAppEntryDate], ["Exit Date", visaAppExitDate],
            ].map(([label, val]) => (
              <div key={label}>
                <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">{label}</span>
                <span className="font-medium text-[#0F294D]">{val}</span>
              </div>
            ))}
            <div className="col-span-2">
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block">Accommodation / Host</span>
              <span className="font-medium text-[#0F294D]">{visaAppAccommodation}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider block mb-2">Verified Documents</span>
            <div className="flex flex-wrap gap-2">
              {["Passport Copy","Biometrics","Photo Captured","Travel Itinerary","Financial Proof"].map((item) => (
                <span key={item} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" />{item}</span>
              ))}
            </div>
          </div>
        </div>
        {/* E-Signature */}
        <div className="mt-5 p-4 border border-border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-[#001b94]" />
            <div>
              <h4 className="text-xs font-medium text-[#0F294D]">E-Signature Declaration</h4>
              <p className="text-[9px] text-[#64748B] mt-0.5 font-sans">I declare that all information provided is true and accurate.</p>
            </div>
          </div>
          <button onClick={() => setVisaAppSigned(true)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors font-sans ${visaAppSigned ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            {visaAppSigned ? "✓ Signed" : "Sign"}
          </button>
        </div>
        <button onClick={() => setVisaAppStep("FEE_CALCULATION")} disabled={!visaAppSigned}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
          Proceed to Fee Calculation
        </button>
      </div>
    );

    // Step 10: Fee Calculation & Payment
    const renderVisaAppFeeStep = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Fee Calculation & Payment</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Confirm the visa application fee and select your preferred payment method.</p>
        <div className="bg-[#F2F5FA] rounded-xl p-5 border border-slate-200/50 space-y-3 mb-6 text-xs text-left font-sans">
          <div className="flex justify-between items-center text-[#64748B]">
            <span>{visaAppType} Visa Application Fee</span>
            <span className="font-medium text-[#0F294D]">${visaFee}.00</span>
          </div>
          <div className="flex justify-between items-center text-[#64748B]">
            <span>Biometric Enrolment Fee</span>
            <span className="font-medium text-[#0F294D]">$20.00</span>
          </div>
          <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-sm font-medium text-[#001b94]">
            <span>Total Fee due</span>
            <span className="text-lg font-medium">${visaFee + 20}.00</span>
          </div>
        </div>
        <div className="text-left font-sans">
          <label className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider block mb-3">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setPaymentMethod("Card"); setVisaAppStep("PAYMENT_PROCESS"); setPaymentProgress(0); }}
              className="p-4 border border-border hover:border-[#001b94] rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
              <CreditCard className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">Credit / Debit Card</span>
            </button>
            <button onClick={() => { setPaymentMethod("UPI"); setVisaAppStep("PAYMENT_PROCESS"); setPaymentProgress(0); }}
              className="p-4 border border-border hover:border-[#001b94] rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
              <QrCode className="h-6 w-6 text-[#001b94]" />
              <span className="text-xs font-medium text-[#0F294D]">QR / UPI Pay</span>
            </button>
          </div>
        </div>
      </div>
    );

    // Payment Processing
    const renderVisaAppPaymentStep = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Payment Processing</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Please complete the transaction through the terminal</p>
        {paymentMethod === "UPI" && (
          <div className="flex flex-col items-center mb-4">
            <div className="h-44 w-44 rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center z-10 animate-pulse">
                <span className="bg-[#001b94] text-white text-[9px] font-medium px-2 py-0.5 rounded-full tracking-wider font-sans">SECURE QR CODE</span>
              </div>
              <div className="grid grid-cols-6 gap-2 w-full h-full opacity-60">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <div key={idx} className={`h-5 rounded-sm ${(idx * 7 + 13) % 5 === 0 || (idx * 3 + 2) % 7 === 0 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1 font-sans">Scan to Pay: ${visaFee + 20}.00</p>
          </div>
        )}
        {paymentMethod === "Card" && (
          <div className="flex flex-col items-center py-4">
            <div className="h-20 w-32 rounded-xl bg-slate-100 border-2 border-slate-200 flex flex-col justify-between p-3 relative overflow-hidden mb-6 animate-pulse">
              <div className="h-4 w-6 bg-[#FF6F00] rounded-sm" />
              <div className="h-2 w-full bg-slate-300 rounded-sm" />
              <div className="h-2 w-12 bg-[#001b94] rounded-sm" />
            </div>
            <p className="text-xs font-medium text-[#0F294D] mb-1 font-sans">Insert / Tap Credit Card</p>
          </div>
        )}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
          <div className="bg-[#001b94] h-full transition-all duration-300" style={{ width: `${paymentProgress}%` }} />
        </div>
        <span className="text-[10px] text-[#64748B] font-medium mt-2 inline-block animate-pulse font-sans">
          {paymentProgress < 100 ? "Awaiting authorization..." : "Payment Authorized!"}
        </span>
      </div>
    );

    // Submit Application
    const renderVisaAppSubmitStep = () => {
      const handleSubmit = () => {
        setSubmittingVisaApp(true); setSubmitVisaProgress(0);
        const outcome: "APPROVED" | "UNDER_REVIEW" | "INTERVIEW_REQUIRED" =
          visaAppType === "Transit" || visaAppType === "Medical" ? "APPROVED" :
          visaAppType === "Study" ? "INTERVIEW_REQUIRED" : "UNDER_REVIEW";
        const iv = setInterval(() => setSubmitVisaProgress((p) => {
          if (p >= 100) {
            clearInterval(iv);
            setTimeout(() => { setVisaAppStatus(outcome); setVisaAppStep("STATUS"); setSuccessCountdown(15); }, 800);
            return 100;
          }
          return p + 8;
        }), 150);
      };
      return (
        <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001b94] mb-6 animate-pulse">
            <FileCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-normal text-[#0F294D] mb-1 font-display">Submit Application</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans text-center">Payment successful. Submit your application to the Immigration Authority for processing.</p>
          {submittingVisaApp ? (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs font-medium text-[#0F294D] font-sans">
                <span>Submitting to Immigration Authority...</span>
                <span>{submitVisaProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#001b94] h-full transition-all duration-100" style={{ width: `${submitVisaProgress}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 font-sans italic animate-pulse">Do not close the screen or eject cards</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="bg-[#F2F5FA] rounded-xl p-4 border border-slate-200/50 space-y-2 text-left text-xs font-sans">
                <div className="flex justify-between text-slate-600"><span>Visa Type:</span><span className="font-medium text-[#0F294D]">{visaAppType} Visa</span></div>
                <div className="flex justify-between text-slate-600"><span>Amount Paid:</span><span className="font-medium text-emerald-600">${visaFee + 20}.00</span></div>
                <div className="flex justify-between text-slate-600"><span>Payment Method:</span><span className="font-medium text-[#0F294D]">{paymentMethod === "UPI" ? "QR / UPI" : "Card"}</span></div>
              </div>
              <button onClick={handleSubmit}
                className="w-full py-3.5 bg-[#FF6F00] hover:bg-[#E05E00] text-white font-medium rounded-xl transition-all text-sm font-sans flex items-center justify-center gap-2 animate-bounce">
                Submit Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      );
    };

    // Application Status
    const renderVisaAppStatusStep = () => {
      const isApproved    = visaAppStatus === "APPROVED";
      const isUnderReview = visaAppStatus === "UNDER_REVIEW";
      const isInterview   = visaAppStatus === "INTERVIEW_REQUIRED";
      return (
        <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
          {isApproved    && <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce"><Check className="h-8 w-8" strokeWidth={3} /></div>}
          {isUnderReview && <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          {isInterview   && <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001b94] mb-4"><CalendarCheck className="h-8 w-8" /></div>}

          <h3 className={`text-2xl font-medium font-display ${isApproved ? "text-emerald-600" : isUnderReview ? "text-amber-600" : "text-[#001b94]"}`}>
            {isApproved ? "Visa Approved!" : isUnderReview ? "Under Review" : "Interview Required"}
          </h3>
          <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">
            {isApproved    && `Your ${visaAppType} visa has been approved. Valid from ${visaAppEntryDate} to ${visaAppExitDate}.`}
            {isUnderReview && `Your ${visaAppType} visa application is under review. You will be notified within 3–5 business days.`}
            {isInterview   && `Your ${visaAppType} visa requires an in-person interview. Please collect your appointment slip below.`}
          </p>

          <div className="w-full space-y-3">
            {isApproved && (
              <>
                <button className="w-full py-3 border-2 border-[#001b94] text-[#001b94] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:bg-[#EBF3FC] transition-all">
                  <Printer className="h-4 w-4" /> Print Visa Document
                </button>
                <button className="w-full py-3 border border-border text-[#0F294D] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:border-slate-300 transition-all">
                  <Printer className="h-4 w-4" /> Print Payment Receipt
                </button>
              </>
            )}
            {isUnderReview && (
              <>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-left text-xs font-sans">
                  <p className="font-medium text-amber-800">Tracking Number</p>
                  <p className="text-amber-700 font-mono mt-1 text-sm font-medium">VA-TRK-{passportNum.replace(/\D/g,"").slice(0,6)}</p>
                </div>
                <button className="w-full py-3 border border-border text-[#0F294D] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:border-slate-300 transition-all">
                  <Printer className="h-4 w-4" /> Print Receipt
                </button>
              </>
            )}
            {isInterview && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left text-xs font-sans space-y-1">
                  <p className="font-medium text-[#001b94]">Interview Appointment</p>
                  <p className="text-[#001b94]/70">Date: <strong>30 June 2026, 10:00 AM</strong></p>
                  <p className="text-[#001b94]/70">Counter: <strong>Immigration Counter F, Level 2</strong></p>
                </div>
                <button className="w-full py-3 border-2 border-[#001b94] text-[#001b94] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:bg-[#EBF3FC] transition-all">
                  <Printer className="h-4 w-4" /> Print Appointment Details
                </button>
              </>
            )}
            <button onClick={resetSession}
              className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm font-sans">
              Finish & Return ({successCountdown}s)
            </button>
          </div>
        </div>
      );
    };

    // ── Layout ────────────────────────────────────────────────────────────────
    return (
      <main className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border z-20">
          <div className="max-w-[1200px] w-full mx-auto px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EBF3FC] text-[#001b94] flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
              <div className="text-left font-sans">
                <h1 className="text-sm font-medium text-[#001b94] tracking-tight uppercase">Visa Application</h1>
                <p className="text-[9px] text-[#64748B] font-medium uppercase tracking-wider">Self-Service Process</p>
              </div>
            </div>
            {showStepsIndicator && (
              <span className="text-[10px] font-medium text-[#001b94] bg-[#001b94]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                Step {currentStepIndex + 1} of {visaAppWizardSteps.length}
              </span>
            )}
          </div>

          {showStepsIndicator && (
            <div className="border-t border-slate-100 bg-slate-50/50 py-2.5">
              <div className="max-w-[1200px] w-full mx-auto px-16 flex items-center justify-between">
                {visaAppWizardSteps.map((step, idx) => {
                  const isActive    = step.id === visaAppStep;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-6 w-6 rounded-full text-[10px] font-medium flex items-center justify-center border transition-all ${
                          isActive ? "bg-[#001b94] text-white border-[#001b94]" : isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-400 border-slate-200"
                        }`}>
                          {isCompleted ? <Check className="h-3 w-3" strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className={`text-[9px] font-medium hidden lg:inline transition-colors font-sans ${isActive ? "text-[#001b94]" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < visaAppWizardSteps.length - 1 && (
                        <div className={`h-[2px] flex-1 mx-2 min-w-[6px] rounded-full transition-colors ${idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-16 py-6 my-auto flex flex-col justify-center">
            {visaAppStep === "ELIGIBILITY"       && renderEligibilityStep()}
            {visaAppStep === "VISA_TYPE"         && renderVisaTypeStep()}
            {visaAppStep === "SCAN_PASSPORT"     && renderVisaAppScanStep()}
            {visaAppStep === "VERIFY_IDENTITY"   && renderVisaAppVerifyStep()}
            {visaAppStep === "TRAVEL_DETAILS"    && renderTravelDetailsStep()}
            {visaAppStep === "UPLOAD_DOCUMENTS"  && renderVisaAppDocsStep()}
            {visaAppStep === "PHOTO_CAPTURE"     && renderVisaAppPhotoStep()}
            {visaAppStep === "BIOMETRICS"        && renderVisaAppBiometricsStep()}
            {visaAppStep === "REVIEW_CONFIRM"    && renderReviewConfirmStep()}
            {visaAppStep === "FEE_CALCULATION"   && renderVisaAppFeeStep()}
            {visaAppStep === "PAYMENT_PROCESS"   && renderVisaAppPaymentStep()}
            {visaAppStep === "SUBMIT_APPLICATION"&& renderVisaAppSubmitStep()}
            {visaAppStep === "STATUS"            && renderVisaAppStatusStep()}
          </div>
        </div>

        {showStepsIndicator && (
          <footer className="h-16 border-t border-border bg-card">
            <div className="h-full max-w-[1200px] mx-auto px-16 flex items-center justify-between text-xs font-medium">
              <button
                onClick={() => {
                  const backMap: Record<string, string> = {
                    ELIGIBILITY: "SERVICES", VISA_TYPE: "ELIGIBILITY", SCAN_PASSPORT: "VISA_TYPE",
                    VERIFY_IDENTITY: "SCAN_PASSPORT", TRAVEL_DETAILS: "VERIFY_IDENTITY",
                    UPLOAD_DOCUMENTS: "TRAVEL_DETAILS", PHOTO_CAPTURE: "UPLOAD_DOCUMENTS",
                    BIOMETRICS: "PHOTO_CAPTURE", REVIEW_CONFIRM: "BIOMETRICS", FEE_CALCULATION: "REVIEW_CONFIRM",
                  };
                  const prev = backMap[visaAppStep];
                  if (prev === "SERVICES") setAppState("SERVICES");
                  else if (prev) setVisaAppStep(prev as any);
                }}
                className="px-4 py-2 border border-border hover:border-slate-300 rounded-lg text-[#0F294D] transition-colors flex items-center gap-2 font-sans">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={resetSession} className="px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium font-sans">
                Cancel Session
              </button>
            </div>
          </footer>
        )}
      </main>
    );
  }


// ─── APPOINTMENT BOOKING FLOW ────────────────────────────────────────────────
  if (appState === "APPOINTMENT_FLOW") {

    const locations = [
      { id: "KL_CENTRAL", name: "KL Sentral Service Centre",    address: "Brickfields, Kuala Lumpur",     slots: 12 },
      { id: "PUTRAJAYA",  name: "Putrajaya Immigration Office", address: "Presinct 2, Putrajaya",         slots: 8  },
      { id: "SUBANG",     name: "Subang Jaya Service Hub",      address: "SS15, Subang Jaya, Selangor",   slots: 15 },
      { id: "CHOW_KIT",   name: "Chow Kit Digital Counter",     address: "Jalan Tuanku Abdul Halim, KL", slots: 6  },
    ];
    const timeSlots = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","02:00 PM","02:30 PM","03:00 PM","03:30 PM"];
    const apptTypes: Array<"Visa Application"|"Visa Extension"|"Passport Renewal"|"Other Services"> = ["Visa Application","Visa Extension","Passport Renewal","Other Services"];

    const bookSteps    = ["SELECT_ACTION","BOOK_IDENTITY","APPT_TYPE","SELECT_LOCATION","SELECT_DATETIME","SPECIAL_REQUIREMENTS","BOOK_REVIEW","CONFIRMATION"];
    const reschedSteps = ["SELECT_ACTION","RESCHEDULE_IDENTITY","CURRENT_APPT","NEW_DATETIME","RESCHEDULE_REVIEW","RESCHEDULE_CONFIRM"];
    const cancelSteps  = ["SELECT_ACTION","CANCEL_IDENTITY","CANCEL_APPT_DETAILS","CANCEL_CONFIRM","CANCEL_RECEIPT"];
    const activeSteps  = apptAction === "RESCHEDULE" ? reschedSteps : apptAction === "CANCEL" ? cancelSteps : bookSteps;
    const currentStepIdx = activeSteps.indexOf(apptStep);
    const showWizard = apptStep !== "SELECT_ACTION";

    const stepLabels: Record<string,string> = {
      BOOK_IDENTITY:"Identity", APPT_TYPE:"Service Type", SELECT_LOCATION:"Location",
      SELECT_DATETIME:"Date & Time", SPECIAL_REQUIREMENTS:"Requirements", BOOK_REVIEW:"Review", CONFIRMATION:"Confirmed",
      RESCHEDULE_IDENTITY:"Identity", CURRENT_APPT:"Current Appt", NEW_DATETIME:"New Date & Time",
      RESCHEDULE_REVIEW:"Review", RESCHEDULE_CONFIRM:"Confirmed",
      CANCEL_IDENTITY:"Identity", CANCEL_APPT_DETAILS:"Appt Details", CANCEL_CONFIRM:"Confirm", CANCEL_RECEIPT:"Cancelled",
    };

    const OtpBlock = ({ onVerified }: { onVerified: () => void }) => (
      <div className="space-y-4 text-left font-sans">
        <div>
          <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Application / Reference Number</label>
          <input type="text" value={apptAppNumber} onChange={(e) => setApptAppNumber(e.target.value)}
            className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none" />
        </div>
        <div>
          <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1">Mobile OTP Verification</label>
          {!apptOtpSent ? (
            <button onClick={() => { setApptOtpSent(true); setApptOtpValue(""); }}
              className="w-full py-2.5 border border-[#001b94] text-[#001b94] text-xs font-medium rounded-xl hover:bg-[#EBF3FC] transition-all font-sans">
              Send OTP to Registered Mobile
            </button>
          ) : apptOtpVerified ? (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
              <span className="text-xs text-emerald-700 font-medium">OTP Verified Successfully</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input type="text" maxLength={4} value={apptOtpValue} onChange={(e) => setApptOtpValue(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="flex-1 p-2.5 border border-border rounded-xl text-xs text-[#0F294D] text-center tracking-widest focus:border-[#001b94] focus:outline-none" />
              <button onClick={() => { if (apptOtpValue.length === 4) setApptOtpVerified(true); }}
                disabled={apptOtpValue.length !== 4}
                className="px-4 py-2.5 bg-[#001b94] text-white text-xs font-medium rounded-xl disabled:bg-slate-200 disabled:text-slate-400 transition-colors font-sans">
                Verify
              </button>
            </div>
          )}
          {apptOtpSent && !apptOtpVerified && <p className="text-[9px] text-slate-400 mt-1 font-sans">Demo: Enter any 4 digits to verify</p>}
        </div>
        {apptOtpVerified && (
          <button onClick={onVerified}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans">
            Continue
          </button>
        )}
      </div>
    );

    const renderSelectAction = () => (
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-[#0F294D] font-display">Appointment Booking</h3>
          <p className="text-xs text-[#64748B] mt-2 font-sans">Select an action to manage your counter appointment.</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {([
            { key: "BOOK" as const,       label: "Book Appointment",       desc: "Schedule a new counter visit",         nextStep: "BOOK_IDENTITY" as typeof apptStep,       color: "#001b94", IconEl: CalendarCheck },
            { key: "RESCHEDULE" as const, label: "Reschedule Appointment", desc: "Change your existing appointment slot", nextStep: "RESCHEDULE_IDENTITY" as typeof apptStep, color: "#FF6F00", IconEl: RefreshCw    },
            { key: "CANCEL" as const,     label: "Cancel Appointment",     desc: "Cancel an existing booked appointment", nextStep: "CANCEL_IDENTITY" as typeof apptStep,     color: "#DC2626", IconEl: AlertCircle  },
          ]).map((action) => {
            const IconComp = action.IconEl;
            return (
              <button key={action.key}
                onClick={() => {
                  setApptAction(action.key);
                  setApptOtpSent(false); setApptOtpValue(""); setApptOtpVerified(false);
                  setApptStep(action.nextStep);
                }}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4 text-center hover:border-[#001b94] transition-all">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${action.color}15`, color: action.color }}>
                  <IconComp className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#0F294D]">{action.label}</h4>
                  <p className="text-[10px] text-[#64748B] mt-1 leading-normal font-sans">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );

    const renderBookIdentity = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Identity Verification</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Enter your application number and verify via OTP to continue.</p>
        <OtpBlock onVerified={() => setApptStep("APPT_TYPE")} />
      </div>
    );

    const renderApptType = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Select Appointment Type</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">What service would you like to visit the counter for?</p>
        <div className="grid grid-cols-2 gap-3">
          {apptTypes.map((type) => {
            const isSelected = apptType === type;
            const iconMap: Record<string, LucideIcon> = {
              "Visa Application": Globe, "Visa Extension": RefreshCw,
              "Passport Renewal": BookMarked, "Other Services": CalendarCheck,
            };
            const IconComp = iconMap[type];
            return (
              <button key={type} onClick={() => { setApptType(type); setApptStep("SELECT_LOCATION"); }}
                className={`p-5 border rounded-2xl flex flex-col items-start gap-3 text-left transition-all ${isSelected ? "border-[#001b94] bg-[#EBF3FC]/30" : "border-border hover:border-[#001b94]"}`}>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#001b94] text-white" : "bg-[#EBF3FC] text-[#001b94]"}`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#0F294D]">{type}</h4>
                  <p className="text-[9px] text-[#64748B] mt-0.5 font-sans">Counter service appointment</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );

    const renderSelectLocation = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Select Service Center</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Choose the most convenient immigration service center for your visit.</p>
        <div className="space-y-3">
          {locations.map((loc) => {
            const isSelected = apptLocation === loc.id;
            return (
              <button key={loc.id} onClick={() => { setApptLocation(loc.id); setApptStep("SELECT_DATETIME"); }}
                className={`w-full p-4 border rounded-xl flex items-center justify-between text-left transition-all ${isSelected ? "border-[#001b94] bg-[#EBF3FC]/20" : "border-border hover:border-[#001b94]"}`}>
                <div className="flex items-center gap-3">
                  <MapPin className={`h-4 w-4 flex-shrink-0 ${isSelected ? "text-[#001b94]" : "text-slate-400"}`} />
                  <div>
                    <h4 className="text-xs font-medium text-[#0F294D]">{loc.name}</h4>
                    <p className="text-[9px] text-[#64748B] mt-0.5 font-sans">{loc.address}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-medium px-2 py-1 rounded-full font-sans flex-shrink-0 ml-2 ${loc.slots > 10 ? "bg-emerald-50 text-emerald-700" : loc.slots > 5 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                  {loc.slots} slots
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );

    const renderSelectDatetime = () => {
      const today = new Date();
      const dates = Array.from({ length: 8 }, (_, i) => {
        const d = new Date(today); d.setDate(d.getDate() + i + 1);
        return { label: d.toLocaleDateString("en-MY", { weekday: "short", month: "short", day: "numeric" }), value: d.toISOString().split("T")[0] };
      });
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Select Date & Time</h3>
          <p className="text-xs text-[#64748B] mb-5 font-sans">Choose an available date and time slot for your visit.</p>
          <div className="mb-5">
            <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Available Dates</label>
            <div className="grid grid-cols-4 gap-2">
              {dates.map((d) => (
                <button key={d.value} onClick={() => { setApptDate(d.value); setApptTime(null); }}
                  className={`p-2.5 border rounded-xl text-center transition-all ${apptDate === d.value ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                  <span className={`text-[10px] font-medium block ${apptDate === d.value ? "text-[#001b94]" : "text-[#0F294D]"}`}>{d.label.split(",")[0]}</span>
                  <span className={`text-[9px] ${apptDate === d.value ? "text-[#001b94]" : "text-slate-400"}`}>{d.label.split(", ")[1]}</span>
                </button>
              ))}
            </div>
          </div>
          {apptDate && (
            <div className="mb-5">
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Available Time Slots</label>
              <div className="grid grid-cols-5 gap-2">
                {timeSlots.map((t) => (
                  <button key={t} onClick={() => setApptTime(t)}
                    className={`py-2 px-1 border rounded-lg text-center transition-all ${apptTime === t ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                    <span className={`text-[9px] font-medium ${apptTime === t ? "text-[#001b94]" : "text-[#0F294D]"}`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setApptStep("SPECIAL_REQUIREMENTS")} disabled={!apptDate || !apptTime}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            Continue
          </button>
        </div>
      );
    };

    const renderSpecialRequirements = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Special Requirements</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Let us know if you need accessibility support or have additional notes.</p>
        <div className="space-y-4 font-sans">
          <button onClick={() => setApptAccessibility(!apptAccessibility)}
            className={`w-full p-4 border rounded-xl flex items-center justify-between text-left transition-all ${apptAccessibility ? "border-[#001b94] bg-[#EBF3FC]/20" : "border-border hover:border-slate-300"}`}>
            <div>
              <h4 className="text-xs font-medium text-[#0F294D]">Accessibility Support Required</h4>
              <p className="text-[9px] text-[#64748B] mt-0.5">Wheelchair access, sign language interpreter, or disability assistance</p>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${apptAccessibility ? "bg-[#001b94] border-[#001b94]" : "border-slate-300"}`}>
              {apptAccessibility && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
          </button>
          <div>
            <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-1.5">Additional Notes (Optional)</label>
            <textarea value={apptNotes} onChange={(e) => setApptNotes(e.target.value)} rows={3}
              placeholder="Any additional information for the counter officer..."
              className="w-full p-2.5 border border-border rounded-xl text-xs text-[#0F294D] focus:border-[#001b94] focus:outline-none resize-none" />
          </div>
        </div>
        <button onClick={() => setApptStep("BOOK_REVIEW")}
          className="w-full mt-6 py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans">
          Review Appointment
        </button>
      </div>
    );

    const renderBookReview = () => {
      const loc = locations.find((l) => l.id === apptLocation);
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Review & Confirm</h3>
          <p className="text-xs text-[#64748B] mb-6 font-sans">Please review your appointment details before confirming.</p>
          <div className="border border-slate-100 rounded-xl overflow-hidden mb-6">
            {([
              ["Service Type",    apptType ?? "—"],
              ["Location",        loc?.name ?? "—"],
              ["Address",         loc?.address ?? "—"],
              ["Date",            apptDate ? new Date(apptDate).toLocaleDateString("en-MY", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—"],
              ["Time",            apptTime ?? "—"],
              ["Application Ref", apptAppNumber],
              ["Accessibility",   apptAccessibility ? "Required" : "Not Required"],
            ] as [string,string][]).map(([label, val], idx) => (
              <div key={label} className={`flex justify-between items-start px-4 py-3 text-xs font-sans ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                <span className="text-[#64748B] font-medium">{label}</span>
                <span className="text-[#0F294D] font-medium text-right ml-4 max-w-[60%]">{val}</span>
              </div>
            ))}
            {apptNotes && (
              <div className="px-4 py-3 text-xs font-sans border-t border-slate-100">
                <span className="text-[#64748B] font-medium block mb-1">Additional Notes</span>
                <span className="text-[#0F294D]">{apptNotes}</span>
              </div>
            )}
          </div>
          <button onClick={() => { setApptStep("CONFIRMATION"); setSuccessCountdown(15); }}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans flex items-center justify-center gap-2">
            Confirm Appointment <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      );
    };

    const renderConfirmation = () => {
      const loc = locations.find((l) => l.id === apptLocation);
      return (
        <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-medium text-emerald-600 font-display">Appointment Confirmed!</h3>
          <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">Your appointment is booked. Present the QR code at the counter.</p>
          <div className="w-full border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <div className="bg-[#001b94] px-5 py-4 text-white text-left">
              <p className="text-[9px] uppercase tracking-widest font-medium opacity-70 font-sans">Appointment Letter</p>
              <p className="text-sm font-medium mt-0.5">{apptType} — {apptTime}</p>
              <p className="text-[11px] opacity-80 mt-0.5">{apptDate ? new Date(apptDate).toLocaleDateString("en-MY", { weekday: "long", month: "long", day: "numeric" }) : ""}</p>
            </div>
            <div className="p-5 flex items-center gap-4">
              <div className="h-20 w-20 border border-slate-200 rounded-lg bg-white p-1.5 flex-shrink-0 grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`rounded-[1px] ${(i * 3 + 7) % 4 === 0 || i % 5 === 0 || (i + 3) % 7 === 0 ? "bg-[#0F172A]" : "bg-transparent"}`} />
                ))}
              </div>
              <div className="text-left text-xs font-sans space-y-1">
                <p><span className="text-[#64748B]">Ref:</span> <strong className="text-[#0F294D] font-mono">{apptBookingRef}</strong></p>
                <p><span className="text-[#64748B]">Location:</span> <span className="text-[#0F294D]">{loc?.name}</span></p>
                <p><span className="text-[#64748B]">Counter:</span> <span className="text-[#0F294D]">Counter A</span></p>
                {apptAccessibility && <p className="text-[9px] text-[#001b94] font-medium">Accessibility arranged</p>}
              </div>
            </div>
          </div>
          <button className="w-full py-3 border-2 border-[#001b94] text-[#001b94] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:bg-[#EBF3FC] transition-all mb-3">
            <Printer className="h-4 w-4" /> Print Appointment Letter
          </button>
          <button onClick={resetSession} className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm font-sans">
            Finish & Return ({successCountdown}s)
          </button>
        </div>
      );
    };

    const renderRescheduleIdentity = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Identity Verification</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Enter your existing appointment reference and verify via OTP.</p>
        <OtpBlock onVerified={() => setApptStep("CURRENT_APPT")} />
      </div>
    );

    const renderCurrentAppt = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Current Appointment Details</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Your existing appointment found. Select a new date and time to reschedule.</p>
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          {([["Reference",apptBookingRef],["Service","Visa Extension"],["Location","KL Sentral Service Centre"],["Date","Monday, 30 June 2026"],["Time","10:00 AM"],["Status","Confirmed"]] as [string,string][]).map(([label,val],idx) => (
            <div key={label} className={`flex justify-between px-4 py-3 text-xs font-sans ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
              <span className="text-[#64748B] font-medium">{label}</span>
              <span className={`font-medium ${label === "Status" ? "text-emerald-600" : "text-[#0F294D]"}`}>{val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setApptStep("NEW_DATETIME")}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans">
          Select New Date & Time
        </button>
      </div>
    );

    const renderNewDatetime = () => {
      const today = new Date();
      const dates = Array.from({ length: 8 }, (_, i) => {
        const d = new Date(today); d.setDate(d.getDate() + i + 1);
        return { label: d.toLocaleDateString("en-MY", { weekday: "short", month: "short", day: "numeric" }), value: d.toISOString().split("T")[0] };
      });
      return (
        <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
          <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Select New Date & Time</h3>
          <p className="text-xs text-[#64748B] mb-5 font-sans">Choose a new available slot for your rescheduled appointment.</p>
          <div className="mb-5">
            <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Available Dates</label>
            <div className="grid grid-cols-4 gap-2">
              {dates.map((d) => (
                <button key={d.value} onClick={() => { setApptNewDate(d.value); setApptNewTime(null); }}
                  className={`p-2.5 border rounded-xl text-center transition-all ${apptNewDate === d.value ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                  <span className={`text-[10px] font-medium block ${apptNewDate === d.value ? "text-[#001b94]" : "text-[#0F294D]"}`}>{d.label.split(",")[0]}</span>
                  <span className={`text-[9px] ${apptNewDate === d.value ? "text-[#001b94]" : "text-slate-400"}`}>{d.label.split(", ")[1]}</span>
                </button>
              ))}
            </div>
          </div>
          {apptNewDate && (
            <div className="mb-5">
              <label className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block mb-2">Available Time Slots</label>
              <div className="grid grid-cols-5 gap-2">
                {timeSlots.map((t) => (
                  <button key={t} onClick={() => setApptNewTime(t)}
                    className={`py-2 px-1 border rounded-lg text-center transition-all ${apptNewTime === t ? "border-[#001b94] bg-[#EBF3FC]/40" : "border-border hover:border-slate-300"}`}>
                    <span className={`text-[9px] font-medium ${apptNewTime === t ? "text-[#001b94]" : "text-[#0F294D]"}`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setApptStep("RESCHEDULE_REVIEW")} disabled={!apptNewDate || !apptNewTime}
            className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] disabled:bg-slate-200 disabled:text-slate-400 transition-colors text-sm font-sans">
            Review Changes
          </button>
        </div>
      );
    };

    const renderRescheduleReview = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Review Reschedule</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Confirm the change to your appointment slot below.</p>
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-red-50 px-4 py-3 border-b border-slate-100">
            <p className="text-[9px] uppercase tracking-wider font-medium text-red-500 font-sans">Previous Slot</p>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">Monday, 30 June 2026 — 10:00 AM</p>
          </div>
          <div className="bg-emerald-50 px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider font-medium text-emerald-600 font-sans">New Slot</p>
            <p className="text-xs font-medium text-[#0F294D] mt-0.5">
              {apptNewDate ? new Date(apptNewDate).toLocaleDateString("en-MY", { weekday: "long", month: "long", day: "numeric" }) : "—"} — {apptNewTime ?? "—"}
            </p>
          </div>
        </div>
        <button onClick={() => { setApptStep("RESCHEDULE_CONFIRM"); setSuccessCountdown(15); }}
          className="w-full py-3 bg-[#001b94] text-white font-medium rounded-xl hover:bg-[#001575] transition-colors text-sm font-sans flex items-center justify-center gap-2">
          Confirm Reschedule <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );

    const renderRescheduleConfirm = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-medium text-emerald-600 font-display">Rescheduled!</h3>
        <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">
          Appointment moved to <strong className="text-[#0F294D]">
            {apptNewDate ? new Date(apptNewDate).toLocaleDateString("en-MY", { weekday: "long", month: "long", day: "numeric" }) : ""} at {apptNewTime}
          </strong>.
        </p>
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs font-sans mb-6 space-y-1.5">
          <p><span className="text-[#64748B]">Reference:</span> <strong className="font-mono text-[#0F294D]">{apptBookingRef}</strong></p>
          <p><span className="text-[#64748B]">Location:</span> <span className="text-[#0F294D]">KL Sentral Service Centre</span></p>
        </div>
        <button className="w-full py-3 border-2 border-[#001b94] text-[#001b94] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:bg-[#EBF3FC] transition-all mb-3">
          <Printer className="h-4 w-4" /> Print Updated Appointment Letter
        </button>
        <button onClick={resetSession} className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm font-sans">
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    const renderCancelIdentity = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Identity Verification</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Enter your appointment reference and verify via OTP to proceed.</p>
        <OtpBlock onVerified={() => setApptStep("CANCEL_APPT_DETAILS")} />
      </div>
    );

    const renderCancelApptDetails = () => (
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl border border-border p-8">
        <h3 className="text-xl font-medium text-[#0F294D] mb-1 font-display">Appointment Details</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">Found the following appointment linked to your reference.</p>
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
          {([["Reference",apptBookingRef],["Service","Visa Extension"],["Location","KL Sentral Service Centre"],["Date","Monday, 30 June 2026"],["Time","10:00 AM"],["Status","Confirmed"]] as [string,string][]).map(([label,val],idx) => (
            <div key={label} className={`flex justify-between px-4 py-3 text-xs font-sans ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
              <span className="text-[#64748B] font-medium">{label}</span>
              <span className={`font-medium ${label === "Status" ? "text-emerald-600" : "text-[#0F294D]"}`}>{val}</span>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-xs text-red-700 font-sans">
          Once cancelled, this slot will be released and cannot be recovered.
        </div>
        <button onClick={() => setApptStep("CANCEL_CONFIRM")}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm font-sans">
          Proceed to Cancellation
        </button>
      </div>
    );

    const renderCancelConfirm = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-[#0F294D] mb-2 font-display">Confirm Cancellation</h3>
        <p className="text-xs text-[#64748B] mb-6 font-sans">
          You are about to cancel <strong className="text-[#0F294D] font-mono">{apptBookingRef}</strong> on Monday, 30 June 2026 at 10:00 AM. This cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={() => setApptStep("CANCEL_APPT_DETAILS")}
            className="w-1/2 py-3 border border-border hover:border-slate-300 text-[#0F294D] font-medium rounded-xl transition-all text-sm font-sans">
            Go Back
          </button>
          <button onClick={() => { setApptStep("CANCEL_RECEIPT"); setSuccessCountdown(15); }}
            className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all text-sm font-sans">
            Yes, Cancel It
          </button>
        </div>
      </div>
    );

    const renderCancelReceipt = () => (
      <div className="max-w-md w-full mx-auto bg-card rounded-2xl border border-border p-8 text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-4">
          <Check className="h-8 w-8" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-medium text-[#0F294D] font-display">Appointment Cancelled</h3>
        <p className="text-xs text-[#64748B] mt-2 mb-6 font-sans">Your appointment has been cancelled. Print your cancellation receipt below.</p>
        <div className="w-full border border-slate-200 rounded-xl overflow-hidden mb-6 text-left text-xs font-sans">
          <div className="bg-slate-100 px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider font-medium text-[#64748B]">Cancellation Receipt</p>
            <p className="font-mono font-medium text-[#0F294D] mt-0.5">{apptBookingRef}-CANCEL</p>
          </div>
          {([["Cancelled On",new Date().toLocaleDateString("en-MY",{day:"numeric",month:"long",year:"numeric"})],["Was Scheduled","30 June 2026, 10:00 AM"],["Service","Visa Extension"],["Location","KL Sentral Service Centre"]] as [string,string][]).map(([label,val]) => (
            <div key={label} className="flex justify-between px-4 py-2.5 border-t border-slate-100">
              <span className="text-[#64748B]">{label}</span>
              <span className="text-[#0F294D] font-medium text-right ml-4">{val}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-3 border border-border text-[#0F294D] font-medium rounded-xl text-sm font-sans flex items-center justify-center gap-2 hover:border-slate-300 transition-all mb-3">
          <Printer className="h-4 w-4" /> Print Cancellation Receipt
        </button>
        <button onClick={resetSession} className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm font-sans">
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    const wizardSteps = apptAction
      ? activeSteps.slice(1).map((id) => ({ id, label: stepLabels[id] ?? id }))
      : [];

    return (
      <main className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border z-20">
          <div className="max-w-[1200px] w-full mx-auto px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EBF3FC] text-[#001b94] flex items-center justify-center">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="text-left font-sans">
                <h1 className="text-sm font-medium text-[#001b94] tracking-tight uppercase">Appointment Booking</h1>
                <p className="text-[9px] text-[#64748B] font-medium uppercase tracking-wider">
                  {apptAction === "BOOK" ? "New Appointment" : apptAction === "RESCHEDULE" ? "Reschedule" : apptAction === "CANCEL" ? "Cancel Appointment" : "Self-Service"}
                </p>
              </div>
            </div>
            {showWizard && (
              <span className="text-[10px] font-medium text-[#001b94] bg-[#001b94]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                Step {currentStepIdx} of {activeSteps.length - 1}
              </span>
            )}
          </div>
          {showWizard && wizardSteps.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 py-2.5">
              <div className="max-w-[1200px] w-full mx-auto px-16 flex items-center justify-between">
                {wizardSteps.map((step, idx) => {
                  const isActive    = step.id === apptStep;
                  const isCompleted = idx < currentStepIdx - 1;
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-6 w-6 rounded-full text-[10px] font-medium flex items-center justify-center border transition-all ${isActive ? "bg-[#001b94] text-white border-[#001b94]" : isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-400 border-slate-200"}`}>
                          {isCompleted ? <Check className="h-3 w-3" strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className={`text-[9px] font-medium hidden xl:inline font-sans ${isActive ? "text-[#001b94]" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>{step.label}</span>
                      </div>
                      {idx < wizardSteps.length - 1 && (
                        <div className={`h-[2px] flex-1 mx-2 min-w-[6px] rounded-full ${isCompleted ? "bg-emerald-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto px-16 py-6 my-auto flex flex-col justify-center">
            {apptStep === "SELECT_ACTION"        && renderSelectAction()}
            {apptStep === "BOOK_IDENTITY"        && renderBookIdentity()}
            {apptStep === "APPT_TYPE"            && renderApptType()}
            {apptStep === "SELECT_LOCATION"      && renderSelectLocation()}
            {apptStep === "SELECT_DATETIME"      && renderSelectDatetime()}
            {apptStep === "SPECIAL_REQUIREMENTS" && renderSpecialRequirements()}
            {apptStep === "BOOK_REVIEW"          && renderBookReview()}
            {apptStep === "CONFIRMATION"         && renderConfirmation()}
            {apptStep === "RESCHEDULE_IDENTITY"  && renderRescheduleIdentity()}
            {apptStep === "CURRENT_APPT"         && renderCurrentAppt()}
            {apptStep === "NEW_DATETIME"         && renderNewDatetime()}
            {apptStep === "RESCHEDULE_REVIEW"    && renderRescheduleReview()}
            {apptStep === "RESCHEDULE_CONFIRM"   && renderRescheduleConfirm()}
            {apptStep === "CANCEL_IDENTITY"      && renderCancelIdentity()}
            {apptStep === "CANCEL_APPT_DETAILS"  && renderCancelApptDetails()}
            {apptStep === "CANCEL_CONFIRM"       && renderCancelConfirm()}
            {apptStep === "CANCEL_RECEIPT"       && renderCancelReceipt()}
          </div>
        </div>

        <footer className="h-16 border-t border-border bg-card">
          <div className="h-full max-w-[1200px] mx-auto px-16 flex items-center justify-between text-xs font-medium">
            <button
              onClick={() => {
                if (apptStep === "SELECT_ACTION") { setAppState("SERVICES"); return; }
                const backMap: Record<string,string> = {
                  BOOK_IDENTITY:"SELECT_ACTION", APPT_TYPE:"BOOK_IDENTITY", SELECT_LOCATION:"APPT_TYPE",
                  SELECT_DATETIME:"SELECT_LOCATION", SPECIAL_REQUIREMENTS:"SELECT_DATETIME", BOOK_REVIEW:"SPECIAL_REQUIREMENTS",
                  RESCHEDULE_IDENTITY:"SELECT_ACTION", CURRENT_APPT:"RESCHEDULE_IDENTITY",
                  NEW_DATETIME:"CURRENT_APPT", RESCHEDULE_REVIEW:"NEW_DATETIME",
                  CANCEL_IDENTITY:"SELECT_ACTION", CANCEL_APPT_DETAILS:"CANCEL_IDENTITY", CANCEL_CONFIRM:"CANCEL_APPT_DETAILS",
                };
                const prev = backMap[apptStep];
                if (prev === "SELECT_ACTION") { setApptAction(null); setApptOtpSent(false); setApptOtpVerified(false); setApptOtpValue(""); }
                if (prev) setApptStep(prev as typeof apptStep);
              }}
              className="px-4 py-2 border border-border hover:border-slate-300 rounded-lg text-[#0F294D] transition-colors flex items-center gap-2 font-sans">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button onClick={resetSession} className="px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium font-sans">
              Cancel Session
            </button>
          </div>
        </footer>
      </main>
    );
  }
}


function ServiceCard({
  title,
  hint,
  Icon,
  onClick,
}: Service & { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left bg-card rounded-xl border border-border p-6 transition-all duration-300 hover:border-[#001b94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001b94] focus-visible:ring-offset-2 focus-visible:ring-offset-background flex flex-col justify-between"
      style={{
        height: 160,
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      {/* Top row: Icon */}
      <div className="flex items-start justify-between w-full">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#EBF3FC] text-[#001b94] transition-all duration-300 group-hover:bg-[#001b94] group-hover:text-white">
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
        </div>
      </div>

      {/* Middle row: Title and Hint + Arrow side-by-side */}
      <div className="mt-4 w-full flex-1 flex flex-col justify-end">
        <h3 className="text-lg font-normal text-[#0F294D] leading-6 group-hover:text-[#001b94] transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-4 w-full">
          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-sans font-medium flex-1">
            {hint}
          </p>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#001b94] transform transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
