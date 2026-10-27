import {test,expect} from '@playwright/test'
async function mockWallet(page,kind='phantom'){
 await page.addInitScript((kind)=>{
  const listeners={}
  const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let keys
  const provider={
   publicKey:null,
   async changeAccount(){
    keys=await crypto.subtle.generateKey('Ed25519',true,['sign','verify'])
    const raw=new Uint8Array(await crypto.subtle.exportKey('raw',keys.publicKey))
    let n=0n;for(const byte of raw)n=n*256n+BigInt(byte)
    let out='';while(n){out=alphabet[Number(n%58n)]+out;n/=58n}
    for(const byte of raw){if(byte)break;out='1'+out}
    provider.publicKey={toString:()=>out}
    for(const cb of listeners.accountChanged||[])cb(provider.publicKey)
   },
   async connect(){if(!provider.publicKey)await provider.changeAccount();return{publicKey:provider.publicKey}},
   async disconnect(){provider.publicKey=null;for(const cb of listeners.disconnect||[])cb()},
   async signMessage(message){
    if(window.__rejectSignature)throw Object.assign(Error('User rejected request'),{code:4001})
    return {signature:new Uint8Array(await crypto.subtle.sign('Ed25519',keys.privateKey,message))}
   },
   on(event,cb){(listeners[event]??=[]).push(cb)},
   removeListener(event,cb){listeners[event]=(listeners[event]||[]).filter(x=>x!==cb)},
  }
  if(kind==='backpack')window.backpack=provider
  else window.phantom={solana:provider}
 },kind)
}
async function fill(page,kind='Phantom'){
 await page.getByRole('button',{name:new RegExp('Connect '+kind)}).click()
 await expect(page.getByRole('button',{name:'Disconnect',exact:true})).toBeVisible()
 await page.getByLabel('AGENT NAME',{exact:true}).fill('Atlas Research')
 await page.getByLabel('WHAT DOES YOUR AGENT DO?').fill('Researching the Solana agent economy.')
 await page.getByLabel('AGENT URL / OPTIONAL').fill('https://example.com/atlas')
 await page.getByRole('button',{name:'Review identity message'}).click()
}
test('create, export, import, share and reverify a signed profile',async({page})=>{
 await mockWallet(page);await page.goto('/xx/')
 await fill(page)
 await expect(page.locator('.message-preview')).toContainText('Atlas Research')
 await page.getByRole('button',{name:'Sign & verify identity'}).click()
 await expect(page.locator('.agent-card')).toContainText('SIGNATURE VERIFIED')
 const download=page.waitForEvent('download')
 await page.getByRole('button',{name:'Export JSON'}).click()
 expect((await download).suggestedFilename()).toBe('zunon-agent-identity.json')
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('zunon.solana.identity.v1')))
 await page.reload()
 await expect(page.locator('.agent-card')).toContainText('Atlas Research')
 const hash=await page.evaluate(async r=>(await import('/xx/src/identity.mjs')).shareHash(r),record)
 const other=await page.context().browser().newContext({baseURL:'http://127.0.0.1:5173'})
 const reader=await other.newPage();await reader.goto('/xx/'+hash)
 await expect(reader.locator('.agent-card')).toContainText('Atlas Research')
 await expect(reader.getByRole('button',{name:'Connect Phantom',exact:false})).toBeVisible()
 await other.close()
 await page.getByLabel('AGENT NAME',{exact:true}).fill('Changed draft')
 await expect(page.locator('.identity-warning')).toContainText('Draft changed')
 const changed=structuredClone(record);changed.payload.profile.name='Forged'
 await page.locator('input[type=file]').setInputFiles({name:'forged.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(changed))})
 await expect(page.getByRole('alert')).toContainText('verification failed')
 await page.getByRole('button',{name:'Clear local profile'}).click()
 await page.locator('input[type=file]').setInputFiles({name:'identity.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(record))})
 await expect(page.locator('.agent-card')).toContainText('Atlas Research')
})
test('cancelled signatures and changed accounts cannot create stale proofs',async({page})=>{
 await mockWallet(page);await page.goto('/xx/');await fill(page)
 await page.evaluate(()=>{window.__rejectSignature=true})
 await page.getByRole('button',{name:'Sign & verify identity'}).click()
 await expect(page.getByRole('alert')).toContainText('cancelled')
 await expect(page.locator('.agent-card')).toHaveCount(0)
 await page.evaluate(()=>window.phantom.solana.changeAccount())
 await expect(page.locator('.message-preview')).toHaveCount(0)
 await page.getByRole('button',{name:'Disconnect',exact:true}).click()
 await expect(page.getByRole('button',{name:'Review identity message'})).toBeDisabled()
})
for(const width of [375,390,768,1440]){
 test('responsive layout at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/xx/')
  await expect(page.getByRole('heading',{level:1})).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.getByRole('button',{name:/Create your Agent ID/}).click()
  await expect(page.getByLabel('AGENT NAME',{exact:true})).toBeInViewport()
  await page.getByRole('button',{name:'Import & verify JSON'}).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button',{name:'Import & verify JSON'})).toBeVisible()
  await page.getByRole('button',{name:/TOKEN \/ CA:/}).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 })
}

test('Backpack connects and signs; only the two approved wallets are shown',async({page})=>{
 await mockWallet(page,'backpack');await page.goto('/xx/')
 await expect(page.getByRole('link',{name:/X \/ @ZUNONsol/})).toHaveAttribute('href','https://x.com/ZUNONsol')
 await expect(page.locator('.wallet-choice')).toHaveCount(2)
 await expect(page.locator('.wallet-picker')).not.toContainText('Solflare')
 await fill(page,'Backpack')
 await page.getByRole('button',{name:'Sign & verify identity'}).click()
 await expect(page.locator('.agent-card')).toContainText('SIGNATURE VERIFIED')
})

test('official CA, copy button and token links use the complete address',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write'])
 await page.goto('/xx/')
 const ca='DmsbYxTywtgnGfSFB84WHsgSjzeP86RJXe8Cm8Gdpump'
 await expect(page.locator('.official-ca strong')).toHaveText(ca)
 await expect(page.locator('.official-links').getByRole('link',{name:/Pump.fun/})).toHaveAttribute('href','https://pump.fun/coin/'+ca)
 await expect(page.locator('.official-links').getByRole('link',{name:/Solscan/})).toHaveAttribute('href','https://solscan.io/token/'+ca)
 await page.getByRole('button',{name:'Copy address',exact:true}).click()
 await expect(page.locator('.official-section')).toContainText('CA copied.')
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(ca)
 await expect(page.locator('.launch-hero')).not.toContainText('TBA')
})
