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
  const [appState, setAppState] = useState<"WELCOME" | "LANGUAGE" | "SERVICES" | "VISA_FLOW" | "PASSPORT_FLOW">("LANGUAGE");
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
                         (appState === "PASSPORT_FLOW" && passportStep === "PAYMENT_PROCESS");
    if (isProcessing) {
      const interval = setInterval(() => {
        setPaymentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (appState === "PASSPORT_FLOW") {
                setPassportStep("SUBMIT_APPLICATION");
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
  }, [visaStep, passportStep, appState]);

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
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [visaStep, passportStep, appState]);

  // Success countdown timer
  useEffect(() => {
    const isSuccess = (appState === "VISA_FLOW" && visaStep === "SUCCESS") ||
                      (appState === "PASSPORT_FLOW" && passportStep === "SUCCESS");
    if (isSuccess && successCountdown > 0) {
      const timer = setTimeout(() => {
        setSuccessCountdown(successCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && successCountdown === 0) {
      resetSession();
    }
  }, [visaStep, passportStep, appState, successCountdown]);

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
        className="min-h-screen bg-gradient-to-br from-[#001b94] to-[#000a3a] text-white flex flex-col justify-between p-12 cursor-pointer select-none"
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
      { name: "English", code: "EN", flag: "🇬🇧" },
      { name: "Bahasa Melayu", code: "MS", flag: "🇲🇾" },
      { name: "简体中文", code: "ZH", flag: "🇨🇳" },
      { name: "தமிழ்", code: "TA", flag: "🇮🇳" }
    ];

    return (
      <main className="min-h-screen bg-background flex flex-col justify-center py-12">
        <div className="max-w-[800px] w-full mx-auto px-16 text-center">
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
                className="group p-8 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-[#001b94] hover:-translate-y-1"
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
      <main className="min-h-screen bg-background flex flex-col justify-center py-12 relative">
        {maintenanceMsg && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium py-3 px-6 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>{maintenanceMsg}</span>
          </div>
        )}

        <div className="max-w-[1200px] w-full mx-auto px-16 flex-1 flex flex-col justify-center">
          <div className="mb-16 text-center flex flex-col items-center justify-center">
            <h2 className="text-4xl font-medium font-display text-[#1F2937] tracking-tight sm:text-5xl">
              Welcome to
            </h2>
            <h2 className="text-4xl font-medium font-display text-[#001b94] tracking-tight sm:text-5xl mt-1">
              e-Passport & Visa Hub
            </h2>
          </div>

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
                  } else {
                    showMaintenance(s.title);
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center text-xs font-medium text-[#64748B]">
            <button
              onClick={() => setAppState("LANGUAGE")}
              className="hover:text-[#001b94] transition-colors flex items-center gap-2"
            >
              <Languages className="h-4 w-4 text-[#001b94]" /> Change Language
            </button>
            <button
              onClick={resetSession}
              className="hover:text-[#FF6F00] transition-colors"
            >
              Cancel Session
            </button>
          </div>
        </div>
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
              height: `${Math.max(40, printProgress * 2.3)}px`, 
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

            <div className="mt-4 pt-2 border-t border-dashed border-slate-200 text-center flex flex-col items-center gap-1">
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

        <div className="w-full bg-slate-50 border border-slate-200/50 rounded-xl p-4 text-xs text-left mb-6 space-y-2 font-sans">
          <p className="font-medium text-[#0F294D]">⚠️ Please note:</p>
          <ul className="list-disc pl-4 text-[10px] text-[#64748B] space-y-1">
            <li>Collect your printed receipt slip from the printer tray.</li>
            <li>Take your passport back from the flatbed scanner slot.</li>
            <li>Make sure to leave the country before your new expiry date to avoid fines.</li>
          </ul>
        </div>

        <button
          onClick={resetSession}
          className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm shadow-md"
        >
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    return (
      <main className="min-h-screen bg-background flex flex-col">
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

        <div className="flex-1 max-w-[1200px] w-full mx-auto px-16 py-10 flex flex-col justify-center">
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
      { id: "UPLOAD_DOCUMENTS", label: "Upload Documents" },
      { id: "PHOTO_CAPTURE", label: "Photo Capture" },
      { id: "BIOMETRICS", label: "Biometrics" },
      { id: "REVIEW_APPLICATION", label: "Review Application" },
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

          {/* WhatsApp upload option card inspired by attached mockup */}
          <div className="mt-4 border border-[#e1f5eb] bg-[#f4fbf7] rounded-xl py-3 px-4 flex items-center gap-4 text-left transition-all hover:shadow-sm">
            {/* Left side: White QR Code card wrapper containing the SVG QR code (no WhatsApp badge on QR) */}
            <div className="relative w-16 h-16 bg-white border border-[#e1f5eb] rounded-none p-1.5 flex items-center justify-center shrink-0 shadow-sm">
              <img src={qrCodeIcon} className="w-full h-full object-contain" alt="QR Code" />
            </div>

            {/* Right side: text details and green action pill vertically stacked */}
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-sm font-medium text-[#075e54]">Send via WhatsApp</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-sans line-clamp-1">
                Scan QR or tap the button to simulate instant mobile connection.
              </p>
              
              <div className="mt-1.5">
                <button
                  onClick={() => {
                    setUploadingViaWhatsApp(true);
                    setTimeout(() => {
                      setUploadedOldPassport(true);
                      setUploadedIdCard(true);
                      setUploadingViaWhatsApp(false);
                    }, 1500);
                  }}
                  disabled={uploadingViaWhatsApp || (uploadedOldPassport && uploadedIdCard)}
                  className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-1.5 rounded-full text-[10px] font-medium shadow-sm hover:bg-[#20ba59] active:scale-95 disabled:bg-[#a1e8bc] transition-all animate-fade-in whitespace-nowrap"
                >
                  {uploadingViaWhatsApp ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Syncing Mobile...</span>
                    </>
                  ) : (uploadedOldPassport && uploadedIdCard) ? (
                    <span>Received & Verified ✅</span>
                  ) : (
                    <>
                      {/* Official WhatsApp Logo SVG */}
                      <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>+1 408 872 8367</span>
                    </>
                  )}
                </button>
              </div>
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
              height: `${Math.max(40, printProgress * 2.3)}px`, 
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

            <div className="mt-4 pt-2 border-t border-dashed border-slate-200 text-center flex flex-col items-center gap-1">
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

        <div className="w-full bg-slate-50 border border-slate-200/50 rounded-xl p-4 text-xs text-left mb-6 space-y-2 font-sans">
          <p className="font-medium text-[#0F294D]">⚠️ Collector Instructions:</p>
          <ul className="list-disc pl-4 text-[10px] text-[#64748B] space-y-1">
            <li>Grab your printed paper receipt containing your Application ID.</li>
            <li>Take your old passport back from the flatbed scanner tray.</li>
            <li>
              {deliveryOption === "Pickup" 
                ? "Present this printed slip at Counter B in 3 hours to collect your new passport."
                : "Your passport will be couriered to your registered address in 3 to 5 business days."}
            </li>
          </ul>
        </div>

        <button
          onClick={resetSession}
          className="w-full py-3 bg-[#001b94] hover:bg-[#001575] text-white font-medium rounded-xl transition-colors text-sm shadow-md font-sans"
        >
          Finish & Return ({successCountdown}s)
        </button>
      </div>
    );

    return (
      <main className="min-h-screen bg-background flex flex-col">
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

        <div className="flex-1 max-w-[1200px] w-full mx-auto px-16 py-10 flex flex-col justify-center">
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
      className="group relative text-left bg-card rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#001b94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001b94] focus-visible:ring-offset-2 focus-visible:ring-offset-background flex flex-col justify-between"
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
          <ArrowRight className="h-4 w-4 shrink-0 text-[#001b94] group-hover:text-[#FF6F00] transform transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
