import ProductList from "@/components/product-list"
import { ConnectWallet } from "@/components/connect-wallet"
import { CartDropdown } from "@/components/cart-dropdown"
import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Web3 Store</h1>
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <CartDropdown />
          <ConnectWallet />
        </div>
      </header>
      <main>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <ProductList />
        </section>
      </main>
    </div>
  )
}

