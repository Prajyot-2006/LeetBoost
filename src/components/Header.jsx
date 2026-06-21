function Header({onClose,onSettings,activeTab}){

return(
  <div
    className="
      px-4 py-3
      flex justify-between items-center
      shrink-0
      border-b border-gray-700/60
    "
  >

    <div className="flex items-center gap-3">

      <div
        className="
          w-9 h-9
          rounded-full
          overflow-hidden
          ring-2 ring-green-500/40
          shadow-[0_0_12px_rgba(34,197,94,0.6)]
          flex items-center justify-center
          bg-gray-800
        "
      >
        ⚡
      </div>

      <div className="leading-tight flex flex-col">
        <h2 className="font-xl mb-0 text-lg text-gray-100">LeetBoost</h2>
        <p className="text-xs text-green-400 font-mono">@LeetBoost</p>
      </div>

    </div>

    <div className="flex items-center gap-1">

      <button
        onClick={onSettings}
        title="Settings"
        className={`
          w-9 h-9
          flex items-center justify-center
          rounded-lg transition cursor-pointer
          ${activeTab === "settings"
            ? "bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.8),0_0_24px_rgba(34,197,94,0.5),0_0_48px_rgba(34,197,94,0.2)]"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_10px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.2)]"
          }
        `}
      >
        ⚙
      </button>

      <button
        onClick={onClose}
        title="Close"
        className="
          w-9 h-9
          flex items-center justify-center
          rounded-lg
          bg-gray-800 text-gray-400
          border border-transparent
          hover:bg-gray-900 hover:text-purple-300
          hover:border-purple-500/40
          hover:shadow-[0_0_10px_rgba(139,92,246,0.6),0_0_22px_rgba(139,92,246,0.3)]
          transition cursor-pointer
        "
      >
        ✕
      </button>

    </div>

  </div>
)

}

export default Header;