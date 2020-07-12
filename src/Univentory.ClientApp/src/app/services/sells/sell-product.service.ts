import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/authentication/auth.service';
declare let pdfMake: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class SaleProductService {
  private serviceUrl: string = '';
  private totalPrice: number;
  private invoiceNumber: number;
  private selectedConsumer: any;
  private dateIssued: string;

  constructor(private authService: AuthService, private httpService: HttpService, private configService: ConfigService) {
    if (this.configService.isReady) {
      this.serviceUrl = this.configService.serverSettings.apiServiceUrl;
    }

  }

  saleProductItems(saleItems): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/sellproduct/create", saleItems)
      .pipe(map(response => {
        return response;
      }));
  }

  getAllSellProducts(searchKeyword, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/sellproduct/items?searchKeyword=" + searchKeyword + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }

  getAllSellProductsByConsumerId(consumerId, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/sellproduct/items/consumerPurchaseHistory/" + consumerId + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }

  getSaleProductItems(saleId, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/sellproduct/items/" + saleId + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }
  calculatePercentage(subTotal, percentagePrice) {
    return (100 - (((parseFloat(subTotal) - parseFloat(percentagePrice)) / parseFloat(subTotal)) * 100)).toFixed(2);
  }

  getDocumentDefinition(sellItems) {
    let user = this.authService.userInfo();
    let saleItems = [];
    let subTotal = 0;
    let taxPerc = 0;
    let taxAmount = 0;
    let discountPerc = 0;
    let discountPrice = 0;
    saleItems.push([
      {
        text: 'Name',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        alignment: 'left',
      },
      {
        text: 'Qty',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        alignment: 'center',
      },
      {
        text: 'Price(₹)',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        alignment: 'center',
      },
      {
        text: 'Tax(%)',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        alignment: 'center',
      },

      {
        text: 'Discount(%)',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
      },
      {
        text: 'Total Price(₹)',
        fillColor: '#c0d9ef',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        alignment: 'center',
      }
    ]);
    sellItems.forEach(element => {
      taxAmount += parseFloat(element.taxAmount) > 0 ? parseFloat(element.taxAmount) : 0;
      discountPrice += parseFloat(element.discountPrice) > 0 ? parseFloat(element.discountPrice) : 0;
      subTotal += parseFloat(element.sellPrice) * parseInt(element.unit);

      saleItems.push([
        { "text": element.name, "style": "itemTitle" },
        { "text": parseInt(element.unit), "style": "itemNumber" },
        { "text": (element.sellPrice).toFixed(2), "style": "itemNumber" },
        { "text": element.taxRateInPercentage > 0 ? (element.taxRateInPercentage).toFixed(2) : '-', "style": "itemNumber" },
        { "text": element.discountInPercntage > 0 ? (element.discountInPercntage).toFixed(2) : '-', "style": "itemNumber" },
        { "text": (element.sellPrice * element.unit).toFixed(2), "style": "itemTotal" }
      ]
      );
    });
    discountPerc = parseFloat(this.calculatePercentage(subTotal, discountPrice));
    taxPerc = parseFloat(this.calculatePercentage(subTotal, taxAmount));
    // playground requires you to assign document definition to a variable called invoiceDescription
    var invoiceDescription = {
      content: [
        {
          columns: [
            [
              {
                text: 'Billing From',
                color: '#6c95d4',
                width: '*',
                fontSize: 20,
                bold: true,
                alignment: 'left',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: user.shopName,
                        color: '#565656',
                        bold: true,
                        width: '*',
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 2],
                      }
                    ],
                  },
                  {
                    columns: [
                      {
                        text: user.mobileNumber != '' && user.mobileNumber != null ? '+91 ' + user.mobileNumber : '',
                        bold: true,
                        color: '#565656;',
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 5],
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: user.gstNumber != '' && user.gstNumber != null ? user.gstNumber : '',
                        bold: true,
                        color: '#565656;',
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 5],
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: user.address != null ? user.address : '',
                        bold: true,
                        color: '#565656',
                        fontSize: 12,
                        alignment: 'left',
                        margin: [0, 0, 0, 5],
                      },
                    ],
                  },
                ],
              },
            ],
            [
              {
                text: 'TAX INVOICE',
                color: '#6c95d4',
                width: '*',
                fontSize: 26,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Invoice No.',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                        margin: [0, 0, 0, 2],

                      },
                      {
                        text: "#" + this.invoiceNumber,
                        bold: true,
                        color: '#565656',
                        fontSize: 14,
                        alignment: 'right',
                        width: 100,
                        margin: [0, 0, 0, 2],
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Date Issued',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                        margin: [0, 0, 0, 2],
                      },
                      {
                        text: this.dateIssued,
                        bold: true,
                        color: '#565656',
                        fontSize: 14,
                        alignment: 'right',
                        width: 100,
                        margin: [0, 0, 0, 2],
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Payment Mode',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        width: '*',
                        margin: [0, 0, 0, 2],
                      },
                      {
                        text: 'CASH',
                        bold: true,
                        fontSize: 14,
                        alignment: 'right',
                        color: 'green',
                        width: 100,
                        margin: [0, 0, 0, 2],
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        '\n',
        {
          columns: [
            [
              {
                text: 'Billing To',
                color: '#6c95d4',
                width: '*',
                fontSize: 20,
                bold: true,
                alignment: 'left',
                margin: [0, 0, 0, 10],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: this.selectedConsumer.name,
                        color: '#565656;',
                        bold: true,
                        width: '*',
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 2],
                      }
                    ],
                  },
                  {
                    columns: [
                      {
                        text: this.selectedConsumer.mobileNumber != null ? this.selectedConsumer.mobileNumber : '',
                        bold: true,
                        color: '#565656;',
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 5],
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: this.selectedConsumer.billingAddress != null ? this.selectedConsumer.billingAddress : '',
                        bold: true,
                        color: '#565656',
                        fontSize: 12,
                        alignment: 'left',
                        margin: [0, 0, 0, 5],
                        width: '50%'
                      },
                    ],
                  },
                ],
              },
            ],
          ]
        },
        '\n',

        // Items
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function (i, node) {
              return '#eaeaea';
            },
            hLineStyle: function (i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 2;
            },
            paddingBottom: function (i, node) {
              return 2;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 40, 'auto', 40, 'auto', 80],

            body: saleItems
          }, // table
          //  layout: 'lightHorizontalLines'
        },
        // TOTAL
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: ['*', 80],

            body: [
              // Total
              [
                {
                  text: 'Subtotal',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: '₹' + subTotal.toFixed(2),
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Discount',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: discountPerc > 0 ? discountPerc + '%' : '-',
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Discount Amount',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: discountPrice > 0 ? '₹' + discountPrice.toFixed(2) : '-',
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Tax',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: taxPerc > 0 ? taxPerc.toFixed(2) + '%' : '-',
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Tax Amount',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: taxAmount > 0 ? '₹' + (taxAmount.toFixed(2)) : '-',
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'TOTAL',
                  style: 'itemsFooterTotalTitle'
                },
                {
                  text: '₹' + this.totalPrice.toFixed(2),
                  style: 'itemsFooterTotalValue'
                }
              ],
            ]
          }, // table
          layout: 'lightHorizontalLines'
        },
        // Signature
        {
          columns: [
            {
              text: '',
            },
            {
              stack: [
                {
                  text: user.shopName,
                  style: 'signaturePlaceholder'
                },
                {
                  text: '_________________________________',
                  style: ''
                },
                {
                  text: 'Your Signature',
                  style: 'signatureJobTitle'

                }
              ],
              width: 180
            },
          ]
        }
      ],
      styles: {
        // Document Header
        documentHeaderLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentHeaderCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentHeaderRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // Document Footer
        documentFooterLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentFooterCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentFooterRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // Invoice Title
        invoiceTitle: {
          fontSize: 22,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 15]
        },
        // Invoice Details
        invoiceSubTitle: {
          fontSize: 12,
          alignment: 'right'
        },
        invoiceSubValue: {
          fontSize: 12,
          alignment: 'right'
        },
        // Billing Headers
        invoiceBillingTitle: {
          fontSize: 14,
          bold: true,
          alignment: 'left',
          margin: [0, 20, 0, 5],
        },
        // Billing Details
        invoiceBillingDetails: {
          alignment: 'left'

        },
        invoiceBillingAddressTitle: {
          margin: [0, 7, 0, 3],
          bold: true
        },
        invoiceBillingAddress: {

        },
        // Items Header
        itemsHeader: {
          margin: [0, 5, 0, 5],
          bold: true
        },
        // Item Title
        itemTitle: {
          bold: true,
        },
        itemSubTitle: {
          italics: true,
          fontSize: 11
        },
        itemNumber: {
          margin: [0, 5, 0, 5],
          alignment: 'center',
        },
        itemTotal: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },

        // Items Footer (Subtotal, Total, Tax, etc)
        itemsFooterSubTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        itemsFooterSubValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },
        itemsFooterTotalTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        itemsFooterTotalValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },
        signaturePlaceholder: {
          margin: [0, 50, 0, 0],
          alignment: 'center',
        },
        signatureName: {
          bold: true,
          alignment: 'center',
        },
        signatureJobTitle: {
          italics: true,
          fontSize: 10,
          alignment: 'center',
        },
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10
        },
        center: {
          alignment: 'center',
        },
      },
      defaultStyle: {
        columnGap: 20,
      }
    }
    return invoiceDescription;
  }

  generateInvoice(action = 'print', saleProductItems, totalPrice, invoiceNumber, selectedConsumer, dateIssued) {
    this.invoiceNumber = invoiceNumber;
    this.totalPrice = totalPrice;
    this.selectedConsumer = selectedConsumer;
    this.dateIssued = dateIssued;

    const documentDefinition = this.getDocumentDefinition(saleProductItems);
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download("invoice_" + this.invoiceNumber + '.pdf'); break;

      // default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }
}