'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface TransactionResponse {
  requestId: number
  status: {
    status: string
    reason: string
    message: string
    date: string
  }
  payment: Array<{
    amount: {
      to: {
        total: number
        currency: string
      }
    }
    status: {
      status: string
      message: string
    }
    receipt: string
    franchise: string
    reference: string
    issuerName: string
    authorization: string
    paymentMethod: string
    internalReference: number
    paymentMethodName: string
  }>
}

export default function TransactionResult() {
  const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    console.log("Executing useEffect");
  
    // Bandera para evitar llamadas duplicadas
    let didCancel = false;
  
    const fetchData = async () => {
      const requestId = localStorage.getItem('requestId');
  
      if (requestId) {
        try {
          const response = await axios.get<TransactionResponse>(`https://pasarelagou.solucredito.com.co/aptp/cheackout/consultrequest/${requestId}`);
          if (!didCancel) {
            setTransactionData(response.data);
            setIsLoading(false);
          }
        } catch (error) {
          if (!didCancel) {
            console.error('Error fetching transaction data:', error);
            setError('Hubo un problema al cargar los datos de la transacción. Por favor, intente nuevamente.');
            setIsLoading(false);
          }
        }
      } else {
        setError('No se encontró el ID de la transacción.');
        setIsLoading(false);
      }
    };
  
    fetchData();
  
    // Cleanup function
    return () => {
      didCancel = true;
    };
  }, []);
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!transactionData) {
    return null
  }

  const { status, payment } = transactionData
  const transactionStatus = status.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'
  const statusColor = status.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Resultado de la transacción
            </div>
            <h1 className={`block mt-1 text-lg leading-tight font-medium ${statusColor}`}>
              {status.status === 'APPROVED' ? (
                <CheckCircle className="inline-block mr-2" />
              ) : (
                <XCircle className="inline-block mr-2" />
              )}
              {transactionStatus}
            </h1>
            <p className="mt-2 text-gray-500">{status.message}</p>
            <div className="mt-4">
              <p className="text-gray-600"><span className="font-semibold">Fecha:</span> {new Date(status.date).toLocaleString()}</p>
              <p className="text-gray-600"><span className="font-semibold">Referencia:</span> {payment[0].reference}</p>
              <p className="text-gray-600"><span className="font-semibold">Monto:</span> {payment[0].amount.to.total} {payment[0].amount.to.currency}</p>
              <p className="text-gray-600"><span className="font-semibold">Método de pago:</span> {payment[0].paymentMethodName}</p>
              <p className="text-gray-600"><span className="font-semibold">Entidad:</span> {payment[0].issuerName}</p>
              <p className="text-gray-600"><span className="font-semibold">Autorización:</span> {payment[0].authorization}</p>
              <p className="text-gray-600"><span className="font-semibold">Recibo:</span> {payment[0].receipt}</p>
            </div>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => router.push('/')} 
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}