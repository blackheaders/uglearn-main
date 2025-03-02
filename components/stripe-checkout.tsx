"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  amount: number
  onSuccess: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const cardElement = elements.getElement(CardElement)

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // In a real application, you would send the payment method ID to your server
        // to create a charge or save it for future use
        console.log("PaymentMethod", paymentMethod)
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        })
        onSuccess()
      }
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="mt-4 w-full bg-[#F6BD6A] text-white hover:bg-[#6C462E]"
      >
        Pay ${amount.toFixed(2)}
      </Button>
    </form>
  )
}

interface StripeCheckoutProps {
  amount: number
  onSuccess: () => void
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  )
}

