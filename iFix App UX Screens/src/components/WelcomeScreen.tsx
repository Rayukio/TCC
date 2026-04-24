import * as React from "react";
import logo from "figma:asset/9602d4631452c40a4f84b3fe07fc6befac3aa408.png";
import { login } from "../services/auth";

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onLogin, onSignUp }: WelcomeScreenProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      onLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <img
          src={logo}
          alt="iFix Logo"
          className="w-64 h-auto mb-12"
        />

        <p className="text-center text-[rgb(var(--color-text-primary))] mb-16 max-w-sm leading-relaxed px-4">
          Conexão entre consumidores e técnicos de eletrônicos
        </p>

        {!showLogin ? (
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={onSignUp}
              className="w-full bg-white text-[rgb(var(--color-primary))] px-8 py-4 rounded-xl border-2 border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-light))]/20 transition-colors"
            >
              Cadastre-se
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div>
              <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
            </div>
            <div>
              <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="w-full text-[rgb(var(--color-text-secondary))] py-2"
            >
              Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}