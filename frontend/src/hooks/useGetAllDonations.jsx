import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDonations } from '@/lib/apiRequests';
import { setAllDonations, setLoading as setDonationsLoading } from '@/store/donationSlice';

export default function useGetAllDonations() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.donation);

  useEffect(() => {
    let mounted = true;
    dispatch(setDonationsLoading(true));

    (async () => {
      try {
        const res = await getAllDonations();
        // console.log('response of res in view',res);
        if (mounted && res.success) {
          dispatch(setAllDonations(res.donations));
        }
      } catch (err) {
        console.error('Failed to fetch donations:', err);
      } finally {
        if (mounted) dispatch(setDonationsLoading(false));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return { loading };
}
