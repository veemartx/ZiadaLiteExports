<script>
    // @ts-nocheck

    import axios from "axios";
    import { onMount } from "svelte";
    import { useParams } from "svelte-navigator";
    import { newApiBaseUrl } from "../../config/config";
    import { decode } from "js-base64";
    import pdfMake, { async } from "pdfmake/build/pdfmake";
    import "pdfmake/build/vfs_fonts";
    import logo from "../../config/new_logo";
    import { addCommas, arraySum, capitalize } from "../../config/methods";
    import isBetween from "dayjs/plugin/isBetween";
    import dayjs from "dayjs";

    dayjs.extend(isBetween);

    pdfMake.fonts = {
        Liberation: {
            normal: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.regular.ttf",
            bold: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.bold.ttf",
            italics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.italic.ttf",
            bolditalics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/liberation-serif.bold-italic.ttf",
        },
        Fontello: {
            normal: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            bold: "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            italics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
            bolditalics:
                "https://pharmaplusziadalite.co.ke/assets/fonts/Liberation_serif/fontello.ttf",
        },
    };

    const params = useParams();

    let companyDetails = {
        postalCode: "P.o. Box 1263-09303 Nairobi Kenya",
        companyEmail: "info@pharmaplus.co.ke",
        physicalLocation: "info@pharmaplus.co.ke",
        companyPhone: "2547568383494",
    };

    let filters;

    let products = [];

    let filteredProducts = [];

    $: {
        filters = JSON.parse(decode($params.filters));
    }

    const generatePdfBody = () => {
        let pdfBody = [];

        let pdfHeaderTitles = [
            { text: "No", bold: true, fontSize: 9 },
            { text: "Name", bold: true, fontSize: 9 },
            { text: "Code", bold: true, fontSize: 9 },
            { text: "Type", bold: true, fontSize: 9 },
            { text: "Region", bold: true, fontSize: 9 },
            { text: "Branch", bold: true, fontSize: 9 },
            { text: "Qty", bold: true, fontSize: 9 },
            { text: "Exp", bold: true, fontSize: 9 },
            { text: "Price", bold: true, fontSize: 9 },
            { text: "Value", bold: true, fontSize: 9 },
        ];

        let pdfBodyTableWidths = [
            "6%",
            "20%",
            "7%",
            "5%",
            "12%",
            "10%",
            "9%",
            "7%",
            "10%",
            "10%",
        ];

        let tableBody = [];

        tableBody.push(pdfHeaderTitles);

        filteredProducts.forEach((p, i) => {
            let type;
            if (p.offerName == "Dead Stock") {
                type = "D.S";
            } else if (p.offerName === "Short Exp") {
                type = "S.E";
            } else {
                type = p.offerName;
            }

            //     // striped
            let fillColor = "#f7f7f7";

            if (i % 2 == 0) {
                fillColor = "#f7f0f0";
            }
            tableBody.push([
                {
                    text: i + 1,
                    style: "reportValue",
                    fillColor: fillColor,
                },

                {
                    text: p.productName,
                    style: "reportValue",
                    fillColor: fillColor,
                },

                {
                    text: p.productCode,
                    style: "reportValue",
                    fillColor: fillColor,
                },

                {
                    text: type,
                    style: {
                        fontSize: 9,
                        bold: true,
                        color: type === "D.S" ? "crimson" : "orange",
                    },
                    fillColor: fillColor,
                },
                {
                    text: p.region,
                    style: "reportValue",
                    fillColor: fillColor,
                },

                {
                    text: p.branch,
                    style: "reportValue",
                    fillColor: fillColor,
                },
                {
                    text: `${Math.floor(
                        parseInt(p.qty) / parseInt(p.packSize),
                    )}W ${parseInt(p.qty) % parseInt(p.packSize)}P`,
                    style: "reportValue",
                    fillColor: fillColor,
                },
                {
                    text: dayjs(p.expiryDate).format("MMM YY"),
                    style: "reportValue",
                    fillColor: fillColor,
                },
                {
                    text: p.price,
                    style: "reportValue",
                    fillColor: fillColor,
                },
                {
                    text: addCommas(parseInt(p.price) * parseInt(p.qty), 2),
                    style: {
                        bold: true,
                        fontSize: 9,
                    },
                    fillColor: fillColor,
                },
            ]);
        });

        pdfBody.push({
            margin: [15, 5, 15, 15],
            layout: "lightHorizontalLines",
            table: {
                widths: pdfBodyTableWidths,
                headerRows: 1,
                body: tableBody,
            },
        });

        return pdfBody;
    };
    const generatePdf = () => {
        var docDefinition = {
            pageMargins: [0, 5, 5, 5],

            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + " of " + pageCount,
                        style: "footerText",
                    },
                ];
            },
            header: function (currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element

                return [
                    {
                        text: "ZIADA",
                        alignment: currentPage % 2 ? "left" : "right",
                        style: "headerText",
                    },
                    {
                        image: "" + logo + "",
                        width: 2000,
                        style: "logo",
                    },
                ];
            },
            watermark: {
                text: "Pharmaplus Pharmacies",
                color: "blue",
                opacity: 0.05,
                bold: false,
                italics: false,
                fontSize: 70,
            },
            content: [
                // logo
                {
                    border: [false, false, false, false],
                    image: "" + logo + "",
                    width: 250,
                    style: "logo",
                    outerHeight: 300,
                },

                {
                    style: "topCompanyName",
                    text: "Pharmaplus Pharmacies Ltd",
                },

                {
                    style: "topBarTable",
                    margin: [15, 15, 15, 0],
                    table: {
                        widths: ["100%"],
                        body: [
                            [
                                {
                                    text:
                                        "P.o. Box " +
                                        companyDetails.postalCode +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.companyPhone +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.companyEmail +
                                        " " +
                                        " | " +
                                        " " +
                                        companyDetails.physicalLocation,
                                    border: [false, false, false, true],
                                },
                            ],
                        ],
                    },
                },

                {
                    style: "headerTable",
                    margin: [15, 5, 15, 15],
                    table: {
                        widths: ["60%", "40%"],
                        body: [
                            [
                                {
                                    border: [false, false, false, false],
                                    text: "Product Reports",
                                    style: "mainTitle",
                                },
                                {
                                    border: [false, false, false, false],
                                    text: "ZIADALITE",
                                    style: "documentNumber",
                                    color: "#2fac4c",
                                },
                            ],
                            [
                                {
                                    border: [false, false, false, false],
                                    text: `:`,
                                    fontSize: 10,
                                    color: "#5c4b9a",
                                    bold: true,
                                },

                                {
                                    border: [false, false, false, false],
                                    text: `${addCommas(
                                        filteredProducts.length,
                                    )} Products`,
                                    alignment: "right",
                                    fontSize: 9,
                                    bold: true,
                                    color: "crimson",
                                },
                            ],
                            [
                                {
                                    border: [false, false, false, false],
                                    text: `${
                                        filters.length == 0
                                            ? "All Products"
                                            : filters
                                                  .map((f) => {
                                                      if (
                                                          f.prop ===
                                                              "expiryDate" ||
                                                          f.prop === "addedOn"
                                                      ) {
                                                          return `${capitalize(
                                                              f.name,
                                                          )}: Between ${dayjs(
                                                              f.value.min,
                                                          ).format(
                                                              "MMM YYYY",
                                                          )} & ${dayjs(
                                                              f.value.max,
                                                          ).format(
                                                              "MMM YYYY",
                                                          )}`;
                                                      } else {
                                                          return `${capitalize(
                                                              f.name,
                                                          )}:${capitalize(
                                                              f.value,
                                                          )}`;
                                                      }
                                                  })
                                                  .join(",")
                                    }`,
                                    fontSize: 9,
                                    alignment: "left",
                                    color: "#5c4b9a",
                                },

                                {
                                    border: [false, false, false, false],
                                    text: `(Ksh.${addCommas(
                                        arraySum(
                                            filteredProducts.map(
                                                (p) => p.price * p.qty,
                                            ),
                                        ),
                                        2,
                                    )})`,
                                    alignment: "right",
                                    fontSize: 8,
                                    bold: true,
                                    color: "crimson",
                                },
                            ],
                        ],
                    },
                },

                generatePdfBody(),
            ],
            defaultStyle: {
                font: "Liberation",
            },

            styles: {
                topCompanyName: {
                    fontSize: 20,
                    alignment: "center",
                    fontWeight: "bold",
                },

                topBarTable: {
                    color: "#2b2b2b",
                    fontSize: 10,
                },

                headerText: {
                    fontSize: 13,
                    bold: true,
                    color: "#ffffff",
                    opacity: 1,
                    margin: [10, 0, 0, 0],
                },
                footerText: {
                    fontSize: 13,
                    bold: true,
                    color: "rgba(18,18,18,0.9)",
                    opacity: 0.6,
                },
                headerCols: {
                    background: "red",
                },
                headerTable: {
                    border: false,
                },
                logo: {
                    italics: true,
                    alignment: "center",
                    background: "red",
                    marginTop: 10,
                },

                companyName: {
                    fontSize: 13,
                    bold: true,
                },
                mainTitle: {
                    fontSize: 13,
                    bold: true,
                },

                documentNumber: {
                    fontSize: 11,
                    bold: true,
                    alignment: "right",
                },

                contentTable: {
                    fontSize: 11,
                    margin: [15, 5, 15, 15],
                },

                footerRow: {
                    marginTop: 5,
                },

                tableHead: {
                    bold: true,
                    fontSize: 11,
                },

                summaryTable: {
                    marginTop: 20,
                },

                copyrightText: {
                    color: "gray",
                    fontSize: 10,
                    width: "*",
                    alignment: "right",
                    marginRight: 10,
                    italics: true,
                },

                tableCol: {
                    lineHeight: 1.5,
                    alignment: "justify",
                    marginTop: 8,
                    fontSize: 9,
                    marginLeft: 5,
                },
                chart: {
                    alignment: "justify",
                    background: "red",
                    marginTop: 10,
                    marginLeft: 10,
                },

                reportValue: {
                    fontSize: 9,
                    alignment: "justify",
                    margin: 2,
                },

                icon: { font: "Fontello" },
            },
        };

        pdfMake.createPdf(docDefinition).open({}, window);
        // pdfMake.createPdf(docDefinition).open();
    };

    const filterByDate = (filter, products) => {
        return products.filter((p) => {
            if (
                dayjs(p[filter.prop]).isBetween(
                    dayjs(filter.value.min),
                    dayjs(filter.value.max),
                )
            ) {
                return p;
            }
        });
    };
    const filterProducts = (products, activeFilters) => {
        let filtered = products;

        for (let x = 0; x < activeFilters.length; x++) {
            const filter = activeFilters[x];

            if (filter.prop == "expiryDate" || filter.prop == "addedOn") {
                filtered = filterByDate(filter, filtered);
                continue;
            }

            filtered = filtered.filter((p) => {
                // check if filter is date;
                if (p[filter.prop] === filter.value) {
                    return p;
                }
            });
        }

        return filtered;
    };
    const getProducts = async () => {
        const response = await axios({
            method: "POST",
            url: `${newApiBaseUrl}report-products.php`,
        });

        return response.data;
    };

    onMount(async () => {
        products = await getProducts();

        console.log(filters);

        filteredProducts = filterProducts(products, filters);

        generatePdf();
    });
</script>

<main>
    <main>
        <div id="iframeContainer" />
    </main>
</main>
