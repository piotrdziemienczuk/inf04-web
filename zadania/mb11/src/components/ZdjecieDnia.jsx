import { useState, useEffect } from 'react'

function losowaId() {
  return Math.floor(Math.random() * 300)
}

// Osobna sekcja, niezależna od głównej galerii — własny stan, własny
// useEffect, własne isLoading/error. Zmiana `id` po kliknięciu "Losuj"
// uruchamia efekt ponownie, dokładnie jak zmiana licznikA/licznikB
// w przykładzie z Licznikami w MB8 (sekcja 2 teorii).
function ZdjecieDnia() {
  const [id, setId] = useState(losowaId)
  const [zdjecie, setZdjecie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function pobierz() {
      setIsLoading(true)
      try {
        const odpowiedz = await fetch(`https://picsum.photos/id/${id}/info`)
        if (!odpowiedz.ok) throw new Error('Błąd serwera: ' + odpowiedz.status)
        const dane = await odpowiedz.json()
        setZdjecie(dane)
        setError(null)
      } catch (err) {
        // Picsum ma dziury w numeracji id (nie każde id w zakresie istnieje),
        // więc błąd 404 tu jest realny, nie tylko teoretyczny. Nie robimy
        // wczesnego return — przycisk musi zostać widoczny, żeby dało się
        // wylosować kolejne id, zamiast utknąć na ekranie błędu.
        setError(err.message)
        setZdjecie(null)
      } finally {
        setIsLoading(false)
      }
    }

    pobierz()
  }, [id])

  return (
    <div className="container mt-5 mb-5">
      <h2>Zdjęcie dnia</h2>

      {error && <div className="alert alert-danger">Błąd: {error}</div>}

      {zdjecie && (
        <>
          <img
            src={`https://picsum.photos/id/${id}/400/250`}
            className="img-fluid rounded"
            alt={zdjecie.author}
          />
          <p className="text-muted mt-2">Autor: {zdjecie.author}</p>
        </>
      )}

      <button
        className="btn btn-outline-primary"
        disabled={isLoading}
        onClick={() => setId(losowaId())}
      >
        {isLoading ? 'Losuję...' : 'Losuj nowe zdjęcie'}
      </button>
    </div>
  )
}

export default ZdjecieDnia
