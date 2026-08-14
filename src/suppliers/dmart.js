// ============================================================
// DMART DIAGNOSTIC COLLECTOR
// ============================================================

export async function searchDmart(
    pincode,
    product,
    variety = null,
    size = null
) {

    const searchText =
        encodeURIComponent(product);


    const url =
        `https://www.dmart.in/search?searchTerm=${searchText}`;


    try {

        const response =
            await fetch(

                url,

                {

                    method: "GET",

                    headers: {

                        "User-Agent":
                            "Mozilla/5.0",

                        "Accept":
                            "text/html"

                    }

                }

            );


        const html =
            await response.text();


        console.log(
            "DMART STATUS:",
            response.status
        );


        console.log(
            "HTML SIZE:",
            html.length
        );


        // Return diagnostic item temporarily

        return [

            {

                platform:
                    "DMart",

                item_id:
                    "diagnostic",

                name:
                    "DMart Diagnostic",

                brand:
                    "Test",

                quantity:
                    "",

                price:
                    null,

                mrp:
                    null,

                available:
                    false,

                inventory:
                    {

                        http_status:
                            response.status,

                        html_size:
                            html.length,

                        product_count:
                            (
                                html.match(
                                    /product/gi
                                ) || []
                            ).length,

                        price_count:
                            (
                                html.match(
                                    /price/gi
                                ) || []
                            ).length,

                        json_count:
                            (
                                html.match(
                                    /application\/json/gi
                                ) || []
                            ).length,

                        contains_dmart:
                            html.includes(
                                "dmart"
                            )

                    },

                url:
                    url

            }

        ];


    }

    catch(error) {


        return [

            {

                platform:
                    "DMart",

                name:
                    "DMart Error",

                available:
                    false,

                inventory:
                    {

                        error:
                            error.message

                    }

            }

        ];

    }

}
