import { RiMenuLine } from 'react-icons/ri'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Lib() {
  const [biblioteca, setBiblioteca] = useState(false)
  const [pdfs, setPdfs] = useState<{ name: string }[]>([])
  const [pdfAberto, setPdfAberto] = useState<string | null>(null)

  return (
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

      {biblioteca && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="w-fit bg-[#111111] rounded-xl p-6 text-left shadow-xl">
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
                <iframe
                  className="h-[500px] w-full rounded-lg"
                  src={pdfAberto}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Lib