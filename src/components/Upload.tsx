import { RiCheckboxCircleLine, RiUploadLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Upload() {

  const [popup, setPopup] = useState(false)

{/* função de importar o pdf */}
async function PdfUpload(file: File) {
  {/* Aqui tratei o erro de upload por nome inválido */}
  {/* Mazin, tem q refazer essa função depois, pois fiz com IA para teste */}
  const nomeArquivo = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase()

  await supabase.storage
    .from('pdfs')
    .upload(nomeArquivo, file)

  setPopup(true)
  setTimeout(() => setPopup(false), 3500)
}

  return (
    <>
      {/* botão principal */}
      <label className="mb-2 flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 duration-150 px-8 py-2 cursor-pointer" htmlFor="pdf-upload">
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

      {popup && (
         <div className="absolute left-1/2 top-full w-[300px] justify-center z-50 mt-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-stone-950/80 py-2 text-sm">
          <RiCheckboxCircleLine className="text-lg text-green-400" />
          <p>Seu PDF foi adicionado na biblioteca</p>
        </div>
      )}
    </>
  )
}

export default Upload