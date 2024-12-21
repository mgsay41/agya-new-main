import React from 'react';
import { ChevronDown } from 'lucide-react';

const Help = () => {
  const faqs = [
    "What is this platform about?",
    "How can I contribute to the platform?",
    "Is the platform open to everyone, or only professionals?",
    "How can the platform help in the conservation of historical buildings?",
    "Can I collaborate with others on conservation projects through this platform?",
    "What types of articles or content can I publish on the platform?",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-gray-800">Help</h1>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            number: "1",
            title: "Search and Filter",
            description:
              "Use the search bar and filters to find specific archaeological topics or areas of interest.",
          },
          {
            number: "2",
            title: "Explore and Learn",
            description:
              "Dive into detailed articles, case studies, and multimedia content to enhance your knowledge.",
          },
          {
            number: "3",
            title: "Interact and Engage",
            description:
              "Participate in forums, webinars, and events to connect with other enthusiasts and experts.",
          },
        ].map((step, index) => (
          <div
            key={index}
            className="p-4 border border-main rounded-lg text-center"
          >
            <h2 className="text-3xl font-bold text-main text-left">{step.number}.</h2>
            <h3 className="mt-2 text-md font-semibold text-gray-800">
              {step.title}
            </h3>
            <p className="mt-2 text-xs text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">FAQs</h2>
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="border-y border-gray-300 overflow-hidden"
            >
              <summary className="p-4 cursor-pointer flex justify-between items-center text-gray-800 hover:bg-gray-100">
                {faq}
                <button className='rounded-lg bg-main text-secondary-font w-6 h-6 flex items-center justify-center'><ChevronDown /> </button>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-600">
                {/* Add dynamic FAQ answers here */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore.
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
