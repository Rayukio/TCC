import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { register } from "../services/auth";
import { apiRequest } from "../services/api";

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
  const [specialty, setSpecialty] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validação local de senha
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (userType === "client") {
        await register({ name, email, password, phone });
      } else {
        // Técnico usa rota própria
        const result = await apiRequest<{ token: string; technician: { id: string; name: string; email: string } }>(
          "/technicians/register",
          {
            method: "POST",
            auth: false,
            body: JSON.stringify({
              name,
              email,
              password,
              phone,
              specialties: specialty ? [specialty] : [],
            }),
          }
        );
        localStorage.setItem("ifix_token", result.token);
        localStorage.setItem("ifix_user", JSON.stringify(result.technician));
      }
      onSignUp();
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Traduz erros comuns da API
        const msg = err.message.toLowerCase();
        if (msg.includes("already") || msg.includes("existe") || msg.includes("duplicate")) {
          setError("Este e-mail já está cadastrado.");
        } else if (msg.includes("password") || msg.includes("senha")) {
          setError("A senha deve ter no mínimo 8 caracteres, incluindo letras e números.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Cadastro</h2>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-8">
          <p className="text-[rgb(var(--color-text-secondary))] mb-4">Escolha o tipo de cadastro</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setUserType("client")}
              className={`p-4 rounded-xl border-2 transition-all ${userType === "client" ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))]/20" : "border-[rgb(var(--color-border))] bg-white"}`}>
              <p className="text-[rgb(var(--color-text-primary))]">Cliente</p>
            </button>
            <button onClick={() => setUserType("technician")}
              className={`p-4 rounded-xl border-2 transition-all ${userType === "technician" ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))]/20" : "border-[rgb(var(--color-border))] bg-white"}`}>
              <p className="text-[rgb(var(--color-text-primary))]">Técnico</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">Nome completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo" required
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]" />
          </div>

          <div>
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" required
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]" />
          </div>

          <div>
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">Telefone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]" />
          </div>

          {userType === "technician" && (
            <div>
              <label className="block text-[rgb(var(--color-text-secondary))] mb-2">Especialidade</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                <option value="">Selecione...</option>
                <option value="smartphone">Smartphones</option>
                <option value="computer">Computadores</option>
                <option value="printer">Impressoras</option>
                <option value="all">Todos</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres" required
              className="w-full px-4 py-3 bg-[rgb(var(--color-background))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]" />
            <p className="text-[rgb(var(--color-text-muted))] text-xs mt-1">Mínimo 8 caracteres</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors mt-8 disabled:opacity-50">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}