# Next.js with Opentelemetry

**Resource**
- [Nextjs + Opentelemetry doc](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)

## Usage
1. Start a next.js starter template. This is a starter template for [Learn Next.js](https://nextjs.org/learn).
2. add next.config.js file with the content
    ```
    module.exports = {
    experimental: {
      instrumentationHook: true,
      },
    };
    ```
3. add instrumentation.js file with the content
    ```
    import { registerOTel } from '@vercel/otel'
    export function register() {
        registerOTel({ serviceName: 'next-app' })
        }
    ```
4. Install the module @vercel/otel module and @opentelemetry/api module
    ```
    npm install @vercel/otel
    npm install @opentelemetry/api
    ```
5. Build the new config in next
    ```
    next build
    ```
6. add this script to package.json
    ```
    ...
    "scripts": {
        ...
        "start:otel-verbose": "NEXT_OTEL_VERBOSE=1 next start"
        }
    ...
    ```
7. Start the opentelemetry with next app.
    ```
    npm run start:otel-verbose
    ```