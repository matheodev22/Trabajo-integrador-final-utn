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
  // Guardar mensajes en localStorage
  useEffect(() => {
  saveMessages(messages);
}, [messages]);

  // Marcar mensajes como leídos al abrir un chat
  useEffect(() => {
    if (!chatId) return;

    setMessages((currentMessages) =>
      markMessagesAsRead(currentMessages, chatId)
    );
  }, [chatId]);

  // Escuchar cuando otro componente marca un chat como leído
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

  // Enviar mensaje
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

  // Editar mensaje
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

  // Eliminar mensaje
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

  // Mensajes del chat seleccionado
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