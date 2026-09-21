import { RiMenuLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LibProps {
  onPdfSelect: (pdfUrl: string) => void
}

function Lib({ onPdfSelect }: LibProps) {
  const [biblioteca, setBiblioteca] = useState(false)
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 rounded-lg bg-slate-500 hover:bg-slate-400 duration-150 px-8 py-2 cursor-pointer"
        onClick={async () => {
          const { data } = await supabase.storage.from('pdfs').list()
          setPdfs(data || [])
          setBiblioteca(true)
        }}
      >
        <p>Biblioteca</p>
      </div>

      {biblioteca && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="w-screen lg:w-fit bg-[#111111] rounded-xl p-6 text-left shadow-xl">
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
                <div
                  key={pdf.name}
                  className="flex items-center justify-between rounded-lg bg-[#0c0c0c] px-4 py-3 hover:bg-slate-800 duration-200"
                >
                  <button
                    className="pr-4 text-left cursor-pointer"
                    onClick={() => {
                      const { data } = supabase.storage
                        .from('pdfs')
                        .getPublicUrl(pdf.name)

                      onPdfSelect(data.publicUrl)
                      setBiblioteca(false)
                    }}
                  >
                    {pdf.name}
                  </button>

                  <RiMenuLine className="shrink-0 text-xl text-slate-400" />
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