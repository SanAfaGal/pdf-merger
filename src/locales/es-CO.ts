export const esCoLocale = {
  // Títulos principales
  appTitle: 'Fusionador de PDF',
  appDescription: 'Fusiona automáticamente pares de archivos PDF con prefijos numéricos coincidentes. Sube archivos como 12345N.pdf y 12345A.pdf para crear archivos fusionados llamados 12345.pdf.',
  
  // Zona de carga de archivos
  dropzone: {
    title: 'Arrastra archivos PDF aquí o haz clic para explorar',
    subtitle: 'Selecciona archivos PDF con nombres como 12345N.pdf y 12345A.pdf',
    pdfOnly: 'Solo archivos PDF',
    format: 'Formato: [número][N/A].pdf'
  },
  
  // Estadísticas
  stats: {
    title: 'Resumen del Procesamiento',
    totalPairs: 'Pares Totales',
    completed: 'Completados',
    incomplete: 'Incompletos',
    processing: 'Procesando'
  },
  
  // Acciones
  actions: {
    title: 'Acciones',
    mergeAll: 'Fusionar Todos los Listos',
    downloadAll: 'Descargar Todo como ZIP',
    reset: 'Reiniciar'
  },
  
  // Estados de pares
  pairStatus: {
    ready: 'Listo',
    processing: 'Procesando',
    completed: 'Completado',
    incomplete: 'Incompleto',
    error: 'Error'
  },
  
  // Tarjetas de pares
  pairCard: {
    pairTitle: 'Par',
    missing: 'faltante',
    mergePdfs: 'Fusionar PDFs',
    download: 'Descargar'
  },
  
  // Modal de ZIP
  zipModal: {
    title: 'Creando Archivo ZIP',
    compressing: 'Comprimiendo {count} archivos PDF...',
    pleaseWait: 'Por favor espera mientras creamos tu archivo ZIP',
    progress: 'Progreso',
    compressionFailed: 'Falló la Compresión',
    downloadComplete: 'Descarga Completa',
    successMessage: 'Se comprimieron exitosamente {count} archivos PDF',
    close: 'Cerrar'
  },
  
  // Estados vacíos
  emptyState: {
    title: 'No hay Archivos Seleccionados',
    description: 'Sube archivos PDF para comenzar. La aplicación detectará y agrupará automáticamente los archivos por su prefijo numérico.'
  },
  
  // Mensajes de error
  errors: {
    invalidFileNames: 'Nombres de archivo inválidos (deben tener el formato [número][N/A].pdf): {files}',
    noCompletedPairs: 'No hay pares de PDF completados disponibles para descargar',
    mergeFailed: 'Error al fusionar los PDFs',
    zipCreationFailed: 'Error al crear el archivo ZIP',
    genericError: 'Ha ocurrido un error inesperado'
  },
  
  // Sección de pares
  pairsSection: {
    title: 'Pares de PDF'
  }
};

export type LocaleType = typeof esCoLocale;