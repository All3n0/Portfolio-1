"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Reveal from "./Reveal";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "405affda-13a8-43dc-a84d-ec49bb0c19e9",
          subject: `New message from ${formData.name}`,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          replyto: formData.email,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error(result);
        toast.error("❌ Failed to send message. Please check your form settings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-bg" id="contact">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-deep">
            Get In Touch
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <Reveal className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-ink">Let's Talk</h3>
              <p className="text-muted mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-surface-2 p-6 flex items-center gap-4 rounded-xl border border-line hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <p className="font-semibold text-ink">allankipr6@gmail.com</p>
                </div>
              </div>

              <div className="bg-surface-2 p-6 flex items-center gap-4 rounded-xl border border-line hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <p className="font-semibold text-ink">+254 796 078 921</p>
                </div>
              </div>

              <div className="bg-surface-2 p-6 flex items-center gap-4 rounded-xl border border-line hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-accent-alt/15 flex items-center justify-center group-hover:bg-accent-alt/25 transition-colors">
                  <MapPin className="w-6 h-6 text-accent-alt" />
                </div>
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="font-semibold text-ink">Nairobi, KE</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={150} className="bg-surface-2 p-8 rounded-2xl border border-line shadow-lg shadow-black/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-ink-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-surface text-ink border border-line rounded-lg px-4 py-3 placeholder:text-faint focus:border-accent outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-ink-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-surface text-ink border border-line rounded-lg px-4 py-3 placeholder:text-faint focus:border-accent outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-ink-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full bg-surface text-ink border border-line rounded-lg px-4 py-3 placeholder:text-faint focus:border-accent outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-accent to-accent-deep hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
