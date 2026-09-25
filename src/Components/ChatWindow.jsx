import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import useMessages from "../hooks/useMessages.js";

const emojis = [
  "😀", "😂", "🤣", "😊", "😍",
  "🥰", "😎", "😢", "😭", "😡",
  "😱", "🤔", "👍", "👎", "👏",
  "🙏", "🔥", "❤️", "💯", "🎉",
  "👌", "🤝", "💪", "👀", "😴",
];

function ChatWindow({ selectedChat, onBack }) {
  const { user } = useAuth();

  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useMessages(selectedChat?.id);

  const [messageText, setMessageText] = useState("");
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [messageMenu, setMessageMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const messagesEndRef = useRef(null);

  const isGroup = selectedChat?.type === "group";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!messageText.trim()) return;

    sendMessage(messageText);

    setMessageText("");
  };

  const handleCall = () => {
    setShowMenu(false);
    setShowError(true);
  };

  const handleVideoCall = () => {
    setShowMenu(false);
    setShowError(true);
  };

  const handleDeleteChat = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onBack();
  };

  const handleOpenMessageMenu = (messageId) => {
    setMessageMenu((current) =>
      current === messageId ? null : messageId
    );
  };

  const handleStartEdit = (message) => {
    setEditingMessageId(message.id);
    setEditingText(message.text);
    setMessageMenu(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSaveEdit = (messageId) => {
    if (!editingText.trim()) return;

    editMessage(messageId, editingText);

    setEditingMessageId(null);
    setEditingText("");
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
    setMessageMenu(null);
  };

  if (!selectedChat) {
    return (
      <section className="chat-window">
        <div className="welcome-content">
          <div className="welcome-icon">
            💬
          </div>

          <h1>
            Bienvenido{" "}
            <span>{user?.username || "usuario"}</span>
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
        <header className="conversation-header">

          <button
            className="back-button"
            onClick={onBack}
            aria-label="Volver a los chats"
          >
            ←
          </button>

          <button
            className="contact-header"
            onClick={() => setShowContactProfile(true)}
            aria-label="Ver perfil del contacto"
          >
            <div className="avatar">
              {selectedChat.avatar}
            </div>

            <div className="conversation-info">
              <h2>{selectedChat.name}</h2>

              <p>
                {isGroup
                  ? `${selectedChat.participants?.length || 0} participantes`
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
              📞
            </button>

            <button
              className="header-action"
              onClick={handleVideoCall}
              aria-label="Videollamada"
              title="Videollamada"
            >
              🎥
            </button>

            <div className="menu-container">

              <button
                className="header-action"
                onClick={() =>
                  setShowMenu((current) => !current)
                }
                aria-label="Más opciones"
                title="Más opciones"
              >
                ⋮
              </button>

              {showMenu && (
                <div className="chat-menu">
                  <button onClick={handleDeleteChat}>
                    🗑️ Borrar chat
                  </button>
                </div>
              )}

            </div>
          </div>
        </header>

        <div className="messages">

          {messages.map((message) => (
            <div
              className={`message ${
                message.sender
              } ${isGroup ? "group-message" : ""}`}
              key={message.id}
            >

              {isGroup &&
                message.sender === "received" &&
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

              {editingMessageId === message.id ? (
                <div className="message-edit-container">

                  <input
                    className="message-edit-input"
                    type="text"
                    value={editingText}
                    autoFocus
                    onChange={(event) =>
                      setEditingText(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSaveEdit(message.id);
                      }

                      if (event.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                  />

                  <div className="message-edit-actions">

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveEdit(message.id)
                      }
                    >
                      Guardar
                    </button>

                  </div>
                </div>
              ) : (
                <>
                  <div className="message-content-row">

                    <p>{message.text}</p>

                    {message.sender === "sent" && (
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
                          ⋮
                        </button>

                        {messageMenu === message.id && (
                          <div className="message-menu">

                            <button
                              type="button"
                              onClick={() =>
                                handleStartEdit(message)
                              }
                            >
                              ✏️ Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteMessage(
                                  message.id
                                )
                              }
                            >
                              🗑️ Eliminar
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

                    {message.sender === "sent" && (
                      <span className="message-status">
                        {" "}✓✓
                      </span>
                    )}
                  </span>
                </>
              )}

            </div>
          ))}

          <div ref={messagesEndRef} />

        </div>

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
            >
              😊
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker">

                {emojis.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => {
                      setMessageText(
                        (current) =>
                          `${current}${emoji}`
                      );

                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}

              </div>
            )}

          </div>

          <input
            type="text"
            placeholder="Escribí un mensaje..."
            aria-label="Escribir mensaje"
            value={messageText}
            onChange={(event) =>
              setMessageText(event.target.value)
            }
          />

          <button
            type="submit"
            aria-label="Enviar mensaje"
          >
            ➤
          </button>
        </form>
      </section>

      {showError && (
        <div
          className="modal-overlay"
          onClick={() => setShowError(false)}
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-icon">
              ⚠️
            </div>

            <h2>Función no disponible</h2>

            <p>
              Las llamadas y videollamadas todavía
              no están disponibles.
            </p>

            <button
              className="modal-button"
              onClick={() => setShowError(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

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
              🗑️
            </div>

            <h2>¿Borrar conversación?</h2>

            <p>
              Se eliminará esta conversación de la
              vista de chats.
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
                onClick={handleConfirmDelete}
              >
                Borrar
              </button>

            </div>
          </div>
        </div>
      )}

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
                aria-label="Cerrar perfil"
              >
                ←
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

              <h1>{selectedChat.name}</h1>

              <p className="profile-status">
                {isGroup
                  ? `${selectedChat.participants?.length || 0} participantes`
                  : "En línea"}
              </p>

              <div className="profile-section">
                <span>Nombre</span>
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
                <span>Mensajes</span>

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