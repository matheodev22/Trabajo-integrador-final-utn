export const initialChats = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    lastMessage: "boludo hay q matarlo no puede ser tan burro",
    time: "14:34",
    unread: 0,
    type: "contact",
  },
  {
    id: 2,
    name: "los pijes.fc",
    avatar: "LP",
    lastMessage: "listo de una jugamos el sabado",
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
    lastMessage: "si boludo, no paro de tener cosas para hacer",
    time: "17:58",
    unread: 0,
    type: "contact",
  },
  {
    id: 5,
    name: "mama",
    avatar: "M",
    lastMessage: "matheo despertate!!!! 😡😡😡",
    time: "11:45",
    unread: 0,
    type: "contact",
  },
  {
    id: 6,
    name: "familia",
    avatar: "F",
    lastMessage: "dejaste comida hecha ma?",
    time: "11:30",
    unread: 0,
    type: "group",
    participants: ["Mamá", "Jere", "Matheo"],
  },
  {
    id: 7,
    name: "abuelo",
    avatar: "A",
    lastMessage: "Hola abuelo sisi estoy el finde",
    time: "10:32",
    unread: 0,
    type: "contact",
  },
];

export const initialContacts = [
  { id: 1, name: "tradeo", avatar: "T", chatId: 1 },
  { id: 2, name: "weirdo", avatar: "W", chatId: 3 },
  { id: 3, name: "mama", avatar: "M", chatId: 5 },
  { id: 4, name: "abuelo", avatar: "A", chatId: 7 },
  { id: 5, name: "Mati Ortega", avatar: "MO", chatId: 2 },
  { id: 6, name: "Agus", avatar: "A", chatId: 2 },
  { id: 7, name: "Joel", avatar: "J", chatId: 2 },
  { id: 8, name: "Juan Mati", avatar: "JM", chatId: 2 },
  { id: 9, name: "Jere", avatar: "J", chatId: 6 },
  { id: 10, name: "zaro", avatar: "Z", chatId: 4 },
];

export const normalizeSavedContacts = (savedContacts) => {
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
      return { ...contact, avatar: "Z", chatId: 4 };
    }

    if (contact.name === "tradeo") {
      return { ...contact, chatId: 1 };
    }

    if (contact.name === "weirdo") {
      return { ...contact, chatId: 3 };
    }

    if (contact.name === "mama") {
      return { ...contact, chatId: 5 };
    }

    if (contact.name === "abuelo") {
      return { ...contact, chatId: 7 };
    }

    if (contact.name === "Jere") {
      return { ...contact, chatId: 6 };
    }

    return contact;
  });
};
export const filterChats = (chats, search, activeFilter) => {
  return chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeFilter === "no-leidos") {
      return matchesSearch && chat.unread > 0;
    }

    if (activeFilter === "grupos") {
      return matchesSearch && chat.type === "group";
    }

    return matchesSearch;
  });
};

export const filterContacts = (contacts, search) => {
  return contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );
};
export const markChatAsRead = (chats, chatId) => {
  return chats.map((chat) =>
    chat.id === chatId
      ? { ...chat, unread: 0 }
      : chat
  );
};

export const updateChatLastMessage = (chats, chatId, message, time) => {
  return chats
    .map((chat) =>
      chat.id === chatId
        ? { ...chat, lastMessage: message, time }
        : chat
    )
    .sort((a, b) => {
      if (a.id === chatId) return -1;
      if (b.id === chatId) return 1;
      return 0;
    });
};

export const deleteChat = (chats, chatId) => {
  return chats.filter((chat) => chat.id !== chatId);
};

export const removeChatFromContact = (contacts, chatId) => {
  return contacts.map((contact) =>
    contact.chatId === chatId
      ? { ...contact, chatId: null }
      : contact
  );
};