import { ChevronDown } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";
import { useState, useContext, useRef } from "react";
import { GlobalContext } from "../context/GlobelContext.js";
import { Toast } from "primereact/toast";

const Help = () => {
  const toastBC = useRef(null);

  const faqs = [
    {
      title: "What is this platform about?",
      content:
        "This platform connects academics, professionals, and enthusiasts to share knowledge on architecture, heritage conservation, and ancient civilizations. We aim to raise awareness and promote the preservation of historical sites.",
    },
    {
      title: "How can I contribute to the platform?",
      content:
        "You can contribute by writing articles, joining discussions, and sharing resources. You can also share events, activities, and conferences links. Whether you're an expert or a hobbyist, your contributions are welcome.",
    },
    {
      title: "Is the platform open to everyone, or only professionals?",
      content:
        "The platform is open to anyone interested in heritage conservation, from professionals to enthusiasts. We encourage everyone to engage and share knowledge.",
    },
    {
      title:
        "How can the platform help in the conservation of historical buildings?",
      content:
        "Our platform aims to spread awareness about the importance of preserving historical buildings by facilitating knowledge exchange and connecting people passionate about conservation. By sharing research, best practices, and challenges faced in conservation efforts, we aim to inspire action and collaboration that can lead to tangible efforts in preserving ancient structures like Pharaonic monuments, temples, and more.",
    },
    {
      title:
        "Can I collaborate with others on conservation projects through this platform?",
      content:
        "Yes! The platform is a great place to connect with others for collaboration on research, projects, and conservation efforts.",
    },
    {
      title: "What types of articles or content can I publish on the platform?",
      content:
        "You can publish articles on heritage conservation, restoration techniques, case studies, and the history of ancient civilizations. Content should focus on preserving cultural landmarks.",
    },
  ];

  const { isAuthUser } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("id");
    const messageData = {
      userId,
      subject,
      email,
      message: description,
      senderName: name,
    };

    try {
      const data = await axios.post(
        "https://agyademo.uber.space/api/messages",
        messageData
      );
      const finalData = await data.json();
      if (finalData) {
        toastBC.current.show({
          severity: "success",
          summary: "Your message has been sent successfully.",
          sticky: true,
        });
      }
      setEmail("");
      setName("");
      setSubject("");
      setDescription("");
    } catch (error) {
      toastBC.current.show({
        severity: "success",
        summary: "Your message has been sent successfully.",
        sticky: true,
      });
    }
  };

  const auth = isAuthUser?.email;

  return (
    <div className="min-h-screen md:mx-[85px]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <Navbar />
        <div className="flex flex-col lg:flex-row my-6 lg:my-10 gap-6">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block lg:w-64">
            {auth ? <Sidebar /> : <SidebarGuest />}
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                Help
              </h1>

              {/* FAQs Section */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
                  FAQs
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg duration-500 ${
                        active === index ? "border-main" : "border-gray-200"
                      } overflow-hidden`}
                      onClick={() =>
                        active === index ? setActive(null) : setActive(index)
                      }
                    >
                      <div
                        className={`p-4 cursor-pointer flex justify-between items-center text-gray-800 hover:bg-gray-50 ${
                          active === index ? "text-main" : ""
                        }`}
                      >
                        <p className="text-sm sm:text-base pr-4">{faq.title}</p>
                        <button
                          className={`rounded-lg bg-main text-white w-6 h-6 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${
                            active === index ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className={`px-4 pb-4 text-sm text-gray-600 ${
                          active === index ? "block" : "hidden"
                        }`}
                      >
                        <p>{faq.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
                  Have a Question
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-w-2xl mx-auto"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-semibold mb-1"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-main/20 focus:border-main transition"
                      placeholder="Enter an accessible e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-semibold mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-main/20 focus:border-main transition"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 text-sm font-semibold mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-main/20 focus:border-main transition"
                      placeholder="Enter the subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-gray-700 text-sm font-semibold mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-main/20 focus:border-main transition"
                      placeholder="Write your message here"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="4"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-main text-white rounded-md hover:bg-main/90 transition duration-200 font-medium"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast ref={toastBC} position="top-right" />
    </div>
  );
};

export default Help;
