import { RiMenuLine, RiDeleteBinLine, RiPencilLine } from 'react-icons/ri'
import { RiBookLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LibProps {
  onPdfSelect: (pdfUrl: string) => void
}

function Lib({ onPdfSelect }: LibProps) {
  const [biblioteca, setBiblioteca] = useState(false)
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])

  const [libMenuDisplay, setLibMenuDisplay] = useState<string | null>(null)

  const handleOpen = async () => {
    const { data } = await supabase.storage.from('pdfs').list()
    setPdfs(data || [])
    setBiblioteca(true)
  }

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 rounded-lg bg-slate-500 hover:bg-slate-400 duration-150 px-8 py-2 cursor-pointer"
        onClick={handleOpen}
      ><p>Biblioteca</p></div>

      {biblioteca && (
        <div className="fixed inset-0 z-10 flex items-center justify-center select-none">
          <div className="w-screen lg:w-fit bg-[#111111] rounded-xl p-6 text-left shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Biblioteca</h2>
              <button
                className="text-2xl text-slate-400 hover:text-white"
                onClick={() => setBiblioteca(false)}
              >x</button>
            </div>

            <div className="flex flex-col gap-2">
              {pdfs.map((pdf) => (
                <div key={pdf.name} className="relative">
                  <div className="flex items-center justify-between rounded-lg bg-[#0c0c0c] px-4 py-2 hover:bg-slate-800 duration-200 cursor-pointer"
                    onClick={() => {
                      const { data } = supabase.storage
                        .from('pdfs')
                        .getPublicUrl(pdf.name)
                      onPdfSelect(data.publicUrl)
                      setBiblioteca(false)
                    }}>

                    <div className="pr-4 text-left cursor-pointer">{pdf.name}</div>

                    <div onClick={(e) => {e.stopPropagation(); setLibMenuDisplay((prev) => (prev === pdf.name ? null : pdf.name))}} className='hover:bg-slate-500 text-slate-400 hover:text-slate-100 cursor-pointer duration-150 rounded-full p-1.5'>
                      <RiMenuLine className="shrink-0 text-xl" />
                    </div>
                  </div>

                  {libMenuDisplay === pdf.name && (
                    <div onClick={(e) => e.stopPropagation()} className="flex flex-col w-[125px] justify-start gap-1 absolute right-2 top-11 z-50 bg-mist-900 cursor-pointer rounded-3xl px-2 py-3 shadow-xl">

                      <div 
                        onClick={() => {const { data } = supabase.storage.from('pdfs').getPublicUrl(pdf.name); onPdfSelect(data.publicUrl); setBiblioteca(false)}}
                        className="flex items-center gap-2 hover:bg-slate-600 rounded-full py-1.5 px-3 duration-150">

                        <RiBookLine className="text-xl text-slate-200" />
                        <p className="text-sm text-slate-200">Abrir</p>
                      </div>

                      <div  
                        className="flex items-center gap-2 hover:bg-slate-600 rounded-full py-1.5 px-3 duration-150">
                        
                        <RiPencilLine className="text-xl text-slate-200" />
                        <p className="text-sm text-slate-200">Editar</p>
                      </div>

                      <div className="flex items-center gap-2 hover:bg-red-950 rounded-full py-1.5 px-3 duration-150">
                        <RiDeleteBinLine className="text-xl text-red-500" />
                        <p className="text-sm text-red-500">Excluir</p>
                      </div>

                    </div>
                  )}
                </div>

              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Lib