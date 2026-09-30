export const createMessage = (text) => {
  if (!text.trim()) return null;

  return {
    id: Date.now(),
    text: text.trim(),
    sender: "sent",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "read",
  };
};

export const editMessage = (messages, messageId, newText) => {
  if (!newText.trim()) return messages;

  return messages.map((message) =>
    message.id === messageId
      ? {
          ...message,
          text: newText.trim(),
          edited: true,
        }
      : message
  );
};

export const deleteMessage = (messages, messageId) => {
  return messages.filter(
    (message) => message.id !== messageId
  );
};

export const markMessagesAsRead = (messages) => {
  return messages.map((message) =>
    message.sender === "received"
      ? {
          ...message,
          status: "read",
        }
      : message
  );
};
export const emojis = [
  "😀", "😂", "🤣", "😊", "😍",
  "🥰", "😎", "😢", "😭", "😡",
  "😱", "🤔", "👍", "👎", "👏",
  "🙏", "🔥", "❤️", "💯", "🎉",
  "👌", "🤝", "💪", "👀", "😴",
];