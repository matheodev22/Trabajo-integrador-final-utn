export const createContact = (name, contacts) => {
  const cleanName = name?.trim();

  if (!cleanName) {
    return null;
  }

  const alreadyExists = contacts.some(
    (contact) =>
      contact.name?.trim().toLowerCase() ===
      cleanName.toLowerCase()
  );

  if (alreadyExists) {
    return null;
  }

  const newId =
    contacts.length > 0
      ? Math.max(...contacts.map((contact) => Number(contact.id))) + 1
      : 1;

  return {
    id: newId,
    name: cleanName,
    avatar: cleanName.charAt(0).toUpperCase(),
    chatId: null,
  };
};


export const createChatForContact = (
  contact,
  chatId
) => {
  return {
    id: chatId,
    name: contact.name,
    type: "contact",
    contactId: contact.id,
    avatar:
      contact.avatar ||
      contact.name?.charAt(0).toUpperCase() ||
      "?",
    lastMessage: "",
    time: "",
    unread: 0,
  };
};


export const linkContactToChat = (
  contact,
  chat
) => {
  return {
    ...contact,
    chatId: chat.id,
  };
};


export const createContactWithChat = (
  name,
  contacts
) => {
  const contact = createContact(
    name,
    contacts
  );

  if (!contact) {
    return null;
  }

  const chatId = Date.now();

  const chat =
    createChatForContact(
      contact,
      chatId
    );

  const linkedContact =
    linkContactToChat(
      contact,
      chat
    );

  return {
    contact: linkedContact,
    chat,
  };
};



export const openOrCreateContactChat = (
  contact,
  chats,
  contacts
) => {
  if (!contact) {
    return null;
  }

  let existingChat = null;


 
  if (
    contact.chatId !== null &&
    contact.chatId !== undefined
  ) {
    existingChat =
      chats.find(
        (chat) =>
          Number(chat.id) ===
          Number(contact.chatId)
      ) || null;
  }


 

  if (!existingChat) {
    existingChat =
      chats.find(
        (chat) =>
          chat.type === "contact" &&
          Number(chat.contactId) ===
            Number(contact.id)
      ) || null;
  }


  

  if (!existingChat) {
    existingChat =
      chats.find(
        (chat) =>
          chat.type === "contact" &&
          chat.name?.trim().toLowerCase() ===
            contact.name?.trim().toLowerCase()
      ) || null;
  }




  if (existingChat) {
    const updatedContacts =
      contacts.map((item) =>
        Number(item.id) ===
        Number(contact.id)
          ? {
              ...item,
              chatId: existingChat.id,
            }
          : item
      );

    return {
      chat: existingChat,
      contacts: updatedContacts,
      newChat: false,
    };
  }




  const chatId = Date.now();

  const newChat =
    createChatForContact(
      contact,
      chatId
    );

  const updatedContact =
    linkContactToChat(
      contact,
      newChat
    );

  const updatedContacts =
    contacts.map((item) =>
      Number(item.id) ===
      Number(contact.id)
        ? updatedContact
        : item
    );

  return {
    chat: newChat,
    contacts: updatedContacts,
    newChat: true,
  };
};