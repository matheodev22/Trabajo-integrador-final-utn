import { useEffect, useState } from "react";

import "../styles/global.css";
import "../styles/ChatList.css";
import "../styles/ChatWindow.css";
import "../styles/Contacts.css";
import "../styles/Status.css";
import "../styles/Profile.css";
import "../styles/Settings.css";
import "../styles/mediaqueries.css";
import {
  createContactWithChat,
  openOrCreateContactChat,
} from "../Logic/contactLogic";

import {
  getSavedChats,
  saveChats,
  getSavedContacts,
  saveContacts,
} from "../Logic/storageLogic";

import { useAuth } from "../Context/AuthContext";

import {
  initialChats,
  initialContacts,
  normalizeSavedChats,
  normalizeSavedContacts,
  filterChats,
  filterContacts,
  markChatAsRead,
  getChatByContact,
  handleIncomingMessage,
  handleChatDeletion,
} from "../Logic/chatLogic";

import { initialStatuses } from "../Logic/statusLogic";


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
    return getSavedChats(initialChats);
  });

  const [contacts, setContacts] = useState(() => {
    const savedContacts =
      getSavedContacts(initialContacts);

    const savedChats =
      getSavedChats(initialChats);

    return normalizeSavedContacts(
      savedContacts,
      savedChats
    );
  });




  const [activeSection, setActiveSection] =
    useState("chats");

  const [activeFilter, setActiveFilter] =
    useState("todos");

  const [showNewContact, setShowNewContact] =
    useState(false);

  const [newContactName, setNewContactName] =
    useState("");

  const [contactSearch, setContactSearch] =
    useState("");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [selectedStatus, setSelectedStatus] =
    useState(null);

  const [showProfile, setShowProfile] =
    useState(false);




  useEffect(() => {
    saveChats(chatList);
  }, [chatList]);




  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);



  useEffect(() => {
    const handleMessageSent = (event) => {
      const {
        chatId,
        message,
        time,
      } = event.detail;

      setChatList((currentChats) =>
        handleIncomingMessage(
          currentChats,
          chatId,
          message,
          time
        )
      );
    };

    window.addEventListener(
      "chat-message-sent",
      handleMessageSent
    );

    return () => {
      window.removeEventListener(
        "chat-message-sent",
        handleMessageSent
      );
    };
  }, []);



  useEffect(() => {
    const handleChatDelete = (event) => {
      const { chatId } = event.detail;

      if (
        chatId === null ||
        chatId === undefined
      ) {
        return;
      }

      const result =
        handleChatDeletion(
          chatList,
          contacts,
          chatId
        );

      setChatList(result.chats);
      setContacts(result.contacts);

      if (
        selectedChat &&
        Number(selectedChat.id) ===
          Number(chatId)
      ) {
        onSelectChat(null);
      }
    };

    window.addEventListener(
      "chat-delete-requested",
      handleChatDelete
    );

    return () => {
      window.removeEventListener(
        "chat-delete-requested",
        handleChatDelete
      );
    };
  }, [
    chatList,
    contacts,
    selectedChat,
    onSelectChat,
  ]);


  const filteredChats =
    filterChats(
      chatList,
      search,
      activeFilter
    );

  const filteredContacts =
    filterContacts(
      contacts,
      contactSearch
    );



  const openNewContactForm = () => {
    setNewContactName("");
    setShowNewContact(true);
  };


  const closeNewContactForm = () => {
    setShowNewContact(false);
    setNewContactName("");
  };




  const handleCreateContact = (event) => {
    event.preventDefault();

    const result =
      createContactWithChat(
        newContactName,
        contacts
      );

    if (!result) {
      alert(
        "Ingresá un nombre válido o el contacto ya existe"
      );

      return;
    }

    setContacts((currentContacts) => [
      result.contact,
      ...currentContacts,
    ]);

    setChatList((currentChats) => [
      result.chat,
      ...currentChats,
    ]);

    setNewContactName("");
    setShowNewContact(false);

    setActiveSection("chats");

    onSelectChat(result.chat);
  };




  const handleContactClick = (contact) => {
    if (!contact) {
      return;
    }

    const result =
      openOrCreateContactChat(
        contact,
        chatList,
        contacts
      );

    if (!result || !result.chat) {
      return;
    }

    
    setContacts(result.contacts);




    if (!result.newChat) {
      setChatList((currentChats) =>
        markChatAsRead(
          currentChats,
          result.chat.id
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "chat-messages-read",
          {
            detail: {
              chatId: result.chat.id,
            },
          }
        )
      );
    }


    onSelectChat(result.chat);
  };




  const handleChatClick = (chat) => {
    if (!chat) {
      return;
    }

    setChatList((currentChats) =>
      markChatAsRead(
        currentChats,
        chat.id
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




  const handleOpenChatMenu = (
    event,
    chatId
  ) => {
    event.stopPropagation();

    setOpenMenu((current) =>
      current === chatId
        ? null
        : chatId
    );
  };




  const handleDeleteFromList = (
    event,
    chatId
  ) => {
    event.stopPropagation();

    const result =
      handleChatDeletion(
        chatList,
        contacts,
        chatId
      );

    setChatList(result.chats);
    setContacts(result.contacts);

    if (
      selectedChat &&
      Number(selectedChat.id) ===
        Number(chatId)
    ) {
      onSelectChat(null);
    }

    setOpenMenu(null);
  };




  return (
    <aside className="sidebar">


     

      <div
        className="user-profile profile-desktop"
        onClick={() =>
          setShowProfile(true)
        }
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


      

      {activeSection === "chats" && (
        <>

          <header className="sidebar-header">

            <h2>
              Chats
            </h2>

            <button
              className="new-chat-button"
              aria-label="Nuevo contacto"
              title="Nuevo contacto"
              onClick={
                openNewContactForm
              }
            >
              <i className="bi bi-plus-lg"></i>
            </button>

          </header>


          

          {showNewContact && (
            <form
              className="new-chat-form"
              onSubmit={
                handleCreateContact
              }
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
                  onClick={
                    closeNewContactForm
                  }
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
                onSearch(
                  event.target.value
                )
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
                setActiveFilter(
                  "no-leidos"
                )
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

              filteredChats.map(
                (chat) => (

                  <article
                    className={`chat-item ${
                      selectedChat?.id ===
                      chat.id
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
                        onClick={(event) =>
                          handleOpenChatMenu(
                            event,
                            chat.id
                          )
                        }
                        aria-label={`Opciones de ${chat.name}`}
                      >

                        <i className="bi bi-three-dots-vertical"></i>

                      </button>


                      {openMenu === chat.id && (

                        <div className="chat-menu">

                          <button
                            onClick={(event) =>
                              handleDeleteFromList(
                                event,
                                chat.id
                              )
                            }
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

                )
              )

            ) : (

              <p className="no-results">
                No se encontraron chats.
              </p>

            )}

          </div>

        </>
      )}


      

      {activeSection === "statuses" && (

        <div className="statuses-section">

          <header className="sidebar-header">

            <h2>
              Estados
            </h2>

          </header>


          <div className="status-list">

            {initialStatuses.map(
              (status) => (

                <button
                  className="status-item"
                  key={status.id}
                  onClick={() =>
                    setSelectedStatus(
                      status
                    )
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

              )
            )}

          </div>

        </div>

      )}


      

      {activeSection === "contacts" && (

        <div className="contacts-section">

          <header className="sidebar-header">

            <h2>
              Contactos
            </h2>


            <button
              className="new-chat-button"
              aria-label="Nuevo contacto"
              title="Nuevo contacto"
              onClick={
                openNewContactForm
              }
            >
              <i className="bi bi-plus-lg"></i>
            </button>

          </header>


          

          {showNewContact && (

            <form
              className="new-chat-form"
              onSubmit={
                handleCreateContact
              }
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
                  onClick={
                    closeNewContactForm
                  }
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

              filteredContacts.map(
                (contact) => {

                  const contactChat =
                    getChatByContact(
                      chatList,
                      contact
                    );

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
                }
              )

            ) : (

              <p className="no-results">
                No se encontraron contactos.
              </p>

            )}

          </div>

        </div>

      )}


      {/* ==================================
          CONFIGURACIÓN
      ================================== */}

      {activeSection === "settings" && (

        <div className="settings-section">

          <header className="sidebar-header">

            <h2>
              Configuración
            </h2>

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


      {/* ==================================
          NAVEGACIÓN
      ================================== */}

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
          className="mobile-profile-button"
          onClick={() => setShowProfile(true)}
          aria-label="Perfil"
        >
          <span>
            <i className="bi bi-person-circle"></i>
          </span>
          <small>
            Perfil
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


      {/* ==================================
          VISOR DE ESTADOS
      ================================== */}

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


      {/* ==================================
          PERFIL
      ================================== */}

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