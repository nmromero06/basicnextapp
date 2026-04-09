import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MedicalTestRow } from "./actions";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
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
    fontSize: 9,
  },
  tableCell: {
    fontSize: 9,
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

interface MedicalTestsPdfDocumentProps {
  tests: MedicalTestRow[];
  totalCount: number;
  searchQuery?: string;
}

const MedicalTestsPdfDocument: React.FC<MedicalTestsPdfDocumentProps> = ({ tests, totalCount, searchQuery }) => {
  const selectedColumns = [
    { key: 'rowNumber', label: 'Row No.' },
    { key: 'name', label: 'Test Name' },
    { key: 'description', label: 'Description' },
    { key: 'categoryname', label: 'Category' },
    { key: 'uomname', label: 'Unit' },
    { key: 'normalmin', label: 'Min' },
    { key: 'normalmax', label: 'Max' },
  ];

  const getColWidth = (key: string) => {
    if (key === 'rowNumber') return '6%';
    const otherColsCount = selectedColumns.filter(c => c.key !== 'rowNumber').length;
    return `${94 / otherColsCount}%`;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header Section */}
        <View fixed>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Medical Tests</Text>
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
          {tests.map((test, index) => (
            <View key={test.id} style={styles.tableRow}>
              {selectedColumns.map((col) => (
                <View key={`${test.id}-${col.key}`} style={{ ...styles.tableCol, width: getColWidth(col.key) }}>
                  <Text style={[styles.tableCell, col.key === 'rowNumber' ? { textAlign: 'right', paddingRight: 8 } : {}]}>
                    {col.key === 'rowNumber' ? index + 1 :
                     col.key === 'name' ? test.name :
                     col.key === 'description' ? test.description || '' :
                     col.key === 'categoryname' ? test.categoryname :
                     col.key === 'uomname' ? test.uomname :
                     col.key === 'normalmin' ? (test.normalmin || '') :
                     col.key === 'normalmax' ? (test.normalmax || '') : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footer} fixed>
            <Text>
                {tests.length} of {totalCount} Medical Tests
            </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicalTestsPdfDocument;
