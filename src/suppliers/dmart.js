export async function searchDmart(
    pincode,
    product,
    variety = null,
    size = null
) {

    return [

        {

            platform: "DMart",

            item_id: "test-new-version",

            name: "DMart NEW CODE RUNNING",

            brand: "TEST",

            quantity: "TEST",

            price: 1,

            mrp: 2,

            available: true,

            inventory: {

                message:
                    "If you see this, new dmart.js is deployed"

            },

            url:
                "https://www.dmart.in"

        }

    ];

}
