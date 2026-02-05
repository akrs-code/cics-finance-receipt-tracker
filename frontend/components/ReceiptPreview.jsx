import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";

const BORDER_COLOR = "#000";
const BORDER_WIDTH = 1;
const POCKET_SIZE = [260, 450];

const styles = StyleSheet.create({
  page: {
    padding: 16,
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 8,
  },
  wrapper: {
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
  },
  header: {
    textAlign: "center",
    paddingVertical: 4,
    borderBottom: BORDER_WIDTH,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderBottom: BORDER_WIDTH,
  },
  row: {
    flexDirection: "row",
    borderBottom: BORDER_WIDTH,
  },
  cellLabel: {
    flex: 1,
    padding: 3,
    borderRight: BORDER_WIDTH,
  },
  cellLabelLast: {
    flex: 1,
    padding: 3,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: BORDER_WIDTH,
  },
  colParticular: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    padding: 4,
    borderRight: BORDER_WIDTH,
  },
  colAmount: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    padding: 4,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 14,
    borderBottom: BORDER_WIDTH,
  },
  tableRowEmpty: {
    flexDirection: "row",
    height: 14,
    borderBottom: BORDER_WIDTH,
  },
  totalRow: {
    flexDirection: "row",
    borderBottom: BORDER_WIDTH,
    fontWeight: "bold",
  },
  purposeSection: {
    padding: 3,
    minHeight: 30,
    borderBottom: BORDER_WIDTH,
  },
  certification: {
    padding: 5,
    fontSize: 8.5,
    fontStyle: "italic",
    textAlign: "justify",
    lineHeight: 1.2,
    borderBottom: BORDER_WIDTH,
  },
  sigRow: {
    flexDirection: "row",
    borderBottom: BORDER_WIDTH,
  },
  sigCell: {
    flex: 1,
    borderRight: BORDER_WIDTH,
    padding: 2,
  },
  sigCellName: {
    flex: 1,
    borderRight: BORDER_WIDTH,
    textAlign: "center",
    padding: 2,
  },
  sigCellLast: {
    flex: 1,
    padding: 2,
  },
  sigCellLastName: {
    flex: 1,
    padding: 2,
    textAlign:"center"
  },
});

const ReceiptPDF = ({ data }) => {
  const items = data.items || [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.amount)), 0);
  const emptyRows = Array(Math.max(0, 6 - items.length)).fill(0);

  return (
    <Document>
      <Page size={POCKET_SIZE} style={styles.page}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={{ fontSize: 7 }}>Republic of the Philippines</Text>
            <Text>MINDANAO STATE UNIVERSITY</Text>
            <Text style={{ fontWeight: "bold" }}>MSU-BYTES STUDENT COUNCIL</Text>
            <Text style={{ fontSize: 7 }}>MSU - Marawi City, Philippines</Text>
          </View>

          <Text style={styles.title}>CERTIFICATION OF EXPENSES NOT REQUIRING RECEIPT</Text>

          <View style={styles.row}>
            <Text style={styles.cellLabel}>Name: {data.name}</Text>
            <Text style={styles.cellLabelLast}>Date: {data.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Position: {data.position}</Text>
            <Text style={styles.cellLabelLast}>No.: {data.receipt_no}</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.colParticular}>PARTICULAR</Text>
            <Text style={styles.colAmount}>AMOUNT</Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.colParticular, { fontWeight: "normal" }]}>
               {item.quantity} {item.unit || 'pc'} {item.name}
              </Text>
              <Text style={[styles.colAmount, { fontWeight: "normal" }]}>
                {(Number(item.amount) * Number(item.quantity)).toFixed(2)}
              </Text>
            </View>
          ))}

          {emptyRows.map((_, i) => (
            <View key={`empty-${i}`} style={styles.tableRowEmpty}>
              <View style={styles.colParticular} />
              <View style={styles.colAmount} />
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.colParticular}>TOTAL</Text>
            <Text style={styles.colAmount}>(PHP {totalAmount.toFixed(2)})</Text>
          </View>

          <View style={styles.purposeSection}>
            <Text>Purpose: {data.purpose}</Text>
          </View>

          <View style={styles.certification}>
            <Text>
              I hereby certify that the above expenses were incurred as they are necessary for the above cited purpose. I am fully aware that willful falsification is punishable by law.
            </Text>
          </View>

          <View style={styles.sigRow}>
            <View style={styles.sigCell}><Text></Text></View>
            <View style={styles.sigCell}><Text>Certified correct:</Text></View>
            <View style={styles.sigCellLast}><Text>Noted by:</Text></View>
          </View>

          <View style={styles.sigRow}>
            <View style={styles.sigCell}><Text style={{ fontWeight: "bold" }}>Signature:</Text></View>
            <View style={styles.sigCell}></View>
            <View style={styles.sigCellLast}></View>
          </View>

          <View style={styles.sigRow}>
            <View style={styles.sigCell}><Text style={{ fontWeight: "bold" }}>Printed Name:</Text></View>
            <View style={styles.sigCellName}><Text>{data.certifiedBy?.name}</Text></View>
            <View style={styles.sigCellLastName}>
              <Text>
                Sittie Aisha C.{"\n"}Abdulmanan
              </Text>
            </View>
          </View>

          <View style={styles.sigRow}>
            <View style={styles.sigCell}></View>
            <View style={styles.sigCell}><Text style={{ textAlign: "center", marginTop: 5 }}>Payee</Text></View>
            <View style={styles.sigCellLast}><Text style={{ textAlign: "center", marginTop: 5 }}>Minister of Audit</Text></View>
          </View>

          <View style={[styles.sigRow, { borderBottom: 0 }]}>
            <View style={styles.sigCell}></View>
            <View style={styles.sigCell}><Text>Date:</Text></View>
            <View style={styles.sigCellLast}><Text>Date:</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function ReceiptPreview({ data }) {
  return (
    <div style={{ width: "100%", padding: "20px", display: "flex", justifyContent: "center" }}>
      <PDFViewer style={{ width: "100%", height: "80vh" }}>
        <ReceiptPDF data={data} />
      </PDFViewer>
    </div>
  );
}