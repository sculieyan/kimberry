'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image' // 导入图片组件

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 移除 isProductsOpen 状态
    const pathname = usePathname();
    const isActivePath = (path: string) => {
        if (path === '/') {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };
    return (
        <header>
            <nav className="fixed w-full bg-green-50 backdrop-blur-sm z-50 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* 👇 这里是调整好的 Logo 区域 */}
                            <Link href="/" className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                <Image
                                    src="/brands/logo.png"
                                    alt="Kimberry Trademark"
                                    width={100}  // 随便填，不影响
                                    height={48}  // 控制高度
                                    className="h-[48px] w-auto object-contain -translate-y-1"
                                    unoptimized
                                />
                                <span className='font-josefin'>Kimberry</span>
                            </Link>
                        </div>
                        <button
                            className="md:hidden text-gray-700 hover:text-green-700"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                        <div className="hidden md:flex space-x-8">
                            <Link
                                href="/"
                                className={`text-sm font-bold font-josefin ${isActivePath('/') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className={`text-sm font-bold font-josefin ${isActivePath('/products') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                            >
                                Our Products
                            </Link>
                            <Link
                                href="/story"
                                className={`text-sm font-bold font-josefin ${isActivePath('/about') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                                    }`}
                            >
                                Our Story
                            </Link>
                            <Link
                                href="/contact"
                                className={`text-sm font-bold font-josefin ${isActivePath('/contact') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                                    }`}
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/shop"
                                className={`text-sm font-bold font-josefin ${isActivePath('/shop') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                            >
                                Shop
                            </Link>
                        </div>
                    </div>
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4">
                            <div className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className={`text-sm font-josefin font-bold ${isActivePath('/') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className={`text-sm font-josefin font-bold ${isActivePath('/products') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Our Products
                                </Link>
                                <Link
                                    href="/story"
                                    className={`text-sm font-josefin font-bold ${isActivePath('/about') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Our Story
                                </Link>
                                <Link
                                    href="/contact"
                                    className={`text-sm font-josefin font-bold ${isActivePath('/contact') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    href="/shop"
                                    className={`text-sm font-josefin font-bold ${isActivePath('/shop') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Shop
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}