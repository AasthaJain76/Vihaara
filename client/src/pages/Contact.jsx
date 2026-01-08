import React, { useRef, useState } from "react";
import { Container, Button } from "../components";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_h6ny71e",
        "template_d9ggwna",
        form.current,
        "7f-dU5M9yzNYxEkKY"
      )
      .then(
        (result) => {
          toast.success("Message sent successfully!", { position: "top-right" });
          form.current.reset();
          setLoading(false);
        },
        (error) => {
          toast.error("Failed to send message. Try again later.", { position: "top-right" });
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
      <Container className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">
          Contact Vihaara
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Have questions or suggestions? Send us a message and we'll get back to you.
        </p>

        <form ref={form} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              required
              rows="5"
              placeholder="Your message..."
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <div className="mt-10 text-center text-gray-500 text-sm">
          Or reach us at{" "}
          <a href="mailto:contact@vihaara.com" className="text-indigo-600 underline">
            contact@vihaara.com
          </a>
        </div>
      </Container>
    </div>
  );
}

export default Contact;
