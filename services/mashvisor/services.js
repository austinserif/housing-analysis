module.exports = {
    shortTermRentals: {
        /**
         * https://www.mashvisor.com/api-doc/?go#get-airbnb-listing-info
         */
        getAirbnbListingInfo: {
            path: (args) => (['property', args.airbnbId]),
            params: (args) => ({ state: args.state })
        },

        /**
         * https://www.mashvisor.com/api-doc/?go#get-airbnb-historical-performance
         */
        getAirbnbHistoricalPerformance: {
            path: (args) => (['airbnb-property', args.airbnbId, 'historical']),
            params: (args) => ({ state: args.state })
        }, 

        /**
         * https://www.mashvisor.com/api-doc/?go#get-neighborhood-historical-performance
         */
        getNeighborhoodHistoricalPerformance: {
            path: (args) => ['neighborhood', args.neighborhoodId, 'historical', 'airbnb'],
            params: (args) => ({
                state: args.state,
                percentile_rate: args.percentile_rate,
                
                /** 
                 * Generates averaged results for the neighborhood in question.
                 * Must be one of the following string values:
                 * - 'occupancy' (default)
                 * - 'price'
                 * - 'revenue'
                 */
                average_by: args.average_by,

                /** 
                 * Optional string value to filter results by airbnb category:
                 * - 'flat'
                 * - 'house'
                 * - 'apartment'
                 * - 'loft'
                 */
                category: args.category,

                /** 
                 * Optional integer value between 0 and 4
                 * to filter results by no. of beds.
                 */
                beds: args.beds
            })
        },

        /**
         * https://www.mashvisor.com/api-doc/?go#get-listings
         */
        getListings: {
            path: (args) => (['airbnb-property', 'active-listings']),
            params: (args) => ({
                state: args.state,
                city: args.city,

                /** Unique id of neighborhood you are looking for. */
                neighborhood: args.neighborhood,

                zip_code: args.zip_code,

                /** Results page number. Defaults to 1. */
                page: args.page,

                /** Items per page of results. Defaults to 4. */
                items: args.items
            })
        },

        /**
         * https://www.mashvisor.com/api-doc/?go#get-airbnb-occupancy-rates
         */
        getAirbnbOccupancyRates: {
            path: (args) => (['airbnb-property', 'occupancy-rates']),
            params: (args) => ({
                state: args.state,
                city: args.city,

                /** Unique id of neighborhood you are looking for. */
                neighborhood: args.neighborhood,
                zip_code: args.zip_code,

            })
        }
    }
}