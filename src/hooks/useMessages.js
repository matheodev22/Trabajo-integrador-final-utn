import { useEffect, useState } from "react";

import {
  getSavedMessages,
  saveMessages,
} from "../Logic/storageLogic";

import {
  initialMessages,
  createMessage,
  addMessage,
  editMessage,
  deleteMessage,
  markMessagesAsRead,
} from "../Logic/messageLogic";

function useMessages(selectedChat) {
  const chatId = selectedChat?.id;

  const [messages, setMessages] = useState(() => {
  return getSavedMessages(
    initialMessages
  );
});
 
  useEffect(() => {
  saveMessages(messages);
}, [messages]);

  
  useEffect(() => {
    if (!chatId) return;

    setMessages((currentMessages) =>
      markMessagesAsRead(currentMessages, chatId)
    );
  }, [chatId]);


  useEffect(() => {
    const handleMessagesRead = (event) => {
      const { chatId: eventChatId } = event.detail;

      if (!eventChatId) return;

      setMessages((currentMessages) =>
        markMessagesAsRead(currentMessages, eventChatId)
      );
    };

    window.addEventListener(
      "chat-messages-read",
      handleMessagesRead
    );

    return () => {
      window.removeEventListener(
        "chat-messages-read",
        handleMessagesRead
      );
    };
  }, []);

 
  const sendMessage = (text) => {
    if (!chatId) return null;

    const message = createMessage(text);

    if (!message) return null;

    setMessages((currentMessages) =>
      addMessage(currentMessages, chatId, message)
    );

    window.dispatchEvent(
      new CustomEvent("chat-message-sent", {
        detail: {
          chatId,
          message: message.text,
          time: message.time,
        },
      })
    );

    return message;
  };

 
  const handleEditMessage = (messageId, newText) => {
    if (!chatId) return;

    setMessages((currentMessages) =>
      editMessage(
        currentMessages,
        chatId,
        messageId,
        newText
      )
    );
  };

 
  const handleDeleteMessage = (messageId) => {
    if (!chatId) return;

    setMessages((currentMessages) =>
      deleteMessage(
        currentMessages,
        chatId,
        messageId
      )
    );
  };


  const chatMessages = chatId
    ? messages[chatId] || []
    : [];

  return {
    messages: chatMessages,
    sendMessage,
    editMessage: handleEditMessage,
    deleteMessage: handleDeleteMessage,
  };
}

export default useMessages;