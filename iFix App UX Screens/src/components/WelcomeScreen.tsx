import logo from "figma:asset/9602d4631452c40a4f84b3fe07fc6befac3aa408.png";

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onLogin, onSignUp }: WelcomeScreenProps) {
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

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onLogin}
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
      </div>
    </div>
  );
}
