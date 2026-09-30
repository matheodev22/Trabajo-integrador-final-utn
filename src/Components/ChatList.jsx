import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

import img0749 from "../img/IMG_0749.PNG";
import img7515 from "../img/IMG_1755.png";
import img5053 from "../img/IMG_5053.png";

const initialChats = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    lastMessage: "boludo hay q matarlo no puede ser tan burro",
    time: "14:34",
    unread: 0,
    type: "contact",
  },
  {
    id: 2,
    name: "los pijes.fc",
    avatar: "LP",
    lastMessage: "listo de una jugamos el sabado",
    time: "14:50",
    unread: 0,
    type: "group",
    participants: [
      "tradeo",
      "Mati Ortega",
      "Agus",
      "Joel",
      "Juan Mati",
    ],
  },
  {
    id: 3,
    name: "weirdo",
    avatar: "W",
    lastMessage: "dale bb",
    time: "12:31",
    unread: 0,
    type: "contact",
  },
  {
    id: 4,
    name: "zaro",
    avatar: "Z",
    lastMessage: "si boludo, no paro de tener cosas para hacer",
    time: "17:58",
    unread: 0,
    type: "contact",
  },
  {
    id: 5,
    name: "mama",
    avatar: "M",
    lastMessage: "matheo despertate!!!! 😡😡😡",
    time: "11:45",
    unread: 0,
    type: "contact",
  },
  {
    id: 6,
    name: "familia",
    avatar: "F",
    lastMessage: "dejaste comida hecha ma?",
    time: "11:30",
    unread: 0,
    type: "group",
    participants: [
      "Mamá",
      "Jere",
      "Matheo",
    ],
  },
  {
    id: 7,
    name: "abuelo",
    avatar: "A",
    lastMessage: "Hola abuelo sisi estoy el finde",
    time: "10:32",
    unread: 0,
    type: "contact",
  },
];

const initialContacts = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    chatId: 1,
  },
  {
    id: 2,
    name: "weirdo",
    avatar: "W",
    chatId: 3,
  },
  {
    id: 3,
    name: "mama",
    avatar: "M",
    chatId: 5,
  },
  {
    id: 4,
    name: "abuelo",
    avatar: "A",
    chatId: 7,
  },
  {
    id: 5,
    name: "Mati Ortega",
    avatar: "MO",
    chatId: 2,
  },
  {
    id: 6,
    name: "Agus",
    avatar: "A",
    chatId: 2,
  },
  {
    id: 7,
    name: "Joel",
    avatar: "J",
    chatId: 2,
  },
  {
    id: 8,
    name: "Juan Mati",
    avatar: "JM",
    chatId: 2,
  },
  {
    id: 9,
    name: "Jere",
    avatar: "J",
    chatId: 6,
  },
  {
    id: 10,
    name: "zaro",
    avatar: "Z",
    chatId: 4,
  },
];

const normalizeSavedContacts = (savedContacts) => {
  if (!savedContacts) {
    return initialContacts;
  }

  return savedContacts.map((contact) => {
    if (contact.name === "Ortega") {
      return {
        ...contact,
        name: "Mati Ortega",
        avatar: "MO",
        chatId: 2,
      };
    }

    if (contact.name === "Mati") {
      return {
        ...contact,
        name: "Juan Mati",
        avatar: "JM",
        chatId: 2,
      };
    }

    if (contact.name === "zaro") {
      return {
        ...contact,
        avatar: "Z",
        chatId: 4,
      };
    }

    if (contact.name === "tradeo") {
      return {
        ...contact,
        chatId: 1,
      };
    }

    if (contact.name === "weirdo") {
      return {
        ...contact,
        chatId: 3,
      };
    }

    if (contact.name === "mama") {
      return {
        ...contact,
        chatId: 5,
      };
    }

    if (contact.name === "abuelo") {
      return {
        ...contact,
        chatId: 7,
      };
    }

    if (contact.name === "Jere") {
      return {
        ...contact,
        chatId: 6,
      };
    }

    return contact;
  });
};

const initialStatuses = [
  {
    id: 1,
    name: "tradeo",
    avatar: "T",
    image: img0749,
    time: "Hace 20 min",
  },
  {
    id: 2,
    name: "weirdo",
    avatar: "W",
    image: img5053,
    time: "Hace 1 h",
  },
  {
    id: 3,
    name: "mama",
    avatar: "M",
    image: img7515,
    time: "Hace 2 h",
  },
];

function ChatList({
  selectedChat,
  onSelectChat,
  search,
  onSearch,
  darkMode,
  onToggleTheme,
}) {
  const { user, logout } = useAuth();

  const [chatList, setChatList] = useState(() => {
    const savedChats = localStorage.getItem("chatList");

    return savedChats
      ? JSON.parse(savedChats)
      : initialChats;
  });

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");

    return normalizeSavedContacts(
      savedContacts
        ? JSON.parse(savedContacts)
        : null
    );
  });

  const [activeSection, setActiveSection] = useState("chats");
  const [activeFilter, setActiveFilter] = useState("todos");

  const [showNewContact, setShowNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");

  const [contactSearch, setContactSearch] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "chatList",
      JSON.stringify(chatList)
    );
  }, [chatList]);

  useEffect(() => {
    localStorage.setItem(
      "contacts",
      JSON.stringify(contacts)
    );
  }, [contacts]);

  /*
   * Vincular contactos con los chats existentes.
   */
  useEffect(() => {
    setContacts((currentContacts) => {
      let changed = false;

      const updatedContacts = currentContacts.map(
        (contact) => {
          const matchingChat = chatList.find(
            (chat) =>
              chat.type === "contact" &&
              (
                chat.id === contact.chatId ||
                chat.name.toLowerCase() ===
                  contact.name.toLowerCase()
              )
          );

          if (
            matchingChat &&
            contact.chatId !== matchingChat.id
          ) {
            changed = true;

            return {
              ...contact,
              chatId: matchingChat.id,
            };
          }

          if (
            !matchingChat &&
            contact.chatId
          ) {
            const {
              chatId,
              ...contactWithoutChat
            } = contact;

            changed = true;

            return contactWithoutChat;
          }

          return contact;
        }
      );

      return changed
        ? updatedContacts
        : currentContacts;
    });
  }, [chatList]);

  /*
   * Actualizar vista previa cuando se envía
   * un mensaje.
   */
  useEffect(() => {
    const handleChatMessage = (event) => {
      const {
        chatId,
        message,
        time,
      } = event.detail;

      setChatList((currentChats) => {
        const updatedChat = currentChats.find(
          (chat) => chat.id === chatId
        );

        if (!updatedChat) {
          return currentChats;
        }

        const updatedChats = currentChats.map(
          (chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastMessage: message,
                  time,
                }
              : chat
        );

        return [
          updatedChats.find(
            (chat) => chat.id === chatId
          ),
          ...updatedChats.filter(
            (chat) => chat.id !== chatId
          ),
        ];
      });
    };

    window.addEventListener(
      "chat-message-sent",
      handleChatMessage
    );

    return () => {
      window.removeEventListener(
        "chat-message-sent",
        handleChatMessage
      );
    };
  }, []);

  /*
   * Marcar chat como leído.
   */
  useEffect(() => {
    const handleMessagesRead = (event) => {
      const { chatId } = event.detail;

      setChatList((currentChats) =>
        currentChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                unread: 0,
              }
            : chat
        )
      );
    };

    window.addEventListener(
      "chat-messages-read",
      handleMessagesRead
    );

    return () => {
      window.removeEventListener(
        "chat-messages-read",
        handleMessagesRead
      );
    };
  }, []);

  /*
   * Eliminar chat pero conservar contacto.
   */
  useEffect(() => {
    const handleDeleteChat = (event) => {
      const { chatId } = event.detail;

      setChatList((currentChats) =>
        currentChats.filter(
          (chat) => chat.id !== chatId
        )
      );

      setContacts((currentContacts) =>
        currentContacts.map((contact) => {
          if (contact.chatId === chatId) {
            const {
              chatId: removedChatId,
              ...contactWithoutChat
            } = contact;

            return contactWithoutChat;
          }

          return contact;
        })
      );
    };

    window.addEventListener(
      "chat-delete-requested",
      handleDeleteChat
    );

    return () => {
      window.removeEventListener(
        "chat-delete-requested",
        handleDeleteChat
      );
    };
  }, []);

  /*
   * Filtros de chats.
   */
  const filteredChats = chatList.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeFilter === "no-leidos") {
      return (
        matchesSearch &&
        chat.unread > 0
      );
    }

    if (activeFilter === "grupos") {
      return (
        matchesSearch &&
        chat.type === "group"
      );
    }

    return matchesSearch;
  });

  /*
   * Filtro de contactos.
   */
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name
        .toLowerCase()
        .includes(
          contactSearch.toLowerCase()
        )
  );

  /*
   * Buscar chat de contacto.
   */
  const getContactChat = (contact) => {
    if (contact.chatId) {
      const chatById = chatList.find(
        (chat) => chat.id === contact.chatId
      );

      if (chatById) {
        return chatById;
      }
    }

    return chatList.find(
      (chat) =>
        chat.type === "contact" &&
        chat.name.toLowerCase() ===
          contact.name.toLowerCase()
    );
  };

  const openNewContactForm = () => {
    setNewContactName("");
    setShowNewContact(true);
  };

  const closeNewContactForm = () => {
    setShowNewContact(false);
    setNewContactName("");
  };

  /*
   * Crear contacto sin crear chat.
   */
  const handleCreateContact = (event) => {
    event.preventDefault();

    if (!newContactName.trim()) {
      return;
    }

    const name = newContactName.trim();

    const alreadyExists = contacts.some(
      (contact) =>
        contact.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    const newId = Date.now();

    const avatar = name
      .slice(0, 2)
      .toUpperCase();

    const newContact = {
      id: newId,
      name,
      avatar,
    };

    setContacts((currentContacts) => [
      newContact,
      ...currentContacts,
    ]);

    setNewContactName("");
    setShowNewContact(false);

    setActiveSection("contacts");
  };

  /*
   * Abrir contacto.
   */
  const handleContactClick = (contact) => {
    const existingChat =
      getContactChat(contact);

    if (existingChat) {
      setChatList((currentChats) =>
        currentChats.map((item) =>
          item.id === existingChat.id
            ? {
                ...item,
                unread: 0,
              }
            : item
        )
      );

      setContacts((currentContacts) =>
        currentContacts.map((item) =>
          item.id === contact.id
            ? {
                ...item,
                chatId: existingChat.id,
              }
            : item
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "chat-messages-read",
          {
            detail: {
              chatId: existingChat.id,
            },
          }
        )
      );

      onSelectChat(existingChat);

      return;
    }

    /*
     * Crear chat nuevo si no existe.
     */
    const newChatId = Date.now();

    const newChat = {
      id: newChatId,
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: "",
      time: "",
      unread: 0,
      type: "contact",
    };

    setChatList((currentChats) => [
      newChat,
      ...currentChats,
    ]);

    setContacts((currentContacts) =>
      currentContacts.map((item) =>
        item.id === contact.id
          ? {
              ...item,
              chatId: newChatId,
            }
          : item
      )
    );

    onSelectChat(newChat);
  };

  /*
   * Abrir chat reciente.
   */
  const handleChatClick = (chat) => {
    setChatList((currentChats) =>
      currentChats.map((item) =>
        item.id === chat.id
          ? {
              ...item,
              unread: 0,
            }
          : item
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "chat-messages-read",
        {
          detail: {
            chatId: chat.id,
          },
        }
      )
    );

    onSelectChat(chat);
  };

  return (
    <aside className="sidebar">

      {/* PERFIL */}

      <div
        className="user-profile"
        onClick={() => setShowProfile(true)}
      >
        <div className="user-avatar">
          {user?.username
            ?.slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="user-profile-info">
          <strong>
            {user?.username}
          </strong>

          <span>
            Disponible
          </span>
        </div>
      </div>

      {/* CHATS */}

      {activeSection === "chats" && (
        <>
          <header className="sidebar-header">
            <h2>Chats</h2>

            <button
              className="new-chat-button"
              aria-label="Nuevo contacto"
              title="Nuevo contacto"
              onClick={openNewContactForm}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </header>

          {showNewContact && (
            <form
              className="new-chat-form"
              onSubmit={handleCreateContact}
            >
              <div className="new-contact-title">
                <strong>
                  Nuevo contacto
                </strong>

                <span>
                  Agregá un contacto a tu lista
                </span>
              </div>

              <input
                type="text"
                placeholder="Nombre del contacto"
                value={newContactName}
                onChange={(event) =>
                  setNewContactName(
                    event.target.value
                  )
                }
                autoFocus
              />

              <div className="new-chat-actions">
                <button
                  type="button"
                  onClick={closeNewContactForm}
                >
                  Cancelar
                </button>

                <button type="submit">
                  Guardar
                </button>
              </div>
            </form>
          )}

          <div className="search-box">
            <input
              type="search"
              placeholder="Buscar un chat..."
              aria-label="Buscar un chat"
              value={search}
              onChange={(event) =>
                onSearch(event.target.value)
              }
            />
          </div>

          <div className="chat-filters">
            <button
              className={`filter ${
                activeFilter === "todos"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("todos")
              }
            >
              Todos
            </button>

            <button
              className={`filter ${
                activeFilter === "no-leidos"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("no-leidos")
              }
            >
              No leídos
            </button>

            <button
              className={`filter ${
                activeFilter === "grupos"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("grupos")
              }
            >
              Grupos
            </button>
          </div>

          <div className="chat-list">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <article
                  className={`chat-item ${
                    selectedChat?.id === chat.id
                      ? "selected"
                      : ""
                  }`}
                  key={chat.id}
                  onClick={() =>
                    handleChatClick(chat)
                  }
                >
                  <div className="avatar">
                    {chat.avatar}
                  </div>

                  <div className="chat-info">
                    <strong>
                      {chat.name}
                    </strong>

                    <p>
                      {chat.lastMessage}
                    </p>
                  </div>

                  <div className="chat-meta">
                    {chat.time && (
                      <span className="chat-time">
                        {chat.time}
                      </span>
                    )}

                    {chat.unread > 0 && (
                      <span className="unread">
                        {chat.unread}
                      </span>
                    )}
                  </div>

                  <div className="chat-menu-container">
                    <button
                      className="chat-menu-button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenu(
                          openMenu === chat.id
                            ? null
                            : chat.id
                        );
                      }}
                      aria-label={`Opciones de ${chat.name}`}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>

                    {openMenu === chat.id && (
                      <div className="chat-menu">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            setChatList(
                              (currentChats) =>
                                currentChats.filter(
                                  (item) =>
                                    item.id !==
                                    chat.id
                                )
                            );

                            setContacts(
                              (currentContacts) =>
                                currentContacts.map(
                                  (contact) => {
                                    if (
                                      contact.chatId ===
                                      chat.id
                                    ) {
                                      const {
                                        chatId,
                                        ...rest
                                      } = contact;

                                      return rest;
                                    }

                                    return contact;
                                  }
                                )
                            );

                            setOpenMenu(null);
                          }}
                        >
                          <i className="bi bi-trash"></i>

                          <span>
                            Eliminar
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="no-results">
                No se encontraron chats.
              </p>
            )}
          </div>
        </>
      )}

      {/* ESTADOS */}

      {activeSection === "statuses" && (
        <div className="statuses-section">
          <header className="sidebar-header">
            <h2>Estados</h2>
          </header>

          <div className="status-list">
            {initialStatuses.map((status) => (
              <button
                className="status-item"
                key={status.id}
                onClick={() =>
                  setSelectedStatus(status)
                }
              >
                <div className="status-avatar">
                  <img
                    src={status.image}
                    alt=""
                  />

                  <span>
                    {status.avatar}
                  </span>
                </div>

                <div className="status-info">
                  <strong>
                    {status.name}
                  </strong>

                  <small>
                    {status.time}
                  </small>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTACTOS */}

      {activeSection === "contacts" && (
        <div className="contacts-section">
          <header className="sidebar-header">
            <h2>Contactos</h2>

            <button
              className="new-chat-button"
              aria-label="Nuevo contacto"
              title="Nuevo contacto"
              onClick={openNewContactForm}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </header>

          {showNewContact && (
            <form
              className="new-chat-form"
              onSubmit={handleCreateContact}
            >
              <div className="new-contact-title">
                <strong>
                  Nuevo contacto
                </strong>

                <span>
                  Agregá un contacto a tu lista
                </span>
              </div>

              <input
                type="text"
                placeholder="Nombre del contacto"
                value={newContactName}
                onChange={(event) =>
                  setNewContactName(
                    event.target.value
                  )
                }
                autoFocus
              />

              <div className="new-chat-actions">
                <button
                  type="button"
                  onClick={closeNewContactForm}
                >
                  Cancelar
                </button>

                <button type="submit">
                  Guardar
                </button>
              </div>
            </form>
          )}

          <div className="search-box">
            <input
              type="search"
              placeholder="Buscar un contacto..."
              aria-label="Buscar un contacto"
              value={contactSearch}
              onChange={(event) =>
                setContactSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const contactChat =
                  getContactChat(contact);

                return (
                  <button
                    className={`contact-item ${
                      contactChat &&
                      selectedChat?.id ===
                        contactChat.id
                        ? "selected"
                        : ""
                    }`}
                    key={contact.id}
                    onClick={() =>
                      handleContactClick(
                        contact
                      )
                    }
                  >
                    <div className="avatar">
                      {contact.avatar}
                    </div>

                    <div className="contact-info">
                      <strong>
                        {contact.name}
                      </strong>

                      {contactChat && (
                        <p>
                          {contactChat.lastMessage}
                        </p>
                      )}
                    </div>

                    {contactChat?.time && (
                      <span className="chat-time">
                        {contactChat.time}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="no-results">
                No se encontraron contactos.
              </p>
            )}
          </div>
        </div>
      )}

      {/* CONFIGURACIÓN */}

      {activeSection === "settings" && (
        <div className="settings-section">
          <header className="sidebar-header">
            <h2>Configuración</h2>
          </header>

          <div className="settings-list">
            <button
              className="settings-item"
              onClick={onToggleTheme}
            >
              <span className="settings-icon">
                {darkMode ? (
                  <i className="bi bi-sun"></i>
                ) : (
                  <i className="bi bi-moon"></i>
                )}
              </span>

              <div>
                <strong>
                  {darkMode
                    ? "Tema claro"
                    : "Tema oscuro"}
                </strong>

                <small>
                  Cambiar apariencia
                </small>
              </div>
            </button>

            <button
              className="settings-item logout-setting"
              onClick={logout}
            >
              <span className="settings-icon">
                <i className="bi bi-box-arrow-right"></i>
              </span>

              <div>
                <strong>
                  Cerrar sesión
                </strong>

                <small>
                  Salir de tu cuenta
                </small>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}

      <nav className="bottom-navigation">
        <button
          className={
            activeSection === "chats"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("chats")
          }
        >
          <span>
            <i className="bi bi-chat-dots"></i>
          </span>

          <small>
            Chats
          </small>
        </button>

        <button
          className={
            activeSection === "statuses"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("statuses")
          }
        >
          <span>
            <i className="bi bi-circle"></i>
          </span>

          <small>
            Estados
          </small>
        </button>

        <button
          className={
            activeSection === "contacts"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("contacts")
          }
        >
          <span>
            <i className="bi bi-people"></i>
          </span>

          <small>
            Contactos
          </small>
        </button>

        <button
          className={
            activeSection === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("settings")
          }
        >
          <span>
            <i className="bi bi-gear"></i>
          </span>

          <small>
            Config.
          </small>
        </button>
      </nav>

      {/* VISOR DE ESTADOS */}

      {selectedStatus && (
        <div
          className="status-viewer"
          onClick={() =>
            setSelectedStatus(null)
          }
        >
          <div
            className="status-viewer-header"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              onClick={() =>
                setSelectedStatus(null)
              }
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div>
              <strong>
                {selectedStatus.name}
              </strong>

              <small>
                {selectedStatus.time}
              </small>
            </div>
          </div>

          <img
            className="status-viewer-image"
            src={selectedStatus.image}
            alt={`Estado de ${selectedStatus.name}`}
          />
        </div>
      )}

      {/* PERFIL */}

      {showProfile && (
        <div
          className="profile-panel-overlay"
          onClick={() =>
            setShowProfile(false)
          }
        >
          <div
            className="profile-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="profile-panel-header">
              <button
                onClick={() =>
                  setShowProfile(false)
                }
              >
                <i className="bi bi-arrow-left"></i>
              </button>

              <h2>
                Perfil
              </h2>
            </div>

            <div className="profile-panel-content">
              <div className="profile-large-avatar">
                {user?.username
                  ?.slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="profile-detail">
                <span>
                  Nombre
                </span>

                <strong>
                  {user?.username}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Estado
                </span>

                <strong>
                  Disponible
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ChatList;