// src/hooks/useGetApplicants.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApplicants } from "@/lib/apiRequests";
import {
  setApplicants,
  setLoading
} from "@/store/requestSlice";
import { toast } from "sonner";

export default function useGetApplicants(donationId) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applicants, loading, error } = useSelector(
    (state) => state.donation
  );

  useEffect(() => {
    if (!donationId) return;
    let mounted = true;

    dispatch(setLoading(true));

    (async () => {
      try {
        // console.log("donationId", donationId);
        const res = user.user.role ==="DONOR"? await getApplicants(donationId): {applicants:[], loading: applicantsLoading, error: applicantsError , success:true, requests:[], message:"" };
        if (res.success) {
          if (!mounted) return;
          // console.log(res)
          dispatch(setApplicants(res.requests));
          const message = res.message.length>0 ? res.message : "";
          toast.success(message);
          return res;
        }
        else{
          toast.error(res.response.data.message)
        }
        
      } catch (err) {
        if (!mounted) return;
        console.log(err)
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [donationId, dispatch]);

  return { applicants, loading, error };
}
