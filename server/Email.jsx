import axios from 'axios';

const sendMail = async (dataMail) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/sendMail`, dataMail);
        console.log('Correo enviado:', response.data);
        // Manejar la respuesta según sea necesario
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        // Manejar el error según sea necesario
    }
};