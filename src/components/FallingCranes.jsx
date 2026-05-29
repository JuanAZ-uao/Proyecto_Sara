export default function FallingCranes({ count = 6 }) {
  return (
    <div className="crane-stream" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="crane"
          style={{
            '--delay': `${index * 0.35}s`,
            '--x': `${(index % 3) * 28 - 28}px`,
          }}
        >
          grulla
        </span>
      ))}
    </div>
  )
}
