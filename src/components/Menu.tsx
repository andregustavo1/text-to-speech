import { RiCloseLine, RiBookLine, RiSunLine, RiSettings3Line } from 'react-icons/ri'

interface MenuProps {
  onClose?: () => void
}

function Menu({ onClose }: MenuProps) {
  return (
    <div className="w-72 sm:w-80 h-screen bg-[#101010] flex flex-col border-r border-[#222222] select-none">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#222222]">
        <h1 className="text-xl font-bold">Menu</h1>

        <button
          onClick={onClose}
          className="text-slate-200 hover:bg-[#222222] rounded-xl transition duration-300 p-1 cursor-pointer">

          <RiCloseLine className="text-2xl" />

        </button>
      </div>

      <div className="flex flex-col gap-2 py-4 px-4">
        <button
          className="flex items-center gap-4 w-full py-2 px-3 rounded-xl hover:bg-slate-800/40 transition duration-300 text-left cursor-pointer group">

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#222222] text-slate-400 group-hover:text-blue-600 group-hover:bg-black/70  duration-300">
            <RiBookLine className="text-xl" />
          </div>

          <div className="text-base font-semibold text-slate-200">
            <p>Biblioteca</p>
          </div>
        </button>

        <button
          className="flex items-center gap-4 w-full py-2 px-3 rounded-xl hover:bg-slate-800/40 transition duration-300 text-left cursor-pointer group">

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#222222] text-slate-400 group-hover:text-blue-600 group-hover:bg-black/70  duration-300">
            <RiSunLine className="text-xl" />
          </div>

          <div className="text-base font-semibold text-slate-200">
            <p>Alternar Tema</p>
          </div>
        </button>

        <button
          className="flex items-center gap-4 w-full py-2 px-3 rounded-xl hover:bg-slate-800/40 transition duration-300 text-left cursor-pointer group">

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#222222] text-slate-400 group-hover:text-blue-600 group-hover:bg-black/70  duration-300">
            <RiSettings3Line className="text-xl" />
          </div>

          <div className="text-base font-semibold text-slate-200">
            <p>Configurações TTS</p>
          </div>
        </button>

        <div className="absolute bottom-0 mb-20">
          <p>Adicionar o componente Upload</p>
        </div>

      </div>
    </div>
  )
}

export default Menu