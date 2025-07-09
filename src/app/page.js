'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400'] });

const images = [
  '/image/z6788876850964_e2c41ce670eee99467e87db52e3f7a90.jpg',
  '/image/z6788876852012_a41803a5ebdac3616ce3238e93df573e.jpg',
  '/image/z6788876855638_e20ea1b7308d005733a21b7204e8a313.jpg',
  '/image/z6788876855724_64f40a435fb141c9f7bde0f4042e3946.jpg',
  '/image/z6788876856311_5bb46751c3276ce3af9f5d789b8b789d.jpg',
  '/image/z6788876857075_92cebbd1dbc607f315bb3d1987a829f1.jpg',
  '/image/z6788876857265_6d8dd0f2ee7982fe343daa5128890655.jpg',
  '/image/z6788876857662_5aa4c5afe4138f02395e3cc69d966c70.jpg',
];

export default function BirthdayGalleryPage() {
  const [comments, setComments] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ name: '', message: '' });
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef(null);
  const scrollLine1 = useRef(null);
  const scrollLine2 = useRef(null);
  const [paused, setPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      alert('Vui lòng nhập đầy đủ tên và lời chúc.');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Gửi lời chúc thất bại.');
      }

      await fetchComments();
      setForm({ name: '', message: '' });
      setFormVisible(false);
    } catch (error) {
      console.error(error);
      alert('Đã có lỗi xảy ra khi gửi lời chúc.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getImageStyle = (index) => {
    const diff = (index - activeIndex + images.length) % images.length;
    if (index === activeIndex) {
      return 'scale-125 z-20 rotate-y-0 sm:w-80 sm:h-96 w-60 h-80 rounded';
    } else if (diff === 1 || diff === images.length - 1) {
      return 'scale-90 opacity-60 z-10 rotate-y-6 sm:w-48 sm:h-50 w-40 h-50 rounded';
    } else {
      return 'scale-75 opacity-0 z-0 hidden sm:block';
    }
  };

  useEffect(() => {
    let x1 = 0;
    let x2 = 0;
    let animationId;
    const speed = 0.5;

    const animate = () => {
      if (!paused) {
        x1 += speed;
        if (scrollLine1.current) {
          scrollLine1.current.style.transform = `translateX(${x1}px)`;
          if (Math.abs(x1) >= scrollLine1.current.scrollWidth / 2) x1 = 0;
        }

        x2 -= speed;
        if (scrollLine2.current) {
          scrollLine2.current.style.transform = `translateX(${x2}px)`;
          if (Math.abs(x2) >= scrollLine2.current.scrollWidth / 2) x2 = 0;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [paused, comments]);

  // ✅ Tự động phát nhạc sau 1 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 1;
        audio.muted = true;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setTimeout(() => (audio.muted = false), 500);
          })
          .catch((err) => {
            console.warn('Autoplay bị chặn:', err.message);
            setAudioBlocked(true);
            setIsPlaying(false);
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/audio/otpthaptammuoi.mp3" type="audio/mpeg" />
        Trình duyệt không hỗ trợ âm thanh.
      </audio>

      <button
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
          } else {
            audio.muted = false;
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => console.warn('Không thể phát audio'));
          }
        }}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition flex items-center justify-center"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[999]">
          <div className="flex flex-col loader items-center">
            <span className="loader-text text-pink-500 text-4xl font-bold mb-4">BaoNhi</span>
            <span className="load w-16 h-16 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></span>
          </div>
        </div>
      )}

      {!showIntro && (
        <>
          <div
            className="min-h-screen overflow-hidden bg-white text-center mb-2 p-3 font-sans relative select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="z-50 w-full pointer-events-none" style={{ top: '20px' }}>
              <div className="relative h-15 mb-2 flex flex-col justify-between gap-2">
                <div
                  className="flex whitespace-nowrap space-x-6 items-center px-4 py-2 absolute bottom-0"
                  ref={scrollLine2}
                  onClick={() => setPaused(!paused)}
                  style={{
                    willChange: 'transform',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    direction: 'rtl',
                  }}
                >
                  {[...comments.reverse(), ...comments.reverse()].map((c, idx) => (
                    <div
                      key={`line2-${idx}`}
                      className="inline-block bg-[#FFEAEA] text-gray-800 px-4 py-2 rounded shadow min-w-max"
                    >
                      <strong>{c.name}</strong>: {c.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_1px_0_#1f2937]">HAPPY LEVEL UP</h1>
            <h1 className="text-4xl font-bold text-black mb-2">HAPPY LEVEL UP</h1>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_1px_0_#1f2937]">HAPPY LEVEL UP</h1>
            <p className={`${dancingScript.className} italic text-gray-500 mb-6`}>Happy birthday</p>

            <div className="relative flex justify-center items-center space-x-6 mb-10 overflow-hidden h-[300px] sm:h-[400px]">
              <AnimatePresence mode="wait">
                {images.map((src, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden shadow-md transform transition-all duration-700 cursor-pointer ${getImageStyle(index)}`}
                    onClick={() => setActiveIndex(index)}
                    initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={src}
                      alt={`birthday-${index}`}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="pointer-events-none select-none"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-left max-w-3xl mx-auto text-sm text-gray-600 md:text-base">
              <p className="mb-4"><strong>LỜI CHÚC</strong></p>
              <p className={`${dancingScript.className} italic text-gray-500 mb-6`}>
                Chúc tuổi mới thật nhiều niềm vui, sức khỏe và luôn hạnh phúc. Hy vọng sẽ luôn là phiên bản tốt nhất của chính mình!
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <a href="https://www.tiktok.com/@connhongungocc" target="_blank" rel="noopener noreferrer">@baonhi</a>
                <p><span className="border-t border-gray-300 px-2">THỨ NĂM</span> 01 Tháng 07, 2025</p>
              </div>
            </div>

            <button
              onClick={() => setFormVisible(!formVisible)}
              className="mt-10 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            >
              {formVisible ? 'Đóng form' : 'Gửi lời chúc'}
            </button>

            {formVisible && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setFormVisible(false)}
              >
                <form
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={handleSubmit}
                  className="relative bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-pink-300"
                >
                  <button
                    type="button"
                    onClick={() => setFormVisible(false)}
                    className="absolute top-3 right-3 text-pink-500 hover:text-pink-700 transition text-xl"
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  <h2 className="text-pink-600 text-xl font-bold mb-4 text-center">
                    💌 Gửi lời chúc
                  </h2>

                  <input
                    type="text"
                    placeholder="Tên bạn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-700 focus:outline-pink-500 focus:bg-gray-200"
                  />

                  <textarea
                    placeholder="Lời chúc"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-700 focus:outline-pink-500 focus:bg-gray-200"
                    rows={4}
                  />

                  <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition"
                  >
                    🎀 Gửi lời chúc
                  </button>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
