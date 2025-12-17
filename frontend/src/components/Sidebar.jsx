import { IoIosCloseCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

const Sidebar = ({
  isOpen,
  toggleSideBar,
  handleNewChat,
  chats,
  currentChatId,
  onSelectChat,
  handleClearAllChats,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 p-4 transition-transform transform md:relative md:translate-x-0 md:w-1/4 md:block ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button (mobile) */}
      <button
        className="md:hidden p-2 mb-4 bg-gray-700 rounded text-2xl"
        onClick={toggleSideBar}
      >
        <IoIosCloseCircle size={28} />
      </button>

      {/* Title */}
      <div className="text-2xl font-semibold mb-6 text-left">INFOchat</div>

      {/* New Chat */}
      <div className="mb-4">
        <button
          className="flex w-full py-2 bg-gray-700 hover:bg-gray-600 rounded justify-center items-center gap-2"
          onClick={handleNewChat}
        >
          New Chat <FaPlus />
        </button>
      </div>

      {/* Recent Chats */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Recent</p>

        <div className="max-h-125 overflow-y-auto thin-scrollbar">
          {chats.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">
              No recent chats
            </p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded mt-2 truncate ${
                  chat.id === currentChatId
                    ? "bg-gray-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {chat.title}
              </button>
            ))
          )}
        </div>
        {chats.length > 0 && (
          <button
            onClick={handleClearAllChats}
            className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 rounded flex justify-center items-center gap-2 text-white"
          >
            Clear All Chats <IoTrashBinSharp />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
