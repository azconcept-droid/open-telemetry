import { registerOTel } from '@vercel/otel'
import { trace } from '@opentelemetry/api'

export function register() {
    registerOTel({ serviceName: 'next-app' })
  }  
 
export async function nextjsApp() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('nextjsApp', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
