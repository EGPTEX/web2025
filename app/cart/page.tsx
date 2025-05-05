"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ERC20Payment } from "@/components/erc20-payment"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Link href="/" className="text-blue-600 hover:underline flex items-center mt-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Continue Shopping
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4">
                  <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 h-8 mx-1 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{item.price * (item.quantity || 1)} TOKEN</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{totalPrice} TOKEN</span>
              </div>
              <div className="flex justify-between">
                <span>Network Fee</span>
                <span>~0.001 ETH</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{totalPrice} TOKEN</span>
              </div>
            </CardContent>
            <CardFooter>
              {isCheckingOut ? (
                <ERC20Payment
                  amount={totalPrice}
                  onSuccess={() => router.push("/account")}
                  onCancel={() => setIsCheckingOut(false)}
                />
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => setIsCheckingOut(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

