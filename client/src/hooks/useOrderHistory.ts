/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderService } from "../services/orderService";
import { useState, useEffect, useCallback } from "react";
import { useLoader } from "./useLoader";

export const useOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState<any | null>(null); // useState<any | null> can be simplified to useState<any>
    const {loading, setLoading} = useLoader();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const orders = await orderService.getOrderHistory();
            setOrders(orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=>{
        fetchOrders();
    },[fetchOrders]);

    return {
        orders, 
        loading, 
        error,
        refetch: fetchOrders
    };
}