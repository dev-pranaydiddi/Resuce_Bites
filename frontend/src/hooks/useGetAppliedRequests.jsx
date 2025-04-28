// src/hooks/useGetAppliedRequests.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppliedRequests } from '@/lib/apiRequests';
import { setAppliedRequests, setLoading } from '@/store/requestSlice';

export default function useGetAppliedRequests() {
  const dispatch = useDispatch();
  const { loading, appliedRequests } = useSelector((state) => state.request);

  useEffect(() => {
    let mounted = true;

    dispatch(setLoading(true));

    (async () => {
      try {
        const res = await getAppliedRequests();
        console.log("response of res in view", res);
        if (mounted && res.success) {
          dispatch(setAppliedRequests(res.requests));
        }
      } catch (err) {
        console.error('Failed to fetch applied requests:', err);
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return { loading, appliedRequests };
}
