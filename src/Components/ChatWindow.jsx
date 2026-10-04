import { useEffect, useRef, useState } from "react";

import { useAuth } from "../Context/AuthContext";

import useMessages from "../hooks/useMessages.js";

import { emojis } from "../Logic/messageLogic";


/* ======================================================
   COLORES DE LOS CONTACTOS DEL GRUPO
====================================================== */

const senderColors = [
  {
    text: "#53bdeb",
    avatar: "#3a86a8",
  },
  {
    text: "#ff9f43",
    avatar: "#b86f24",
  },
  {
    text: "#a78bfa",
    avatar: "#6751a4",
  },
  {
    text: "#34d399",
    avatar: "#247a5a",
  },
  {
    text: "#f5b84b",
    avatar: "#9a742f",
  },
  {
    text: "#f472b6",
    avatar: "#a94f7c",
  },
  {
    text: "#22d3ee",
    avatar: "#197d8d",
  },
  {
    text: "#fb7185",
    avatar: "#a83f50",
  },
];


/* ======================================================
   OBTENER COLOR DEL CONTACTO
====================================================== */

const getSenderColor = (name = "") => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash =
      (
        hash * 31 +
        name.charCodeAt(i)
      ) >>> 0;
  }

  return senderColors[
    hash % senderColors.length
  ].text;
};


/* ======================================================
   OBTENER COLOR DEL AVATAR
====================================================== */

const getSenderAvatarColor = (
  name = ""
) => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash =
      (
        hash * 31 +
        name.charCodeAt(i)
      ) >>> 0;
  }

  return senderColors[
    hash % senderColors.length
  ].avatar;
};


/* ======================================================
   OBTENER PARTICIPANTES DEL GRUPO
====================================================== */

const getGroupParticipants = (chat) => {
  if (!chat) {
    return [];
  }

  if (Array.isArray(chat.participants)) {
    return chat.participants;
  }

  if (Array.isArray(chat.members)) {
    return chat.members;
  }

  if (Array.isArray(chat.groupMembers)) {
    return chat.groupMembers;
  }

  return [];
};


/* ======================================================
   OBTENER NOMBRE DE PARTICIPANTE
====================================================== */

const getParticipantName = (participant) => {
  if (!participant) {
    return "";
  }

  if (typeof participant === "string") {
    return participant;
  }

  return (
    participant.name ||
    participant.username ||
    participant.fullName ||
    ""
  );
};


/* ======================================================
   OBTENER AVATAR DE PARTICIPANTE
====================================================== */

const getParticipantAvatar = (
  participant
) => {
  if (!participant) {
    return "";
  }

  if (typeof participant === "string") {
    return participant
      .charAt(0)
      .toUpperCase();
  }

  return (
    participant.avatar ||
    participant.name
      ?.charAt(0)
      .toUpperCase() ||
    participant.username
      ?.charAt(0)
      .toUpperCase() ||
    "?"
  );
};


function ChatWindow({
  selectedChat,
  onBack,
}) {
  const { user } = useAuth();

  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useMessages(selectedChat);

  const [messageText, setMessageText] =
    useState("");

  const [
    showContactProfile,
    setShowContactProfile,
  ] = useState(false);

  const [showMenu, setShowMenu] =
    useState(false);

  const [
    showEmojiPicker,
    setShowEmojiPicker,
  ] = useState(false);

  const [showError, setShowError] =
    useState(false);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const [messageMenu, setMessageMenu] =
    useState(null);

  const [
    editingMessageId,
    setEditingMessageId,
  ] = useState(null);

  const [editingText, setEditingText] =
    useState("");

  const messagesEndRef =
    useRef(null);

  const isGroup =
    selectedChat?.type === "group";

  const groupParticipants =
    getGroupParticipants(selectedChat);

  const groupParticipantCount =
    groupParticipants.length;


/* ======================================================
   SCROLL AUTOMÁTICO
====================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


/* ======================================================
   REINICIAR ESTADOS
====================================================== */

  useEffect(() => {
    setMessageText("");
    setShowMenu(false);
    setShowEmojiPicker(false);
    setShowError(false);
    setShowDeleteConfirm(false);
    setMessageMenu(null);
    setEditingMessageId(null);
    setEditingText("");
    setShowContactProfile(false);
  }, [selectedChat?.id]);


/* ======================================================
   ENVIAR MENSAJE
====================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage =
      messageText.trim();

    if (!cleanMessage) {
      return;
    }

    const message =
      sendMessage(cleanMessage);

    if (!message) {
      return;
    }

    setMessageText("");
    setShowEmojiPicker(false);
  };


/* ======================================================
   LLAMADA
====================================================== */

  const handleCall = () => {
    setShowMenu(false);
    setShowError(true);
  };


/* ======================================================
   VIDEOLLAMADA
====================================================== */

  const handleVideoCall = () => {
    setShowMenu(false);
    setShowError(true);
  };


/* ======================================================
   BORRAR CHAT
====================================================== */

  const handleDeleteChat = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };


  const handleConfirmDelete = () => {
    if (
      selectedChat?.id === null ||
      selectedChat?.id === undefined
    ) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "chat-delete-requested",
        {
          detail: {
            chatId: selectedChat.id,
          },
        }
      )
    );

    setShowDeleteConfirm(false);

    onBack();
  };


/* ======================================================
   MENU DEL MENSAJE
====================================================== */

  const handleOpenMessageMenu = (
    messageId
  ) => {
    setMessageMenu((current) =>
      current === messageId
        ? null
        : messageId
    );
  };


/* ======================================================
   EDITAR MENSAJE
====================================================== */

  const handleStartEdit = (message) => {
    if (!message) {
      return;
    }

    setEditingMessageId(
      message.id
    );

    setEditingText(
      message.text || ""
    );

    setMessageMenu(null);
  };


  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };


  const handleSaveEdit = (
    messageId
  ) => {
    const cleanText =
      editingText.trim();

    if (!cleanText) {
      return;
    }

    editMessage(
      messageId,
      cleanText
    );

    setEditingMessageId(null);
    setEditingText("");
  };


/* ======================================================
   ELIMINAR MENSAJE
====================================================== */

  const handleDeleteMessage = (
    messageId
  ) => {
    deleteMessage(messageId);

    setMessageMenu(null);
  };


/* ======================================================
   EMOJIS
====================================================== */

  const handleEmojiClick = (emoji) => {
    setMessageText(
      (current) =>
        `${current}${emoji}`
    );

    setShowEmojiPicker(false);
  };


/* ======================================================
   PANTALLA DE BIENVENIDA
====================================================== */

  if (!selectedChat) {
    return (
      <section className="chat-window">

        <div className="welcome-content">

          <div className="welcome-icon">
            <i className="bi bi-chat-dots"></i>
          </div>

          <h1>
            Bienvenido{" "}
            <span>
              {user?.username || "usuario"}
            </span>
          </h1>

          <p>
            Seleccioná una conversación para comenzar
          </p>

        </div>

      </section>
    );
  }


  return (
    <>

      <section className="chat-window conversation">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="conversation-header">

          <button
            className="back-button"
            onClick={onBack}
            aria-label="Volver a los chats"
            title="Volver"
          >
            <i className="bi bi-arrow-left"></i>
          </button>


          <button
            className="contact-header"
            onClick={() =>
              setShowContactProfile(true)
            }
            aria-label="Ver perfil del contacto"
          >

            <div className="avatar">
              {selectedChat.avatar}
            </div>

            <div className="conversation-info">

              <h2>
                {selectedChat.name}
              </h2>

              <p>
                {isGroup
                  ? groupParticipantCount > 0
                    ? `${groupParticipantCount} participantes`
                    : "Grupo"
                  : "En línea"}
              </p>

            </div>

          </button>


          <div className="conversation-actions">

            <button
              className="header-action"
              onClick={handleCall}
              aria-label="Llamar"
              title="Llamar"
            >
              <i className="bi bi-telephone"></i>
            </button>


            <button
              className="header-action"
              onClick={handleVideoCall}
              aria-label="Videollamada"
              title="Videollamada"
            >
              <i className="bi bi-camera-video"></i>
            </button>


            <div className="menu-container">

              <button
                className="header-action"
                onClick={() =>
                  setShowMenu(
                    (current) => !current
                  )
                }
                aria-label="Más opciones"
                title="Más opciones"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>


              {showMenu && (
                <div className="chat-menu">

                  <button
                    onClick={
                      handleDeleteChat
                    }
                  >

                    <i className="bi bi-trash"></i>

                    <span>
                      Borrar chat
                    </span>

                  </button>

                </div>
              )}

            </div>

          </div>

        </header>


        {/* ==================================================
            MENSAJES
        ================================================== */}

        <div className="messages">

          {messages.map((message) => (

            <div
              className={`message ${
                message.sender
              } ${
                isGroup
                  ? "group-message"
                  : ""
              }`}
              key={message.id}
            >

              {/* ============================================
                  IDENTIDAD DEL CONTACTO EN GRUPO
              ============================================ */}

              {isGroup &&
                message.sender ===
                  "received" &&
                message.senderName && (

                  <div
                    className="message-sender"
                    style={{
                      "--sender-color":
                        getSenderColor(
                          message.senderName
                        ),

                      "--sender-avatar-color":
                        getSenderAvatarColor(
                          message.senderName
                        ),
                    }}
                  >

                    <span className="message-sender-avatar">
                      {message.senderAvatar ||
                        message.senderName
                          .charAt(0)
                          .toUpperCase()}
                    </span>

                    <strong>
                      {message.senderName}
                    </strong>

                  </div>

                )}


              {/* ==================================================
                  MENSAJE ENVIADO POR EL USUARIO EN GRUPO
              ================================================== */}

              {isGroup &&
                message.sender === "sent" && (

                  <div
                    className="message-sender message-sender-own"
                    style={{
                      "--sender-color": "#25d366",
                      "--sender-avatar-color": "#168c4c",
                    }}
                  >

                    <span className="message-sender-avatar">
                      {user?.username
                        ?.charAt(0)
                        .toUpperCase() || "T"}
                    </span>

                    <strong>
                      {user?.username || "Vos"}
                    </strong>

                  </div>

                )}


              {/* ============================================
                  EDITAR MENSAJE
              ============================================ */}

              {editingMessageId ===
              message.id ? (

                <div className="message-edit-container">

                  <input
                    className="message-edit-input"
                    type="text"
                    value={editingText}
                    autoFocus
                    onChange={(event) =>
                      setEditingText(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {

                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleSaveEdit(
                          message.id
                        );
                      }

                      if (
                        event.key ===
                        "Escape"
                      ) {
                        handleCancelEdit();
                      }

                    }}
                  />


                  <div className="message-edit-actions">

                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                    >
                      Cancelar
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleSaveEdit(
                          message.id
                        )
                      }
                    >
                      Guardar
                    </button>

                  </div>

                </div>

              ) : (

                <>

                  <div className="message-content-row">

                    <p>
                      {message.text}
                    </p>


                    {message.sender ===
                      "sent" && (

                      <div className="message-options">

                        <button
                          type="button"
                          className="message-options-button"
                          onClick={() =>
                            handleOpenMessageMenu(
                              message.id
                            )
                          }
                          aria-label="Opciones del mensaje"
                        >
                          <i className="bi bi-three-dots"></i>
                        </button>


                        {messageMenu ===
                          message.id && (

                          <div className="message-menu">

                            <button
                              type="button"
                              onClick={() =>
                                handleStartEdit(
                                  message
                                )
                              }
                            >

                              <i className="bi bi-pencil"></i>

                              <span>
                                Editar
                              </span>

                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteMessage(
                                  message.id
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

                    )}

                  </div>


                  <span>

                    {message.edited && (
                      <span className="edited-label">
                        editado
                      </span>
                    )}

                    {message.time}

                    {message.sender ===
                      "sent" && (

                      <span className="message-status">
                        {" "}
                        <i className="bi bi-check2-all"></i>
                      </span>

                    )}

                  </span>

                </>

              )}

            </div>

          ))}


          <div ref={messagesEndRef} />

        </div>


        {/* ==================================================
            INPUT
        ================================================== */}

        <form
          className="message-form"
          onSubmit={handleSubmit}
        >

          <div className="emoji-container">

            <button
              type="button"
              className="emoji-button"
              onClick={() =>
                setShowEmojiPicker(
                  (current) => !current
                )
              }
              aria-label="Emojis"
            >
              <i className="bi bi-emoji-smile"></i>
            </button>


            {showEmojiPicker && (

              <div className="emoji-picker">

                {emojis.map(
                  (emoji, index) => (

                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      onClick={() =>
                        handleEmojiClick(
                          emoji
                        )
                      }
                    >
                      {emoji}
                    </button>

                  )
                )}

              </div>

            )}

          </div>


          <input
            type="text"
            value={messageText}
            onChange={(event) =>
              setMessageText(
                event.target.value
              )
            }
            placeholder="Escribí un mensaje..."
          />


          <button
            type="submit"
            aria-label="Enviar mensaje"
          >
            <i className="bi bi-send-fill"></i>
          </button>

        </form>

      </section>


      {/* ==================================================
          MODAL DE ERROR
      ================================================== */}

      {showError && (

        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-icon">
              <i className="bi bi-info-circle"></i>
            </div>

            <h2>
              Función no disponible
            </h2>

            <p>
              Esta función todavía no está disponible.
            </p>

            <button
              className="modal-button"
              onClick={() =>
                setShowError(false)
              }
            >
              Cerrar
            </button>

          </div>

        </div>

      )}


      {/* ==================================================
          CONFIRMAR BORRADO
      ================================================== */}

      {showDeleteConfirm && (

        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-icon">
              <i className="bi bi-trash"></i>
            </div>

            <h2>
              ¿Borrar chat?
            </h2>

            <p>
              Esta acción eliminará la conversación.
            </p>

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
              >
                Cancelar
              </button>


              <button
                className="modal-delete"
                onClick={
                  handleConfirmDelete
                }
              >
                Borrar
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          PERFIL DEL CONTACTO / GRUPO
      ================================================== */}

      {showContactProfile && (

        <div
          className="profile-overlay"
          onClick={() =>
            setShowContactProfile(false)
          }
        >

          <aside
            className="contact-profile"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="profile-header">

              <button
                className="profile-close"
                onClick={() =>
                  setShowContactProfile(false)
                }
              >
                <i className="bi bi-arrow-left"></i>
              </button>

              <h2>
                {isGroup
                  ? "Información del grupo"
                  : "Perfil"}
              </h2>

            </div>


            <div className="profile-content">

              <div className="profile-avatar">
                {selectedChat.avatar}
              </div>

              <h1>
                {selectedChat.name}
              </h1>

              {isGroup && (
                <p className="profile-status">
                  {groupParticipantCount > 0
                    ? `${groupParticipantCount} participantes`
                    : "Grupo"}
                </p>
              )}


              {/* ==================================================
                  PARTICIPANTES DEL GRUPO
              ================================================== */}

              {isGroup &&
                groupParticipants.length > 0 && (

                <div className="group-participants">

                  <h3>
                    Participantes
                  </h3>

                  <div className="group-participant-list">

                    {groupParticipants.map(
                      (participant, index) => {

                        const participantName =
                          getParticipantName(
                            participant
                          );

                        const participantAvatar =
                          getParticipantAvatar(
                            participant
                          );

                        return (

                          <div
                            className="group-participant"
                            key={`${participantName}-${index}`}
                          >

                            <div
                              className="group-participant-avatar"
                              style={{
                                background:
                                  getSenderAvatarColor(
                                    participantName
                                  ),
                              }}
                            >
                              {participantAvatar}
                            </div>

                            <span>
                              {participantName || "Participante"}
                            </span>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          </aside>

        </div>

      )}

    </>
  );
}


export default ChatWindow;