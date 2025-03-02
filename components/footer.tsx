import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#3948b5] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UGLearn</h3>
            <p className="text-sm">
              UGlearn is democratizing UG Education making it accessible to all,
              join the revolution for a stress free and trusted content for UG
              education on India's first platform offering customized solutions
              for UG courses.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/courses">Courses</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p>Email: hellouglearn@gmail.com</p>
            <p>Phone: +91 8368505428</p>
            <div className="mt-4 flex space-x-6">
              <Link href="https://www.instagram.com/uglearn" target="_blank">
                <FaInstagram className="text-white text-2xl hover:text-gray-400" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/uglearn-savvy"
                target="_blank">
                <FaLinkedin className="text-white text-2xl hover:text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2025 UGLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
