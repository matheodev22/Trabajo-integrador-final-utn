export const getStorageItem = (key, defaultValue = null) => {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return defaultValue;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
};

export const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};