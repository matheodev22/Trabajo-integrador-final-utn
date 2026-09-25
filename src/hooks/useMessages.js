import { useEffect, useState } from "react";

const initialMessages = {
  // PRIVADO - tradeo
  1: [
    {
      id: 1,
      text: "che amigo me sangra los ojos cuando juega deyverson",
      sender: "received",
      time: "14:32",
      status: "read",
    },
    {
      id: 2,
      text: "hay q hacer algo urgente no le hace un gol ni al arcoiris",
      sender: "received",
      time: "14:33",
      status: "read",
    },
    {
      id: 3,
      text: "boludo hay q matarlo no puede ser tan burro",
      sender: "sent",
      time: "14:34",
      status: "read",
    },
  ],

  // GRUPO - los pijes.fc
  2: [
    {
      id: 4,
      text: "cuando vamos a jugar contra barcito? estan muy bocones en ig",
      sender: "received",
      senderName: "tradeo",
      senderAvatar: "",
      time: "13:20",
      status: "read",
    },
    {
      id: 5,
      text: "este sabado le jugamos f8 en el conteiner",
      sender: "received",
      senderName: "ortega",
      senderAvatar: "",
      time: "13:24",
      status: "unread",
    },
    {
      id: 6,
      text: "yo puedo el sabado",
      sender: "received",
      senderName: "deyver",
      senderAvatar: "",
      time: "13:26",
      status: "read",
    },
    {
      id: 7,
      text: "yo llego un poco mas tarde",
      sender: "received",
      senderName: "mati",
      senderAvatar: "",
      time: "13:28",
      status: "read",
    },
    {
      id: 8,
      text: "d1 entonces tamos para el sabado",
      sender: "sent",
      time: "13:30",
      status: "read",
    },
  ],

  // PRIVADO - weirdo
  3: [
    {
      id: 9,
      text: "papoi no me voy mas de la facultad",
      sender: "received",
      time: "12:10",
      status: "read",
    },
    {
      id: 10,
      text: "avisame si cuando salgo venis a buscarme",
      sender: "received",
      time: "12:11",
      status: "read",
    },
  ],

  // PRIVADO - mama
  4: [
    {
      id: 11,
      text: "matheo despertate!!!! 😡😡😡",
      sender: "received",
      time: "11:45",
      status: "read",
    },
  ],

  // GRUPO - familia
  5: [
    {
      id: 12,
      text: "tu hermano se fue al colegio...??",
      sender: "received",
      senderName: "Mamá",
      senderAvatar: "",
      time: "10:30",
      status: "read",
    },
    {
      id: 13,
      text: "si mama",
      sender: "sent",
      time: "10:31",
      status: "read",
    },
    {
      id: 14,
      text: "yo también salgo ahora",
      sender: "received",
      senderName: "jere",
      senderAvatar: "",
      time: "10:32",
      status: "read",
    },
    {
      id: 15,
      text: "avisen cuando lleguen",
      sender: "received",
      senderName: "Mamá",
      senderAvatar: "",
      time: "10:33",
      status: "read",
    },
    {
      id: 16,
      text: "dale ma",
      sender: "sent",
      time: "10:34",
      status: "read",
    },
  ],

  // PRIVADO - abuelo
  6: [
    {
      id: 17,
      text: "matheo sabes si este finde vamos a poder ver la exposicion en la rural me acompañas?",
      sender: "received",
      time: "09:15",
      status: "read",
    },
  ],
};

function useMessages(selectedChatId) {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");

    return savedMessages
      ? JSON.parse(savedMessages)
      : initialMessages;
  });

  useEffect(() => {
    localStorage.setItem(
      "messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  const currentMessages =
    messages[selectedChatId] || [];

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: "sent",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
    };

    setMessages((current) => ({
      ...current,
      [selectedChatId]: [
        ...(current[selectedChatId] || []),
        newMessage,
      ],
    }));

    window.dispatchEvent(
      new CustomEvent("chat-message-sent", {
        detail: {
          chatId: selectedChatId,
          message: newMessage.text,
          time: newMessage.time,
        },
      })
    );
  };

  const editMessage = (messageId, newText) => {
    if (!newText.trim()) return;

    setMessages((current) => ({
      ...current,
      [selectedChatId]: (
        current[selectedChatId] || []
      ).map((message) =>
        message.id === messageId
          ? {
              ...message,
              text: newText.trim(),
              edited: true,
            }
          : message
      ),
    }));
  };

  const deleteMessage = (messageId) => {
    setMessages((current) => ({
      ...current,
      [selectedChatId]: (
        current[selectedChatId] || []
      ).filter(
        (message) => message.id !== messageId
      ),
    }));
  };

  return {
    messages: currentMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
}

export default useMessages;