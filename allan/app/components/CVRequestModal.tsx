'use client';
import { useEffect, useRef, useState } from "react";
import { Download, XCircle } from "lucide-react";
import toast from "react-hot-toast";

/** The original "Request My CV" modal, extracted so both portfolio sides can use it. */
const CVRequestModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [cvFormData, setCvFormData] = useState({
    name: "",
    email: "",
    company: "",
    purpose: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    if (open) {
      document.addEventListener("mousedown", handleClickOutsideModal);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  const handleCVFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCvFormData({ ...cvFormData, [e.target.id.replace("cv-", "")]: e.target.value });
  };

  const handleCVFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "405affda-13a8-43dc-a84d-ec49bb0c19e9",
          subject: `CV Request from ${cvFormData.name} - ${cvFormData.company}`,
          from_name: cvFormData.name,
          from_email: cvFormData.email,
          message: `CV Request Details:
Name: ${cvFormData.name}
Email: ${cvFormData.email}
Company: ${cvFormData.company}
Purpose: ${cvFormData.purpose}
          
Please send the CV to this email address.`,
          replyto: cvFormData.email,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("✅ CV request sent successfully! I'll get back to you soon.");
        setCvFormData({ name: "", email: "", company: "", purpose: "" });
        onClose();
      } else {
        console.error(result);
        toast.error("❌ Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const inputClass =
    "w-full bg-surface text-ink border border-line rounded-lg px-4 py-3 text-sm focus:border-accent outline-none transition-colors placeholder:text-faint";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
        className="relative bg-surface-2 border border-line rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-line">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="cv-modal-title" className="text-xl font-bold text-ink">Request My CV</h3>
              <p className="text-sm text-muted mt-1">Enter your details and I'll send my CV to your email</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-muted hover:text-ink transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCVFormSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="cv-name" className="block text-sm font-medium mb-2 text-ink-2">
              Full Name *
            </label>
            <input id="cv-name" type="text" value={cvFormData.name} onChange={handleCVFormChange} required placeholder="John Doe" className={inputClass} />
          </div>

          <div>
            <label htmlFor="cv-email" className="block text-sm font-medium mb-2 text-ink-2">
              Email Address *
            </label>
            <input id="cv-email" type="email" value={cvFormData.email} onChange={handleCVFormChange} required placeholder="john@company.com" className={inputClass} />
          </div>

          <div>
            <label htmlFor="cv-company" className="block text-sm font-medium mb-2 text-ink-2">
              Company / Organization
            </label>
            <input id="cv-company" type="text" value={cvFormData.company} onChange={handleCVFormChange} placeholder="Your company name" className={inputClass} />
          </div>

          <div>
            <label htmlFor="cv-purpose" className="block text-sm font-medium mb-2 text-ink-2">
              Purpose of Request *
            </label>
            <textarea
              id="cv-purpose"
              rows={3}
              value={cvFormData.purpose}
              onChange={handleCVFormChange}
              required
              placeholder="Tell me why you need my CV (e.g., job opportunity, collaboration, etc.)"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-accent to-accent-deep hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Request CV</span>
                </>
              )}
            </button>
            <p className="text-xs text-faint text-center mt-3">
              I'll review your request and send my CV to your email within 24 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVRequestModal;
