import { useState } from 'react'
import { oracleYesNo, oracleOpen, useDiceStore } from '../../stores/diceStore'

const YES_NO_COLORS: Record<string, string> = {
  'YES, AND…': 'text-green-300',
  'YES': 'text-green-400',
  'YES, BUT…': 'text-yellow-300',
  'NO, BUT…': 'text-orange-300',
  'NO': 'text-red-400',
  'NO, AND…': 'text-red-300',
}

const OPEN_TABLE = [
  ['Void', 'Treason', 'Chaos', 'Pain', 'Corruption', 'Oppression'],
  ['Suspicion', 'Regression', 'Collision', 'Desire', 'Vengeance', 'Occult'],
  ['Survival', 'Sacrifice', 'Conflict', 'Control', 'Electricity', 'Subversion'],
  ['Nurturing', 'Light', 'Noise', 'Healing', 'Velocity', 'Freedom'],
  ['Compromise', 'Prophecy', 'Evolution', 'Guidance', 'Growth', 'Nature'],
  ['Balance', 'Wealth', 'Change', 'Order', 'Truth', 'Time'],
]

export function OraclePanel() {
  const addEntry = useDiceStore((s) => s.addEntry)
  const [yesNoResult, setYesNoResult] = useState<ReturnType<typeof oracleYesNo> | null>(null)
  const [openResult, setOpenResult] = useState<ReturnType<typeof oracleOpen> | null>(null)
  const [tab, setTab] = useState<'yesno' | 'open'>('yesno')

  function rollYesNo() {
    const res = oracleYesNo()
    setYesNoResult(res)
    addEntry({
      type: 'oracle-yesno',
      label: 'Oracle YES/NO',
      result: res.result,
      detail: `d6 = ${res.roll}`,
    })
  }

  function rollOpen() {
    const res = oracleOpen()
    setOpenResult(res)
    addEntry({
      type: 'oracle-open',
      label: 'Oracle Open-Ended',
      result: res.word,
      detail: `d6(${res.d1}) × d6(${res.d2})`,
    })
  }

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-4">
      <h2 className="text-xs tracking-widest uppercase text-slate-400">Oracle</h2>

      {/* Tab */}
      <div className="flex gap-1 bg-[#0a0a0f] rounded p-1">
        {(['yesno', 'open'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-bold tracking-widest rounded transition ${
              tab === t ? 'bg-purple-500/30 text-purple-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t === 'yesno' ? 'YES / NO' : 'OPEN-ENDED'}
          </button>
        ))}
      </div>

      {tab === 'yesno' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Pose une question fermée, lance le d6.</p>
          <button
            onClick={rollYesNo}
            className="w-full py-3 border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase rounded hover:bg-purple-500/20 active:scale-95 transition"
          >
            🔮 Oracle YES/NO
          </button>
          {yesNoResult && (
            <div className="rounded border border-slate-700 p-4 text-center space-y-1">
              <div className={`text-3xl font-black tracking-widest ${YES_NO_COLORS[yesNoResult.result] ?? 'text-white'}`}>
                {yesNoResult.result}
              </div>
              <div className="text-xs text-slate-500">d6 = {yesNoResult.roll}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'open' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Pose une question ouverte, deux d6 donnent le thème.</p>
          <button
            onClick={rollOpen}
            className="w-full py-3 border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase rounded hover:bg-purple-500/20 active:scale-95 transition"
          >
            🔮 Oracle Open-Ended
          </button>
          {openResult && (
            <div className="rounded border border-slate-700 p-4 text-center space-y-1">
              <div className="text-3xl font-black tracking-widest text-purple-300">
                {openResult.word}
              </div>
              <div className="text-xs text-slate-500">d6({openResult.d1}) × d6({openResult.d2})</div>
            </div>
          )}

          {/* Table visuelle */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-1 text-slate-600">d6↓ / d6→</th>
                  {[1,2,3,4,5,6].map(n => (
                    <th key={n} className={`p-1 text-center ${openResult?.d2 === n ? 'text-purple-400' : 'text-slate-600'}`}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OPEN_TABLE.map((row, ri) => (
                  <tr key={ri}>
                    <td className={`p-1 text-center font-bold ${openResult?.d1 === ri+1 ? 'text-purple-400' : 'text-slate-600'}`}>{ri+1}</td>
                    {row.map((word, ci) => (
                      <td
                        key={ci}
                        className={`p-1 text-center rounded transition ${
                          openResult?.d1 === ri+1 && openResult?.d2 === ci+1
                            ? 'bg-purple-500/30 text-purple-200 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {word}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
