// Publish official links and CA here after owner confirmation.
export const project = Object.freeze({
 name: 'ZUNON',
 ticker: 'ZUNON',
 network: 'Solana',
 ca: 'CqTFhniory2YcmQE6XwX23yjYXaXYRXE6tULHaEVpump',
 x: 'https://x.com/ZUNONsol',
 community: null,
 repository: 'https://github.com/GHOSTXrun/xx',
 trading: 'https://pump.fun/coin/CqTFhniory2YcmQE6XwX23yjYXaXYRXE6tULHaEVpump',
})
export const caLabel = project.ca || 'TBA'

export const caShort = project.ca ? project.ca.slice(0,6)+'…'+project.ca.slice(-4) : 'TBA'
export const explorerUrl = project.ca ? 'https://solscan.io/token/'+project.ca : null
