import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

const Help = () => {
  const faqs = [
    "What is this platform about?",
    "How can I contribute to the platform?",
    "Is the platform open to everyone, or only professionals?",
    "How can the platform help in the conservation of historical buildings?",
    "Can I collaborate with others on conservation projects through this platform?",
    "What types of articles or content can I publish on the platform?",
  ];

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] =useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('id'); // Assuming the user ID is saved in localStorage

    // Create a message object with form data
    const messageData = {
      userId, // Assuming the userId is stored in localStorage
      subject, // You can customize the subject
      message: description,
      senderName: name,
    };

    try {
      // Send a POST request to the backend to save the message
      const response = await axios.post('http://localhost:4000/api/messages', messageData);
      console.log('Message sent successfully:', response.data);
      alert('Your message has been sent successfully.');
      // Optionally, clear the form fields after submission
      setEmail('');
      setName('');
      setSubject('');
      setDescription('');

      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending your message.');
    }
  };

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

      {/* Message form */}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Have a Question</h2>
        


      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold">Your Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter an accessible e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold">Your Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Subject Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold">Subject</label>
          <input
            type="text"
            id="subject"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter the subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-semibold">Description</label>
          <textarea
            id="description"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Write your message here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-main text-white rounded-md hover:bg-main/80 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>

      </div>
  );
};

export default Help;
