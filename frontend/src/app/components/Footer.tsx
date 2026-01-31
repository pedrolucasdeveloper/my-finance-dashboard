import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* LADO ESQUERDO: Copyright e Info */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Dashboard Financeiro
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              &copy; {currentYear} — Todos os direitos reservados.
            </p>
          </div>

          {/* CENTRO: "Feito com amor" */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span>Desenvolvido com</span>
            <FaHeart className="text-red-500 animate-pulse w-3 h-3" />
            <span>por <span className="font-semibold text-indigo-600 dark:text-indigo-400">Pedro Lucas</span></span>
          </div>

          {/* LADO DIREITO: Redes Sociais */}
          <div className="flex items-center gap-5">
            <a 
              href="https://github.com/pedrolucasadeveloper" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="GitHub"
            >
              <FaGithub size={22} />
            </a>
            <a 
              href="https://linkedin.com/in/pedro-lucas-a40414242"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-linkedin transition-colors"
              style={{ '--hover-color': '#0077b5' } as any}
              title="LinkedIn"
            >
              <FaLinkedin size={22} className="hover:text-[#0077b5]" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}