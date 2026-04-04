export function MapPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4" style={{ color: 'var(--earth-50)' }}>
        Mapa de la Huerta
      </h2>
      <div
        className="flex items-center justify-center rounded-lg h-64"
        style={{
          border: '2px dashed var(--green-600)',
          color: 'var(--green-200)',
        }}
      >
        <span className="text-lg">Mapa SVG aquí</span>
      </div>
      <p className="mt-4 text-sm" style={{ color: 'var(--earth-400)' }}>
        En construcción — Sprint 1
      </p>
    </div>
  )
}
