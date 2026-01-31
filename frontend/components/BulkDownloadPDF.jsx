import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { ReceiptContent } from "./ReceiptContent";

const LONG_BOND_LANDSCAPE = [936, 612];

const RECEIPT_MARGIN = 10;

const RECEIPT_WIDTH = 240;
const RECEIPT_HEIGHT = 400;

const BulkDownloadPDF = ({ receipts }) => {
  const receiptsPerRow = Math.floor((LONG_BOND_LANDSCAPE[0] - RECEIPT_MARGIN) / (RECEIPT_WIDTH + RECEIPT_MARGIN));
  const receiptsPerCol = Math.floor((LONG_BOND_LANDSCAPE[1] - RECEIPT_MARGIN) / (RECEIPT_HEIGHT + RECEIPT_MARGIN));
  const receiptsPerPage = receiptsPerRow * receiptsPerCol;
  const pages = [];
  for (let i = 0; i < receipts.length; i += receiptsPerPage) {
    pages.push(receipts.slice(i, i + receiptsPerPage));
  }

  return (
    <Document>
      {pages.map((pageReceipts, pageIndex) => (
        <Page
          key={pageIndex}
          size={LONG_BOND_LANDSCAPE}
          style={{ padding: RECEIPT_MARGIN, flexDirection: "row", flexWrap: "wrap" }}
        >
          {pageReceipts.map((receipt, index) => (
            <View
              key={index}
              style={{
                width: RECEIPT_WIDTH,
                height: RECEIPT_HEIGHT,
                marginRight: RECEIPT_MARGIN,
                marginBottom: RECEIPT_MARGIN,
              }}
            >
              <ReceiptContent data={receipt} />
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default BulkDownloadPDF;