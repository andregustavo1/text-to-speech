import { useState } from 'react'
import { RiBookLine } from 'react-icons/ri'
import Lib from './components/Lib'
import PdfViewer from './components/PdfViewer'
import Upload from './components/Upload'
import Menu from './components/Menu'

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  function displayMenu() {
    setMenuOpen((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161515] text-white overflow-hidden">
      <div className="flex flex-col items-center px-4 text-center">

        {/* Função para quando o pdf aparecer, o hero some */}
        {!pdfUrl && (
          <>
            <div className="h-16 w-16 mb-6 flex items-center justify-center text-slate-400">
              <RiBookLine className="w-full h-full" />
            </div>

            <h1 className="text-4xl font-bold">E-To-Speech</h1>

            <p className="mb-6 mt-2 text-base text-slate-400">Importe seus eBooks em PDF e comece a ouvir!</p>

            <div className="relative flex flex-col items-center">
              <Upload />
              <Lib onPdfSelect={setPdfUrl}  />
            </div>
          </>
        )}

        {/* Animação fluflu do menu */}
        <div
          onClick={displayMenu}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-10 transition-opacity duration-300 ease-in-out ${
            menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
        </div>

        <div
          className={`fixed top-0 right-0 h-full z-20 shadow-2xl transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}><Menu onClose={displayMenu}/>
        </div>

        <PdfViewer pdfUrl={pdfUrl} onPdfSelect={setPdfUrl} onMenuToggle={displayMenu} />

      </div>
    </div>
  )
}

export default App