import { RiCheckboxCircleLine, RiUploadLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Upload() {

  const [popup, setPopup] = useState(false)

{/*função de importar o pdf */}
async function PdfUpload(file: File) {
  {/*Aqui tratei o erro de upload por nome inválido */}
  {/* Mazin, tem q refazer essa função depois, pois fiz com IA para teste*/}
    {/* codigo IA removido*/}
  
  let nomeArquivo = file.name
  //removar acento (peguei do stackoverflow essa)
      nomeArquivo = nomeArquivo.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    nomeArquivo = nomeArquivo.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    nomeArquivo = nomeArquivo.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    nomeArquivo = nomeArquivo.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    nomeArquivo = nomeArquivo.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    nomeArquivo = nomeArquivo.replace(new RegExp('[Ç]','gi'), 'c');

  // troca espaço e caracteres por underline
  nomeArquivo = nomeArquivo.replace(/[^a-zA-Z0-9.-]/g, '_')
  // letras inusculas
  nomeArquivo = nomeArquivo.toLowerCase()


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
        <div className="absolute top-full left-1/2 -ml-[180px] w-[360px] justify-center z-50 mt-12 flex items-center gap-1.5 rounded-full bg-stone-950/80 py-2 text-sm shadow-lg">
          <RiCheckboxCircleLine className="text-lg text-green-400 shrink-0" />
          <p>Seu PDF foi adicionado na biblioteca</p>
        </div>
      )}
    </>
  )
}

export default Upload