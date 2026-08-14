// ============================================================
// GROCERY PRICE COMPARATOR
// CLOUDFLARE WORKER
// ============================================================

import { searchDmart } from "./suppliers/dmart.js";


// ============================================================
// PRODUCT MASTER LIST
// ============================================================

const PRODUCTS = [
    "Rice",
    "Ghee",
    "Milk",
    "Butter",
    "Paneer",
    "Curd",
    "Atta",
    "Dal",
    "Cooking Oil",
    "Sugar",
    "Salt",
    "Biscuits",
    "Bread",
    "Eggs",
    "Tea",
    "Coffee",
    "Flour",
    "Poha",
    "Rava",
    "Spices",
    "Dry Fruits",
    "Noodles",
    "Pasta",
    "Chocolates",
    "Breakfast Cereals"
];


// ============================================================
// TEMPORARY VARIETY MASTER
// ============================================================

const VARIETIES = {

    "Rice": [
        "Basmati Rice",
        "Sona Masoori Rice",
        "Brown Rice",
        "Raw Rice"
    ],

    "Ghee": [
        "Amul Pure Ghee",
        "Amul Cow Ghee",
        "Nandini Ghee"
    ],

    "Milk": [
        "Gold Milk",
        "Toned Milk",
        "Full Cream Milk"
    ],

    "Butter": [
        "Salted Butter",
        "Unsalted Butter"
    ],

    "Paneer": [
        "Fresh Paneer",
        "Malai Paneer",
        "Mughlai Paneer"
    ],

    "Curd": [
        "Fresh Curd",
        "Thick Curd"
    ],

    "Atta": [
        "Whole Wheat Atta",
        "Multigrain Atta"
    ],

    "Dal": [
        "Toor Dal",
        "Moong Dal",
        "Masoor Dal"
    ],

    "Cooking Oil": [
        "Sunflower Oil",
        "Groundnut Oil",
        "Rice Bran Oil"
    ],

    "Sugar": [
        "White Sugar",
        "Brown Sugar"
    ]

};


// ============================================================
// TEMPORARY SIZE MASTER
// ============================================================

const SIZES = [

    "100 g",
    "250 g",
    "500 g",
    "1 kg",
    "1 L",
    "2 L",
    "5 kg"

];


// ============================================================
// JSON RESPONSE
// ============================================================

function jsonResponse(
    data,
    status = 200
) {

    return new Response(

        JSON.stringify(
            data,
            null,
            2
        ),

        {

            status: status,

            headers: {

                "Content-Type":
                    "application/json",

                "Access-Control-Allow-Origin":
                    "*",

                "Access-Control-Allow-Methods":
                    "GET,POST,OPTIONS",

                "Access-Control-Allow-Headers":
                    "Content-Type"

            }

        }

    );

}


// ============================================================
// CORS
// ============================================================

function handleOptions() {

    return new Response(

        null,

        {

            status: 204,

            headers: {

                "Access-Control-Allow-Origin":
                    "*",

                "Access-Control-Allow-Methods":
                    "GET,POST,OPTIONS",

                "Access-Control-Allow-Headers":
                    "Content-Type"

            }

        }

    );

}


// ============================================================
// GET PRODUCTS
// ============================================================

function getProducts() {

    return jsonResponse({

        status:
            "success",

        products:
            PRODUCTS

    });

}


// ============================================================
// GET VARIETIES
// ============================================================

function getVarieties(
    product
) {

    if (!product) {

        return jsonResponse({

            status:
                "error",

            message:
                "Product is required."

        }, 400);

    }


    const varieties =
        VARIETIES[product] || [];


    return jsonResponse({

        status:
            "success",

        product:
            product,

        varieties:
            varieties

    });

}


// ============================================================
// GET SIZES
// ============================================================

function getSizes(
    variety
) {

    if (!variety) {

        return jsonResponse({

            status:
                "error",

            message:
                "Variety is required."

        }, 400);

    }


    return jsonResponse({

        status:
            "success",

        variety:
            variety,

        sizes:
            SIZES

    });

}


// ============================================================
// COMPARE PRICES
// ============================================================

async function comparePrices(
    request
) {

    let body = {};


    // --------------------------------------------------------
    // READ JSON
    // --------------------------------------------------------

    try {

        body =
            await request.json();

    }

    catch {

        return jsonResponse({

            status:
                "error",

            message:
                "Invalid JSON request."

        }, 400);

    }


    // --------------------------------------------------------
    // REQUEST VALUES
    // --------------------------------------------------------

    const {

        pincode,

        product,

        variety,

        size

    } = body;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!pincode) {

        return jsonResponse({

            status:
                "error",

            message:
                "Pincode is required."

        }, 400);

    }


    if (!product) {

        return jsonResponse({

            status:
                "error",

            message:
                "Product is required."

        }, 400);

    }


    // ========================================================
    // ALL RESULTS
    // ========================================================

    let allResults = [];


    // ========================================================
    // DMART
    // ========================================================

    try {

        console.log(
            "Starting DMart collector..."
        );


        const dmartResults =
            await searchDmart(

                pincode,

                product,

                variety,

                size

            );


        if (
            Array.isArray(
                dmartResults
            )
        ) {

            allResults.push(
                ...dmartResults
            );

        }


        console.log(
            "DMart results:",
            dmartResults.length
        );

    }

    catch (error) {

        console.error(
            "DMart collector error:",
            error
        );

    }


    // ========================================================
    // AVAILABLE PRODUCTS
    // ========================================================

    const availableProducts =
        allResults.filter(

            item =>

                item.available === true &&

                item.price !== null &&

                item.price !== undefined

        );


    // ========================================================
    // UNAVAILABLE PRODUCTS
    // ========================================================

    const unavailableProducts =
        allResults.filter(

            item =>
                item.available !== true

        );


    // ========================================================
    // LOWEST PRICE
    // ========================================================

    let lowestProduct = null;


    if (
        availableProducts.length > 0
    ) {

        lowestProduct =
            availableProducts.reduce(

                (
                    lowest,
                    current
                ) => {

                    if (
                        current.price <
                        lowest.price
                    ) {

                        return current;

                    }


                    return lowest;

                }

            );

    }


    // ========================================================
    // LOWEST PRICE VALUE
    // ========================================================

    const lowestPrice =
        lowestProduct
            ? lowestProduct.price
            : null;


    // ========================================================
    // PRICE TIES
    // ========================================================

    const tieProducts =
        lowestPrice !== null

            ?

            availableProducts.filter(

                item =>

                    item.price ===
                    lowestPrice

            )

            :

            [];


    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    return jsonResponse({

        status:
            "success",

        request: {

            pincode:
                pincode,

            product:
                product,

            variety:
                variety || null,

            size:
                size || null

        },

        total_products:
            allResults.length,

        available_products:
            availableProducts.length,

        unavailable_products:
            unavailableProducts.length,

        lowest_price:
            lowestPrice,

        lowest_product:
            lowestProduct,

        price_tie:
            tieProducts.length > 1,

        tie_products:
            tieProducts,

        results:
            allResults

    });

}


// ============================================================
// HEALTH
// ============================================================

function health() {

    return jsonResponse({

        status:
            "healthy",

        service:
            "grocery-price-comparator",

        version:
            "1.0.0"

    });

}


// ============================================================
// MAIN CLOUDFLARE WORKER
// ============================================================

export default {

    async fetch(
        request,
        env
    ) {

        const url =
            new URL(
                request.url
            );


        // ====================================================
        // CORS
        // ====================================================

        if (
            request.method ===
            "OPTIONS"
        ) {

            return handleOptions();

        }


        // ====================================================
        // HEALTH
        // ====================================================

        if (
            url.pathname ===
            "/api/health"
        ) {

            return health();

        }


        // ====================================================
        // PRODUCTS
        // ====================================================

        if (
            url.pathname ===
            "/api/products"
        ) {

            return getProducts();

        }


        // ====================================================
        // VARIETIES
        // ====================================================

        if (
            url.pathname ===
            "/api/varieties"
        ) {

            const product =
                url.searchParams.get(
                    "product"
                );


            return getVarieties(
                product
            );

        }


        // ====================================================
        // SIZES
        // ====================================================

        if (
            url.pathname ===
            "/api/sizes"
        ) {

            const variety =
                url.searchParams.get(
                    "variety"
                );


            return getSizes(
                variety
            );

        }


        // ====================================================
        // COMPARE
        // ====================================================

        if (
            url.pathname ===
            "/api/compare"
        ) {

            if (
                request.method !==
                "POST"
            ) {

                return jsonResponse({

                    status:
                        "error",

                    message:
                        "POST method required."

                }, 405);

            }


            return comparePrices(
                request
            );

        }


        // ====================================================
        // FRONTEND
        // ====================================================

        return env.ASSETS.fetch(
            request
        );

    }

};
