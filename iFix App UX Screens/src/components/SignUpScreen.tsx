import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { register } from "../services/auth";

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: () => void;
}

export function SignUpScreen({ onBack, onSignUp }: SignUpScreenProps) {
  const [userType, setUserType] = React.useState<"client" | "technician">("client");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ name, email, password, phone });
      onSignUp();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Cadastro</h2>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* User Type Selection */}
        <div className="mb-8">
          <p className="text-[rgb(var(--color-text-secondary))] mb-4">Escolha o tipo de cadastro</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("client")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "client"
                  ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))]/20"
                  : "border-[rgb(var(--color-border))] bg-white"
              }`}
            >
              <p className="text-[rgb(var(--color-text-primary))]">Cliente</p>
            </button>
            <button
              onClick={() => setUserType("technician")}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === "technician"
                  ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))]/20"
                  : "border-[rgb(var(--color-border))] bg-white"
              }`}
            >
              <p className="text-[rgb(var(--color-text-primary))]">Técnico</p>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            />
          </div>

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
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            />
          </div>

          {userType === "technician" && (
            <>
              <div>
                <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
                  Especialidade
                </label>
                <select className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                  <option value="">Selecione...</option>
                  <option value="smartphone">Smartphones</option>
                  <option value="computer">Computadores</option>
                  <option value="printer">Impressoras</option>
                  <option value="all">Todos</option>
                </select>
              </div>

              <div>
                <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
                  RC ou CPF
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                />
              </div>
            </>
          )}

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
            className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors mt-8 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
