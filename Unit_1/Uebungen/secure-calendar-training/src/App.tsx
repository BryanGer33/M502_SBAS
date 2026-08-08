import { useState } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import axios from 'axios'

// Termin-Datenstruktur
interface Appointment {
  id: string
  title: string
  date: string   // Format: YYYY-MM-DD
  time: string   // Format: HH:mm
  description: string
}

// Demo-Endpunkt – kein echter Backend, nur zur Demonstration von axios
const DEMO_API_URL = 'https://jsonplaceholder.typicode.com/todos'

// Startdaten für die Demo
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: nanoid(),
    title: 'Team Meeting',
    date: '2026-08-11',
    time: '09:00',
    description: 'Wöchentlicher Sync',
  },
  {
    id: nanoid(),
    title: 'Code Review',
    date: '2026-08-11',
    time: '14:00',
    description: 'PR #42 reviewen',
  },
  {
    id: nanoid(),
    title: 'IT Security Training',
    date: '2026-08-13',
    time: '10:00',
    description: 'Modul IT Security – Dependency Analysis',
  },
  {
    id: nanoid(),
    title: 'Sprint Planning',
    date: '2026-08-18',
    time: '09:30',
    description: 'Sprint 3 planen',
  },
]

function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [apiMessage, setApiMessage] = useState('')

  // moment: ISO-Datum in lesbares Deutsch formatieren
  const formatDate = (isoDate: string): string =>
    moment(isoDate).format('dddd, DD. MMMM YYYY')

  // lodash: gefilterte Termine sortieren und nach Datum gruppieren
  const filtered = appointments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const sorted = _.sortBy(filtered, ['date', 'time'])
  const grouped: Record<string, Appointment[]> = _.groupBy(sorted, 'date')

  const handleAdd = () => {
    if (!newTitle.trim() || !newDate || !newTime) return
    const appointment: Appointment = {
      id: nanoid(), // nanoid: eindeutige ID generieren
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      description: newDescription.trim(),
    }
    setAppointments(prev => [...prev, appointment])
    setNewTitle('')
    setNewDate('')
    setNewTime('')
    setNewDescription('')
  }

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  // axios: Fake-Import von einer öffentlichen Demo-API
  const handleFakeImport = async () => {
    setApiMessage('Importiere…')
    try {
      const response = await axios.get<Array<{ id: number; title: string }>>(
        `${DEMO_API_URL}?_limit=3`
      )
      const imported: Appointment[] = response.data.map(item => ({
        id: nanoid(),
        title: item.title,
        // moment: relatives Datum für Demo-Daten berechnen
        date: moment().add(item.id % 5, 'days').format('YYYY-MM-DD'),
        time: '12:00',
        description: 'Importiert via Demo-API',
      }))
      setAppointments(prev => [...prev, ...imported])
      setApiMessage(`${imported.length} Termine importiert (Demo)`)
    } catch {
      setApiMessage('Import fehlgeschlagen – Demo-API nicht erreichbar')
    }
  }

  // lodash: Termine für den Export aufbereiten
  const handleExport = () => {
    const data = _.sortBy(appointments, ['date', 'time'])
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'termine.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kalender App</h1>
        <p className="training-badge">Nur für Schulungszwecke</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Termine suchen…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <main className="calendar">
        {Object.keys(grouped).length === 0 ? (
          <p className="empty-message">Keine Termine gefunden.</p>
        ) : (
          Object.entries(grouped).map(([date, apps]) => (
            <section key={date} className="date-group">
              <h2 className="date-heading">{formatDate(date)}</h2>
              {apps.map(app => (
                <div key={app.id} className="appointment-card">
                  <div className="appointment-info">
                    <span className="appointment-time">{app.time} Uhr</span>
                    <span className="appointment-title">{app.title}</span>
                    {app.description && (
                      <span className="appointment-desc">{app.description}</span>
                    )}
                  </div>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(app.id)}
                  >
                    Löschen
                  </button>
                </div>
              ))}
            </section>
          ))
        )}
      </main>

      <section className="add-form">
        <h2>Neuer Termin</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Titel *"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
          />
          <input
            type="time"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Beschreibung (optional)"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
        </div>
        <button className="btn btn-add" onClick={handleAdd}>
          Termin hinzufügen
        </button>
      </section>

      <section className="actions">
        <button className="btn btn-export" onClick={handleExport}>
          Export (JSON)
        </button>
        <button className="btn btn-import" onClick={handleFakeImport}>
          Fake-Import via API
        </button>
        {apiMessage && <span className="api-message">{apiMessage}</span>}
      </section>
    </div>
  )
}

export default App
