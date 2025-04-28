// import { toast } from 'react-toastify';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useGetAllDeliveries from '@/hooks/useGetAllDeliveries';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptDelivery } from '@/lib/apiRequests'; // your API helper
import { toast } from 'sonner';

export default function DeliveriesList({ limit, showViewAll = false }) {
  // fetch into redux
  const { allDeliveries, loading } = useSelector(s => s.delivery);
  useGetAllDeliveries();

  const [searchTerm, setSearchTerm] = useState('');

  // filter by donation name or recipient name
  const filtered = useMemo(() => {
    return allDeliveries
      .filter(d => !d.volunteer) // only unassigned
      .filter(d => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          d.donation.name.toLowerCase().includes(q) ||
          d.request.applicant.name.toLowerCase().includes(q)
        );
      });
  }, [allDeliveries, searchTerm]);
  
  const status = {status:"ACCEPTED"};
  const displayed = limit ? filtered.slice(0, limit) : filtered;
  const acceptTheDelivery = async (id,status) => {
    try {
      const res = await acceptDelivery(id,status);
      if(res.success){
        toast.success(res.message);
      }
      else{
        toast.error(res.response.data.message)
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit || 3 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No deliveries available</h3>
        <p className="text-gray-600">
          {searchTerm
            ? 'Try a different search term.'
            : 'There are currently no deliveries to accept.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      {!limit && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            className="pl-10"
            placeholder="Search by donation or recipient..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map(d => (
          <div key={d._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-lg">{d.donation.name}</h4>
              <p className="text-sm text-gray-600">
                Recipient: {d.request.applicant.name.first} {d.request.applicant.name.last}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Pickup: </span>
                {[
                  d.donation.pickUpAddress.street,
                  d.donation.pickUpAddress.city,
                  d.donation.pickUpAddress.state
                ].filter(Boolean).join(', ')}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Delivery To: </span>
                <span>{d.request.applicant.address.orgName}</span>
              </p>
              <p className="mt-1 inline-block text-xs font-semibold px-2 py-1 rounded 
                {`${
                  {
                    PENDING: 'bg-yellow-100 text-yellow-800',
                    ACCEPTED: 'bg-blue-100 text-blue-800',
                    PICKED_UP: 'bg-indigo-100 text-indigo-800',
                    DELIVERED: 'bg-green-100 text-green-800',
                    CANCELLED: 'bg-red-100 text-red-800',
                    EXPIRED: 'bg-gray-100 text-gray-800'
                  }[d.status]
                }`}"
              >
                {d.status.replace('_',' ')}
              </p>
            </div>
            <Button
              onClick={()=>acceptTheDelivery(d._id,status)}
              size="sm"
              className="mt-4"
            >
              Accept
            </Button>
          </div>
        ))}
      </div>

      {showViewAll && filtered.length > (limit || 0) && (
        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/deliveries'}>
            View All Deliveries
          </Button>
        </div>
      )}
    </div>
  );
}
