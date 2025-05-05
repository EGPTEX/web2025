"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWallet } from "@/components/connect-wallet"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Copy, CheckCircle, Clock, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Sample order data - in a real app, this would come from your backend or blockchain
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

// Sample token contract address - this would be your actual token in production
const TOKEN_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

// ERC20 ABI (minimal for balance checking)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
]

export default function AccountPage() {
  const [account, setAccount] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<string>("0")
  const [tokenSymbol, setTokenSymbol] = useState<string>("TOKEN")
  const [ethBalance, setEthBalance] = useState<string>("0")
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if MetaMask is installed and connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
            fetchBalances(accounts[0])
          } else {
            setLoading(false)
          }
        })
        .catch(console.error)

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          fetchBalances(accounts[0])
        } else {
          setAccount(null)
          setTokenBalance("0")
          setEthBalance("0")
        }
      })
    } else {
      setLoading(false)
    }

    // Load orders (in a real app, this would be fetched from your backend or blockchain)
    setOrders(sampleOrders)
  }, [])

  const fetchBalances = async (address: string) => {
    try {
      setLoading(true)

      // Import ethers dynamically
      const { ethers } = await import("ethers")

      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Get ETH balance
      const balance = await provider.getBalance(address)
      setEthBalance(ethers.formatEther(balance))

      // Create contract instance
      const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, ERC20_ABI, provider)

      // Get token symbol - with fallback
      let symbol = "TOKEN"
      try {
        // Check if the contract exists and has the symbol method
        const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS)
        if (code !== "0x") {
          // Check if contract exists
          symbol = await tokenContract.symbol()
          setTokenSymbol(symbol)
        } else {
          console.log("Token contract doesn't exist at the specified address")
        }
      } catch (error) {
        console.error("Error fetching token symbol, using default:", error)
        // Keep using the default symbol
      }

      // Get token decimals with fallback
      let decimals = 18
      try {
        const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS)
        if (code !== "0x") {
          decimals = await tokenContract.decimals()
        }
      } catch (error) {
        console.error("Error fetching token decimals, using default:", error)
        // Keep using the default decimals
      }

      // Get token balance with fallback
      try {
        const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS)
        if (code !== "0x") {
          const tokenBalance = await tokenContract.balanceOf(address)
          setTokenBalance(ethers.formatUnits(tokenBalance, decimals))
        } else {
          // Use a mock balance for demonstration
          setTokenBalance("1000.00")
        }
      } catch (error) {
        console.error("Error fetching token balance:", error)
        // Set a default balance for demonstration
        setTokenBalance("1000.00")
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching balances:", error)
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline flex items-center mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold">My Account</h1>
        </header>

        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your account details and purchase history.
            </p>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline flex items-center mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Store
        </Link>
        <h1 className="text-3xl font-bold">My Account</h1>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your connected wallet details and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Connected Address</h3>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">{account}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Token Balance</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        `${Number.parseFloat(tokenBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${tokenSymbol}`
                      )}
                    </div>
                    <a
                      href={`https://etherscan.io/token/${TOKEN_CONTRACT_ADDRESS}?a=${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center text-xs"
                    >
                      View on Etherscan
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">ETH Balance</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        `${Number.parseFloat(ethBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`
                      )}
                    </div>
                    <a
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center text-xs"
                    >
                      View on Etherscan
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>Your recent purchases and digital assets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="mb-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="assets">Digital Assets</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">You haven't placed any orders yet.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm font-medium text-green-600">{order.status}</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted rounded overflow-hidden">
                                  <img src="/placeholder.svg" alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <span>{item.name}</span>
                              </div>
                              <span>
                                {item.price} {tokenSymbol}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between items-center font-medium">
                          <span>Total</span>
                          <span>
                            {order.total} {tokenSymbol}
                          </span>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                          <div className="truncate">Transaction: {order.txHash}</div>
                          <a
                            href={`https://etherscan.io/tx/${order.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center mt-1"
                            style={{ width: "fit-content" }}
                          >
                            View on Etherscan
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.flatMap((order) =>
                    order.items.map((item: any) => (
                      <Card key={`${order.id}-${item.id}`} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                          <img src="/placeholder.svg" alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Purchased on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    )),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

