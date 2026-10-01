import { useEffect, useRef, useState } from "react";

import { useAuth } from "../Context/AuthContext";

import useMessages from "../hooks/useMessages.js";

import { emojis } from "../Logic/messageLogic";


function ChatWindow({
  selectedChat,
  onBack,
}) {
  const { user } = useAuth();


  // ========================================
  // MENSAJES
  // ========================================

  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useMessages(selectedChat);


  // ========================================
  // ESTADOS DE LA INTERFAZ
  // ========================================

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


  // ========================================
  // REFERENCIA DEL SCROLL
  // ========================================

  const messagesEndRef =
    useRef(null);


  // ========================================
  // TIPO DE CHAT
  // ========================================

  const isGroup =
    selectedChat?.type === "group";


  // ========================================
  // SCROLL AUTOMÁTICO
  // ========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // ========================================
  // LIMPIAR ESTADOS AL CAMBIAR DE CHAT
  // ========================================

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


  // ========================================
  // ENVIAR MENSAJE
  // ========================================

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


  // ========================================
  // LLAMADA
  // ========================================

  const handleCall = () => {
    setShowMenu(false);
    setShowError(true);
  };


  // ========================================
  // VIDEOLLAMADA
  // ========================================

  const handleVideoCall = () => {
    setShowMenu(false);
    setShowError(true);
  };


  // ========================================
  // BORRAR CHAT
  // ========================================

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


  // ========================================
  // MENÚ DE MENSAJE
  // ========================================

  const handleOpenMessageMenu = (
    messageId
  ) => {
    setMessageMenu((current) =>
      current === messageId
        ? null
        : messageId
    );
  };


  // ========================================
  // EDITAR MENSAJE
  // ========================================

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


  // ========================================
  // ELIMINAR MENSAJE
  // ========================================

  const handleDeleteMessage = (
    messageId
  ) => {
    deleteMessage(messageId);

    setMessageMenu(null);
  };


  // ========================================
  // AGREGAR EMOJI
  // ========================================

  const handleEmojiClick = (emoji) => {
    setMessageText(
      (current) =>
        `${current}${emoji}`
    );

    setShowEmojiPicker(false);
  };


  // ========================================
  // PANTALLA INICIAL
  // ========================================

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


  // ========================================
  // CHAT
  // ========================================

  return (
    <>
      <section className="chat-window conversation">


        {/* ==================================
            HEADER
        ================================== */}

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
                  ? `${
                      selectedChat.participants
                        ?.length || 0
                    } participantes`
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


        {/* ==================================
            MENSAJES
        ================================== */}

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


              {/* IDENTIDAD DEL PARTICIPANTE */}

              {isGroup &&
                message.sender ===
                  "received" &&
                message.senderName && (

                  <div className="message-sender">

                    <span className="message-sender-avatar">
                      {message.senderAvatar}
                    </span>

                    <strong>
                      {message.senderName}
                    </strong>

                  </div>

                )}


              {/* ==================================
                  EDICIÓN
              ================================== */}

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


                    {/* OPCIONES DEL MENSAJE */}

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


        {/* ==================================
            FORMULARIO
        ================================== */}

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
              aria-label="Abrir emojis"
              title="Emojis"
            >
              <i className="bi bi-emoji-smile"></i>
            </button>


            {showEmojiPicker && (

              <div className="emoji-picker">

                {emojis.map(
                  (emoji) => (

                    <button
                      type="button"
                      key={emoji}
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
            placeholder="Escribí un mensaje..."
            aria-label="Escribir mensaje"
            value={messageText}
            onChange={(event) =>
              setMessageText(
                event.target.value
              )
            }
          />


          <button
            type="submit"
            aria-label="Enviar mensaje"
            title="Enviar mensaje"
          >
            <i className="bi bi-send-fill"></i>
          </button>

        </form>

      </section>


      {/* ==================================
          ERROR DE LLAMADA
      ================================== */}

      {showError && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowError(false)
          }
        >

          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>

            <h2>
              Función no disponible
            </h2>

            <p>
              Las llamadas y videollamadas
              todavía no están disponibles.
            </p>

            <button
              className="modal-button"
              onClick={() =>
                setShowError(false)
              }
            >
              Aceptar
            </button>

          </div>

        </div>

      )}


      {/* ==================================
          CONFIRMAR BORRADO
      ================================== */}

      {showDeleteConfirm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >

          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-icon">
              <i className="bi bi-trash"></i>
            </div>

            <h2>
              ¿Borrar conversación?
            </h2>

            <p>
              Se eliminará esta conversación
              de la vista de chats.
            </p>

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() =>
                  setShowDeleteConfirm(
                    false
                  )
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


      {/* ==================================
          PERFIL CONTACTO / GRUPO
      ================================== */}

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
                  setShowContactProfile(
                    false
                  )
                }
                aria-label="Cerrar perfil"
                title="Cerrar"
              >
                <i className="bi bi-arrow-left"></i>
              </button>

              <h2>
                {isGroup
                  ? "Información del grupo"
                  : "Información del contacto"}
              </h2>

            </div>


            <div className="profile-content">

              <div className="profile-avatar">
                {selectedChat.avatar}
              </div>

              <h1>
                {selectedChat.name}
              </h1>

              <p className="profile-status">

                {isGroup
                  ? `${
                      selectedChat
                        .participants
                        ?.length || 0
                    } participantes`
                  : "En línea"}

              </p>


              <div className="profile-section">

                <span>
                  Nombre
                </span>

                <strong>
                  {selectedChat.name}
                </strong>

              </div>


              <div className="profile-section">

                <span>
                  {isGroup
                    ? "Participantes"
                    : "Estado"}
                </span>

                <strong>

                  {isGroup
                    ? selectedChat.participants?.join(
                        ", "
                      )
                    : "En línea"}

                </strong>

              </div>


              <div className="profile-section">

                <span>
                  Mensajes
                </span>

                <strong>
                  {messages.length}
                </strong>

              </div>

            </div>

          </aside>

        </div>

      )}

    </>
  );
}

export default ChatWindow;