// src/pages/dashboard/Profile.tsx
export default function Profile() {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Perfil de Usuario</h1>
        <form className="space-y-4 max-w-lg">
          <input type="text" placeholder="Nombre" className="input" />
          <input type="email" placeholder="Correo electrónico" className="input" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Guardar cambios</button>
        </form>
      </div>
    );
  }
  