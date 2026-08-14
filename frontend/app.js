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


// ------------------------------------------------------------
// TEMPORARY VARIETIES
// ------------------------------------------------------------
// These are only for testing the UI.
// Later they will come dynamically from our backend.
// ------------------------------------------------------------

const varieties = {

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


// ------------------------------------------------------------
// PRODUCT CHANGE
// ------------------------------------------------------------

productSelect.addEventListener(
    "change",
    function () {

        const product =
            productSelect.value;

        varietySelect.innerHTML =
            '<option value="">Select Variety</option>';

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


        const productVarieties =
            varieties[product] || [];


        productVarieties.forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item;

                option.textContent =
                    item;

                varietySelect.appendChild(
                    option
                );

            }
        );


        varietySection.style.display =
            "block";

    }
);


// ------------------------------------------------------------
// VARIETY CHANGE
// ------------------------------------------------------------

varietySelect.addEventListener(
    "change",
    function () {

        const variety =
            varietySelect.value;

        sizeSelect.innerHTML =
            '<option value="">Select Size</option>';

        compareButton.disabled =
            true;

        if (!variety) {

            sizeSection.style.display =
                "none";

            return;
        }


        // Temporary sizes.
        // These will become dynamic from the backend.

        const sizes = [
            "100 g",
            "250 g",
            "500 g",
            "1 kg",
            "1 L",
            "2 L",
            "5 kg"
        ];


        sizes.forEach(
            function (size) {

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


        sizeSection.style.display =
            "block";

    }
);


// ------------------------------------------------------------
// SIZE CHANGE
// ------------------------------------------------------------

sizeSelect.addEventListener(
    "change",
    function () {

        compareButton.disabled =
            !(
                pincodeInput.value.trim()
                &&
                productSelect.value
                &&
                varietySelect.value
                &&
                sizeSelect.value
            );

    }
);


// ------------------------------------------------------------
// PINCODE CHANGE
// ------------------------------------------------------------

pincodeInput.addEventListener(
    "input",
    function () {

        compareButton.disabled =
            !(
                pincodeInput.value.trim()
                &&
                productSelect.value
                &&
                varietySelect.value
                &&
                sizeSelect.value
            );

    }
);


// ------------------------------------------------------------
// COMPARE
// ------------------------------------------------------------

compareButton.addEventListener(
    "click",
    function () {

        results.innerHTML = `

            <div class="result-card">

                <strong>
                    Searching suppliers...
                </strong>

                <p>
                    This will connect to our
                    backend API once deployed.
                </p>

            </div>

        `;

    }
);
