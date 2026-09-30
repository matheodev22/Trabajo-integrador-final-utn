export const createContact = (name, contacts) => {
  const cleanName = name.trim();

  if (!cleanName) return null;

  const alreadyExists = contacts.some(
    (contact) =>
      contact.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (alreadyExists) return null;

  return {
    id: Date.now(),
    name: cleanName,
    avatar: cleanName.slice(0, 2).toUpperCase(),
  };
};
export const getContactChat = (contact, chats) => {
  if (contact.chatId) {
    const chatById = chats.find(
      (chat) => chat.id === contact.chatId
    );

    if (chatById) {
      return chatById;
    }
  }

  return chats.find(
    (chat) =>
      chat.type === "contact" &&
      chat.name.toLowerCase() ===
        contact.name.toLowerCase()
  );
};