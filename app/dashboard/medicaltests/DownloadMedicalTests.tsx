import ExcelJS from 'exceljs';
import { MedicalTestRow } from "./actions";

export const downloadMedicalTestsExcel = async (tests: MedicalTestRow[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medical Tests");
    worksheet.columns = [
        { header: "Row Number", key: "rowNumber", width: 12 },
        { header: "Test Name", key: "testName", width: 20 },
        { header: "Description", key: "description", width: 25 },
        { header: "Category", key: "category", width: 15 },
        { header: "Unit", key: "unit", width: 12 },
        { header: "Normal Min", key: "normalMin", width: 12 },
        { header: "Normal Max", key: "normalMax", width: 12 }
    ];
    tests.forEach((test, index) => {
        worksheet.addRow({
            rowNumber: index + 1,
            testName: test.name,
            description: test.description || "",
            category: test.categoryname || "",
            unit: test.uomname || "",
            normalMin: test.normalmin || "",
            normalMax: test.normalmax || ""
        });
    });
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MedicalTests.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
