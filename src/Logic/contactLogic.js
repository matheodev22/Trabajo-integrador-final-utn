// ================================
// CONTACT LOGIC
// ================================


// ================================
// CREAR CONTACTO
// ================================

export const createContact = (
  name,
  contacts = []
) => {
  const cleanName = name?.trim();

  // No crear contacto vacío
  if (!cleanName) {
    return null;
  }

  // Evitar contactos duplicados
  const alreadyExists = contacts.some(
    (contact) =>
      contact.name?.toLowerCase() ===
      cleanName.toLowerCase()
  );

  if (alreadyExists) {
    return null;
  }

  const id = crypto.randomUUID();

  return {
    id,
    name: cleanName,
    avatar: cleanName
      .slice(0, 2)
      .toUpperCase(),
    chatId: null,
  };
};


// ================================
// BUSCAR CHAT DE UN CONTACTO
// ================================

export const getContactChat = (
  contact,
  chats = []
) => {
  if (!contact || !Array.isArray(chats)) {
    return null;
  }

  // Primero buscar por chatId
  if (contact.chatId) {
    const chatById = chats.find(
      (chat) => chat.id === contact.chatId
    );

    if (chatById) {
      return chatById;
    }
  }

  // Después buscar por contactId
  const chatByContactId = chats.find(
    (chat) => chat.contactId === contact.id
  );

  if (chatByContactId) {
    return chatByContactId;
  }

  // Último recurso: buscar por nombre
  const chatByName = chats.find(
    (chat) => chat.name === contact.name
  );

  return chatByName ?? null;
};