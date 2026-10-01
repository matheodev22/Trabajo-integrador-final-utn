import { useEffect, useState } from "react";

import {
  getStorageItem,
  setStorageItem,
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
    return getStorageItem(
      "messages",
      initialMessages
    );
  });


  // ========================================
  // GUARDAR MENSAJES
  // ========================================

  useEffect(() => {
    setStorageItem(
      "messages",
      messages
    );
  }, [messages]);


  // ========================================
  // MARCAR MENSAJES COMO LEÍDOS
  // ========================================

  useEffect(() => {
    if (!chatId) {
      return;
    }

    setMessages((currentMessages) =>
      markMessagesAsRead(
        currentMessages,
        chatId
      )
    );
  }, [chatId]);


  // ========================================
  // ESCUCHAR CUANDO CHATLIST MARCA LEÍDO
  // ========================================

  useEffect(() => {
    const handleMessagesRead = (event) => {
      const { chatId: eventChatId } =
        event.detail;

      if (!eventChatId) {
        return;
      }

      setMessages((currentMessages) =>
        markMessagesAsRead(
          currentMessages,
          eventChatId
        )
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


  // ========================================
  // ENVIAR MENSAJE
  // ========================================

  const sendMessage = (text) => {
    if (!chatId) {
      return null;
    }

    const message = createMessage(text);

    if (!message) {
      return null;
    }


    setMessages((currentMessages) =>
      addMessage(
        currentMessages,
        chatId,
        message
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "chat-message-sent",
        {
          detail: {
            chatId,
            message: message.text,
            time: message.time,
          },
        }
      )
    );


    return message;
  };


  // ========================================
  // EDITAR MENSAJE
  // ========================================

  const handleEditMessage = (
    messageId,
    newText
  ) => {
    if (!chatId) {
      return;
    }

    setMessages((currentMessages) =>
      editMessage(
        currentMessages,
        chatId,
        messageId,
        newText
      )
    );
  };


  // ========================================
  // ELIMINAR MENSAJE
  // ========================================

  const handleDeleteMessage = (
    messageId
  ) => {
    if (!chatId) {
      return;
    }

    setMessages((currentMessages) =>
      deleteMessage(
        currentMessages,
        chatId,
        messageId
      )
    );
  };


  // ========================================
  // MENSAJES DEL CHAT ACTUAL
  // ========================================

  const chatMessages =
    chatId
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