

export const initialChats = [
  {
    id: 1,
    name: "tradeo",
    type: "contact",
    contactId: 1,
    avatar: "T",
    lastMessage: "si creo q si si no fue",
    time: "14:50",
    unread: 0,
  },

  {
    id: 2,
    name: "los pijes.fc",
    type: "group",
    avatar: "LP",
    participants: [
      "tradeo",
      "Ortega",
      "deyver",
      "Joel",
      "Mati",
    ],
    lastMessage: "perfecto entonces queda sabado 20:30",
    time: "13:46",
    unread: 1,
  },

  {
    id: 3,
    name: "weirdo",
    type: "contact",
    contactId: 2,
    avatar: "W",
    lastMessage: "compra capeletinis que te encuentro en el chino",
    time: "12:42",
    unread: 0,
  },

  {
    id: 4,
    name: "zaro",
    type: "contact",
    contactId: 10,
    avatar: "Z",
    lastMessage: "fuerza xd",
    time: "12:23",
    unread: 0,
  },

  {
    id: 5,
    name: "mama",
    type: "contact",
    contactId: 3,
    avatar: "M",
    lastMessage: "si ahora voy",
    time: "11:54",
    unread: 0,
  },

  {
    id: 6,
    name: "familia",
    type: "group",
    avatar: "F",
    participants: [
      "Mamá",
      "Jere",
      "Matheo",
    ],
    lastMessage: "dale gracias",
    time: "11:39",
    unread: 1,
  },

  {
    id: 7,
    name: "abuelo",
    type: "contact",
    contactId: 4,
    avatar: "A",
    lastMessage: "👍",
    time: "09:32",
    unread: 0,
  },
];




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
    id: 10,
    name: "zaro",
    avatar: "Z",
    chatId: 4,
  },

  {
    id: 5,
    name: "Ortega",
    avatar: "S",
    chatId: null,
  },

  {
    id: 6,
    name: "deyver",
    avatar: "D",
    chatId: null,
  },

  {
    id: 7,
    name: "Joel",
    avatar: "J",
    chatId: null,
  },

  {
    id: 8,
    name: "Mati",
    avatar: "M",
    chatId: null,
  },

  {
    id: 9,
    name: "Jere",
    avatar: "J",
    chatId: null,
  },
  {
    id: 10,
    name: "juan",
    avatar: "J",
    chatId: null,
  },
];



export const normalizeSavedChats = (
  chats,
  defaultChats = initialChats
) => {
  if (!Array.isArray(chats)) {
    return defaultChats;
  }

  return chats.map((chat) => {
    const defaultChat = defaultChats.find(
      (item) =>
        Number(item.id) === Number(chat.id)
    );

  
    let type = chat.type;

    if (!type && defaultChat?.type) {
      type = defaultChat.type;
    }

    if (!type && Array.isArray(chat.participants)) {
      type = "group";
    }

    
    if (!type) {
      type = "contact";
    }

    return {
      ...defaultChat,
      ...chat,
      type,
      unread: Number(chat.unread) || 0,
    };
  });
};



export const normalizeSavedContacts = (
  contacts,
  chats
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  if (!Array.isArray(chats)) {
    return contacts;
  }

  return contacts.map((contact) => {
    const existingChat = chats.find(
      (chat) => {
        if (chat.type !== "contact") {
          return false;
        }

        if (
          Number(chat.contactId) ===
          Number(contact.id)
        ) {
          return true;
        }

        if (
          chat.name?.trim().toLowerCase() ===
          contact.name?.trim().toLowerCase()
        ) {
          return true;
        }

        return false;
      }
    );

    return {
      ...contact,
      chatId:
        existingChat?.id ??
        contact.chatId ??
        null,
    };
  });
};




export const getChatById = (
  chats,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return null;
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return null;
  }

  return (
    chats.find(
      (chat) =>
        Number(chat.id) ===
        Number(chatId)
    ) || null
  );
};




export const getChatByContact = (
  chats,
  contact
) => {
  if (
    !Array.isArray(chats) ||
    !contact
  ) {
    return null;
  }

  return (
    chats.find(
      (chat) => {
        if (
          chat.type !== "contact"
        ) {
          return false;
        }

        if (
          Number(chat.contactId) ===
          Number(contact.id)
        ) {
          return true;
        }

        if (
          contact.chatId !== null &&
          contact.chatId !== undefined &&
          Number(chat.id) ===
            Number(contact.chatId)
        ) {
          return true;
        }

        return (
          chat.name?.trim().toLowerCase() ===
          contact.name?.trim().toLowerCase()
        );
      }
    ) || null
  );
};



export const filterChats = (
  chats,
  search = "",
  activeFilter = "todos"
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  const cleanSearch =
    String(search || "")
      .trim()
      .toLowerCase();

  return chats.filter((chat) => {

   

    const chatName =
      String(chat.name || "").toLowerCase();

    const lastMessage =
      String(chat.lastMessage || "").toLowerCase();

    const matchesSearch =
      !cleanSearch ||
      chatName.includes(cleanSearch) ||
      lastMessage.includes(cleanSearch);

    if (!matchesSearch) {
      return false;
    }


 
    if (activeFilter === "todos") {
      return true;
    }


   

    if (activeFilter === "no-leidos") {
      return Number(chat.unread) > 0;
    }



    if (activeFilter === "grupos") {
      return (
        chat.type === "group" ||
        Array.isArray(chat.participants)
      );
    }


    return true;
  });
};




export const filterContacts = (
  contacts,
  search = ""
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  const cleanSearch =
    String(search || "")
      .trim()
      .toLowerCase();

  if (!cleanSearch) {
    return contacts;
  }

  return contacts.filter(
    (contact) => {
      const name =
        String(contact.name || "")
          .toLowerCase();

      return name.includes(cleanSearch);
    }
  );
};




export const markChatAsRead = (
  chats,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return chats;
  }

  return chats.map((chat) =>
    Number(chat.id) ===
    Number(chatId)
      ? {
          ...chat,
          unread: 0,
        }
      : chat
  );
};




export const updateChatLastMessage = (
  chats,
  chatId,
  message,
  time
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return chats;
  }

  return chats.map((chat) =>
    Number(chat.id) ===
    Number(chatId)
      ? {
          ...chat,
          lastMessage: message,
          time,
        }
      : chat
  );
};




export const deleteChat = (
  chats,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return chats;
  }

  return chats.filter(
    (chat) =>
      Number(chat.id) !==
      Number(chatId)
  );
};




export const removeChatFromContact = (
  contacts,
  chatId
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return contacts;
  }

  return contacts.map(
    (contact) =>
      Number(contact.chatId) ===
      Number(chatId)
        ? {
            ...contact,
            chatId: null,
          }
        : contact
  );
};




export const syncContactsWithChats = (
  contacts,
  chats
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  if (!Array.isArray(chats)) {
    return contacts;
  }

  return contacts.map((contact) => {
    const chat = getChatByContact(
      chats,
      contact
    );

    return {
      ...contact,
      chatId:
        chat?.id ?? null,
    };
  });
};




export const openContactChat = (
  contact,
  chats
) => {
  if (!contact) {
    return null;
  }

  return getChatByContact(
    chats,
    contact
  );
};



export const handleIncomingMessage = (
  chats,
  chatId,
  message,
  time
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return chats;
  }

  return updateChatLastMessage(
    chats,
    chatId,
    message,
    time
  );
};



export const handleChatDeletion = (
  chats,
  contacts,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return {
      chats: [],
      contacts: Array.isArray(contacts)
        ? contacts
        : [],
    };
  }

  if (!Array.isArray(contacts)) {
    return {
      chats,
      contacts: [],
    };
  }

  if (
    chatId === null ||
    chatId === undefined
  ) {
    return {
      chats,
      contacts,
    };
  }

  const updatedChats =
    deleteChat(
      chats,
      chatId
    );

  const updatedContacts =
    removeChatFromContact(
      contacts,
      chatId
    );

  return {
    chats: updatedChats,
    contacts: updatedContacts,
  };
};