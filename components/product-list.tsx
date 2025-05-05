"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

// Sample product data
const products = [
  {
    id: 1,
    name: "Digital Artwork #1",
    description: "Limited edition digital artwork by a renowned artist",
    price: 100,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Virtual Land",
    description: "Prime location virtual land in the metaverse",
    price: 500,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "NFT Membership",
    description: "Exclusive membership to premium Web3 content",
    price: 250,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Digital Collectible",
    description: "Rare digital collectible with unique properties",
    price: 150,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function ProductList() {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square relative">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                {product.price} TOKEN
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

