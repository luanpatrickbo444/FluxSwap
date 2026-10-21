import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes = [process.env.NEXT_PUBLIC_NODE_1, process.env.NEXT_PUBLIC_NODE_2, process.env.NEXT_PUBLIC_NODE_3]

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 56)
const fallbackRpc =
  chainId === 97 ? 'https://bsc-testnet-dataseed.bnbchain.org' : 'https://bsc-dataseed.bnbchain.org'

const isLocalRpc = (value?: string): boolean => {
  if (!value) return false
  try {
    const hostname = new URL(value).hostname.toLowerCase()
    return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname)
  } catch {
    return true
  }
}

const getNodeUrl = () => {
  const productionNode = process.env.NEXT_PUBLIC_NODE_PRODUCTION

  // Never ship localhost RPC URLs to visitors: localhost points to each
  // visitor's own computer, not to the Vercel deployment.
  if (productionNode && !(process.env.NODE_ENV === 'production' && isLocalRpc(productionNode))) {
    return productionNode
  }

  if (process.env.NODE_ENV === 'production') {
    return fallbackRpc
  }

  const availableNodes = nodes.filter((node): node is string => Boolean(node))
  if (availableNodes.length === 0) {
    return fallbackRpc
  }
  return sample(availableNodes) || fallbackRpc
}

export default getNodeUrl
