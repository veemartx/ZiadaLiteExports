<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import axios from "axios";
    import pdfMake, { async } from "pdfmake/build/pdfmake";
    import "pdfmake/build/vfs_fonts";
    import logo from "../../config/logo";
    import { sharedBaseUrl } from "../../config/config";

    let inventory = [];

    let companyDetails = {
        postalCode: "P.o. Box 1263-09303 Nairobi Kenya",
        companyEmail: "info@pharmaplus.co.ke",
        physicalLocation: "info@pharmaplus.co.ke",
        companyPhone: "2547568383494",
    };

    let pdfColumns = ["No", "Name", "Branch", "Email", "Phone", "Position"];

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

    const getInventory = async () => {
        try {
            let response = await axios({
                method: "get",
                url: `${sharedBaseUrl}filterInventoryReport.php`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // console.log(response);

            inventory = response.data;

            generatePdf();
        } catch (err) {
            console.log(err);
        }
    };

    const generatePdfBody = async (columns, payload) => {
        var body = [];

        // titles
        let titlesArray = columns.map((val) => {
            let newVal = {
                border: [false, false, false, true],
                text: val,
                style: "tableHead",
            };

            return newVal;
        });

        // headers
        body.push(titlesArray);

        // console.log(titlesArray);

        // for (let x = 0; x < payload.length; x++) {
        //     let name = payload[x].name;

        //     let branch = payload[x].branch;

        //     let email = payload[x].email;

        //     let phone = payload[x].phone;

        //     let position = payload[x].position;

        //     // striped
        //     let fillColor = "#f7f7f7";

        //     if (x % 2 == 0) {
        //         fillColor = "#f7f0f0";
        //     }

        //     // let new data row
        //     let dataRow = [
        //         {
        //             text: x + 1,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //         {
        //             text: name,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //         {
        //             text: branch,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //         {
        //             text: email,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //         {
        //             text: phone,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //         {
        //             text: position,
        //             style: "tableCol",
        //             fillColor: fillColor,
        //         },
        //     ];

        //     body.push(dataRow);
        // }

        // console.log(totalSales);

        return body;
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
                                    text: "Branch Ranking",
                                    style: "mainTitle",
                                },
                                {
                                    border: [false, false, false, false],
                                    text: "MST038",
                                    style: "documentNumber",
                                },
                            ],
                            [
                                {
                                    border: [false, false, false, false],
                                    text: "",
                                    fontSize: 12,
                                    bold: true,
                                },

                                {
                                    border: [false, false, false, false],
                                    text: "(All)",
                                    alignment: "right",
                                    fontSize: 10,
                                },
                            ],
                        ],
                    },
                },

  
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

                icon: { font: "Fontello" },
            },
        };

         pdfMake.createPdf(docDefinition).open({}, window);
        // pdfMake.createPdf(docDefinition).open();
    };

    onMount(() => {
        getInventory();
    });
</script>

<main>
    <div id="iframeContainer" />
</main>
