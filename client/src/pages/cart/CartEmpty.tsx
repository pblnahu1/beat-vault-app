import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { CartEmptyProps } from "../../types/prodCart";
import { Loader } from "../../components/UI/Loader/Loader";

export const CartEmpty: React.FC<CartEmptyProps> = ({ items, loading }) => {
  const hasItems = items.length > 0;
  if (hasItems) return null;

  // render functions
  function renderEmptyCartContent() {
    return (
      <>
        <ShoppingCart size={48} className="text-blue-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-4 text-slate-200">
          Tu carrito está vacío... ¡Agregá ahora tus productos preferidos!
        </h2>
        {renderCatalogLink()}
        {renderHistory()}
      </>
    )
  }

  function renderCatalogLink() {
    return (
      <Link 
        to="/" 
        className="p-4 rounded-lg bg-blue-950 text-blue-200 hover:text-blue-300 font-medium underline"
      >
        Ver catálogo
      </Link>
    )
  }

  function renderHistory(){
    return (
      <span className="text-slate-300 mt-6">
        * Para ver tu historial de compras: <b>Gestioná tu cuenta → Historial de Compras</b>
      </span>
    )
  }

  function renderLoadingState(){
    if(!loading) return null;
    return(
      <Loader message='Verificando carrito...' />
    )
  }

  // Devuelve el bloque solamente cuando no hay items
  // if (items.length === 0) {
    // return loading ? (

    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        {renderLoadingState()}   
        {renderEmptyCartContent()}
      </div>
    // ) : (
      // si no está cargando y no hay items, podés mostrar lo mismo o algo distinto
      


    )
};
