
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-proto');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Custom Span Processor to filter out non-error spans
class ErrorSpanProcessor extends BatchSpanProcessor {
  onEnd(span) {
    if (span.status.code !== 2) { // 2 corresponds to the status code for ERROR
      return;
    }
    super.onEnd(span);
  }
}

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'api-server',
    [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
  }),
);

const traceExporter = new OTLPTraceExporter({
  headers: {},
});

const errorSpanProcessor = new ErrorSpanProcessor(traceExporter);

const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  spanProcessor: errorSpanProcessor,
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      //url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
      headers: {}, // an optional object containing custom headers to be sent with each request
      concurrencyLimit: 1, // an optional limit on pending requests
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
