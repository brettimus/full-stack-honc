import { env } from 'cloudflare:workers';
import {
  configure,
  getConsoleSink,
  getAnsiColorFormatter as getLogtapeAnsiColorFormatter,
  jsonLinesFormatter,
} from '@logtape/logtape';

function getAnsiColorFormatter() {
  return getLogtapeAnsiColorFormatter({
    timestamp: 'time-tz', // Show just time with timezone in development
    level: 'ABBR', // Use abbreviations like INF, ERR
    format: (values) => {
      const parts = [
        values.timestamp ? `${values.timestamp}` : '',
        `[${values.level}]`,
        `${values.category}:`,
        values.message,
      ].filter(Boolean);

      // Add properties if they exist and aren't empty
      if (
        values.record.properties &&
        Object.keys(values.record.properties).length > 0
      ) {
        // Format properties in a compact way for development
        const propEntries = Object.entries(values.record.properties);
        if (propEntries.length === 1) {
          // Single property: inline format
          const [key, value] = propEntries[0];
          parts.push(`{${key}: ${JSON.stringify(value)}}`);
        } else {
          // Multiple properties: compact JSON format
          const propertiesStr = JSON.stringify(values.record.properties);
          parts.push(propertiesStr);
        }
      }

      return parts.join(' ');
    },
  });
}

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: (record) => {
        const formatted =
          env.ENVIRONMENT === 'development'
            ? getAnsiColorFormatter()(record)
            : jsonLinesFormatter(record);

        return [formatted];
      },
    }),
  },
  loggers: [
    {
      category: ['honc'],
      lowestLevel: 'debug',
      sinks: ['console'],
    },
  ],
});
