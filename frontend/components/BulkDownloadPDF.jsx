import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { ReceiptContent } from "./ReceiptContent";

const PAPER_CONFIGS = {
  A4: {
    size: [841.89, 595.28], 
    label: "A4"
  },
  LONG: {
    size: [936, 612], 
    label: "Long Bond"
  }
};

const RECEIPT_MARGIN = 40;
const RECEIPT_WIDTH = 240;
const RECEIPT_HEIGHT = 400;

const BulkDownloadPDF = ({ receipts, paperType = "LONG" }) => {
  const selectedPaper = PAPER_CONFIGS[paperType] || PAPER_CONFIGS.LONG;
  const pageWidth = selectedPaper.size[0];
  const pageHeight = selectedPaper.size[1];

  const receiptsPerRow = Math.floor((pageWidth - RECEIPT_MARGIN) / (RECEIPT_WIDTH + RECEIPT_MARGIN));
  const receiptsPerCol = Math.floor((pageHeight - RECEIPT_MARGIN) / (RECEIPT_HEIGHT + RECEIPT_MARGIN));
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
          size={selectedPaper.size}
          style={{ 
            padding: RECEIPT_MARGIN, 
            flexDirection: "row", 
            flexWrap: "wrap",
            backgroundColor: "#FFFFFF" 
          }}
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