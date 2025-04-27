import { useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get("bookingId");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg">Booking ID: {bookingId}</p>
    </div>
  );
};

export default Success;
