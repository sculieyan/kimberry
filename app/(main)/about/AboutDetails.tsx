'use client';

import ClientErrorBoundary from '@/components/ClientErrorBoundary';

import { useState } from 'react';
import { AnswerContent, ContentElement, FAQ } from '../types/types';



export default function AboutDetails({ qas }: { qas: FAQ[] }) {
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const processedFaqs = qas.length > 0 ? qas.map((faq: FAQ) => ({
        ...faq,
        answer: JSON.parse(faq.answer.toString())
    })).sort((a: FAQ, b: FAQ) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)) : [];

    return (
        <ClientErrorBoundary>
            <div className="container mx-auto px-4 max-w-4xl font-josefin">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600 text-center mb-12 font-josefin">
                    Find answers to common questions about our products and certifications
                </p>

                <div className="space-y-4">
                    {processedFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 pr-8">{faq.question}</h3>
                                <svg
                                    className={`w-6 h-6 transform transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <div
                                className={`px-6 transition-all duration-200 ease-in-out overflow-hidden ${expandedFaq === faq.id ? 'max-h-[1000px] pb-6' : 'max-h-0'
                                    }`}
                            >
                                {faq.answer.map((answer: AnswerContent, index: number) => {
                                    switch (answer.type) {
                                        case 'text':
                                            return (
                                                <p
                                                    key={`${faq.id}-${index}`}
                                                    className="text-gray-600 mb-4"
                                                >
                                                    {answer.content}
                                                </p>
                                            );
                                        case 'list':
                                            return (
                                                <ul
                                                    key={`${faq.id}-${index}`}
                                                    className="list-disc list-inside text-gray-600 mb-4 space-y-2"
                                                >
                                                    {answer.items?.map((item, itemIndex) => (
                                                        <li
                                                            key={`${faq.id}-${index}-${itemIndex}`}
                                                            className="ml-4"
                                                        >
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            );
                                        case 'section':
                                            return (
                                                <div
                                                    key={`${faq.id}-${index}`}
                                                    className="mb-4"
                                                >
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                        {answer.title}
                                                    </h4>
                                                    {answer.content && (
                                                        Array.isArray(answer.content) ? (
                                                            answer.content.map((element, contentIndex) => (
                                                                <p
                                                                    key={`${faq.id}-${index}-${contentIndex}`}
                                                                    className="text-gray-600 mb-2"
                                                                >
                                                                    {typeof element === 'string' ? element : (element as ContentElement).content}
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-600">
                                                                {answer.content}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ClientErrorBoundary>
    )
}