// ============================================================
// DMART HTML STRUCTURE ANALYZER
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



        function count(term) {

            return (
                html.match(
                    new RegExp(term, "gi")
                ) || []
            ).length;

        }



        // Look for product links

        const urls =
            html.match(
                /https?:\/\/[^"']+product[^"']+/gi
            ) || [];



        // Look around price areas

        const priceMatches =
            html.match(
                /.{0,80}(price|mrp|selling).{0,120}/gi
            ) || [];



        // Look around product ids

        const idMatches =
            html.match(
                /.{0,80}(productId|product_id|sku).{0,120}/gi
            ) || [];



        return [

            {

                platform:
                    "DMart",

                item_id:
                    "analysis",

                name:
                    "DMart HTML Analysis",

                available:
                    false,


                inventory:
                    {

                        status:
                            response.status,


                        html_size:
                            html.length,


                        markers:
                            {

                                productId:
                                    count(
                                        "productId"
                                    ),

                                product_id:
                                    count(
                                        "product_id"
                                    ),

                                sku:
                                    count(
                                        "sku"
                                    ),

                                price:
                                    count(
                                        "price"
                                    ),

                                mrp:
                                    count(
                                        "mrp"
                                    ),

                                sellingPrice:
                                    count(
                                        "sellingPrice"
                                    ),

                                quantity:
                                    count(
                                        "quantity"
                                    )

                            },


                        product_urls_found:
                            urls.slice(
                                0,
                                5
                            ),


                        price_samples:
                            priceMatches.slice(
                                0,
                                5
                            ),


                        id_samples:
                            idMatches.slice(
                                0,
                                5
                            )

                    }

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
