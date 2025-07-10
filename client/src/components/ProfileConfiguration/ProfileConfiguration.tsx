
import { useState } from "react"
import {
  User,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react'

export const ProfileConfiguration = () => {

  const [userData, setUserData] = useState({
    id: 1,
    username: 'usuario_ejemplo',
    email: 'usuario@ejemplo.com'
  });

  const [formData, setFormData] = useState({
    username: userData.username,
    email: userData.email,
    newPassword: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    console.log('Actualizando:',formData);
    setUserData(prev => ({
      ...prev,
      username: formData.username,
      email: formData.email
    }));
    alert('Perfil actualizado');
  }

  const handleDelete = () => {
    // conecto mi api para eliminar
    console.log('Eliminando cuenta...');
    alert('Cuenta eliminada');
    setShowDeleteModal(false);
  }

  return (
    <div className=" bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <User
            size={24}
          />
          Mi Perfil
        </h2>

        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Dejar vacío para no cambiar"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 mt-4"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>

      </div>
        {/* Zona Peligrosa */}
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-900/20 border border-red-800 rounded-2xl">
          <h3 className="text-red-400 font-semibold mb-2">Zona Peligrosa</h3>
          <p className="text-gray-400 text-sm mb-4">
            Eliminar tu cuenta es permanente y no se puede deshacer.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar Cuenta
          </button>
        </div>

        {/* Modal de confirmación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-lg font-bold text-white">¿Eliminar cuenta?</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Esta acción no se puede deshacer. Perderás todos tus datos permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
