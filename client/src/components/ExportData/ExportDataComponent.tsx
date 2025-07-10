import { Download, FileText, Database, CheckCircle } from "lucide-react";
import { useState } from "react";

export function ExportDataComponent() {
  const [loading, setLoading] = useState(null);
  const [exported, setExported] = useState([]);

  const exportOptions = [
    {
      id: 'orders',
      title: 'Historial de Pedidos',
      description: 'Todas tus compras y transacciones',
      icon: <FileText className="w-5 h-5" />,
      format: 'CSV'
    },
    {
      id: 'profile',
      title: 'Datos del Perfil',
      description: 'Información personal y configuración',
      icon: <Database className="w-5 h-5" />,
      format: 'CSV'
    },
    {
      id: 'reviews',
      title: 'Reseñas y Valoraciones',
      description: 'Todas tus opiniones sobre productos',
      icon: <FileText className="w-5 h-5" />,
      format: 'PDF'
    }
  ];

  const handleExport = async (optionId) => {
    setLoading(optionId);
    
    // Simular exportación
    setTimeout(() => {
      setLoading(null);
      setExported([...exported, optionId]);
      
      // Remover de exportados después de 3 segundos
      setTimeout(() => {
        setExported(prev => prev.filter(id => id !== optionId));
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Disponibles</h2>
      </div>

      <div className="mb-6">
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-4">
          <p className="text-blue-300 text-sm">
            <strong>Privacidad:</strong> Tus datos se exportan de forma segura y solo tú puedes acceder a ellos.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-400">
                  {option.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{option.title}</h3>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 my-4 md:my-0">
                <span className="text-xs text-gray-500 bg-gray-700 px-4 py-2 rounded">
                  {option.format}
                </span>
                
                {exported.includes(option.id) ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Exportado</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleExport(option.id)}
                    disabled={loading === option.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                  >
                    {loading === option.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Exportando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Los archivos se descargarán automáticamente cuando estén listos
        </p>
      </div>
    </div>
  );
}