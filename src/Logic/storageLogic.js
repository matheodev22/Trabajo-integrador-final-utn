

export const getStorageItem = (
  key,
  defaultValue
) => {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Error leyendo ${key}:`,
      error
    );

    return defaultValue;
  }
};



export const setStorageItem = (
  key,
  value
) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Error guardando ${key}:`,
      error
    );

    return false;
  }
};




export const removeStorageItem = (
  key
) => {
  try {
    localStorage.removeItem(key);

    return true;
  } catch (error) {
    console.error(
      `Error eliminando ${key}:`,
      error
    );

    return false;
  }
};




export const getSavedChats = (
  defaultChats
) => {
  return getStorageItem(
    "chats",
    defaultChats
  );
};



export const saveChats = (
  chats
) => {
  return setStorageItem(
    "chats",
    chats
  );
};




export const getSavedContacts = (
  defaultContacts
) => {
  return getStorageItem(
    "contacts",
    defaultContacts
  );
};



export const saveContacts = (
  contacts
) => {
  return setStorageItem(
    "contacts",
    contacts
  );
};



export const getSavedMessages = (
  defaultMessages
) => {
  return getStorageItem(
    "messages",
    defaultMessages
  );
};



export const saveMessages = (
  messages
) => {
  return setStorageItem(
    "messages",
    messages
  );
};