import React, { useState, useEffect } from "react";
import { UseAuth } from "../../services/UseAuth";
// Assuming you use react-router for navigation; adjust if you use something else
import { useParams, useNavigate } from "react-router-dom"; 

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams(); // Gets the ID from the URL (e.g., /deliveries/1)
  const navigate = useNavigate();
  const { user } = UseAuth();

  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Delivery Details
  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Deliveries/${deliveryId}`, {
          headers: { 'Authorization': `Bearer ${user?.accessToken}` }
        });
        if (!response.ok) throw new Error("Failed to fetch delivery details");
        
        const data = await response.json();
        setDelivery(data);
      } catch (error) {
        console.error("Error fetching delivery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDelivery();
  }, [deliveryId, user?.accessToken]);

  // Handle Action (Accept or Cancel)
  const handleAction = async (actionStatus) => {
    if (!window.confirm(`Are you sure you want to ${actionStatus.toLowerCase()} this delivery?`)) return;
    
    setIsProcessing(true);
    try {
      // Calls either /accept or /cancel endpoint
      const endpoint = actionStatus === 'COMPLETED' ? 'accept' : 'cancel';
      const response = await fetch(`http://localhost:5000/api/Deliveries/${deliveryId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(await response.text());

      alert(`Delivery successfully ${actionStatus === 'COMPLETED' ? 'accepted' : 'cancelled'}.`);
      navigate('/deliveries'); // Go back to the main deliveries list
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="p-10 font-montserrat">Loading delivery details...</div>;
  if (!delivery) return <div className="p-10 font-montserrat text-red-500">Delivery not found.</div>;

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat p-8 bg-[#F4F7FB]">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#E3DFD6] hover:bg-[#d4c2ab] text-[#333] px-4 py-1.5 rounded-md font-medium text-sm transition-colors"
        >
          ‹ Back
        </button>
        <h1 className="text-[32px] font-bold text-[#333] tracking-tight leading-none">
          {delivery.delivery_display_id}
        </h1>
        {/* INBOUND BADGE */}
        <span className="bg-[#FFF4E5] border border-[#FFD599] text-[#E69900] px-4 py-1 rounded-full text-xs font-bold tracking-wider">
          {delivery.delivery_status || 'INBOUND'}
        </span>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-[#333] mb-6">Products to be Sent</h2>

        {/* ITEMS TABLE */}
        <div className="overflow-hidden rounded-lg border border-gray-100 mb-8">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Perfume Name</th>
                <th className="px-6 py-4">Qty to be Sent</th>
              </tr>
            </thead>
            <tbody>
              {delivery.items?.map((item, index) => (
                <tr key={item.product_id} className={index % 2 === 0 ? "bg-[#FBF9F6]" : "bg-white"}>
                  {/* Using product_display_id to match your database (e.g., PROD-001) */}
                  <td className="px-6 py-4 text-gray-500">{item.product_display_id}</td>
                  <td className="px-6 py-4 text-[#333] font-medium">{item.product_name}</td>
                  <td className="px-6 py-4 text-gray-500">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTION BUTTONS */}
        {delivery.delivery_status === 'INBOUND' && (
          <div className="flex gap-4">
            <button 
              onClick={() => handleAction('COMPLETED')}
              disabled={isProcessing}
              className="flex-1 bg-[#5A9B5C] hover:bg-[#4a804c] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              ✓ Accept Request
            </button>
            <button 
              onClick={() => handleAction('CANCELLED')}
              disabled={isProcessing}
              className="flex-1 bg-[#8B2332] hover:bg-[#731c28] text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              ⊗ Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetailsPage;