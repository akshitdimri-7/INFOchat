const chats = new Map();

/*
chatId => {
  messages: [{ role, content }],
  documentText: "",
  image: { data, mimeType } | null
}
*/

export function createChat(chatId) {
  chats.set(chatId, {
    messages: [],
    documentText: "",
    image: null,
  });
}

export function getChat(chatId) {
  return chats.get(chatId);
}

export function clearChat(chatId) {
  chats.delete(chatId);
}

export function clearAllChats() {
  chats.clear();
}
