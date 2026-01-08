import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { Button } from "../components";
import { toast } from "react-toastify";
import { getAllActivities } from "../services/mindfulnessService";

/* ---------------- CONSTANTS ---------------- */
const categories = ["all", "motivational", "mind relaxing", "feeling low"];
const MODES = ["audio", "breathing", "guided", "sleep"];

const guidedTexts = [
  "Close your eyes and take a deep breath.",
  "Notice five things you can see around you.",
  "Place one hand on your chest. Feel the calm.",
  "Let your thoughts come and go gently.",
];

const DAILY_GOAL = 10;
const SLEEP_AUDIO = "/sleep.mp3";

function Mindfulness() {
  const [activeMode, setActiveMode] = useState("audio");

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [sleepPlaying, setSleepPlaying] = useState(false);

  const [guidedIndex, setGuidedIndex] = useState(0);

  /* ✅ DAILY CALM */
  const [playSeconds, setPlaySeconds] = useState(0);
  const todayMinutes = Math.floor(playSeconds / 60);

  /* Breathing */
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");

  /* Audio refs */
  const audioRef = useRef(null);
  const sleepAudioRef = useRef(null);

  const toggleSleep = async () => {
    if (!sleepAudioRef.current) return;

    if (sleepPlaying) {
      sleepAudioRef.current.pause();
      sleepAudioRef.current.currentTime = 0;
      setSleepPlaying(false);
    } else {
      try {
        await sleepAudioRef.current.play();
        setSleepPlaying(true);
      } catch {
        toast.info("Tap to allow sleep audio");
      }
    }
  };

  /* ---------------- FETCH ACTIVITIES ---------------- */
  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const data = await getAllActivities();
        setActivities(data.activities || []);
      } catch {
        toast.error("Failed to load mindfulness activities");
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  /* ---------------- FILTER ---------------- */
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter(
          (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
    setCurrentIndex(0);
    stopAllMedia();
  }, [selectedCategory, activities]);

  /* ---------------- STOP MEDIA ON MODE CHANGE ---------------- */
  useEffect(() => {
    stopAllMedia();
    setBreathRunning(false);
  }, [activeMode]);

  /* ---------------- DAILY CALM TIMER ---------------- */
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setPlaySeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  /* ---------------- BREATHING LOGIC ---------------- */
  useEffect(() => {
    if (!breathRunning) return;
    const interval = setInterval(() => {
      setBreathPhase((p) => (p === "Inhale" ? "Exhale" : "Inhale"));
    }, 4000);
    return () => clearInterval(interval);
  }, [breathRunning]);

  /* ---------------- HELPERS ---------------- */
  const stopAllMedia = () => {
    setIsPlaying(false);

    if (audioRef.current instanceof HTMLAudioElement) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (sleepAudioRef.current instanceof HTMLAudioElement) {
      sleepAudioRef.current.pause();
      sleepAudioRef.current.currentTime = 0;
    }
  };

  const safePlay = async (ref) => {
    if (!ref.current) return;
    try {
      await ref.current.play();
    } catch {
      toast.info("Tap once to allow audio playback");
    }
  };

  const isYouTubeLink = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubeVideoId = (url) => {
    const match = url?.match(/^.*(youtu.be\/|watch\?v=)([^#&?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
  };

  /* ---------------- AUDIO CONTROLS ---------------- */
  const currentActivity = filteredActivities[currentIndex];
  const musicURL = currentActivity?.resourceUrl ?? null;

  const youtubeVideoId = isYouTubeLink(musicURL)
    ? getYouTubeVideoId(musicURL)
    : null;

  const toggleMusic = async () => {
    if (isPlaying) {
      stopAllMedia();
    } else {
      if (!youtubeVideoId) {
        await safePlay(audioRef);
      }
      setIsPlaying(true); // 🔥 THIS mounts YouTube with autoplay
    }
  };

  const tabStyle = (mode) =>
    `px-4 py-2 rounded ${activeMode === mode ? "bg-green-600 text-white" : "bg-gray-200"
    }`;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🧘‍♀️ Mindfulness Space
      </h1>

      <div className="flex gap-3 mb-6">
        {MODES.map((m) => (
          <button
            key={m}
            className={tabStyle(m)}
            onClick={() => setActiveMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="mb-4 font-semibold">
        🔥 Daily Calm: {todayMinutes}/{DAILY_GOAL} minutes
      </p>

      {/* ---------------- AUDIO ---------------- */}
      {activeMode === "audio" && (
        <>
          <div className="flex gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded ${selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {!loading && (
            <>
              <div className="bg-white p-4 rounded shadow text-center max-w-md">
                <h3 className="font-semibold">{currentActivity?.title}</h3>
                <p className="text-sm text-gray-600">
                  {currentActivity?.description}
                </p>
              </div>

              {/* ✅ YouTube auto-play via mount */}
              {youtubeVideoId && isPlaying && (
                <YouTube
                  videoId={youtubeVideoId}
                  opts={{
                    height: "0",
                    width: "0",
                    playerVars: { autoplay: 1 },
                  }}
                />
              )}

              {musicURL && !youtubeVideoId && (
                <audio ref={audioRef} src={musicURL} loop />
              )}

              <Button onClick={toggleMusic} className="mt-4">
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </>
          )}
        </>
      )}

      {/* ---------------- BREATHING ---------------- */}
      {activeMode === "breathing" && (
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">🌬️ Breathing Exercise</h2>
          <div
            className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white text-xl transition-all duration-[4000ms]
            ${breathPhase === "Inhale"
                ? "bg-green-400 scale-110"
                : "bg-blue-400 scale-90"
              }`}
          >
            {breathPhase}
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={() => setBreathRunning(true)}>Start</Button>
            <Button onClick={() => setBreathRunning(false)}>Stop</Button>
          </div>
        </div>
      )}

      {/* ---------------- GUIDED ---------------- */}
      {activeMode === "guided" && (
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">🧠 Guided Calm</h2>
          <p className="mb-4">{guidedTexts[guidedIndex]}</p>
          <Button
            onClick={() =>
              setGuidedIndex((i) => (i + 1) % guidedTexts.length)
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* ---------------- SLEEP ---------------- */}
      {activeMode === "sleep" && (
        <div className="bg-gray-900 text-white p-6 rounded text-center max-w-md">
          <h2 className="text-xl mb-4">🌙 Sleep Mode</h2>

          <audio ref={sleepAudioRef} src={SLEEP_AUDIO} loop />

          <Button onClick={toggleSleep}>
            {sleepPlaying ? "Stop Sleep Audio" : "Start Sleep Audio"}
          </Button>

          <p className="mt-3 text-sm text-gray-300">
            {sleepPlaying
              ? "😴 Sleep audio is playing..."
              : "Tap to start relaxing sleep sound"}
          </p>
        </div>
      )}

    </div>
  );
}

export default Mindfulness;
