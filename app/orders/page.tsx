"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, ArrowLeft, Package, Clock } from "lucide-react"
import Link from "next/link"

// Sample order data - in a real app, this would come from your backend
const sampleOrders = [
  {
    id: "ORD-1234",
    date: "2023-09-15T10:30:00Z",
    status: "Completed",
    total: 350,
    items: [
      { id: 1, name: "Digital Artwork #1", quantity: 1, price: 100 },
      { id: 2, name: "Virtual Land", quantity: 0.5, price: 250 },
    ],
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "ORD-5678",
    date: "2023-09-10T14:45:00Z",
    status: "Completed",
    total: 150,
    items: [{ id: 4, name: "Digital Collectible", quantity: 1, price: 150 }],
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading orders from API or blockchain
    setTimeout(() => {
      setOrders(sampleOrders)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Clock className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-spin" />
        <h1 className="text-2xl font-bold mb-4">Loading your orders...</h1>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">No orders found</h1>
        <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
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
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <Link href="/" className="text-blue-600 hover:underline flex items-center mt-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Continue Shopping
        </Link>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{order.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{item.price} TOKEN</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>{order.total} TOKEN</span>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground break-all">Transaction: {order.txHash}</p>
                  <a
                    href={`https://etherscan.io/tx/${order.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

