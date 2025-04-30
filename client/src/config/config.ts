import { http, createConfig } from '@wagmi/core'
import { rootstockTestnet, rootstock } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [rootstockTestnet, rootstock],
  transports: {
    [rootstockTestnet.id]: http(),
    [rootstock.id]: http(),
  },
})