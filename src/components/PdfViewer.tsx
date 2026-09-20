interface PdfViewerProps {
  pdfUrl: string | null
}

function PdfViewer({ pdfUrl }: PdfViewerProps) {
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
    </div>
  )
}

export default PdfViewer