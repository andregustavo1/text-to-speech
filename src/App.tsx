import { useState } from 'react'
import { RiBookLine } from 'react-icons/ri'
import Lib from './components/Lib'
import PdfViewer from './components/PdfViewer'
import Upload from './components/Upload'

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161515] text-white">
      <div className="flex flex-col items-center px-4 text-center">

      <div className="h-16 w-16 mb-6 flex items-center justify-center text-slate-400">
        <RiBookLine className="w-full h-full" />
      </div>


        <h1 className="text-4xl font-bold">E-To-Speech</h1>
        <p className="mb-6 mt-2 text-base text-slate-400">Importe seus eBooks em PDF e comece a ouvir!</p>

        <div className="relative flex flex-col items-center">
          <Upload />
          <Lib onPdfSelect={setPdfUrl} />
        </div>

        <PdfViewer pdfUrl={pdfUrl} />

      </div>
    </div>
  )
}

export default App