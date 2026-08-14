// ============================================================
// DMART DIAGNOSTIC COLLECTOR
// ============================================================


export async function searchDmart(
    pincode,
    product,
    variety = null,
    size = null
) {


    console.log(
        "================================="
    );

    console.log(
        "DMART TEST"
    );

    console.log(
        "Product:",
        product
    );

    console.log(
        "Pincode:",
        pincode
    );


    try {


        const searchText =
            encodeURIComponent(
                product
            );


        const url =
            `https://www.dmart.in/search?searchTerm=${searchText}`;


        console.log(
            "URL:",
            url
        );


        const response =
            await fetch(

                url,

                {

                    method:
                        "GET",

                    headers: {

                        "User-Agent":
                            "Mozilla/5.0",

                        "Accept":
                            "text/html"

                    }

                }

            );


        console.log(
            "STATUS:",
            response.status
        );


        const html =
            await response.text();


        console.log(
            "HTML SIZE:",
            html.length
        );


        console.log(
            "PRODUCT COUNT:",
            (
                html.match(
                    /product/gi
                ) || []
            ).length
        );


        console.log(
            "PRICE COUNT:",
            (
                html.match(
                    /price/gi
                ) || []
            ).length
        );


        console.log(
            "JSON COUNT:",
            (
                html.match(
                    /application\/json/gi
                ) || []
            ).length
        );


        // ---------------------------------------------
        // Temporary return
        // ---------------------------------------------

        return [];


    }

    catch(error) {


        console.log(
            "DMART ERROR:",
            error.message
        );


        return [];

    }

}
