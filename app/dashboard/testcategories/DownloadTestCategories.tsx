import ExcelJS from 'exceljs';
import { TestCategory } from "./actions";

export const downloadTestCategoriesExcel = async (categories: TestCategory[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test Categories");
    worksheet.columns = [
        { header: "Row Number", key: "rowNumber", width: 12 },
        { header: "Category Name", key: "categoryName", width: 20 },
        { header: "Description", key: "description", width: 30 }
    ];
    categories.forEach((category, index) => {
        worksheet.addRow({
            rowNumber: index + 1,
            categoryName: category.name,
            description: category.description || ""
        });
    });
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TestCategories.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
