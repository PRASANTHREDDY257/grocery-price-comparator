// ============================================================
// GROCERY PRICE COMPARATOR
// FRONTEND API VERSION
// ============================================================


// ============================================================
// API BASE
// ============================================================

// Because the API and website are running on the SAME
// Cloudflare Worker, we can use relative API paths.

const API_BASE = "";


// ============================================================
// ELEMENTS
// ============================================================

const productSelect =
    document.getElementById("product");

const varietySelect =
    document.getElementById("variety");

const sizeSelect =
    document.getElementById("size");

const pincodeInput =
    document.getElementById("pincode");

const varietySection =
    document.getElementById("varietySection");

const sizeSection =
    document.getElementById("sizeSection");

const compareButton =
    document.getElementById("compareButton");

const results =
    document.getElementById("results");


// ============================================================
// HELPER — CHECK FORM
// ============================================================

function updateCompareButton() {

    const ready =
        pincodeInput.value.trim() &&
        productSelect.value &&
        varietySelect.value &&
        sizeSelect.value;

    compareButton.disabled =
        !ready;
}


// ============================================================
// LOAD PRODUCTS
// ============================================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE}/api/products`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        productSelect.innerHTML =
            '<option value="">Select Product</option>';


        data.products.forEach(
            function(product) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    product;

                option.textContent =
                    product;

                productSelect.appendChild(
                    option
                );

            }
        );


    }

    catch (error) {

        console.error(
            "Product loading failed:",
            error
        );


        results.innerHTML = `

            <div class="result-card">

                <strong>
                    Unable to load products
                </strong>

                <p>
                    Please refresh the page.
                </p>

            </div>

        `;

    }

}


// ============================================================
// PRODUCT CHANGE
// ============================================================

productSelect.addEventListener(
    "change",
    async function() {

        const product =
            productSelect.value;


        varietySelect.innerHTML =
            '<option value="">Loading varieties...</option>';


        sizeSelect.innerHTML =
            '<option value="">Select Size</option>';


        sizeSection.style.display =
            "none";


        compareButton.disabled =
            true;


        if (!product) {

            varietySection.style.display =
                "none";

            return;

        }


        varietySection.style.display =
            "block";


        try {

            const response =
                await fetch(

                    `${API_BASE}/api/varieties?product=${encodeURIComponent(product)}`

                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            varietySelect.innerHTML =
                '<option value="">Select Variety</option>';


            data.varieties.forEach(
                function(variety) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        variety;

                    option.textContent =
                        variety;

                    varietySelect.appendChild(
                        option
                    );

                }
            );


        }

        catch (error) {

            console.error(
                "Variety loading failed:",
                error
            );


            varietySelect.innerHTML =
                '<option value="">Unable to load varieties</option>';

        }

    }
);


// ============================================================
// VARIETY CHANGE
// ============================================================

varietySelect.addEventListener(
    "change",
    async function() {

        const variety =
            varietySelect.value;


        sizeSelect.innerHTML =
            '<option value="">Loading sizes...</option>';


        compareButton.disabled =
            true;


        if (!variety) {

            sizeSection.style.display =
                "none";

            return;

        }


        sizeSection.style.display =
            "block";


        try {

            const response =
                await fetch(

                    `${API_BASE}/api/sizes?variety=${encodeURIComponent(variety)}`

                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            sizeSelect.innerHTML =
                '<option value="">Select Size</option>';


            data.sizes.forEach(
                function(size) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        size;

                    option.textContent =
                        size;

                    sizeSelect.appendChild(
                        option
                    );

                }
            );


        }

        catch (error) {

            console.error(
                "Size loading failed:",
                error
            );


            sizeSelect.innerHTML =
                '<option value="">Unable to load sizes</option>';

        }

    }
);


// ============================================================
// PINCODE CHANGE
// ============================================================

pincodeInput.addEventListener(
    "input",
    function() {

        updateCompareButton();

    }
);


// ============================================================
// SIZE CHANGE
// ============================================================

sizeSelect.addEventListener(
    "change",
    function() {

        updateCompareButton();

    }
);


// ============================================================
// COMPARE PRICES
// ============================================================

compareButton.addEventListener(
    "click",
    async function() {

        const pincode =
            pincodeInput.value.trim();

        const product =
            productSelect.value;

        const variety =
            varietySelect.value;

        const size =
            sizeSelect.value;


        if (
            !pincode ||
            !product ||
            !variety ||
            !size
        ) {

            return;

        }


        compareButton.disabled =
            true;


        results.innerHTML = `

            <div class="result-card">

                <strong>
                    Searching suppliers...
                </strong>

                <p>
                    Please wait.
                </p>

            </div>

        `;


        try {

            const response =
                await fetch(

                    `${API_BASE}/api/compare`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                pincode:
                                    pincode,

                                product:
                                    product,

                                variety:
                                    variety,

                                size:
                                    size

                            })

                    }

                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            displayResults(
                data
            );


        }

        catch (error) {

            console.error(
                "Comparison failed:",
                error
            );


            results.innerHTML = `

                <div class="result-card">

                    <strong>
                        Comparison failed
                    </strong>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }


        finally {

            updateCompareButton();

        }

    }
);


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(
    data
) {

    if (
        !data ||
        !data.results ||
        data.results.length === 0
    ) {

        results.innerHTML = `

            <div class="result-card">

                <strong>
                    No supplier results yet
                </strong>

                <p>
                    ${data.message || "No products found."}
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    data.results.forEach(
        function(item) {

            const availability =
                item.available
                    ? "Available"
                    : "Unavailable";


            html += `

                <div class="result-card">

                    <h3>
                        ${item.platform}
                    </h3>

                    <p>
                        ${item.name || ""}
                    </p>

                    <p>
                        ${item.quantity || ""}
                    </p>

                    <p class="${
                        item.available
                            ? "available"
                            : "unavailable"
                    }">

                        ${availability}

                    </p>

                    ${
                        item.price !== null &&
                        item.price !== undefined

                        ?

                        `<div class="price">
                            ₹${item.price}
                         </div>`

                        :

                        `<div class="price">
                            Price unavailable
                         </div>`
                    }

                </div>

            `;

        }
    );


    results.innerHTML = html;

}


// ============================================================
// INITIALIZE
// ============================================================

loadProducts();
