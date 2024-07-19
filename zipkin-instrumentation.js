/*zipkin-instrumentation.js*/
// Require dependencies
const opentelemetry = require('@opentelemetry/sdk-node');
const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');  
const { Resource } = require('@opentelemetry/resources');
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Custom Span Processor to filter out non-error spans
class ErrorSpanProcessor extends BatchSpanProcessor {
  onEnd(span) {
    // console.log(span.status.code)
    if (span.status.code !== 2) { // 2 corresponds to the status code for ERROR
      return;
    }
    super.onEnd(span);
  }
}

const traceExporter = new ZipkinExporter({})

const errorSpanProcessor = new ErrorSpanProcessor(traceExporter);

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'dice-server',
    [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
  }),
  spanProcessor: errorSpanProcessor,
  traceExporter: traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
