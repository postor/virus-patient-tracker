"use strict";
import { ServiceSchema } from "moleculer";
import ESService from "moleculer-elasticsearch";
import { Client as ESClient } from "elasticsearch";
const ESINDEX = "testlocation";
const LocationService: ServiceSchema = {
  name: "location",
  mixins: [ESService],
	/**
	 * Service settings
	 */
  settings: {
    elasticsearch: {
      host: process.env.ELASTIC_SEARCH || "http://192.168.5.43:9200",
      apiVersion: "7.0",
    },
  },

	/**
	 * Service dependencies
	 */
  dependencies: [],

	/**
	 * Actions
	 */
  actions: {
    report: {
      params: {
        user: "string",
        pos: "array",
        date: "number",
      },
      async handler({ params }) {
        // @ts-ignore
        const client: ESClient = this.client;
        // @ts-ignore
        return await client.index({
          index: ESINDEX,
          body: params,
        });
      },
    },
    users: {
      async handler({ params }) {
        // @ts-ignore
        const client: ESClient = this.client;
        const { user } = params;
        // @ts-ignore
        return await client.search({
          index: ESINDEX,
          body: {
            size: 0,
            aggs: {
              users: {
                terms: {
                  field: "user",
                },
              },
            },
          },
        });
      },
    },
    pos: {
      params: {
        user: "string",
      },
      async handler({ params }) {
        // @ts-ignore
        const client: ESClient = this.client;
        const { user } = params;
        // @ts-ignore
        return await client.search({
          index: ESINDEX,
          body: {
            size: 10000,
            query: {
              bool: {
                must: {
                  term: { user },
                },
              },
            },
          },
        });
      },
    },
    overlap: {
      params: {
        posArr: "array",
        user: "string",
      },
      async handler({ params = {} }) {
        // @ts-ignore
        const client: ESClient = this.client;
        // @ts-ignore
        const { posArr = [], user = "" } = params;
        // @ts-ignore
        return await client.search({
          index: ESINDEX,
          body: {
            size: 10000,
            query: {
              bool: {
                must_not: [ // eslint-disable-line
                  {
                    term: { user },
                  },
                ],
                // @ts-ignore
                should: posArr.map(({ pos = [], date = "" }) => {
                  // @ts-ignore
                  const gte = new Date(date) * 1 - 2 * 60 * 1000;
                  // @ts-ignore
                  const lte = new Date(date) * 1 + 2 * 60 * 1000;

                  return ({
                    bool: {
                      must: [
                        {
                          geo_distance: { // eslint-disable-line
                            distance: "400m",
                            pos,
                          },
                        },
                        {
                          range: {
                            date: {
                              gte,
                              lte,
                            },
                          },
                        },
                      ],
                    },
                  });
                }),
              },
            },
          },
        });
      },
    },
  },

	/**
	 * Events
	 */
  events: {

  },

	/**
	 * Methods
	 */
  methods: {
    async initMapping() {
      // @ts-ignore
      const client: ESClient = this.client;
      const exists = await client.indices.exists({
        index: ESINDEX,
      });
      if (!exists) {
        await client.indices.create({
          index: ESINDEX,
        });
      }
      // @ts-ignore
      client.indices.putMapping({
        index: ESINDEX,
        body: {
          properties: {
            pos: {
              type: "geo_point",
            },
            date: {
              type: "date",
            },
            user: {
              type: "keyword",
            },
          },
        },
      });
    },
  },

  /* eslint-disable */
  async started() {
    this.initMapping()
  },
  /* eslint-enable */
};

export = LocationService;
