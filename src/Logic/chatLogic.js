// ========================================
// CHATS INICIALES
// ========================================

export const initialChats = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    lastMessage:
      "boludo hay q matarlo no puede ser tan burro",
    time: "14:34",
    unread: 0,
    type: "contact",
  },

  {
    id: 2,
    name: "los pijes.fc",
    avatar: "LP",
    lastMessage:
      "listo de una jugamos el sabado",
    time: "14:50",
    unread: 0,
    type: "group",
    participants: [
      "tradeo",
      "Mati Ortega",
      "Agus",
      "Joel",
      "Juan Mati",
    ],
  },

  {
    id: 3,
    name: "weirdo",
    avatar: "W",
    lastMessage: "dale bb",
    time: "12:31",
    unread: 0,
    type: "contact",
  },

  {
    id: 4,
    name: "zaro",
    avatar: "Z",
    lastMessage:
      "si boludo, no paro de tener cosas para hacer",
    time: "17:58",
    unread: 0,
    type: "contact",
  },

  {
    id: 5,
    name: "mama",
    avatar: "M",
    lastMessage:
      "matheo despertate!!!! 😡😡😡",
    time: "11:45",
    unread: 0,
    type: "contact",
  },

  {
    id: 6,
    name: "familia",
    avatar: "F",
    lastMessage:
      "dejaste comida hecha ma?",
    time: "11:30",
    unread: 0,
    type: "group",
    participants: [
      "Mamá",
      "Jere",
      "Matheo",
    ],
  },

  {
    id: 7,
    name: "abuelo",
    avatar: "A",
    lastMessage:
      "Hola abuelo sisi estoy el finde",
    time: "10:32",
    unread: 0,
    type: "contact",
  },
];


// ========================================
// CONTACTOS INICIALES
// ========================================

export const initialContacts = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    chatId: 1,
  },

  {
    id: 2,
    name: "weirdo",
    avatar: "W",
    chatId: 3,
  },

  {
    id: 3,
    name: "mama",
    avatar: "M",
    chatId: 5,
  },

  {
    id: 4,
    name: "abuelo",
    avatar: "A",
    chatId: 7,
  },

  {
    id: 5,
    name: "Mati Ortega",
    avatar: "MO",
    chatId: 2,
  },

  {
    id: 6,
    name: "Agus",
    avatar: "A",
    chatId: 2,
  },

  {
    id: 7,
    name: "Joel",
    avatar: "J",
    chatId: 2,
  },

  {
    id: 8,
    name: "Juan Mati",
    avatar: "JM",
    chatId: 2,
  },

  {
    id: 9,
    name: "Jere",
    avatar: "J",
    chatId: 6,
  },

  {
    id: 10,
    name: "zaro",
    avatar: "Z",
    chatId: 4,
  },
];


// ========================================
// NORMALIZAR CONTACTOS
// ========================================

export const normalizeSavedContacts = (
  savedContacts
) => {
  if (!savedContacts) {
    return initialContacts;
  }

  return savedContacts.map((contact) => {
    if (contact.name === "Ortega") {
      return {
        ...contact,
        name: "Mati Ortega",
        avatar: "MO",
        chatId: 2,
      };
    }

    if (contact.name === "Mati") {
      return {
        ...contact,
        name: "Juan Mati",
        avatar: "JM",
        chatId: 2,
      };
    }

    if (contact.name === "zaro") {
      return {
        ...contact,
        avatar: "Z",
        chatId: 4,
      };
    }

    if (contact.name === "tradeo") {
      return {
        ...contact,
        chatId: 1,
      };
    }

    if (contact.name === "weirdo") {
      return {
        ...contact,
        chatId: 3,
      };
    }

    if (contact.name === "mama") {
      return {
        ...contact,
        chatId: 5,
      };
    }

    if (contact.name === "abuelo") {
      return {
        ...contact,
        chatId: 7,
      };
    }

    if (contact.name === "Jere") {
      return {
        ...contact,
        chatId: 6,
      };
    }

    return contact;
  });
};


// ========================================
// FILTRAR CHATS
// ========================================

export const filterChats = (
  chats,
  search,
  activeFilter
) => {
  return chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeFilter === "no-leidos") {
      return (
        matchesSearch &&
        chat.unread > 0
      );
    }

    if (activeFilter === "grupos") {
      return (
        matchesSearch &&
        chat.type === "group"
      );
    }

    return matchesSearch;
  });
};


// ========================================
// FILTRAR CONTACTOS
// ========================================

export const filterContacts = (
  contacts,
  search
) => {
  return contacts.filter((contact) =>
    contact.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );
};


// ========================================
// MARCAR CHAT COMO LEÍDO
// ========================================

export const markChatAsRead = (
  chats,
  chatId
) => {
  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          unread: 0,
        }
      : chat
  );
};


// ========================================
// ACTUALIZAR ÚLTIMO MENSAJE
// ========================================

export const updateChatLastMessage = (
  chats,
  chatId,
  message,
  time
) => {
  return chats
    .map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            lastMessage: message,
            time,
          }
        : chat
    )
    .sort((a, b) => {
      if (a.id === chatId) {
        return -1;
      }

      if (b.id === chatId) {
        return 1;
      }

      return 0;
    });
};


// ========================================
// ELIMINAR CHAT
// ========================================

export const deleteChat = (
  chats,
  chatId
) => {
  return chats.filter(
    (chat) => chat.id !== chatId
  );
};


// ========================================
// QUITAR CHAT DEL CONTACTO
// ========================================

export const removeChatFromContact = (
  contacts,
  chatId
) => {
  return contacts.map((contact) =>
    contact.chatId === chatId
      ? {
          ...contact,
          chatId: null,
        }
      : contact
  );
};


// ========================================
// SINCRONIZAR CONTACTOS CON CHATS
// ========================================

export const syncContactsWithChats = (
  contacts,
  chats
) => {
  return contacts.map((contact) => {
    if (
      contact.chatId &&
      chats.some(
        (chat) =>
          chat.id === contact.chatId
      )
    ) {
      return contact;
    }

    const matchingChat = chats.find(
      (chat) =>
        chat.type === "contact" &&
        chat.name.toLowerCase() ===
          contact.name.toLowerCase()
    );

    if (matchingChat) {
      return {
        ...contact,
        chatId: matchingChat.id,
      };
    }

    return {
      ...contact,
      chatId: null,
    };
  });
};


// ========================================
// ABRIR CHAT DESDE CONTACTO
// ========================================

export const openContactChat = (
  contact,
  chats,
  contacts
) => {
  let existingChat = null;

  // Buscar por chatId
  if (contact.chatId) {
    existingChat = chats.find(
      (chat) =>
        chat.id === contact.chatId
    );
  }

  // Buscar por contactId
  if (!existingChat) {
    existingChat = chats.find(
      (chat) =>
        chat.contactId === contact.id
    );
  }

  // Buscar por nombre
  if (!existingChat) {
    existingChat = chats.find(
      (chat) =>
        chat.type === "contact" &&
        chat.name.toLowerCase() ===
          contact.name.toLowerCase()
    );
  }

  // ========================================
  // CHAT EXISTENTE
  // ========================================

  if (existingChat) {
    const updatedContacts =
      contacts.map((item) =>
        item.id === contact.id
          ? {
              ...item,
              chatId: existingChat.id,
            }
          : item
      );

    return {
      chat: existingChat,
      newChat: false,
      contacts: updatedContacts,
    };
  }

  // ========================================
  // CREAR CHAT NUEVO
  // ========================================

  const newChat = {
    id: Date.now(),
    contactId: contact.id,
    name: contact.name,
    avatar: contact.avatar,
    lastMessage: "",
    time: "",
    unread: 0,
    type: "contact",
  };

  const updatedContacts =
    contacts.map((item) =>
      item.id === contact.id
        ? {
            ...item,
            chatId: newChat.id,
          }
        : item
    );

  return {
    chat: newChat,
    newChat: true,
    contacts: updatedContacts,
  };
};