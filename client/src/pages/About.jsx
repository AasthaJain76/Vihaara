import React from 'react';
import Logo from '../components/Logo';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-600 mb-8">
            About Vihaara
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            Vihaara is your personal mental wellness companion, offering AI-guided chats, journaling, mood tracking, and mindfulness tools to support your emotional well-being.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              To provide accessible, empathetic, and AI-powered mental wellness support for anyone seeking guidance, mindfulness, or emotional reflection.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">Our Vision</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              To create a safe digital space where individuals can track emotions, gain insights, practice mindfulness, and develop healthy mental habits.
            </p>
          </div>
        </div>

        {/* Personal Story / About Team */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 mb-12 hover:shadow-xl transition">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">About Me</h2>
          <p className="text-gray-600 text-sm sm:text-base text-center">
            Hi, I’m Aastha Jain 👋. I created Vihaara to leverage AI and technology to support mental health, helping users reflect, track moods, and cultivate mindfulness in a personalized and safe environment.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 mb-12 hover:shadow-xl transition">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">Key Features</h2>
          <div className="text-gray-600 space-y-4 text-sm sm:text-base">
            <ul className="list-disc list-inside space-y-2">
              <li>AI Chat Companion providing empathetic, supportive conversations.</li>
              <li>Smart Journaling with AI-generated summaries and emotion analysis.</li>
              <li>Mood Tracker & Analytics to visualize emotional trends over time.</li>
              <li>Mindfulness tools including guided breathing, meditations, and ambient sounds.</li>
              <li>Personalized AI Insights and daily affirmations for actionable wellness suggestions.</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Start Your Wellness Journey</h2>
          <p className="text-sm sm:text-base mb-6">Join Vihaara and take the first step toward mindful, healthier living.</p>
          <a
            href="/dashboard"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Get Started
          </a>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;
