"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Wallet, LogOut, User } from "lucide-react"
import Link from "next/link"

export function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        })
        .catch(console.error)

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      })
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Connection failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <>
      {!account ? (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Wallet className="mr-2 h-4 w-4" />
              {formatAddress(account)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={disconnectWallet} className="text-red-500 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

