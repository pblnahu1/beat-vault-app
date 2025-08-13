import cartService from "../../services/cartService.ts";

interface HandleBuyClickProps {
  clearCart: () => void;
}

// type PurchaseResult = {
//   success: boolean;
//   purchaseId?: string;
//   message?: string;
// }

const handleBuyClick = async ({clearCart}: HandleBuyClickProps): Promise<void> => {
  const result = await cartService.handlePurchase();
  if (result.success) {
    alert(`¡Tu compra fue un éxito! ID DE COMPRA: #${result.purchaseId}`);
    clearCart();
    // window.location.reload();
  } else {
    alert(`Error al comprar: ${result.message}`);
  }
};

export default handleBuyClick;
