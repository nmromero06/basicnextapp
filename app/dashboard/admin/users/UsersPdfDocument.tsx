import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { User } from "./actions";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 10,
    color: "#000000",
  },
  filterInfo: {
    fontSize: 10,
    marginBottom: 14,
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#000000",
    borderBottomWidth: 0.5,
    minHeight: 20,
    alignItems: "center",
  },
  tableCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  tableCellHeader: {
    fontWeight: "bold",
    fontSize: 9,
  },
  tableCell: {
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 5,
  },
});

interface UsersPdfDocumentProps {
  users: User[];
  totalCount: number;
  searchQuery?: string;
}

const columns = [
  { key: "rowNumber", label: "Row #" },
  { key: "email", label: "Email" },
  { key: "active", label: "Active" },
  { key: "name", label: "Name" },
  { key: "fullname", label: "Full Name" },
  { key: "birthdate", label: "Birthdate" },
  { key: "gender", label: "Gender" },
];

const getColWidth = (key: string) => {
  if (key === "rowNumber") return "6%";
  if (key === "email") return "24%";
  return "11.666%";
};

const UsersPdfDocument: React.FC<UsersPdfDocumentProps> = ({ users, totalCount, searchQuery }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View fixed>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Users</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
          <Text style={styles.filterInfo}>Filtered by: {searchQuery || "None"}</Text>
        </View>

        <View style={styles.tableHeaderRow} fixed>
          {columns.map((col) => (
            <View key={col.key} style={{ ...styles.tableCol, width: getColWidth(col.key) }}>
              <Text style={[styles.tableCellHeader, col.key === "rowNumber" ? { textAlign: "right", paddingRight: 8 } : {}]}>
                {col.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.table}>
          {users.map((user, index) => (
            <View key={user.id} style={styles.tableRow}>
              {columns.map((col) => (
                <View key={`${user.id}-${col.key}`} style={{ ...styles.tableCol, width: getColWidth(col.key) }}>
                  <Text style={[styles.tableCell, col.key === "rowNumber" ? { textAlign: "right", paddingRight: 8 } : {}]}>
                    {col.key === "rowNumber"
                      ? index + 1
                      : col.key === "email"
                        ? user.email
                        : col.key === "active"
                          ? user.active
                            ? "Yes"
                            : "No"
                          : col.key === "name"
                            ? user.name
                            : col.key === "fullname"
                              ? user.fullname || ""
                              : col.key === "birthdate"
                                ? user.birthdate
                                  ? new Date(user.birthdate).toLocaleDateString()
                                  : ""
                                : col.key === "gender"
                                  ? user.gender || ""
                                  : ""}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {users.length} of {totalCount} Users
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default UsersPdfDocument;
