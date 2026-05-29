export default function PointsTable({ ways, benefits }) {
  return (
    <div className="points-layout">
      <article className="panel">
        <h3>Como ganar puntos</h3>
        <ul className="clean-list">
          {ways.map((way) => (
            <li key={way.action}>
              <span>{way.action}</span>
              <strong>{way.points} pts</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="panel">
        <h3>Beneficios</h3>
        <div className="benefits-grid">
          {benefits.map((item) => (
            <div key={item.points} className="benefit-card">
              <h4>{item.points} puntos</h4>
              <p>{item.service}</p>
              <small>Accesorio: {item.accessory}</small>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
