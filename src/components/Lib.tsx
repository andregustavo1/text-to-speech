import { RiMenuLine, RiDeleteBinLine, RiPencilLine } from 'react-icons/ri'
import { RiBookLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface LibProps {
  isOpen: boolean
  onClose: () => void
  onPdfSelect: (pdfUrl: string) => void
}

function Lib({ isOpen, onClose, onPdfSelect }: LibProps) {
  supabase.storage.from('pdfs').list().then(({ data }) => setPdfs(data || []))
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])

  const [libMenuDisplay, setLibMenuDisplay] = useState<string | null>(null)

    useEffect(() => {
    }, [isOpen])
    if (!isOpen) return null

  return (
    <div className="relative">

        <div className="fixed inset-0 z-10 flex items-center justify-center select-none">
          <div className="max-w-[90vw] sm:max-w-[420px] max-h-[80vh] lg:w-fit bg-[#111111] rounded-xl p-6 text-left shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Biblioteca</h2>
              <button
                className="text-2xl text-slate-400 hover:text-white"
                onClick={onClose}
              >x</button>
            </div>

            <div className="flex flex-col gap-2 text-sm max-h-[60vh] overflow-y-auto pr-1 scrollbar-custom">
              {pdfs
                .filter((pdf) => pdf.name !== '.emptyFolderPlaceholder') //oculta o arquivo vazio
                .map((pdf) => (
                <div key={pdf.name} className="relative">
                  <div className="flex items-center justify-between rounded-lg bg-[#0c0c0c] px-4 py-2 hover:bg-slate-800 duration-200 cursor-pointer"
                    onClick={() => {
                      const { data } = supabase.storage
                        .from('pdfs')
                        .getPublicUrl(pdf.name)
                      onPdfSelect(data.publicUrl)
                      onClose()
                    }}>

                  
                <div 
                  className="truncate min-w-0 flex-1 text-left cursor-pointer"
                  title={pdf.name} 
                >{pdf.name.replace(/\.pdf$/i, '')}</div>
              

                    <div onClick={(e) => {e.stopPropagation(); setLibMenuDisplay((prev) => (prev === pdf.name ? null : pdf.name))}} className='hover:bg-slate-500 text-slate-400 hover:text-slate-100 cursor-pointer duration-150 rounded-full p-1.5'>
                      <RiMenuLine className="shrink-0 text-xl" />
                    </div>
                  </div>

                  {libMenuDisplay === pdf.name && (
                    <div onClick={(e) => e.stopPropagation()} className="flex flex-col w-[125px] justify-start gap-1 absolute right-2 top-11 z-50 bg-mist-900 cursor-pointer rounded-3xl px-2 py-3 shadow-xl">

                      <div 
                        onClick={() => {const { data } = supabase.storage.from('pdfs').getPublicUrl(pdf.name); onPdfSelect(data.publicUrl); onClose()}}
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
      
    </div>
  )
}

export default Lib