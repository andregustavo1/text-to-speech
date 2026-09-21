import Lib from './Lib'

interface PdfViewerProps {
  pdfUrl: string | null
  onPdfSelect: (pdfUrl: string) => void
}

function PdfViewer({ pdfUrl, onPdfSelect }: PdfViewerProps) {
  {/* Aqui se a interface nao receber nenhum pdf ele fica escondido*/}
  if (!pdfUrl) {
    return null
  }

  {/* estamos usando o iframe para abrir os pdf, mas a estilização dele é muito limtada, precisamos substituir por algo no futuro */}
  {/* Adicionei pdfjs mas preciso ler a doc ainda pra implementar*/}
  return (
    <div className="mt-6 w-full max-w-5xl">
      <iframe
        className="h-[700px] w-full rounded-lg border border-slate-700 bg-slate-900"
        src={pdfUrl}
        title="Visualizador de PDF"
      />

      <div className="bg-[#111111] flex items-center justify-between rounded-full px-4 py-2">
        <div className="flex items-center gap-2">
            <button className="cursor-pointer">Seta</button>
            <div className='text-sm text-slate-300'>1/12</div>
            <button className="cursor-pointer">Seta</button>
        </div>
        
        <Lib onPdfSelect={onPdfSelect} iconOnly={true} />
      </div>
    </div>
  )
}

export default PdfViewer