"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function page() {
  const [valor, setValor] = useState('');
  const [respuesta, setRespuesta] = useState<any>(null);

  useEffect(() => {
    // Recuperar la variable de localStorage
    const storedValue = localStorage.getItem('requestId');
    if (storedValue) {
      setValor(storedValue);
      // Realizar la petición POST a la API con Axios
      axios.get(`http://localhost:15037/aptp/cheackout/consultrequest/${storedValue}`) 
        .then(response => {
          setRespuesta(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, []);
  console.log("Request ID: "+valor)
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      {respuesta && <p>{JSON.stringify(respuesta)}</p>}
       </div>
    
  )
}

export default page