

/**
 * Created by meredith on 6/5/16.
 *
 * Stores geolocation for neighborhoods in seattle, along with radius values
 */

// note I changed this on 4.11.17
    // probably broke something
 var locations = {

    "University District":  [
        {
            "lat": 47.653700,
            "long": -122.302706,
            "radius": 0.5
        }
    ],
"North Beach": [
            {
            "lat": 47.696688,
            "long": -122.390599,
            "radius": 0.5
            }
    ],
    
"Broadview": [{
            "lat": 47.726977,
            "long": -122.364500,
            "radius": 0.5
            },
            {
            "lat": 47.716930,
            "long": -122.366216,
            "radius": 0.5
            }
            ],
    "View Ridge": [{
        "lat": 47.683486,
        "long": -122.273829,
        "radius": 0.6
    }],
"Haller Lake":[{
            "lat": 47.719685,
            "long": -122.333860,
            "radius": 0.5
            }],
"Olympic Hills":[{
            "lat": 47.726800,
            "long": -122.392573,
            "radius": 0.5
            }],
"Cedar Park":[{
            "lat": 47.726926,
            "long": -122.285881,
            "radius": 0.5
            }],
"Northgate":[{
            "lat": 47.721390,
            "long": -122.326826,
            "radius": 0.5
            },
            {
            "lat": 47.701412,
            "long": -122.3232393,
            "radius": 0.5
            }],
"Blue Ridge":[{
            "lat": 47.707145,
            "long": -122.375321,
            "radius": 0.5
            }],
"Maple Leaf":[{
            "lat": 47.694960,
            "long": -122.315871,
            "radius": 0.5
            }],
    "Matthews Beach": [{
        "lat": 47.710099,
        "long": -122.282763,
        "radius": 0.4
    },
        {
            "lat": 47.699991,
            "long": -122.277184,
            "radius": 0.5
        }],
"Sand Point":[{
            "lat": 47.681645,
            "long": -122.253911,
            "radius": 0.5
            }],
"Windermere":[{
            "lat": 47.671325,
            "long": -122.266615,
            "radius": 0.5
            }],
    "Pinehurst":[{
        "lat": 47.728822,
        "long": -122.318290,
        "radius": 0.5
    },
        {
            "lat": 47.717581,
            "long": -122.318092,
            "radius": 0.5
        },
        {   "lat": 47.711459,
            "long": -122.324958,
            "radius": 0.1},
        {
            "lat": 47.710535,
            "long": -122.315173,
            "radius": 0.1
        }],
"Wedgwood":[{
            "lat": 47.690557,
            "long": -122.290732,
            "radius": 0.5
            }],
"Wallingford":[{
            "lat": 47.665157,
            "long": -122.331042,
            "radius": 0.5
            },
            {
            "lat": 47.655098,
            "long": -122.333102,
            "radius": 0.5
            }],
"Fremont":[{
            "lat": 47.656315,
            "long": -122.354226,
            "radius": 0.5
            }],
"Laurelhurst":[{
            "lat": 47.659627,
            "long": -122.277163,
            "radius": 0.5
            }],
"Hawthorne Hills":[{
            "lat": 47.672849,
            "long": -122.272833,
            "radius": 0.3
            },
            {
            "lat": 47.671346,
            "long": -122.280643,
            "radius": 0.3
            }],
"Magnolia":[{
            "lat": 47.651710,
            "long": -122.405040,
            "radius": 1.0
            }],
"Queen Anne":[{
            "lat": 47.637002,
            "long": -122.357374,
            "radius": 0.8
            }],
"Lower Queen Anne":[{
            "lat": 47.624282,
            "long": -122.354136,
            "radius": 0.5
            }],
"Westlake":[{
            "lat": 47.635396,
            "long": -122.341545,
            "radius": 0.1
            },
            {
            "lat": 47.629988,
            "long": -122.341245,
            "radius": 0.5
            }],

"Interbay":[{
            "lat": 47.660135,
            "long": -122.387360,
            "radius": 0.2
            },
            {
            "lat": 47.652735,
            "long": -122.378949,
            "radius": 0.2
            },
            {
            "lat": 47.646086,
            "long": -122.379009,
            "radius": 0.2
            },
            {
            "lat": 47.637730,
            "long": -122.381280,
            "radius": 0.3
            },
            {
            "lat": 47.625489,
            "long": -122.379359,
            "radius": 0.3
            },
            {
            "lat": 47.619603,
            "long": -122.368617,
            "radius": 0.3
            }],
"Eastlake":[{
            "lat": 47.639346,
            "long": -122.326038,
            "radius": 0.3
            },
            {
            "lat": 47.645852,
            "long": -122.325223,
            "radius": 0.1
            }],
"Portage Bay":[{
            "lat": 47.648231,
            "long": -122.319575,
            "radius": 0.3
            }],
"Beacon Hill":[{
            "lat": 47.551326,
            "long": -122.300359,
            "radius": 0.4
            },
            {
            "lat": 47.567486,
            "long": -122.316924,
            "radius": 0.1
            }],
"Georgetown":[{
            "lat": 47.546216,
            "long": -122.324118,
            "radius": 1.0
            },
            {
            "lat": 47.543512,
            "long": -122.307724,
            "radius": 0.7
            }],
"Belltown":[ {
            "lat": 47.615402,
            "long": -122.348058,
            "radius": 0.3
            },
            {
            "lat": 47.616559,
            "long": -122.353355,
            "radius": 0.1
            }],
"West Seattle":[{
            "lat": 47.566075,
            "long": -122.386773,
            "radius": 0.8
            }],
"Seward Park":[{
            "lat": 47.555139,
            "long": -122.251381,
            "radius": 0.5
            }],
"Alki":[{
            "lat": 47.565862,
            "long": -122.403029,
            "radius": 0.3
            },
            {
            "lat": 47.574954,
            "long": -122.410411,
            "radius": 0.5
            },
            {
            "lat": 47.587460,
            "long": -122.405261,
            "radius": 0.5
            },
            {
            "lat": 47.595332,
            "long": -122.386035,
            "radius": 0.3
            }],
"Fauntleroy":[{
            "lat": 47.531315,
            "long": -122.393458,
            "radius": 0.3
            },
            {
            "lat": 47.523201,
            "long": -122.384789,
            "radius": 0.5
            },
            {
            "lat": 47.508303,
            "long": -122.399552,
            "radius": 0.4
            }],
"South Park":[{
            "lat": 47.526792,
            "long": -122.323576,
            "radius": 0.7
            },
            {
            "lat": 47.537049,
            "long": -122.333275,
            "radius": 0.2
            }],
"Arbor Heights":[{
            "lat": 47.509386,
            "long": -122.380079,
            "radius": 0.8
            }],
"Highland Park":[{
            "lat": 47.527356,
            "long": -122.343936,
            "radius": 0.5
            },
            {
            "lat": 47.517792,
            "long": -122.333207,
            "radius": 0.1
            }],
"Columbia City":[{
            "lat": 47.559775,
            "long": -122.282548,
            "radius": 0.3
            },
            {
            "lat": 47.565393,
            "long": -122.294307,
            "radius": 0.2
            },
            {
            "lat": 47.573211,
            "long": -122.296796,
            "radius": 0.1
            }],
"South Delridge":[{
            "lat": 47.530444,
            "long": -122.360405,
            "radius": 0.4
            },
            {
            "lat": 47.521866,
            "long": -122.359805,
            "radius": 0.3
            }],
"High Point": [{
            "lat": 47.548759,
            "long": -122.368853,
            "radius": 0.5
            },
            {
            "lat": 47.539953,
            "long": -122.367308,
            "radius": 0.4
            }],
"Mount Baker": [{
            "lat": 47.584061,
            "long": -122.291033,
            "radius": 0.4
            },
            {
            "lat": 47.576014,
            "long": -122.287600,
            "radius": 0.4
            },
            {
            "lat": 47.567154,
            "long": -122.284167,
            "radius": 0.2
            }],
"Industrial District": [{
            "lat": 47.581134,
            "long": -122.331035,
            "radius": 0.5
            },
            {
            "lat": 47.567352,
            "long": -122.332580,
            "radius": 0.5
            },
            {
            "lat": 47.579976,
            "long": -122.350948,
            "radius": 0.4
            },
            {
            "lat": 47.578702,
            "long": -122.363994,
            "radius": 0.2
            }],
"Madison Valley": [{
            "lat": 47.624619,
            "long": -122.289729,
            "radius": 0.5
            }],
    "Madison Park": [{
        "lat": 47.636966,
        "long": -122.286085,
        "radius": 0.6
    }],
"Denny-Blaine": [{
            "lat": 47.621443,
            "long": -122.289939,
            "radius": 0.2
            },
            {
            "lat": 47.623641,
            "long": -122.276163,
            "radius": 0.5
            }],
"Downtown": [{
            "lat": 47.605824,
            "long": -122.340344,
            "radius": 1.0
            }],
    "Whittier Heights": [{
        "lat": 47.686643,
        "long": -122.370952,
        "radius": 0.3
    },
        {
            "lat": 47.680258,
            "long": -122.371081,
            "radius": 0.3
        }],
"Broadmoor": [{
            "lat": 47.635906,
            "long": -122.289615,
            "radius": 0.5
            }],
    "Brighton": [
        {   "lat": 47.541623,
        "long": -122.276692,
        "radius": 0.4},
        {"lat": 47.535626,
            "long": -122.274332,
            "radius": 0.4}
    ],
    "Sunset Hill": [{
        "lat": 47.671964,
        "long": -122.403107,
        "radius": 0.3
    },
        {
            "lat": 47.683002,
            "long": -122.402850,
            "radius": 0.5
        },
        {
            "lat": 47.693633,
            "long": -122.402421,
            "radius": 0.1
        }],
    "Rainier Beach": [{
        "lat": 47.513373,
        "long": -122.260001,
        "radius": 1
    }],
"South Lake Union": [{
            "lat": 47.623077,
            "long": -122.337105,
            "radius": 0.3
            },
            {
            "lat": 47.632910,
            "long": -122.333758,
            "radius": 0.4
            }],
    "Capitol Hill": [{
        "lat": 47.627731,
        "long": -122.317181,
        "radius": 0.6
    }],
    "First Hill": [{
        "lat": 47.609016,
        "long": -122.325077,
        "radius": 0.4
    }],
    "Meadowbrook": [{
        "lat": 47.702143,
        "long": -122.296535,
        "radius": 0.3
    },
        {
            "lat": 47.711124,
            "long": -122.295763,
            "radius": 0.3
        }],
    "Admiral": [{
        "lat": 47.581198,
        "long": -122.385528,
        "radius": 0.1
    }],
    "North College Park": [{
        "lat": 47.695875,
        "long": -122.336834,
        "radius": 0.5
    },
        {
            "lat": 47.705002,
            "long": -122.336749,
            "radius": 0.4
        }],
    "Atlantic": [{
        "lat": 47.596667,
        "long": -122.305542,
        "radius": 0.4
    },
        {
            "lat": 47.587406,
            "long": -122.301336,
            "radius": 0.2
        },
        {
            "lat": 47.581848,
            "long": -122.299362,
            "radius": 0.1
        },
        {
            "lat": 47.579372,
            "long": -122.297433,
            "radius": 0.2
        }],
    "Loyal Heights": [{
        "lat": 47.683318,
        "long": -122.384374,
        "radius": 0.4
    }],
    "Central District": [{
        "lat": 47.606342,
        "long": -122.282172,
        "radius": 2.2
    }],
    "International District": [{
        "lat": 47.598943,
        "long": -122.324872,
        "radius": 0.2
    },
        {
            "lat": 47.597670,
            "long": -122.317276,
            "radius": 0.2
        }],
    "Roosevelt": [{
        "lat": 47.679659,
        "long": -122.316267,
        "radius": 0.2
    },
        {
            "lat": 47.673244,
            "long": -122.315066,
            "radius": 0.15
        }],
    "Pioneer Square": [
        {
        "lat": 47.600855,
        "long": -122.332273,
        "radius": 0.2
    },
        {
            "lat": 47.603285,
            "long": -122.329054,
            "radius": 0.1
        }],
    "Ballard": [{
        "lat": 47.676345,
        "long": -122.388039,
        "radius": 1.2
    }],
    "Roxhill": [{
        "lat": 47.522857,
        "long": -122.371232,
        "radius": 0.4
    },
        {
            "lat": 47.533115,
            "long": -122.371104,
            "radius": 0.25
        }],
    "North Delridge": [{
        "lat": 47.563064,
        "long": -122.363358,
        "radius": 0.8
    }],
    "Greenwood": [{
        "lat": 47.694669,
        "long": -122.354564,
        "radius": 0.8
    }],
    "Leschi": [{
        "lat": 47.602414,
        "long": -122.290351,
        "radius": 0.35
    },
        {
            "lat": 47.592950,
            "long": -122.291638,
            "radius": 0.2
        }],
    "Riverview": [{
        "lat": 47.550774,
        "long": -122.353223,
        "radius": 0.6
    },
        {
            "lat": 47.536695,
            "long": -122.352193,
            "radius": 0.3
        }],
    "Montlake": [{
        "lat": 47.641211,
        "long": -122.304351,
        "radius": 0.4
    }],
    "Green Lake": [{
        "lat": 47.681777,
        "long": -122.333332,
        "radius": 1.4
    },
        {
            "lat": 47.668138,
            "long": -122.344061,
            "radius": 0.2
        }],
    "Ravenna": [{
        "lat": 47.678981,
        "long": -122.307090,
        "radius": 0.8
    }],
    "Crown Hill": [{
        "lat": 47.700922,
        "long": -122.371123,
        "radius": 0.3
    },
        {
            "lat": 47.694192,
            "long": -122.371252,
            "radius": 0.3
        },
        {
            "lat": 47.692748,
            "long": -122.379878,
            "radius": 0.1
        }],
    "Madrona": [{
        "lat": 47.613357,
        "long": -122.288264,
        "radius": 0.5
    }],
    "Bitter Lake": [{
        "lat": 47.729606,
        "long": -122.350447,
        "radius": 0.3
    },
        {
            "lat": 47.720080,
            "long": -122.349932,
            "radius": 0.3
        },
        {
            "lat": 47.710551,
            "long": -122.394760,
            "radius": 0.3
        }],
    "Olympic Manor": [{ //this place was just one spot...
        "lat": 47.689922,
        "long": -122.385390,
        "radius": 0.3
    }],
    "Victory Heights": [{
        "lat": 47.714114,
        "long": -122.305320,
        "radius": 0.5
    },
        {
            "lat": 47.703805,
            "long": -122.306908,
            "radius": 0.3
        }],
    "Phinney Ridge": [{
        "lat": 47.679529,
        "long": -122.355152,
        "radius": 0.6
    },
        {
            "lat": 47.668491,
            "long": -122.354551,
            "radius": 0.8
        },
        {
            "lat": 47.670514,
            "long": -122.363563,
            "radius": 0.1
        }],
    "Bryant": [{
        "lat": 47.665372,
        "long": -122.286601,
        "radius": 0.25
    },
        {
            "lat": 47.672539,
            "long": -122.284970,
            "radius": 0.3
        },
        {
            "lat": 47.679474,
            "long": -122.287888,
            "radius": 0.25
        }]

};