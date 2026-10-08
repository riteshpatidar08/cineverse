import api from '../lib/api';


export const createBooking = (data) => {
    return api.get('/booking/create', data);
  };
  
//   @payment data = {paymentId , signature , razorPayOrderId }
  export const verifyPayment = (data) => {
    return api.get(`/verifyPayment` , data);
  };  
  