"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="container justify-center flex flex-col items-center mx-auto px-4 py-12 bg-gradient-to-br from-white to-amber-50">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-[#4f5ed7] mb-12 text-center border-b-4 border-[#4f5ed7] pb-4 inline-block"
      >
        About UGLearn
      </motion.h1>
      <div className="prose max-w-4xl mx-auto backdrop-blur-sm bg-white/50 p-8 rounded-2xl shadow-xl">
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-lg leading-relaxed text-gray-700"
        >
          UGLearn is a leading platform dedicated to providing high-quality, university-specific courses to students across the globe. Our mission is to bridge the gap between traditional education and the ever-evolving demands of the professional world, offering a seamless learning experience.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-lg leading-relaxed text-gray-700"
        >
          Founded in 2025, UGLearn has quickly become a trusted resource for students seeking to enhance both their academic knowledge and practical skills. We collaborate with top universities and industry experts to create courses that are academically rigorous and relevant to today's job market.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6 text-lg leading-relaxed text-gray-700"
        >
          Our platform offers a wide range of semester-wise curated courses across various disciplines, with a special focus on Business Administration (BBA) and Technology (B.Tech) programs. UGLearn simplifies exam preparations by providing comprehensive resources for semester exams, including end-term exams (ETE), mid-term exams (MTE), and other university-specific assessments. Say goodbye to endless content searches on the internet - UGLearn brings everything you need in one place.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg leading-relaxed text-gray-700"
        >
          Whether you're looking to strengthen your understanding of management principles, dive deep into data structures, or explore any other academic area, UGLearn has something for you. We believe in the power of education to transform lives and shape the future. Join us on this exciting journey of learning and growth!
        </motion.p>
      </div>
    </div>
  )
}
