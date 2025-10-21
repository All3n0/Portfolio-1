'use client';
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]" id="contact">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold mb-6 text-white">Let's Talk</h3>
              <p className="text-gray-400 mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="bg-[#1a1a1a] p-6 flex items-center gap-4 rounded-xl border border-[#2a2a2a] hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center group-hover:bg-orange-600/30 transition-colors">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold text-white">hello@portfolio.dev</p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-[#1a1a1a] p-6 flex items-center gap-4 rounded-xl border border-[#2a2a2a] hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Phone className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-semibold text-white">+1 (555) 123-4567</p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-[#1a1a1a] p-6 flex items-center gap-4 rounded-xl border border-[#2a2a2a] hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-semibold text-white">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a] shadow-lg shadow-black/20">
            <form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-[#111] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full bg-[#111] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full bg-[#111] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:border-orange-500 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
