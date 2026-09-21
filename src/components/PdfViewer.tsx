interface PdfViewerProps {
  pdfUrl: string | null
}

function PdfViewer({ pdfUrl }: PdfViewerProps) {
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

      <div className="bg-[#111111] rounded-full px-4 py-2">
        <p>Navbar</p>
        
      </div>
    </div>
  )
}

export default PdfViewer