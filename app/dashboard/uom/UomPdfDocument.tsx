import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Uom } from "./actions";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: 10,
    color: '#000000',
  },
  filterInfo: {
    fontSize: 10,
    marginBottom: 15,
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: '#000000',
    borderBottomWidth: 0.5,
    minHeight: 20,
    alignItems: 'center',
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 2,
  },
  tableCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCell: {
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
  },
});

interface UomPdfDocumentProps {
  uoms: Uom[];
  totalCount: number;
  searchQuery?: string;
}

const UomPdfDocument: React.FC<UomPdfDocumentProps> = ({ uoms, totalCount, searchQuery }) => {
  const selectedColumns = [
    { key: 'rowNumber', label: 'Row No.' },
    { key: 'name', label: 'UOM Name' },
    { key: 'description', label: 'Description' },
  ];

  const getColWidth = (key: string) => {
    if (key === 'rowNumber') return '10%';
    const otherColsCount = selectedColumns.filter(c => c.key !== 'rowNumber').length;
    return `${90 / otherColsCount}%`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View fixed>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Units of Measure</Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `Page ${pageNumber} of ${totalPages}`
                )} />
            </View>
            <Text style={styles.filterInfo}>
                Filtered by: {searchQuery || "None"}
            </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeaderRow} fixed>
            {selectedColumns.map((col) => (
                <View key={col.key} style={{ ...styles.tableCol, width: getColWidth(col.key) }}>
                    <Text style={[styles.tableCellHeader, col.key === 'rowNumber' ? { textAlign: 'right', paddingRight: 8 } : {}]}>
                        {col.label}
                    </Text>
                </View>
            ))}
        </View>

        {/* Table Rows */}
        <View style={styles.table}>
          {uoms.map((uom, index) => (
            <View key={uom.id} style={styles.tableRow}>
              {selectedColumns.map((col) => (
                <View key={`${uom.id}-${col.key}`} style={{ ...styles.tableCol, width: getColWidth(col.key) }}>
                  <Text style={[styles.tableCell, col.key === 'rowNumber' ? { textAlign: 'right', paddingRight: 8 } : {}]}>
                    {col.key === 'rowNumber' ? index + 1 :
                     col.key === 'name' ? uom.name :
                     col.key === 'description' ? uom.description || '' : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footer} fixed>
            <Text>
                {uoms.length} of {totalCount} Units of Measure
            </Text>
        </View>
      </Page>
    </Document>
  );
};

export default UomPdfDocument;
