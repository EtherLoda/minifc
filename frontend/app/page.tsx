<div className="text-center mb-12">
  <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
    ⚽ Mini FC
  </h1>
  <p className="text-xl text-purple-100 mb-6">
    Pixel Art Player Avatar System
  </p>
  <div className="flex gap-4 justify-center">
    <button
      onClick={regenerateTeam}
      className="bg-white text-purple-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
    >
      🎲 Generate New Team
    </button>
    <a
      href="/customizer"
      className="bg-pink-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-pink-600 transition-all transform hover:scale-105 shadow-lg"
    >
      🎨 Customize Player
    </a>
  </div>
</div>

{/* Player Grid */ }
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
  {team.map((player) => (
    <div
      key={player.id}
      className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
    >
      {/* Player Avatar */}
      <div className="flex justify-center mb-4">
        <MiniPlayer
          appearance={player.appearance}
          position={player.position}
          size={120}
        />
      </div>

      {/* Player Info */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-800 mb-1">
          {player.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{player.position}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {player.stats.speed}
            </div>
            <div className="text-xs text-gray-500">SPD</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {player.stats.power}
            </div>
            <div className="text-xs text-gray-500">PWR</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {player.stats.skill}
            </div>
            <div className="text-xs text-gray-500">SKL</div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

{/* Footer */ }
<div className="text-center mt-12 text-purple-200">
  <p className="text-sm">
    Built with Next.js, TypeScript, and TailwindCSS
  </p>
</div>
    </div >
  </div >
);
}
