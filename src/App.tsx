import { RiBookLine, RiCheckboxCircleLine, RiMenuLine, RiUploadLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from './lib/supabase'

function App() {

  const [popup, setPopup] = useState(false)
  const [biblioteca, setBiblioteca] = useState(false)
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])
  const [pdfAberto, setPdfAberto] = useState<string | null>(null)

{/* função de importar o pdf */}
async function PdfUpload(file: File) {
  await supabase.storage
    .from('pdfs')
    .upload(file.name, file)

  setPopup(true)
  setTimeout(() => setPopup(false), 3500)
}
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161515] text-white">
      <div className="flex flex-col items-center px-4 text-center">

      <div className="h-16 w-16 mb-6 flex items-center justify-center text-slate-400">
        <RiBookLine className="w-full h-full" />
      </div>


        <h1 className="text-4xl font-bold">E-To-Speech</h1>
        <p className="mb-6 mt-2 text-base text-slate-400">Importe seus eBooks em PDF e comece a ouvir!</p>

        {/* botão principal */}
        <label className="mb-2 flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 px-8 py-2 cursor-pointer" htmlFor="pdf-upload">
          <div className="flex h-5 w-5 items-center justify-center">
            <RiUploadLine />
          </div>

          <p className="">Importar PDF</p>
        </label>

       {/* Aqui eu coloquei pro pdf subir no budget public do supabase mas a gente PRECISA deixar privado depois do sistema de login */}
        <input className="sr-only" id="pdf-upload" type="file" accept="application/pdf" 
          onChange={(e) => { 
            const file = e.target.files?.[0]

          if (file) PdfUpload(file)
        }} />

        <div className="relative">
          <div
            className="flex items-center gap-2 rounded-lg bg-slate-500 hover:bg-slate-400 px-8 py-2 cursor-pointer"
            onClick={async () => {
              const { data } = await supabase.storage.from('pdfs').list()
              setPdfs(data || [])
              setBiblioteca(true)
            }}
          >
            <p>Biblioteca</p>
          </div>

          {popup && (
            <div className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg bg-stone-950/80 px-5 py-2 text-sm">
              <RiCheckboxCircleLine className="text-lg text-green-400" />
              <p>Seu PDF foi adicionado na biblioteca</p>
            </div>
          )}
        </div>

        {biblioteca && (
          <div className="fixed inset-0 z-10 flex items-center justify-center">
            <div className="w-[420px] bg-[#111111] rounded-xl p-6 text-left shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Biblioteca</h2>
                <button
                  className="text-2xl text-slate-400 hover:text-white"
                  onClick={() => setBiblioteca(false)}
                >
                  x
                </button>
              </div>

              <div className="flex flex-col gap-2 cursor-pointer">
                {pdfs.map((pdf) => (
                  <div key={pdf.name} className="flex items-center justify-between rounded-lg bg-[#0c0c0c] px-4 py-3 hover:bg-slate-800 duration-200">
                    <button
                      className="pr-4 text-left cursor-pointer"
                      onClick={() => {
                        const { data } = supabase.storage.from('pdfs').getPublicUrl(pdf.name)
                        setPdfAberto(data.publicUrl)
                      }}
                    >
                      {pdf.name}
                    </button>
                    <RiMenuLine className="shrink-0 text-xl text-slate-400" />
                  </div>
                ))}
              </div>

              {pdfAberto && (
                <div className="mt-5">
                  <iframe className="h-[500px] w-full rounded-lg" src={pdfAberto} />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App