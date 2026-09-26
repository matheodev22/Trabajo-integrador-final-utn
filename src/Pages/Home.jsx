import LoginForm from "../Components/LoginForm";

function Home() {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">💬</div>

        <h1>Bienvenido</h1>
        <p>Ingresá para continuar</p>

        <LoginForm />
      </section>
    </main>
  );
}

export default Home;