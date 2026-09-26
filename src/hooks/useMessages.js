import { useEffect, useState } from "react";

const initialMessages = {
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

 2: [
  {
    id: 4,
    text: "ahora tradeo cuando vamos a jugar contra barcito? estan muy bocones en ig",
    sender: "received",
    senderName: "tradeo",
    senderAvatar: "T",
    time: "13:20",
    status: "read",
  },
  {
    id: 5,
    text: "este sabado le jugamos f8 en el conteiner",
    sender: "received",
    senderName: "Ortega",
    senderAvatar: "S",
    time: "13:24",
    status: "unread",
  },
  {
    id: 12,
    text: "yo puedo el sabado",
    sender: "received",
    senderName: "Joel",
    senderAvatar: "J",
    time: "13:26",
    status: "read",
  },
  {
    id: 13,
    text: "yo llego un poco mas tarde",
    sender: "received",
    senderName: "Mati",
    senderAvatar: "M",
    time: "13:28",
    status: "read",
  },
  {
    id: 16,
    text: "listo de una jugamos el sabado",
    time: "14:50",
    status: "read",
    sender: "sent",
  },
],

  3: [
    {
      id: 6,
      text: "papoi no me voy mas de la facultad",
      sender: "received",
      time: "12:10",
      status: "read",
    },
    {
      id: 7,
      
      text: "avisame asi cuando salgo venis a buscarme",
      sender: "received",
      time: "12:11",
      status: "read",
    },
    {
      id: 15,
      text: "gorda ya salgo y te cruzo te extraño",
      sender: "sent",
      time: "12:30",
      status: "read"

    },
  ],

  5: [
    {
      id: 8,
      text: "matheo despertate!!!! 😡😡😡",
      sender: "received",
      time: "11:45",
      status: "read",
    },
  ],

  6: [
    {
      id: 9,
      text: "Tu hermano se fue al colegio??",
      sender: "received",
      senderName: "Mamá",
      senderAvatar: "M",
      time: "10:30",
      status: "read",
    },
    {
      id: 10,
      text: "si mama",
      sender: "sent",
      time: "10:31",
      status: "read",
    },
    {
      id:14,
      text: "dejaste comida hecha ma?",
      sender: "received",
      senderName: "Jere",
      senderAvatar: "J",
      time: "11:30",
      status: "read",
    },
  ],

  7: [
    {
      id: 11,
      text: "matheo sabes si este finde vamos a poder ver la exposicion en la rural me acompañas?",
      sender: "received",
      time: "09:15",
      status: "read",
    },
    {
      id:17,
      text: "Hola abuelo sisi estoy el finde",
      sender: "sent",
      time: "15:32",
      status: "read",
    },
  ],
  4: [
  {
    id: 1,
    text: "che leo q onda con la uni?",
    sender: "sent",
    time: "17:15",
    status: "read",
  },
  {
    id: 2,
    text: "me estan garchando boludo",
    sender: "received",
    senderName: "zaro",
    senderAvatar: "Z",
    time: "17:20",
  },
  {
    id: 3,
    text: "xd pero q onda tanto?",
    sender: "sent",
    time: "17:57",
    status: "read",
  },
  {
    id: 4,
    text: "si no me paran de dar temas nuevos y no entiendo nada",
    sender: "received",
    senderName: "zaro",
    senderAvatar: "Z",
    time: "17:58",
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
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Marcar los mensajes recibidos como leídos
  // cuando entramos a una conversación.
  useEffect(() => {
    if (!selectedChatId) return;

    setMessages((current) => ({
      ...current,
      [selectedChatId]: (current[selectedChatId] || []).map(
        (message) =>
          message.sender === "received"
            ? {
                ...message,
                status: "read",
              }
            : message
      ),
    }));

    window.dispatchEvent(
      new CustomEvent("chat-messages-read", {
        detail: {
          chatId: selectedChatId,
        },
      })
    );
  }, [selectedChatId]);

  const currentMessages = messages[selectedChatId] || [];

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
      [selectedChatId]: (current[selectedChatId] || []).map(
        (message) =>
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
      [selectedChatId]: (current[selectedChatId] || []).filter(
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