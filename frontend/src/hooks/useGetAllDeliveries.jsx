import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDeliveries } from '@/lib/apiRequests';
import { setAllDeliveries, setLoading as setDeliveriesLoading } from '@/store/deliverySlice';

export default function useGetAllDeliveries() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.delivery);

  useEffect(() => {
    let mounted = true;
    dispatch(setDeliveriesLoading(true));

    (async () => {
      try {
        const res = await getAllDeliveries();
        console.log('Fetched deliveries:', res);
        if (mounted && res.success) {
          dispatch(setAllDeliveries(res.deliveries));
        }
      } catch (err) {
        console.error('Failed to fetch deliveries:', err);
      } finally {
        if (mounted) dispatch(setDeliveriesLoading(false));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return { loading };
}
