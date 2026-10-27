import {defineConfig} from '@playwright/test'
export default defineConfig({
 testDir:'./tests',
 testMatch:'frontend.spec.mjs',
 use:{baseURL:'http://127.0.0.1:5173',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 5173',url:'http://127.0.0.1:5173/xx/',reuseExistingServer:!process.env.CI},
 retries:0,
 reporter:'list',
})
