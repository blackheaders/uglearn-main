"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header className="bg-white shadow-lg z-40 sticky top-0">
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center bg-white">
        <Link href="/" className="text-2xl font-bold text-[#4f5ed7] hover:scale-105 transition-transform duration-300">
          UGLearn
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
              isActivePath('/') ? 'text-[#4f5ed7] font-semibold border-b-2 border-[#4f5ed7]' : 'text-gray-600 hover:border-b-2 hover:border-[#4f5ed7]'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/courses" 
            className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
              isActivePath('/courses') ? 'text-[#4f5ed7] font-semibold border-b-2 border-[#4f5ed7]' : 'text-gray-600 hover:border-b-2 hover:border-[#4f5ed7]'
            }`}
          >
            Courses
          </Link>
          {session && (
            <Link 
              href="/my-courses" 
              className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                isActivePath('/my-courses') ? 'text-[#4f5ed7] font-semibold border-b-2 border-[#4f5ed7]' : 'text-gray-600 hover:border-b-2 hover:border-[#4f5ed7]'
              }`}
            >
              My Courses
            </Link>
          )}
          <Link 
            href="/about" 
            className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
              isActivePath('/about') ? 'text-[#4f5ed7] font-semibold border-b-2 border-[#4f5ed7]' : 'text-gray-600 hover:border-b-2 hover:border-[#4f5ed7]'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
              isActivePath('/contact') ? 'text-[#4f5ed7] font-semibold border-b-2 border-[#4f5ed7]' : 'text-gray-600 hover:border-b-2 hover:border-[#4f5ed7]'
            }`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-[#4f5ed7] font-semibold text-lg">Hello, {session?.user?.name}</span>
                {/* @ts-ignore */}
                {session.user.role === "admin" && (
                  <Button
                    variant="outline"
                    className="bg-[#5C67E5] hover:bg-[#4f5ed7] text-white transform hover:scale-105 transition-all duration-300 shadow-lg px-6 py-2 rounded-full font-semibold"
                    onClick={() => router.push("/admin")}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-[#5C67E5] hover:bg-[#4f5ed7] text-white transform hover:scale-105 transition-all duration-300 shadow-lg px-6 py-2 rounded-full font-semibold"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
              <div className="md:hidden">
                <span className="text-[#4f5ed7] font-semibold text-sm">Hello, {session?.user?.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7] transform hover:scale-105 transition-all duration-300 shadow-lg px-8 py-2 rounded-full font-semibold"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`absolute top-full left-0 right-0 bg-white shadow-lg md:hidden transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-4 p-4">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                isActivePath('/') ? 'text-[#4f5ed7] font-semibold' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/courses"
              onClick={() => setIsMenuOpen(false)} 
              className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                isActivePath('/courses') ? 'text-[#4f5ed7] font-semibold' : 'text-gray-600'
              }`}
            >
              Courses
            </Link>
            {session && (
              <Link 
                href="/my-courses"
                onClick={() => setIsMenuOpen(false)} 
                className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                  isActivePath('/my-courses') ? 'text-[#4f5ed7] font-semibold' : 'text-gray-600'
                }`}
              >
                My Courses
              </Link>
            )}
            <Link 
              href="/about"
              onClick={() => setIsMenuOpen(false)} 
              className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                isActivePath('/about') ? 'text-[#4f5ed7] font-semibold' : 'text-gray-600'
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/contact"
              onClick={() => setIsMenuOpen(false)} 
              className={`transition-all duration-300 hover:text-[#4f5ed7] text-lg ${
                isActivePath('/contact') ? 'text-[#4f5ed7] font-semibold' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
            {session && (
              <>
                {/* @ts-ignore */}
                {session.user.role === "admin" && (
                  <Button
                    variant="outline"
                    className="bg-[#5C67E5] hover:bg-[#4f5ed7] text-white transform hover:scale-105 transition-all duration-300 shadow-lg px-4 py-1 rounded-full font-semibold text-sm"
                    onClick={() => {
                      router.push("/admin");
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-[#5C67E5] hover:bg-[#4f5ed7] text-white transform hover:scale-105 transition-all duration-300 shadow-lg px-4 py-1 rounded-full font-semibold text-sm"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
