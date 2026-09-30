// ================================
// CHAT LOGIC
// ================================

// Chats iniciales
export const initialChats = [
  // Si ya tenías chats iniciales, colocá acá tus objetos.
];

// Contactos iniciales
export const initialContacts = [
  // Si ya tenías contactos iniciales, colocá acá tus objetos.
];


// ================================
// NORMALIZAR CONTACTOS GUARDADOS
// ================================

export const normalizeSavedContacts = (savedContacts) => {
  if (!Array.isArray(savedContacts)) {
    return initialContacts;
  }

  return savedContacts.map((contact) => ({
    ...contact,
    id: contact.id ?? crypto.randomUUID(),
    name: contact.name ?? "Sin nombre",
    avatar:
      contact.avatar ??
      contact.name?.slice(0, 2).toUpperCase() ??
      "??",
    chatId: contact.chatId ?? null,
  }));
};


// ================================
// FILTRAR CHATS
// ================================

export const filterChats = (
  chats,
  search = "",
  activeFilter = "todos"
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  const normalizedSearch = search.trim().toLowerCase();

  return chats.filter((chat) => {
    // Buscar por nombre o último mensaje
    const matchesSearch =
      !normalizedSearch ||
      chat.name?.toLowerCase().includes(normalizedSearch) ||
      chat.lastMessage
        ?.toLowerCase()
        .includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    // Filtro de no leídos
    if (activeFilter === "no-leidos") {
      return Number(chat.unread) > 0;
    }

    // Filtro de grupos
    if (activeFilter === "grupos") {
      return chat.isGroup === true || chat.type === "group";
    }

    return true;
  });
};


// ================================
// FILTRAR CONTACTOS
// ================================

export const filterContacts = (
  contacts,
  search = ""
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return contacts;
  }

  return contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(normalizedSearch)
  );
};


// ================================
// MARCAR CHAT COMO LEÍDO
// ================================

export const markChatAsRead = (
  chats,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          unread: 0,
        }
      : chat
  );
};


// ================================
// ACTUALIZAR ÚLTIMO MENSAJE
// ================================

export const updateChatLastMessage = (
  chats,
  chatId,
  message,
  time
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          lastMessage: message,
          time: time ?? chat.time,
          unread: Number(chat.unread || 0) + 1,
        }
      : chat
  );
};


// ================================
// ELIMINAR CHAT
// ================================

export const deleteChat = (
  chats,
  chatId
) => {
  if (!Array.isArray(chats)) {
    return [];
  }

  return chats.filter(
    (chat) => chat.id !== chatId
  );
};


// ================================
// QUITAR CHAT DEL CONTACTO
// ================================

export const removeChatFromContact = (
  contacts,
  chatId
) => {
  if (!Array.isArray(contacts)) {
    return [];
  }

  return contacts.map((contact) =>
    contact.chatId === chatId
      ? {
          ...contact,
          chatId: null,
        }
      : contact
  );
};


// ================================
// SINCRONIZAR CONTACTOS CON CHATS
// ================================

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
    // Si ya tiene chatId y ese chat existe,
    // lo conservamos.
    if (
      contact.chatId &&
      chats.some(
        (chat) => chat.id === contact.chatId
      )
    ) {
      return contact;
    }

    // Buscar un chat por nombre
    const matchingChat = chats.find(
      (chat) =>
        chat.contactId === contact.id ||
        chat.name === contact.name
    );

    if (matchingChat) {
      return {
        ...contact,
        chatId: matchingChat.id,
      };
    }

    // Si no hay chat, queda como contacto solamente
    return {
      ...contact,
      chatId: null,
    };
  });
};


// ================================
// ABRIR CHAT DESDE CONTACTO
// ================================

export const openContactChat = (
  contact,
  chats,
  contacts
) => {
  if (!contact) {
    return {
      chat: null,
      newChat: false,
      contacts,
    };
  }

  // Buscar si el contacto ya tiene un chat
  let existingChat = null;

  if (contact.chatId) {
    existingChat = chats.find(
      (chat) => chat.id === contact.chatId
    );
  }

  // Si no encontró por chatId,
  // intenta encontrarlo por contactId
  if (!existingChat) {
    existingChat = chats.find(
      (chat) =>
        chat.contactId === contact.id
    );
  }

  // Si tampoco lo encontró, busca por nombre
  if (!existingChat) {
    existingChat = chats.find(
      (chat) =>
        chat.name === contact.name
    );
  }

  // ================================
  // CHAT YA EXISTE
  // ================================

  if (existingChat) {
    const updatedContacts = contacts.map(
      (item) =>
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

  // ================================
  // CREAR CHAT NUEVO
  // ================================

  const newChatId = crypto.randomUUID();

  const newChat = {
    id: newChatId,
    contactId: contact.id,
    name: contact.name,
    avatar: contact.avatar,
    lastMessage: "",
    time: "",
    unread: 0,
    messages: [],
  };

  const updatedContacts = contacts.map(
    (item) =>
      item.id === contact.id
        ? {
            ...item,
            chatId: newChatId,
          }
        : item
  );

  return {
    chat: newChat,
    newChat: true,
    contacts: updatedContacts,
  };
};