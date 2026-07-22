import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Holding = {
  id: number
  ticker: string
  name: string
  amount: number
  color: string
}

const colors = ['#6c63ff', '#20b486', '#ffb547', '#ee6c81', '#4da3ff']

const starterHoldings: Holding[] = [
  { id: 1, ticker: 'VOO', name: 'Vanguard S&P 500 ETF', amount: 3000, color: colors[0] },
  { id: 2, ticker: 'AAPL', name: 'Apple Inc.', amount: 2000, color: colors[1] },
  { id: 3, ticker: 'NVDA', name: 'NVIDIA Corp.', amount: 1500, color: colors[2] },
  { id: 4, ticker: 'MSFT', name: 'Microsoft Corp.', amount: 1000, color: colors[3] },
]

const storageKey = 'finsight-ai-holdings'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function loadSavedHoldings() {
  const savedHoldings = localStorage.getItem(storageKey)
  if (!savedHoldings) return starterHoldings

  try {
    const parsedHoldings = JSON.parse(savedHoldings) as Holding[]
    return parsedHoldings.length ? parsedHoldings : starterHoldings
  } catch {
    return starterHoldings
  }
}

function App() {
  const [holdings, setHoldings] = useState<Holding[]>(loadSavedHoldings)
  const [ticker, setTicker] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [amount, setAmount] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [editingHoldingId, setEditingHoldingId] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(holdings))
  }, [holdings])

  const total = useMemo(
    () => holdings.reduce((sum, holding) => sum + holding.amount, 0),
    [holdings],
  )

  const allocation = useMemo(() => {
    let cursor = 0
    const slices = holdings.map((holding) => {
      const start = cursor
      cursor += total ? (holding.amount / total) * 100 : 0
      return `${holding.color} ${start}% ${cursor}%`
    })
    return `conic-gradient(${slices.join(', ') || '#e9e8f2 0 100%'})`
  }, [holdings, total])

  function clearForm() {
    setTicker('')
    setCompanyName('')
    setAmount('')
    setFormError('')
    setEditingHoldingId(null)
  }

  function openAddForm() {
    clearForm()
    setShowForm(true)
  }

  function startEditing(holding: Holding) {
    setTicker(holding.ticker)
    setCompanyName(holding.name)
    setAmount(String(holding.amount))
    setFormError('')
    setEditingHoldingId(holding.id)
    setShowForm(true)
  }

  function saveHolding(event: FormEvent) {
    event.preventDefault()
    const cleanTicker = ticker.trim().toUpperCase()
    const cleanCompanyName = companyName.trim()
    const numericAmount = Number(amount)
    if (!cleanTicker || numericAmount <= 0) {
      setFormError('Please enter a ticker and an amount greater than $0.')
      return
    }

    if (editingHoldingId) {
      setHoldings((current) =>
        current.map((holding) =>
          holding.id === editingHoldingId
            ? {
                ...holding,
                ticker: cleanTicker,
                name: cleanCompanyName || `${cleanTicker} holding`,
                amount: numericAmount,
              }
            : holding,
        ),
      )
    } else {
      setHoldings((current) => [
        ...current,
        {
          id: Date.now(),
          ticker: cleanTicker,
          name: cleanCompanyName || `${cleanTicker} holding`,
          amount: numericAmount,
          color: colors[current.length % colors.length],
        },
      ])
    }

    clearForm()
    setShowForm(false)
  }

  function removeHolding(id: number) {
    setHoldings((current) => current.filter((holding) => holding.id !== id))
  }

  function resetPortfolio() {
    setHoldings(starterHoldings)
    setTicker('')
    setCompanyName('')
    setAmount('')
    setFormError('')
    setEditingHoldingId(null)
    setShowForm(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="FinSight home">
          <span className="brand-mark">F</span>
          <span>FinSight <em>AI</em></span>
        </a>
        <nav>
          <a className="active" href="#"><span>⌂</span> Overview</a>
          <a href="#holdings"><span>◫</span> Portfolio</a>
          <a href="#insight"><span>✦</span> AI Insights</a>
          <a href="#learn"><span>◇</span> Learn</a>
        </nav>
        <div className="sidebar-bottom">
          <a href="#settings"><span>⚙</span> Settings</a>
          <div className="user">
            <span className="avatar">AV</span>
            <span><strong>Demo Investor</strong><small>Student account</small></span>
          </div>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">WEDNESDAY, JULY 8</p>
            <h1>Good afternoon, Ananya.</h1>
            <p>Here’s how your portfolio is looking today.</p>
          </div>
          <button className="primary" onClick={openAddForm}>＋ Add holding</button>
        </header>

        {showForm && (
          <form className="add-form" onSubmit={saveHolding}>
            <label>
              Ticker
              <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="e.g. TSLA" autoFocus />
            </label>
            <label>
              Company or fund name
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Tesla Inc." />
            </label>
            <label>
              Amount invested
              <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" placeholder="$1,000" />
            </label>
            <button className="primary" type="submit">{editingHoldingId ? 'Save changes' : 'Add to portfolio'}</button>
            <button className="text-button" type="button" onClick={() => { clearForm(); setShowForm(false) }}>Cancel</button>
            {formError && <p className="form-error">{formError}</p>}
          </form>
        )}

        <section className="metric-grid" aria-label="Portfolio summary">
          <article className="hero-card">
            <p>Portfolio value <span className="status-dot">Mock data</span></p>
            <h2>{money.format(total)}</h2>
            <span className="positive">↗ 6.8%</span><small> hypothetical return</small>
            <svg viewBox="0 0 500 90" role="img" aria-label="Upward portfolio trend">
              <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c63ff" stopOpacity=".25"/><stop offset="1" stopColor="#6c63ff" stopOpacity="0"/></linearGradient></defs>
              <path className="area" d="M0,77 C55,72 63,42 115,55 S180,70 215,43 S280,50 310,25 S375,42 410,20 S455,31 500,5 L500,90 L0,90Z"/>
              <path className="line" d="M0,77 C55,72 63,42 115,55 S180,70 215,43 S280,50 310,25 S375,42 410,20 S455,31 500,5"/>
            </svg>
          </article>
          <article className="metric-card"><div className="icon purple">◈</div><p>Risk level</p><h3>Moderate</h3><div className="meter"><i style={{width: '58%'}} /></div><small>58 out of 100</small></article>
          <article className="metric-card"><div className="icon green">◎</div><p>Diversification</p><h3>Good</h3><div className="meter green-meter"><i style={{width: '76%'}} /></div><small>4 holdings across 2 sectors</small></article>
        </section>

        <section className="content-grid">
          <article className="panel allocation-panel">
            <div className="panel-heading"><div><p className="eyebrow">YOUR MIX</p><h2>Portfolio allocation</h2></div><button className="dots">•••</button></div>
            <div className="allocation">
              <div className="donut" style={{background: allocation}}><span><strong>{holdings.length}</strong>holdings</span></div>
              <div className="legend">
                {holdings.map((holding) => (
                  <div key={holding.id}><i style={{background: holding.color}}/><span>{holding.ticker}<small>{total ? Math.round((holding.amount / total) * 100) : 0}%</small></span></div>
                ))}
              </div>
            </div>
          </article>

          <article className="panel insight" id="insight">
            <div className="sparkle">✦</div>
            <p className="eyebrow">AI PORTFOLIO INSIGHT</p>
            <h2>Your portfolio leans toward technology.</h2>
            <p>About 60% of your portfolio is invested in individual technology companies. This can create stronger growth potential, but also larger short-term swings.</p>
            <button className="ask-button">Ask FinSight about this <span>→</span></button>
            <small>Educational only — not financial advice.</small>
          </article>
        </section>

        <section className="panel holdings" id="holdings">
          <div className="panel-heading"><div><p className="eyebrow">POSITIONS</p><h2>Your holdings</h2></div><button className="text-button" onClick={openAddForm}>＋ Add holding</button></div>
          <p className="save-note">Saved in this browser. Refresh the page and your portfolio will still be here.</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Asset</th><th>Amount</th><th>Allocation</th><th>Actions</th></tr></thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.id}>
                    <td><span className="ticker-icon" style={{background: holding.color}}>{holding.ticker.slice(0, 1)}</span><span><strong>{holding.ticker}</strong><small>{holding.name}</small></span></td>
                    <td>{money.format(holding.amount)}</td>
                    <td>{total ? ((holding.amount / total) * 100).toFixed(1) : 0}%</td>
                    <td>
                      <div className="row-actions">
                        <button className="edit" onClick={() => startEditing(holding)}>Edit</button>
                        <button className="delete" onClick={() => removeHolding(holding.id)} aria-label={`Remove ${holding.ticker}`}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="reset-button" onClick={resetPortfolio}>Reset to sample portfolio</button>
        </section>
      </main>
    </div>
  )
}

export default App
