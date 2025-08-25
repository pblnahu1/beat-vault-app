import { Download, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
// import { apiClient } from "../../core/apiClient";
import authService from "../../services/authService";
import { useManagementUsers } from "../../hooks/useManagementUsers";

export function ExportDataComponent() {
  const currentUser = useManagementUsers()?.id_u;
  const [loading, setLoading] = useState<"pdf" | "csv" | null>(null);
  const [exported, setExported] = useState<string | null>(null);
  const getAuthToken = () => authService.getToken() || "";

  const handleExport = async (format: "pdf" | "csv") => {
  setLoading(format);
  try {
    // Llamada a la API, obteniendo el archivo como blob
    const response = await fetch(`http://localhost:3000/api/export-data?userId=${currentUser}&format=${format}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error("Error exportando archivo");

    const blob = await response.blob(); // obtiene el PDF o CSV
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_${currentUser}_data.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    setExported(format);
    setTimeout(() => setExported(null), 3000);
  } catch (err) {
    console.error("Error exportando:", err);
  } finally {
    setLoading(null);
  }
};


  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Exportar Mis Datos</h2>
      </div>

      <div className="mb-6">
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-4">
          <p className="text-blue-300 text-sm">
            <strong>Privacidad:</strong> Tu perfil e historial de compras se exportan en un solo archivo, en el formato que elijas.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {["pdf", "csv"].map((format) => (
          <div
            key={format}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Exportar en {format.toUpperCase()}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Descarga tu perfil e historial de compras en {format.toUpperCase()}.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 my-4 md:my-0">
                <span className="text-xs text-gray-500 bg-gray-700 px-4 py-2 rounded">
                  {format.toUpperCase()}
                </span>

                {exported === format ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Exportado</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleExport(format as "pdf" | "csv")}
                    disabled={loading === format}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                  >
                    {loading === format ? (
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
          El archivo se descargará automáticamente cuando esté listo
        </p>
      </div>
    </div>
  );
}
