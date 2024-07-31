import axios from "axios";

const sendEmail = async ({ to, type, variables }) => {
    try {
        const response = await axios.post('http://localhost:3001/send-email', {
          to,
          type,
          variables,
        });
    
        return response.data;
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
    };
  
  export default sendEmail;
  