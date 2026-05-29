import { useEffect, useState } from 'react'
import PointsTable from './components/PointsTable'
import {
  entregaMessages,
  heroContent,
  historiaContent,
  imageBySection,
  menuSections,
  playlistUrl,
  puntosBenefits,
  puntosWays,
  reservaOptions,
  senbazuruMeaningInfo,
  teaBenefitInfo,
  tallerMessages,
  teaHighlights,
} from './data/content'

function ProgressPanel({ title, subtitle, messages, onComplete, onReset, craneSprite }) {
  const [step, setStep] = useState(0)
  const progress = ((step + 1) / messages.length) * 100
  const settledCount = Math.max(3, Math.round(((step + 1) / messages.length) * 22))
  const fillLevel = Math.max(18, Math.round(((step + 1) / messages.length) * 88))

  function nextStep() {
    setStep((current) => {
      const next = current + 1 < messages.length ? current + 1 : current
      if (next === messages.length - 1) {
        onComplete?.()
      }
      return next
    })
  }

  function restart() {
    setStep(0)
    onReset?.()
  }

  return (
    <article className="panel process-panel">
      <h3>{title}</h3>
      <p>{subtitle}</p>

      <div className="basket-shell" role="status" aria-live="polite" style={{ '--crane-image': `url(${craneSprite})` }}>
        <div className="falling-layer" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="falling-crane"
              style={{
                '--delay': `${index * 0.6}s`,
                '--offset': `${(index % 2 === 0 ? -1 : 1) * (14 + index * 5)}px`,
              }}
            />
          ))}
        </div>

        <div className="bowl">
          <div className="bowl-fill" style={{ '--fill-level': `${fillLevel}%` }}>
            {Array.from({ length: settledCount }).map((_, index) => (
              <span
                key={index}
                className="settled-crane"
                style={{
                  '--x': `${6 + ((index * 17) % 82)}%`,
                  '--y': `${4 + Math.floor(index / 4) * 13}px`,
                  '--r': `${((index * 23) % 36) - 18}deg`,
                  '--s': `${0.72 + ((index % 5) * 0.08)}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="progress-bar" aria-label={`${progress}% de avance`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <p className="process-message">{messages[step]}</p>

      <div className="row-actions">
        <button type="button" onClick={nextStep} disabled={step === messages.length - 1}>
          Avanzar estado
        </button>
        <button type="button" className="ghost" onClick={restart}>
          Reiniciar
        </button>
      </div>
    </article>
  )
}

function BottomButtons({ sections, onSelect }) {
  return (
    <nav className="bottom-menu" aria-label="Navegacion de secciones">
      {sections.map((section) => (
        <button key={section.id} type="button" className="menu-card" onClick={() => onSelect(section.id)}>
          <span className="menu-icon" aria-hidden="true">
            {section.emoji}
          </span>
          <span className="menu-copy">
            <strong>{section.label}</strong>
            <small>{section.subtitle}</small>
          </span>
        </button>
      ))}
    </nav>
  )
}

function PageNavigator({ sections, currentId, onSelect, onHome }) {
  const currentIndex = sections.findIndex((item) => item.id === currentId)
  const previous = currentIndex > 0 ? sections[currentIndex - 1] : null
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null

  return (
    <footer className="page-nav" aria-label="Navegacion entre paginas">
      <button
        type="button"
        className="nav-side"
        onClick={() => previous && onSelect(previous.id)}
        disabled={!previous}
      >
        {previous ? previous.label : 'Sin anterior'}
      </button>

      <button type="button" className="nav-home" onClick={onHome}>
        Inicio
      </button>

      <button
        type="button"
        className="nav-side"
        onClick={() => next && onSelect(next.id)}
        disabled={!next}
      >
        {next ? next.label : 'Sin siguiente'}
      </button>
    </footer>
  )
}

function ImageLightbox({ image, zoom, onClose, onZoomIn, onZoomOut, onWheelZoom }) {
  if (!image.src) {
    return null
  }

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Visor de imagen">
      <div className="lightbox-shell" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-toolbar">
          <button type="button" onClick={onZoomOut} aria-label="Alejar imagen">
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={onZoomIn} aria-label="Acercar imagen">
            +
          </button>
          <button type="button" onClick={onClose} className="ghost">
            Cerrar
          </button>
        </div>

        <div className="lightbox-stage" onWheel={onWheelZoom}>
          <img
            src={image.src}
            alt={image.alt}
            style={{ transform: `scale(${zoom})` }}
            className="lightbox-image"
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [serviceType, setServiceType] = useState(reservaOptions[0])
  const [bookingDone, setBookingDone] = useState(false)
  const [uploadedImage, setUploadedImage] = useState('')
  const [activePage, setActivePage] = useState('home')
  const [workshopReady, setWorkshopReady] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('Tu vehiculo ya esta listo')
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedMeaning, setSelectedMeaning] = useState('')
  const [selectedTeaHighlight, setSelectedTeaHighlight] = useState('')
  const craneSpritePath = '/images/custom/grulla-sprite.png'
  const brandImagePath = '/images/custom/nortesur-clean.png'

  function submitBooking(event) {
    event.preventDefault()
    setBookingDone(true)
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setUploadedImage(URL.createObjectURL(file))
  }

  function openLightbox(src, alt) {
    setLightboxImage({ src, alt })
    setZoomLevel(1)
  }

  function closeLightbox() {
    setLightboxImage({ src: '', alt: '' })
    setZoomLevel(1)
  }

  function zoomIn() {
    setZoomLevel((current) => Math.min(4, +(current + 0.25).toFixed(2)))
  }

  function zoomOut() {
    setZoomLevel((current) => Math.max(1, +(current - 0.25).toFixed(2)))
  }

  function handleWheelZoom(event) {
    event.preventDefault()
    if (event.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  useEffect(() => {
    if (!lightboxImage.src) {
      return
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lightboxImage.src])

  function renderCurrentPage() {
    switch (activePage) {
      case 'historia':
        return (
          <section className="panel wide">
            <h2>Historia de las mil grullas</h2>
            <div className="history-visuals">
              <button
                type="button"
                className="image-trigger"
                onClick={() => openLightbox(imageBySection.historyLogo, 'Logo Toyota')}
              >
                <img src={imageBySection.historyLogo} alt="Logo Toyota" className="history-logo" />
              </button>
              <button
                type="button"
                className="image-trigger"
                onClick={() => openLightbox(imageBySection.historyFrame, 'Fondo grullas japon')}
              >
                <img src={imageBySection.historyFrame} alt="Fondo grullas japon" className="history-frame" />
              </button>
              <button
                type="button"
                className="image-trigger"
                onClick={() => openLightbox(imageBySection.historyPhoto, 'Instalacion de grullas')}
              >
                <img src={imageBySection.historyPhoto} alt="Instalacion de grullas" className="history-photo" />
              </button>
            </div>
            <p>{historiaContent.intro}</p>
            <p className="important-line">
              <strong>{historiaContent.highlighted}</strong>
            </p>
            <p className="history-title-emphasis">
              <strong>
                <em>La historia de las mil grullas</em>
              </strong>
            </p>
            {historiaContent.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <h3>Que significa el Senbazuru</h3>
            <ul className="pill-list">
              {historiaContent.senbazuru.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`pill-button${selectedMeaning === item ? ' active' : ''}`}
                    onClick={() => setSelectedMeaning((current) => (current === item ? '' : item))}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            {selectedMeaning && (
              <div className="meaning-box" role="status" aria-live="polite">
                <h4>{selectedMeaning}</h4>
                <p>{senbazuruMeaningInfo[selectedMeaning]}</p>
              </div>
            )}
          </section>
        )

      case 'reserva':
        return (
          <section className="panel wide">
            <h2>Reserva tu experiencia Toyota</h2>
            <h3>Agenda tu cita</h3>
            <p>Reserva tu espacio y vive la experiencia Norte Sur Toyota.</p>

            <form onSubmit={submitBooking} className="booking-form">
              <label htmlFor="service-type">Tipo de cita</label>
              <select
                id="service-type"
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
              >
                {reservaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button type="submit">Agendar cita</button>
            </form>

            {bookingDone && (
              <p className="success">
                Tu cita fue agendada exitosamente. Has recibido 50 puntos Toyota.
              </p>
            )}
          </section>
        )

      case 'taller':
        return (
          <section className="wide">
            <ProgressPanel
              title="Tiempo de espera del taller"
              subtitle="Estado de tu vehiculo: tu vehiculo esta siendo atendido"
              messages={tallerMessages}
              craneSprite={craneSpritePath}
              onComplete={() => {
                setWorkshopReady(true)
                setShowNotification(true)
                setNotificationMessage('Tu vehiculo ya esta listo')
              }}
              onReset={() => {
                setWorkshopReady(false)
                setShowNotification(false)
              }}
            />
          </section>
        )

      case 'entrega':
        return (
          <section className="wide">
            <ProgressPanel
              title="Tiempo de espera para entrega del vehiculo"
              subtitle="Tu Toyota esta en preparacion final para entrega"
              messages={entregaMessages}
              craneSprite={craneSpritePath}
              onComplete={() => {
                setWorkshopReady(true)
                setShowNotification(true)
                setNotificationMessage('Tu vehiculo ya esta listo para ser entregado')
              }}
              onReset={() => {
                setWorkshopReady(false)
                setShowNotification(false)
              }}
            />
          </section>
        )

      case 'puntos':
        return (
          <section className="panel wide">
            <h2>Tus puntos Toyota</h2>
            <p>Acumula puntos y disfruta beneficios exclusivos.</p>
            <PointsTable ways={puntosWays} benefits={puntosBenefits} />
          </section>
        )

      case 'accesorios':
        return (
          <section className="panel wide">
            <h2>Accesorios Toyota</h2>
            <h3>Accesorios exclusivos</h3>
            <div className="accessories-grid">
              {imageBySection.accessories.map((item) => (
                <article key={item.name} className="accessory-card">
                  <button
                    type="button"
                    className="image-trigger"
                    onClick={() => openLightbox(item.image, item.name)}
                  >
                    <img src={item.image} alt={item.name} />
                  </button>
                  <p>
                    <em>{item.name}</em>
                  </p>
                </article>
              ))}
            </div>
            <p className="final-line">Accesorios exclusivos Norte Sur Toyota</p>
          </section>
        )

      case 'te':
        return (
          <section className="panel wide">
            <h2>Experiencia del te japones</h2>
            <h3>La tranquilidad del te japones</h3>
            <button
              type="button"
              className="image-trigger tea-trigger"
              onClick={() => openLightbox(imageBySection.tea, 'Te japones')}
            >
              <img src={imageBySection.tea} alt="Te japones" className="tea-image" />
            </button>
            <p>
              <em>En Japon, el te representa calma, armonia y bienestar.</em>
            </p>
            <p>
              La ceremonia del te es una tradicion japonesa que busca transmitir tranquilidad y
              conexion con el presente.
            </p>
            <p>
              Inspirados en esta tradicion, en Norte Sur Toyota queremos que cada espera se
              convierta en un momento mas relajante y agradable.
            </p>
            <ul className="clean-list">
              {teaHighlights.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`tea-item-button${selectedTeaHighlight === item ? ' active' : ''}`}
                    onClick={() =>
                      setSelectedTeaHighlight((current) => (current === item ? '' : item))
                    }
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            {selectedTeaHighlight && (
              <div className="meaning-box" role="status" aria-live="polite">
                <h4>{selectedTeaHighlight}</h4>
                <p>{teaBenefitInfo[selectedTeaHighlight]}</p>
              </div>
            )}
          </section>
        )

      case 'playlist':
        return (
          <section className="panel wide">
            <h2>Playlist Toyota</h2>
            <h3>Escucha la experiencia Toyota</h3>
            <p>
              <em>
                Disfruta una playlist disenada para transmitir tranquilidad y armonia durante tu
                experiencia en Norte Sur Toyota.
              </em>
            </p>
            <a className="spotify-link" href={playlistUrl} target="_blank" rel="noreferrer">
              Abrir playlist en Spotify
            </a>
          </section>
        )

      case 'origami':
        return (
          <section className="panel wide">
            <h2>Sube tu origami</h2>
            <h3>Comparte tu grulla</h3>
            <p>
              Durante tu visita podras crear una grulla de papel en nuestra sala de espera.
              Tomale una foto y subela al aplicativo para recibir recompensas exclusivas.
            </p>

            <label className="drop-zone" htmlFor="origami-upload">
              Arrastra tu foto aqui o haz clic para seleccionar
            </label>
            <input
              id="origami-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {uploadedImage && (
              <>
                <button
                  type="button"
                  className="image-trigger"
                  onClick={() => openLightbox(uploadedImage, 'Origami cargado')}
                >
                  <img className="preview-image" src={uploadedImage} alt="Origami cargado" />
                </button>
                <p className="success">Has recibido 100 puntos Toyota.</p>
                <p className="final-line">
                  Gracias por hacer parte de la experiencia Norte Sur Toyota. Cada grulla
                  representa un momento de paciencia, dedicacion y tranquilidad.
                </p>
              </>
            )}
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      {activePage === 'home' ? (
        <>
          <header className="hero-area">
            <div className="hero-overlay" />

            <div className="home-bell">
              <button
                type="button"
                className="bell-trigger"
                onClick={() => {
                  if (workshopReady) {
                    setShowNotification((current) => !current)
                  }
                }}
                aria-label="Notificaciones"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 0-5 5v2.8c0 .7-.2 1.4-.6 2l-1.1 1.6A1.5 1.5 0 0 0 6.6 17h10.8a1.5 1.5 0 0 0 1.3-2.3l-1.1-1.6c-.4-.6-.6-1.3-.6-2V8a5 5 0 0 0-5-5Zm0 18a2.5 2.5 0 0 1-2.3-1.5h4.6A2.5 2.5 0 0 1 12 21Z" />
                </svg>
                {workshopReady && <span className="bell-badge" />}
              </button>

              {showNotification && workshopReady && (
                <div className="notification-card" role="status" aria-live="polite">
                  <strong>{notificationMessage}</strong>
                </div>
              )}
            </div>

            <div className="hero-copy">
              <div className="brand-row">
                <img src={imageBySection.homeLogo} alt="Logo Toyota" className="toyota-logo" />
                <img src={brandImagePath} alt="Automotora Norte Sur" className="nortesur-wordmark" />
              </div>
              <h1>{heroContent.title}</h1>
              <p>{heroContent.subtitle}</p>
            </div>
          </header>
          <BottomButtons sections={menuSections} onSelect={setActivePage} />
        </>
      ) : (
        <>
          <main className="single-page">{renderCurrentPage()}</main>
          <PageNavigator
            sections={menuSections}
            currentId={activePage}
            onSelect={setActivePage}
            onHome={() => setActivePage('home')}
          />
        </>
      )}

      <ImageLightbox
        image={lightboxImage}
        zoom={zoomLevel}
        onClose={closeLightbox}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onWheelZoom={handleWheelZoom}
      />
    </div>
  )
}

export default App
