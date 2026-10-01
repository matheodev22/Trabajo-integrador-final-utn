// ========================================
// OBTENER DATO
// ========================================

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


// ========================================
// GUARDAR DATO
// ========================================

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


// ========================================
// ELIMINAR DATO
// ========================================

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


// ========================================
// OBTENER CHATS
// ========================================

export const getSavedChats = (
  defaultChats
) => {
  return getStorageItem(
    "chats",
    defaultChats
  );
};


// ========================================
// GUARDAR CHATS
// ========================================

export const saveChats = (
  chats
) => {
  return setStorageItem(
    "chats",
    chats
  );
};


// ========================================
// OBTENER CONTACTOS
// ========================================

export const getSavedContacts = (
  defaultContacts
) => {
  return getStorageItem(
    "contacts",
    defaultContacts
  );
};


// ========================================
// GUARDAR CONTACTOS
// ========================================

export const saveContacts = (
  contacts
) => {
  return setStorageItem(
    "contacts",
    contacts
  );
};


// ========================================
// OBTENER MENSAJES
// ========================================

export const getSavedMessages = (
  defaultMessages
) => {
  return getStorageItem(
    "messages",
    defaultMessages
  );
};


// ========================================
// GUARDAR MENSAJES
// ========================================

export const saveMessages = (
  messages
) => {
  return setStorageItem(
    "messages",
    messages
  );
};