import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a18101bc3c42fb39ff58d82214614b7e@o4508886607462400.ingest.de.sentry.io/4508886637150288",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});