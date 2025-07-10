import { useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishListComponent = () => {

    const [wishItems, setWishItems] = useState([
        // inicializo con esto para pruebas
        {
            id: 1,
            name: 'Producto ejemplo 1',
            price: 29.99,
            image: 'http://via.placeholder.com/150',
            addedDate: '2024-01-15'
        },
        {
            id: 2,
            name: 'Producto ejemplo 2',
            price: 55.99,
            image: 'http://via.placeholder.com/150',
            addedDate: '2024-01-10'
        },

    ]);

    const removeFromWishList = (id) => {
        setWishItems(prev => prev.filter(item => item.id !== id));
    };

    const addToCart = (item) => {
        // conecto el store del carrito
        // fijarse si el producto está disponible por eliminación o por stock
        console.log('Agregando al carrito:', item);
        alert(`${item.name} agregado al carrito`);
    }

    return (
        <div className="space-y-4">
            {
                wishItems.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className='mx-auto h-16 w-16 text-gray-600 mb-4' />
                        <p className="text-gray-400">Tu lista de deseos está vacía.</p>
                    </div>
                ) : (
                    wishItems.map(item => (
                        <div className='bg-gray-800 rounded-2xl p-4 flex items-center gap-4' key={item.id}>
                            <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                            />

                            <div className="flex-1">
                                <h3 className='text-white font-medium'>
                                    {item.name}
                                </h3>
                                <p className='text-green-400 font-bold'>
                                    ${item.price}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Agregado: {item.addedDate}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={()=>addToCart(item)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    <ShoppingBag size={16} />
                                </button>
                                <button
                                    onClick={()=>removeFromWishList(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    <Trash2  size={16}/>
                                </button>
                            </div>
                        </div>
                    ))
                )
            }
        </div>
    )
}
