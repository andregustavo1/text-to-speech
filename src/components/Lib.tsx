import { RiMenuLine, RiDeleteBinLine, RiPencilLine } from 'react-icons/ri'
import { RiBookLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Upload from './Upload'

interface LibProps {
  isOpen: boolean
  onClose: () => void
  onPdfSelect: (pdfUrl: string) => void
}

function Lib({ isOpen, onClose, onPdfSelect }: LibProps) {
  
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])

  const [libMenuDisplay, setLibMenuDisplay] = useState<string | null>(null)

  const [editingPdf, setEditingPdf] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
      if (isOpen) {
            supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return
            setUserId(user.id)
            supabase.storage.from('pdfs').list(user.id).then(({ data }) => setPdfs(data || []))
          })
      }
    }, [isOpen])

  if (!isOpen) return null

  // função de renomear o pdf
  async function handleRename(oldName: string) {
    if (!newName.trim() || !userId) {
      setEditingPdf(null)
      return
    }
    const finalName = newName.replace(/\.pdf$/i, '') + '.pdf'
    await supabase.storage.from('pdfs').move(`${userId}/${oldName}`, `${userId}/${finalName}`)
    setPdfs((prev) =>
      prev.map((item) => (item.name === oldName ? { ...item, name: finalName } : item))
    )
    setEditingPdf(null)
  }


  // da um refresh na lista depois de ter adicionado um novo pdf
  async function atualizarLista() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)
    const { data } = await supabase.storage.from('pdfs').list(user.id)
    setPdfs(data || [])
  }


  return (
    <div className="relative">

        <div className="fixed inset-0 z-10 flex items-center justify-center select-none"     onClick={() => setLibMenuDisplay(null)}>
          <div className="min-w-[90vw] max-w-[90vw] sm:min-w-[420px] sm:max-w-[420px] max-h-[80vh] lg:w-fit bg-[#111111] rounded-xl py-6 px-6 text-left shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Biblioteca</h2>
              <button
                className="text-2xl text-slate-400 hover:text-white"
                onClick={onClose}
              >x</button>
            </div>

            

            <div className="flex flex-col gap-2 text-sm max-h-[60vh] overflow-y-auto scrollbar-custom pr-1 -mr-3">
              {pdfs
                .filter((pdf) => pdf.name !== '.emptyFolderPlaceholder') //oculta o arquivo vazio
                .map((pdf) => (
                <div key={pdf.name} className="relative">
                  
                  <div className="flex items-center justify-between rounded-lg bg-[#0c0c0c] px-4 py-2 hover:bg-slate-800 duration-200 cursor-pointer"
                    
                  onClick={async () => {
                    const { data } = await supabase.storage
                      .from('pdfs')
                      .createSignedUrl(`${userId}/${pdf.name}`, 3600)     
                    if (data?.signedUrl) {
                      onPdfSelect(data.signedUrl)
                      onClose()
                    }
                  }}>
                  
                  {editingPdf === pdf.name ? (
                    <input
                      value={newName}
                      autoFocus
                      onClick={(e) => e.stopPropagation()} 
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleRename(pdf.name)} 
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      className="bg-slate-800 text-white px-2 py-1 rounded outline-none border border-blue-500 text-sm flex-1 min-w-0"
                    />
                  ) : (
                    <div
                      className="truncate min-w-0 flex-1 text-left cursor-pointer"
                      title={pdf.name}>{pdf.name.replace(/\.pdf$/i, '')}
                    </div>
                  )}
              
                  
                    <div onClick={(e) => {e.stopPropagation(); setLibMenuDisplay((prev) => (prev === pdf.name ? null : pdf.name))}} className='hover:bg-slate-500 text-slate-400 hover:text-slate-100 cursor-pointer duration-150 rounded-full p-1.5 '>
                      <RiMenuLine className="shrink-0 text-xl" />
                    </div>
                  </div>

                  {libMenuDisplay === pdf.name && (
                    <div onClick={(e) => e.stopPropagation()} className="flex flex-col w-[150px] justify-start gap-1 absolute right-2 top-11 z-50 bg-mist-900 cursor-pointer rounded-3xl px-2 py-3 shadow-xl">

                      <div 
                        onClick={async () => {
                          const { data } = await supabase.storage
                            .from('pdfs')
                            .createSignedUrl(`${userId}/${pdf.name}`, 3600) 
                          if (data?.signedUrl) {
                            onPdfSelect(data.signedUrl)
                            onClose()
                          }
                        }}

                        className="flex items-center gap-2 hover:bg-slate-600 rounded-full py-1.5 px-3 duration-150">

                        <RiBookLine className="text-xl text-slate-200" />
                        <p className="text-sm text-slate-200">Abrir</p>
                      </div>

                      <div className="flex items-center gap-2 hover:bg-slate-600 rounded-full py-1.5 px-3 duration-150" onClick={() => {
                            setEditingPdf(pdf.name)
                            setNewName(pdf.name.replace(/\.pdf$/i, ''))
                            setLibMenuDisplay(null) 
                          }}>
                        
                        <RiPencilLine className="text-xl text-slate-200" />
                        <p className="text-sm text-slate-200">Editar</p>
                      </div>

                      <div className="flex items-center gap-2 hover:bg-red-950 rounded-full py-1.5 px-3 duration-150" onClick={async () => {
                            await supabase.storage.from('pdfs').remove([`${userId}/${pdf.name}`])
                            setPdfs((prev) => prev.filter((item) => item.name !== pdf.name))
                            setLibMenuDisplay(null)
                          }}>
                        
                        <RiDeleteBinLine className="text-xl text-red-500" />
                        <p className="text-sm text-red-500">Excluir</p>
                      </div>

                    </div>
                  )}
                </div>

              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 shrink-0">
              <Upload onUploadComplete={atualizarLista} />
            </div>
          </div>

        </div>
      
    </div>
  )
}


export default Lib