# msw-openapi-poc

POC for automatically generating OpenAPI MockServiceWorker (https://mswjs.io/) handlers given a swagger.json file to read from. This is for REST APIs; for GraphQL there's a different approach, see https://mswjs.io/docs/api/graphql/operation#resolve-against-schema

# Borrowed Works

- generateSampleSchema - from swagger-ui - this is the function responsible for generating sample values - https://github.com/swagger-api/swagger-ui/blob/master/src/core/plugins/samples/fn.js#L598-L599

# TODO

- [x] generate handlers based on `paths`
- [x] generate an example GET if there is a 200 response
- [ ] create a library that allows the user to respond with a handler and act accordingly (for mutations) or use the default handler response
