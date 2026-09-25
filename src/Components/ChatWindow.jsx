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

  const { messages, sendMessage } = useMessages(
    selectedChat?.id
  );

  const [messageText, setMessageText] = useState("");
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const messagesEndRef = useRef(null);

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

  const isGroup =
    selectedChat.type === "group";

  const groupParticipants =
    selectedChat.participants?.length || 0;

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
            aria-label={
              isGroup
                ? "Ver información del grupo"
                : "Ver perfil del contacto"
            }
          >
            <div className="avatar">
              {selectedChat.avatar}
            </div>

            <div className="conversation-info">
              <h2>
                {isGroup && "👥 "}
                {selectedChat.name}
              </h2>

              <p>
                {isGroup
                  ? `${groupParticipants || 0} participantes`
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
          {messages.map((message) => {
            const showSender =
              isGroup &&
              message.sender === "received";

            return (
              <div
                className={`message ${message.sender} ${
                  isGroup ? "group-message" : ""
                }`}
                key={message.id}
              >
                {showSender && (
                  <div className="message-sender">
                    <span className="message-sender-avatar">
                      {message.senderAvatar || "👤"}
                    </span>

                    <strong>
                      {message.senderName || "Participante"}
                    </strong>
                  </div>
                )}

                <p>{message.text}</p>

                <span>
                  {message.time}

                  {message.sender === "sent" && (
                    <span className="message-status">
                      {" "}✓✓
                    </span>
                  )}
                </span>
              </div>
            );
          })}

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
                  ? `${groupParticipants || 0} participantes`
                  : "En línea"}
              </p>

              <div className="profile-section">
                <span>
                  {isGroup
                    ? "Nombre del grupo"
                    : "Nombre"}
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
                    ? groupParticipants || 0
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