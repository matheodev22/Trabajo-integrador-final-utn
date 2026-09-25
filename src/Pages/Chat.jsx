import { useSearchParams } from "react-router-dom";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";
import { useEffect, useState } from "react";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme !== "light";
  });

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleSearch = (value) => {
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMobileChatOpen(true);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setMobileChatOpen(false);
  };

  return (
    <main
      className={`chat-app ${
        mobileChatOpen ? "mobile-chat-open" : ""
      }`}
    >
      <ChatList
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        search={search}
        onSearch={handleSearch}
        darkMode={darkMode}
        onToggleTheme={() =>
          setDarkMode((current) => !current)
        }
      />

      <ChatWindow
        selectedChat={selectedChat}
        onBack={handleBack}
      />
    </main>
  );
}

export default Chat;