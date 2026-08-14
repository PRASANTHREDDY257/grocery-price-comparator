// ============================================================
// GROCERY PRICE COMPARATOR
// CLOUDFLARE WORKER API
// ============================================================


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
//
// IMPORTANT:
// These are temporary.
// Later these will come from our supplier collectors.
//

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
//
// These are temporary too.
// Later sizes will be generated from real supplier data.
//

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
// JSON RESPONSE HELPER
// ============================================================

function jsonResponse(data, status = 200) {

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
// API — PRODUCTS
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
// API — VARIETIES
// ============================================================

function getVarieties(product) {

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
// API — SIZES
// ============================================================

function getSizes(variety) {

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
// API — COMPARE
// ============================================================
//
// This is intentionally a placeholder.
//
// We will connect real supplier collectors here later.
//

async function comparePrices(request) {

    let body = {};

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


    const {

        pincode,

        product,

        variety,

        size

    } = body;


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
            0,

        available_products:
            0,

        unavailable_products:
            0,

        lowest_price:
            null,

        lowest_product:
            null,

        price_tie:
            false,

        tie_products:
            [],

        results:
            [],

        message:
            "Supplier collectors are not connected yet."

    });

}


// ============================================================
// MAIN WORKER
// ============================================================

export default {

    async fetch(
        request,
        env
    ) {

        const url =
            new URL(request.url);


        // ----------------------------------------------------
        // CORS PREFLIGHT
        // ----------------------------------------------------

        if (
            request.method === "OPTIONS"
        ) {

            return handleOptions();

        }


        // ----------------------------------------------------
        // API — PRODUCTS
        // ----------------------------------------------------

        if (
            url.pathname ===
            "/api/products"
        ) {

            return getProducts();

        }


        // ----------------------------------------------------
        // API — VARIETIES
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // API — SIZES
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // API — COMPARE
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // HEALTH
        // ----------------------------------------------------

        if (
            url.pathname ===
            "/api/health"
        ) {

            return jsonResponse({

                status:
                    "healthy",

                service:
                    "grocery-price-comparator",

                version:
                    "1.0.0"

            });

        }


        // ----------------------------------------------------
        // FRONTEND
        // ----------------------------------------------------

        return env.ASSETS.fetch(
            request
        );

    }

};
