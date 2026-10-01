// ========================================
// MENSAJES INICIALES
// ========================================

export const initialMessages = {
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
      senderName: "Mati Ortega",
      senderAvatar: "MO",
      time: "13:24",
      status: "read",
    },
    {
      id: 12,
      text: "yo puedo el sabado",
      sender: "received",
      senderName: "Agus",
      senderAvatar: "A",
      time: "13:26",
      status: "read",
    },
    {
      id: 13,
      text: "yo llego un poco mas tarde",
      sender: "received",
      senderName: "Joel",
      senderAvatar: "J",
      time: "13:28",
      status: "read",
    },
    {
      id: 14,
      text: "yo también puedo",
      sender: "received",
      senderName: "Juan Mati",
      senderAvatar: "JM",
      time: "13:30",
      status: "read",
    },
    {
      id: 16,
      text: "listo de una jugamos el sabado",
      sender: "sent",
      time: "14:50",
      status: "read",
    },
  ],

  3: [
    {
      id: 6,
      text: "si papoi te cruzo en el camino",
      sender: "sent",
      time: "12:30",
      status: "read",
    },
    {
      id: 7,
      text: "dale bb",
      sender: "received",
      senderName: "weirdo",
      senderAvatar: "W",
      time: "12:31",
      status: "read",
    },
  ],

  4: [
    {
      id: 17,
      text: "che zaro q onda con la carrera?",
      sender: "sent",
      time: "17:15",
      status: "read",
    },
    {
      id: 18,
      text: "y amigo me estan matando jajaj",
      sender: "received",
      senderName: "zaro",
      senderAvatar: "Z",
      time: "17:20",
      status: "read",
    },
    {
      id: 19,
      text: "mal, es una banda o q?",
      sender: "sent",
      time: "17:57",
      status: "read",
    },
    {
      id: 20,
      text: "si boludo, no paro de tener cosas para hacer",
      sender: "received",
      senderName: "zaro",
      senderAvatar: "Z",
      time: "17:58",
      status: "read",
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
      id: 14,
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
      id: 21,
      text: "Hola abuelo sisi estoy el finde",
      sender: "sent",
      time: "10:32",
      status: "read",
    },
  ],
};


// ========================================
// CREAR MENSAJE
// ========================================

export const createMessage = (text) => {
  const cleanText = text?.trim();

  if (!cleanText) {
    return null;
  }

  return {
    id: Date.now(),
    text: cleanText,
    sender: "sent",
    time: new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
    status: "sent",
  };
};


// ========================================
// AGREGAR MENSAJE
// ========================================

export const addMessage = (
  messages,
  chatId,
  message
) => {
  return {
    ...messages,

    [chatId]: [
      ...(messages[chatId] || []),
      message,
    ],
  };
};


// ========================================
// EDITAR MENSAJE
// ========================================

export const editMessage = (
  messages,
  chatId,
  messageId,
  newText
) => {
  const cleanText = newText?.trim();

  if (!cleanText) {
    return messages;
  }

  return {
    ...messages,

    [chatId]: (
      messages[chatId] || []
    ).map((message) =>
      message.id === messageId
        ? {
            ...message,
            text: cleanText,
            edited: true,
          }
        : message
    ),
  };
};


// ========================================
// ELIMINAR MENSAJE
// ========================================

export const deleteMessage = (
  messages,
  chatId,
  messageId
) => {
  return {
    ...messages,

    [chatId]: (
      messages[chatId] || []
    ).filter(
      (message) =>
        message.id !== messageId
    ),
  };
};


// ========================================
// MARCAR MENSAJES COMO LEÍDOS
// ========================================

export const markMessagesAsRead = (
  messages,
  chatId
) => {
  if (!messages[chatId]) {
    return messages;
  }

  return {
    ...messages,

    [chatId]: messages[chatId].map(
      (message) =>
        message.sender === "received"
          ? {
              ...message,
              status: "read",
            }
          : message
    ),
  };
};