import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { FaHamburger } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaUserAstronaut } from "react-icons/fa";
import { GiRobotGolem } from "react-icons/gi";
import { FaPaperclip } from "react-icons/fa6";
import { FaImages } from "react-icons/fa";

import server from "../environment.js";
import Header from "../components/Header";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const docInputRef = useRef(null);
  const imgInputRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState("");

  const bottomRef = useRef(null);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || !currentChatId) return;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("chatId", currentChatId);

    setUploadStatus("Uploading document, please wait........");
    try {
      await fetch(`${server}/api/chat/upload/document`, {
        method: "POST",
        body: formData,
      });

      setUploadStatus("Upload Complete.");

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "system", content: `📄 ${file.name} uploaded` },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      setUploadStatus("Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentChatId) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("chatId", currentChatId);

    setUploadStatus("Uploading image...");

    try {
      await fetch(`${server}/api/chat/upload/image`, {
        method: "POST",
        body: formData,
      });

      setUploadStatus("Image uploaded");

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "system", content: `🖼️ ${file.name} uploaded` },
                ],
              }
            : chat
        )
      );
    } catch {
      setUploadStatus("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleClearAllChats = async () => {
    try {
      await fetch(`${server}/api/chat/new`, {
        method: "POST",
      });

      setChats([]);
      setCurrentChatId(null);
      setPrompt("");
    } catch (error) {
      console.error("Failed to clear all chats");
    }
  };

  const handleNewChat = async () => {
    const res = await fetch(`${server}/api/chat/new`, {
      method: "POST",
    });

    const data = await res.json();

    const newChat = {
      id: data.chatId,
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(data.chatId);
    setPrompt("");
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");

    let activeChatId = currentChatId;

    // 0. Auto-create chat if none exists
    if (!activeChatId) {
      const res = await fetch(`${server}/api/chat/new`, {
        method: "POST",
      });

      const data = await res.json();

      const newChat = {
        id: data.chatId,
        title: "New Chat",
        messages: [],
      };

      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(data.chatId);
      activeChatId = data.chatId;
    }

    // 1. Add user message + Thinking...
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? userMessage.slice(0, 30)
                  : chat.title,
              messages: [
                ...chat.messages,
                { role: "user", content: userMessage },
                { role: "model", content: "Thinking..." },
              ],
            }
          : chat
      )
    );

    try {
      const res = await fetch(`${server}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: activeChatId,
          message: userMessage,
        }),
      });

      const data = await res.json();

      // 2. Replace Thinking... with real reply
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages.slice(0, -1),
                  { role: "model", content: data.reply },
                ],
              }
            : chat
        )
      );
    } catch {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages.slice(0, -1),
                  { role: "model", content: "Something went wrong." },
                ],
              }
            : chat
        )
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        isOpen={isOpen}
        toggleSideBar={toggleSideBar}
        handleNewChat={handleNewChat}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        handleClearAllChats={handleClearAllChats}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden p-3 sm:p-4 bg-gray-800 text-xl sm:text-2xl">
          <button
            onClick={toggleSideBar}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <FaHamburger />
          </button>
        </div>

        <Header />

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 px-2 sm:px-6 py-2 sm:py-6 overflow-y-auto thin-scrollbar">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 sm:mb-4 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[75%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg items-start sm:items-center gap-2 ${
                      msg.role === "user"
                        ? "bg-blue-600 rounded-br-none"
                        : "bg-gray-700 rounded-bl-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <FaUserAstronaut className="mt-1 sm:mt-0 shrink-0" />
                    ) : (
                      <GiRobotGolem className="mt-1 sm:mt-0 shrink-0" />
                    )}
                    <span className="wrap-break-words leading-relaxed">
                      {msg.content}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-16 sm:mt-20">
                No chats yet.
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar - Mobile optimized */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 px-2 sm:px-4 py-3 sm:py-4">
            <form
              onSubmit={submitHandler}
              className="flex items-stretch gap-1 sm:gap-2 max-w-full sm:max-w-4xl mx-auto focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 transition"
            >
              <input
                className="flex-1 px-3 sm:px-4 py-3 h-12 sm:h-auto rounded-l-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none text-sm sm:text-base"
                type="text"
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />

              <input
                type="file"
                accept=".pdf"
                ref={docInputRef}
                hidden
                onChange={handleDocumentUpload}
              />
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={imgInputRef}
                hidden
                onChange={handleImageUpload}
              />

              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="p-3 sm:p-4 bg-gray-700 text-xl sm:text-2xl hover:bg-gray-600 focus:outline-none transition flex items-center justify-center shrink-0"
                aria-label="Attach document"
              >
                <FaPaperclip />
              </button>

              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="p-3 sm:p-4 bg-gray-700 text-xl sm:text-2xl hover:bg-gray-600 focus:outline-none transition flex items-center justify-center shrink-0"
                aria-label="Attach image"
              >
                <FaImages />
              </button>

              <button
                disabled={isUploading}
                type="submit"
                className="p-3 sm:p-4 bg-blue-600 hover:bg-blue-500 rounded-r-lg text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center shrink-0"
              >
                <IoMdSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
