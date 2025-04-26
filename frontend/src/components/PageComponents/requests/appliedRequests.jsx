import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import React from 'react'
import { data, useParams } from 'react-router-dom';
import { getAppliedRequests } from '@/lib/donation-api';
import { toast } from 'sonner';

function AppliedRequests() {
    const [appliedRequests, setAppliedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const {requestId} = useParams();
    const user = useSelector((state) => state.auth.user);
    console.log('requestId',requestId);
        useEffect(() => {
            const fetchRequests = async () => {
              try {
                setLoading(true);
                const userId = user?.user?._id
                const res = await getAppliedRequests(userId);
                console.log('res', res);
                if (res.success) {
                  toast.success(res?.message);
                }
                else {
                  toast.error(res?.response?.data?.message)
                }
                const data = res.requests;
                console.log('data', data);
                setAppliedRequests(data);
                setLoading(false);
              } catch (error) {
                console.error('Error fetching requests:', error);
                setLoading(false);
              }
            };
            fetchRequests();
          }, []);
              const fetchedRequests = [appliedRequests];
              console.log('fetchedRequests', typeof(fetchedRequests));
  return (
    <>
    <div>appliedRequests - {requestId}</div>
    {
        appliedRequests.map((request) => (
            <div key={request._id}>
            </div>
        ))
    }
    </>
  )
}

export default AppliedRequests