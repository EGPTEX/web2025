"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CartDropdown() {
  const { cart, removeFromCart, totalItems, totalPrice } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Shopping Cart</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cart.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">Your cart is empty</div>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              <DropdownMenuGroup className="p-2">
                {cart.map((item) => (
                  <DropdownMenuItem key={item.id} className="flex p-0 focus:bg-transparent" asChild>
                    <div className="flex items-start py-2 px-1 gap-3 w-full">
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">
                            {item.quantity} × {item.price} TOKEN
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromCart(item.id)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </ScrollArea>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{totalPrice} TOKEN</span>
              </div>
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/cart" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

