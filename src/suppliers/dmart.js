// ============================================================
// DMART SUPPLIER ADAPTER
// ============================================================
//
// Purpose:
// Collect DMart product information
// and return a standard product format.
//
// Output format:
// {
//   platform,
//   item_id,
//   name,
//   brand,
//   quantity,
//   price,
//   mrp,
//   available,
//   url
// }
//
// ============================================================


export async function searchDmart(
    pincode,
    product,
    variety = null,
    size = null
) {


    console.log(
        "====================================="
    );

    console.log(
        "DMART SEARCH"
    );

    console.log(
        "Pincode:",
        pincode
    );

    console.log(
        "Product:",
        product
    );

    console.log(
        "Variety:",
        variety
    );

    console.log(
        "Size:",
        size
    );


    // --------------------------------------------------------
    // IMPORTANT
    //
    // This is the adapter shell.
    //
    // The actual DMart collector logic will be inserted here.
    //
    // Keeping this isolated means:
    //
    // index.js does not change when we improve DMart scraping.
    //
    // --------------------------------------------------------


    let results = [];


    /*
    
    Expected future collector output:

    results.push({

        platform:
            "DMart",

        item_id:
            "1686070",

        name:
            "SriLalitha Premium Brown Rice",

        brand:
            "Sri Lalitha",

        quantity:
            "5 kg",

        price:
            419,

        mrp:
            450,

        available:
            true,

        url:
            "https://www.dmart.in/product/..."

    });


    */


    return results;

}
