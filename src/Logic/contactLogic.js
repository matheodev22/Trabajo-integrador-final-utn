export const createContact = (
  name,
  contacts
) => {
  const cleanName =
    name?.trim();

  if (!cleanName) {
    return null;
  }

  const exists = contacts.some(
    (contact) =>
      contact.name.toLowerCase() ===
      cleanName.toLowerCase()
  );

  if (exists) {
    return null;
  }

  return {
    id: Date.now(),
    name: cleanName,
    avatar: cleanName
      .slice(0, 2)
      .toUpperCase(),
    chatId: null,
  };
};


export const getContactChat = (
  contact,
  chats
) => {
  if (!contact || !chats) {
    return null;
  }

  if (contact.chatId) {
    const chat = chats.find(
      (item) =>
        item.id === contact.chatId
    );

    if (chat) {
      return chat;
    }
  }

  return (
    chats.find(
      (chat) =>
        chat.type === "contact" &&
        chat.name.toLowerCase() ===
          contact.name.toLowerCase()
    ) || null
  );
};