import { useState, useEffect, useRef } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiMenuLine, RiPlayFill, RiStopFill, RiLoader4Line } from 'react-icons/ri'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { supabase } from '../lib/supabase'
// import Lib from './Lib'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// função copiada do readme do react-pdf https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md import worker (recommended)
// Na documentação fala que o workerSrc precisa estar no mesmo arquivo aonde vou usar os componentes do react-pdf, no caso aqui no nosso componente PdfViewer 
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()  

interface PdfViewerProps {
  pdfUrl: string | null
  onPdfSelect: (pdfUrl: string) => void
  /* função para dysplay de menu */
  onMenuToggle?: () => void
}

function PdfViewer({ pdfUrl, onMenuToggle }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [inputPage, setInputPage] = useState<string>(String(pageNumber))

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const [erro, setErro] = useState<string | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  // muda a cada stop, pra descartar um áudio que chegou depois do usuário trocar de página
  const leitura = useRef(0)

  {/* função toda vez que o pdf mudsar, ele volta para a pagina 1 */}
  useEffect(() => {
    setPageNumber(1)
  }, [pdfUrl])

  {/* trocou de página ou de pdf: para o áudio */}
  useEffect(() => stop, [pageNumber, pdfUrl])

  function stop() {
    leitura.current++
    audio.current?.pause()
    if (audio.current) URL.revokeObjectURL(audio.current.src)
    audio.current = null
    setStatus('idle')
  }

  {/* chamada ao backend Express com o token do usuário logado */}
  async function api(path: string, body: object) {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Falha no servidor')
    return res
  }

  {/* texto da página: usa a camada de texto do pdf, se não tiver (pdf escaneado) faz OCR com o Google Vision */}
  async function pageText(n: number) {
    const page = await pdf!.getPage(n)
    const content = await page.getTextContent()
    const text = content.items.map((i) => ('str' in i ? i.str : '')).join(' ').trim()
    if (text) return text

    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, viewport }).promise
    const image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    const res = await api('/api/ocr', { image })
    return ((await res.json()).text as string).trim()
  }

  async function togglePlay() {
    if (status !== 'idle') return stop()
    const id = ++leitura.current
    setErro(null)
    setStatus('loading')
    try {
      const text = await pageText(pageNumber)
      if (!text) throw new Error('Nenhum texto encontrado nesta página')
      const blob = await (await api('/api/tts', { text })).blob()
      if (id !== leitura.current) return
      audio.current = new Audio(URL.createObjectURL(blob))
      audio.current.onended = stop
      await audio.current.play()
      setStatus('playing')
    } catch (e) {
      if (id !== leitura.current) return
      setErro(e instanceof Error ? e.message : String(e))
      stop()
    }
  }

  useEffect(() => {
    setInputPage(String(pageNumber))
  }, [pageNumber])

  {/* funções avançar e voltar paginas */}
  function prevPage() {
    setPageNumber(pageNumber - 1)
  }
  function nextPage() {
    setPageNumber(pageNumber + 1)
  }

  function indexPage() {
    setPageNumber(Number(inputPage))
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
        onLoadSuccess={(doc) => { setPdf(doc); setNumPages(doc.numPages) }}
      ><Page pageNumber={pageNumber} /></Document>

      {erro && <p className="fixed bottom-20 rounded-full bg-red-950/90 px-4 py-1.5 text-sm text-red-300">{erro}</p>}

      {/* Navbar */}
      <div className="bg-[#111111] fixed bottom-4 w-[350px] flex items-center justify-between rounded-full px-2 py-2">
        <div className="flex items-center gap-1">
            <button 
              className="cursor-pointer p-2 rounded-full hover:bg-slate-800 duration-150 flex items-center justify-center" 
              onClick={prevPage}
            ><RiArrowLeftSLine className="text-slate-200 text-xl" /></button>

            <div className="text-sm text-slate-300 gap-1 flex items-center">
              <input
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={indexPage}
                onKeyDown={(e) => e.key === 'Enter' && indexPage()}
                className="w-8 h-8 bg-transparent text-center text-white outline-none rounded-full hover:bg-slate-800 focus:bg-slate-800 cursor-pointer [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <div>/</div>
                      <div className=''>{numPages ?? '--'}</div>
            </div>

            <button 
              className="cursor-pointer p-2 rounded-full hover:bg-slate-800 duration-150 flex items-center justify-center" onClick={nextPage}
            ><RiArrowRightSLine className="text-slate-200 text-xl" /></button>
        </div>

        <button
          onClick={togglePlay}
          disabled={!pdf}
          aria-label={status === 'idle' ? 'Ouvir página' : 'Parar'}
          className="cursor-pointer p-3 rounded-full bg-blue-600 hover:bg-blue-700 duration-150 flex items-center justify-center disabled:opacity-50"
        >
          {status === 'idle' && <RiPlayFill className="text-xl" />}
          {status === 'loading' && <RiLoader4Line className="text-xl animate-spin" />}
          {status === 'playing' && <RiStopFill className="text-xl" />}
        </button>

        <div onClick={onMenuToggle} className="flex items-center p-3 rounded-full hover:bg-slate-800 duration-150 cursor-pointer">
          <RiMenuLine />
        </div>
      </div>
    </div>
  )
}

export default PdfViewer