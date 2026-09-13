import { RiBookLine, RiUploadLine } from 'react-icons/ri'
import { supabase } from './lib/supabase'

function App() {

async function PdfUpload(file: File) {
  await supabase.storage
    .from('pdfs')
    .upload(file.name, file)
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
        <label className="flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-2 cursor-pointer" htmlFor="pdf-upload">
          <div className="flex h-5 w-5 items-center justify-center">
            <RiUploadLine />
          </div>

          <p className="">Importar PDF</p>
        </label>

        <input className="sr-only" id="pdf-upload" type="file" accept="application/pdf" 
          onChange={(e) => { 
            const file = e.target.files?.[0]

          if (file) PdfUpload(file)
        }} />
      </div>
    </div>
  )
}

export default App