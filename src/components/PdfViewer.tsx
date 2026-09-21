import { useState, useEffect } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiMenuLine } from 'react-icons/ri'
import { Document, Page, pdfjs } from 'react-pdf'
import Lib from './Lib'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

interface PdfViewerProps {
  pdfUrl: string | null
  onPdfSelect: (pdfUrl: string) => void
}

function PdfViewer({ pdfUrl, onPdfSelect }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)

  {/* função toda vez que o pdf mudsar, ele volta para a pagina 1 */}
  useEffect(() => {
    setPageNumber(1)
  }, [pdfUrl])

  {/* funções avançar e voltar paginas */}
  function prevPage() {
  setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  function nextPage() {
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev + 1))
  }

  {/* Aqui se a interface nao receber nenhum pdf ele fica escondido*/}
  if (!pdfUrl) {
    return null
  }

  {/* estamos usando o iframe para abrir os pdf, mas a estilização dele é muito limtada, precisamos substituir por algo no futuro */}
  {/* Adicionei pdfjs mas preciso ler a doc ainda pra implementar*/}
  {/* Implementação do react-pdf e pdfjs */}
  return (
    <div className="mt-6 w-full max-w-5xl flex flex-col items-center px-3">

      <Document
        className={""}
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      ><Page pageNumber={pageNumber} /></Document>

      {/* Navbar */}
      <div className="bg-[#111111] fixed bottom-4 w-[350px] flex items-center justify-between rounded-full px-2 py-2">
        <div className="flex items-center gap-1">
            <button 
              className="cursor-pointer p-2 rounded-full hover:bg-slate-800 duration-150 flex items-center justify-center" 
              onClick={prevPage}
            ><RiArrowLeftSLine className="text-slate-200 text-xl" /></button>

            <div className="text-sm text-slate-300">{pageNumber}/{numPages ?? '--'}</div>

            <button 
              className="cursor-pointer p-2 rounded-full hover:bg-slate-800 duration-150 flex items-center justify-center" 
              onClick={nextPage}
            ><RiArrowRightSLine className="text-slate-200 text-xl" /></button>
        </div>
        
        <div className="flex items-center p-3 rounded-full hover:bg-slate-800 duration-150 cursor-pointer">
          <RiMenuLine />
        </div>
      </div>
    </div>
  )
}

export default PdfViewer