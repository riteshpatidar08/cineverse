import api from '../lib/api';


export const createBooking = (data) => {
    return api.post('/booking/create', data);
  };
  
//   @payment data = {paymentId , signature , razorPayOrderId }
  export const verifyPayment = (data) => {
    return api.post(`/verifyPayment` , data);
  };  
  